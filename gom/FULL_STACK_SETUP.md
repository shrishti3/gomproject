# Full Stack Setup Guide

Complete instructions to run the Madmann Electronics application locally.

## Prerequisites
- Node.js (v14+)
- MongoDB (running locally or via Docker)
- npm

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create `.env` file (already created, but verify):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/madmann
```

### 4. Setup MongoDB

**Option A: Using Docker**
```bash
docker run -d -p 27017:27017 --name madmann-mongo mongo:latest
```

**Option B: Local MongoDB**
- Windows: Start MongoDB service
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

### 5. Initialize Sample Data (Optional)
```bash
node scripts/init-db.js
```

### 6. Start Backend Server
```bash
npm start
```

Backend will be available at: `http://localhost:5000`

**Verify it's running:**
```bash
curl http://localhost:5000/api/health
```

---

## Frontend Setup

### 1. Navigate to Frontend Directory (in a new terminal)
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create/verify `.env` file:
```
REACT_APP_API_URL=http://localhost:5000
NODE_ENV=development
```

### 4. Start Development Server
```bash
npm start
```

Frontend will open at: `http://localhost:3000`

---

## Running Both Together

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Both applications will run simultaneously:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in backend `.env`
- Try connecting manually: `mongo mongodb://localhost:27017/madmann`

### Frontend Can't Connect to Backend
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Look for CORS errors in browser console
- Try: `curl http://localhost:5000/api/health`

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: `PORT=3001 npm start`

### Clear Node Modules
```bash
# Backend
cd backend && rm -rf node_modules && npm install

# Frontend
cd frontend && rm -rf node_modules && npm install
```

---

## Features

### Backend API
- `GET /api/health` - Server health check
- `GET /api/projects` - List all projects/services
- `POST /api/projects` - Create new project
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - Get all contacts

### Frontend
- Dynamic project listing from backend
- Contact form submission
- About page with company history
- Responsive tech-themed UI
- Real-time data fetching

---

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run start  # or serve build with nginx/apache
```

For production, update `REACT_APP_API_URL` to your backend domain.
