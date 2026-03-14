# Madmann Electronics Backend

Simple Node.js + Express + MongoDB backend for the Madmann Electronics website.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/madmann

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
RECIPIENT_EMAIL=gom123@gmail.com
```

### 3. Setup Email (Gmail)

To send emails via Gmail:

1. Enable 2-Factor Authentication on your Gmail account
2. Create an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
3. Use this password in `.env` as `SMTP_PASS`

**Note:** Never use your actual Gmail password. Always use an App Password for security.

### 4. Start MongoDB
Make sure MongoDB is running on your machine. If using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Or if using MongoDB locally, start the service.

### 5. Run the Backend
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Projects/Services
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Contact Form
- `POST /api/contact` - Submit contact form (sends email to gom123@gmail.com)
- `GET /api/contacts` - Get all contacts

### Health Check
- `GET /api/health` - Server status

## Features

- **Email Notifications**: Automatically sends contact form submissions to gom123@gmail.com
- **Database Storage**: Saves all contact submissions to MongoDB
- **CORS Enabled**: Communicates with frontend on different port
- **Error Handling**: Comprehensive error messages

## Frontend Connection
The frontend connects to this backend at `http://localhost:5000` by default.
Update `REACT_APP_API_URL` in frontend `.env` if the backend runs on a different URL.

## Database Collections
- `projects` - Service/project listings
- `contacts` - Contact form submissions with email notifications

