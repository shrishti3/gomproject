require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/madmann';

// CORS Configuration - Accept all origins
const corsOptions = {
  origin: true, // Accept all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['*'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle all preflight requests
app.use(express.json());

// MongoDB Connection
let db;
const client = new MongoClient(MONGODB_URI);

// Email Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper function to send email
async function sendContactEmail(contactData) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL || 'gom123@gmail.com',
      subject: `New Contact Form Submission - ${contactData.fullName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Full Name:</strong> ${contactData.fullName}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${contactData.company || 'Not provided'}</p>
        <p><strong>Service Type:</strong> ${contactData.serviceType}</p>
        <p><strong>Budget:</strong> ${contactData.budget || 'Not specified'}</p>
        <p><strong>Timeline:</strong> ${contactData.timeline || 'Not specified'}</p>
        <h3>Message:</h3>
        <p>${contactData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Submitted on: ${new Date().toLocaleString()}</em></p>
      `,
      replyTo: contactData.email, // Reply directly to the sender
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

async function connectDB() {
  try {
    await client.connect();
    db = client.db('madmann');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Get all projects/services
app.get('/api/projects', async (req, res) => {
  try {
    const projects = db.collection('projects');
    const data = await projects.find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const projects = db.collection('projects');
    const project = await projects.findOne({ _id: new ObjectId(req.params.id) });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project
app.post('/api/projects', async (req, res) => {
  try {
    const { category, projectName, description } = req.body;
    const projects = db.collection('projects');
    
    const newProject = {
      category,
      projectName,
      description,
      createdAt: new Date()
    };

    const result = await projects.insertOne(newProject);
    res.status(201).json({ _id: result.insertedId, ...newProject });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { category, projectName, description } = req.body;
    const projects = db.collection('projects');
    
    const result = await projects.updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          category,
          projectName,
          description,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const projects = db.collection('projects');
    const result = await projects.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Contact form submission (handles both /api/contact and /api/inquiry)
const handleContactSubmission = async (req, res) => {
  try {
    const { fullName, email, phone, company, serviceType, message, budget, timeline } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'Full name, email, and message are required' });
    }

    const contacts = db.collection('contacts');
    
    const newContact = {
      fullName,
      email,
      phone,
      company,
      serviceType,
      message,
      budget,
      timeline,
      createdAt: new Date()
    };

    // Save to database
    // const result = await contacts.insertOne(newContact);

    // Send email notification
    const emailSent = await sendContactEmail(newContact);

    res.status(201).json({ 
      _id: 546, 
      ...newContact,
      emailSent: emailSent ? 'Email notification sent' : 'Form saved but email notification failed'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
};

app.post('/api/contact', handleContactSubmission);
app.post('/api/inquiry', handleContactSubmission);

// Get contacts (supports both endpoints)
const handleGetContacts = async (req, res) => {
  try {
    const contacts = db.collection('contacts');
    const data = await contacts.find({}).sort({ createdAt: -1 }).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

app.get('/api/contacts', handleGetContacts);
app.get('/api/inquiries', handleGetContacts);

// Start server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing connection:', error);
    process.exit(1);
  }
});
