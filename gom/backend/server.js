require('dotenv').config();
const express = require('express');
// const { MongoClient, ObjectId } = require('mongodb'); // COMMENTED OUT - DB not available
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

// MongoDB Connection - COMMENTED OUT
// let db;
// const client = new MongoClient(MONGODB_URI);

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

// MongoDB connection function - COMMENTED OUT
// async function connectDB() {
//   try {
//     await client.connect();
//     db = client.db('madmann');
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('MongoDB connection failed:', error);
//     process.exit(1);
//   }
// }

// Mock projects data
const mockProjects = [
  { _id: '1', category: 'ODM Services', projectName: 'Power Supply Design', description: 'Custom SMPS design', createdAt: new Date() },
  { _id: '2', category: 'SCM Solutions', projectName: 'Component Sourcing', description: 'Global supplier management', createdAt: new Date() },
  { _id: '3', category: 'EMS Manufacturing', projectName: 'PCB Assembly', description: 'High-volume PCB assembly', createdAt: new Date() },
  { _id: '4', category: 'Wire Harnessing', projectName: 'Cable Assembly', description: 'Custom cable harnesses', createdAt: new Date() }
];

let submittedInquiries = [];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Get all projects/services - Using mock data
app.get('/api/projects', (req, res) => {
  res.json(mockProjects);
});

// Get single project - Using mock data
app.get('/api/projects/:id', (req, res) => {
  const project = mockProjects.find(p => p._id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// Create project - Mock only
app.post('/api/projects', (req, res) => {
  const { category, projectName, description } = req.body;
  
  const newProject = {
    _id: Date.now().toString(),
    category,
    projectName,
    description,
    createdAt: new Date()
  };

  mockProjects.push(newProject);
  res.status(201).json(newProject);
});

// Update project - Mock only
app.put('/api/projects/:id', (req, res) => {
  const { category, projectName, description } = req.body;
  const projectIndex = mockProjects.findIndex(p => p._id === req.params.id);

  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  mockProjects[projectIndex] = {
    ...mockProjects[projectIndex],
    category,
    projectName,
    description,
    updatedAt: new Date()
  };

  res.json({ message: 'Project updated successfully' });
});

// Delete project - Mock only
app.delete('/api/projects/:id', (req, res) => {
  const projectIndex = mockProjects.findIndex(p => p._id === req.params.id);

  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  mockProjects.splice(projectIndex, 1);
  res.json({ message: 'Project deleted successfully' });
});

// Contact form submission (handles both /api/contact and /api/inquiry)
const handleContactSubmission = async (req, res) => {
  const { fullName, email, phone, company, serviceType, message, budget, timeline } = req.body;
  
  // Validate required fields
  if (!fullName || !email || !message) {
    return res.status(400).json({ error: 'Full name, email, and message are required' });
  }

  const newContact = {
    _id: Date.now().toString(),
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

  // Save to in-memory array
  submittedInquiries.push(newContact);

  // Send email notification
  const emailSent = await sendContactEmail(newContact);

  res.status(201).json({ 
    ...newContact,
    emailSent: emailSent ? 'Email notification sent' : 'Form saved but email notification failed'
  });
};

app.post('/api/contact', handleContactSubmission);
app.post('/api/inquiry', handleContactSubmission);

// Get contacts (supports both endpoints) - Using in-memory array
const handleGetContacts = (req, res) => {
  const sorted = [...submittedInquiries].sort((a, b) => b.createdAt - a.createdAt);
  res.json(sorted);
};

app.get('/api/contacts', handleGetContacts);
app.get('/api/inquiries', handleGetContacts);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Server shutting down');
  process.exit(0);
});
