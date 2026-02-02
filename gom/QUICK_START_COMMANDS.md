# Quick Start Commands

## Prerequisites Check
```powershell
node --version          # Need 18+
npm --version           # Should be installed with Node
go version              # Need 1.21+
mongosh --version       # Need MongoDB
```

---

## Step 1: Start MongoDB

### Option A: Local MongoDB Service
```powershell
# Windows - MongoDB runs as service after installation
# If not running, start it:
net start MongoDB

# Or verify it's running:
mongosh
```

### Option B: MongoDB from Command Line
```powershell
mongod --dbpath "C:\data\db"
# Keep this window open while developing
```

### Option C: MongoDB Atlas (Cloud)
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Set as MONGO_URI in backend/.env

---

## Step 2: Start Backend (Terminal 1)

```powershell
cd c:\Users\shris\gom\backend

# Option A: Run with hot-reload (recommended)
go run ./cmd/server

# Option B: Build then run
go build -o server.exe ./cmd/server
.\server.exe
```

**You should see:**
```
Server starting on :8080
Listening on :8080
CORS enabled for http://localhost:3000
```

**Test it:**
```powershell
curl http://localhost:8080/api/health
```

---

## Step 3: Start Frontend (Terminal 2)

```powershell
cd c:\Users\shris\gom\frontend

# First time only - install dependencies
npm install

# Start development server
npm start
```

**It will automatically open:**
```
http://localhost:3000
```

---

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Web application UI |
| **Backend** | http://localhost:8080 | REST API |
| **API Health** | http://localhost:8080/api/health | Status check |
| **MongoDB** | localhost:27017 | Database |

---

## Environment Files

### Backend: `backend/.env`
```
MONGO_URI=mongodb://admin:madmann_secure_2025@localhost:27017/madmann_db
PORT=8080
CORS_ORIGIN=http://localhost:3000
ENVIRONMENT=development
```

### Frontend: `frontend/.env`
```
REACT_APP_API_URL=http://localhost:8080
NODE_ENV=development
```

---

## Common Commands

### MongoDB
```powershell
# Connect to database
mongosh

# View databases
show dbs

# Use specific database
use madmann_db

# View collections
show collections

# View all inquiries
db.inquiries.find()

# Clear collection
db.inquiries.deleteMany({})
```

### Backend
```powershell
cd backend

# Run with hot-reload
go run ./cmd/server

# Build binary
go build -o server.exe ./cmd/server

# Run tests
go test ./...

# Format code
go fmt ./...
```

### Frontend
```powershell
cd frontend

# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (⚠️ one-way operation)
npm run eject
```

---

## API Endpoints

### Health Check
```bash
GET http://localhost:8080/api/health
```

### Submit Inquiry
```bash
POST http://localhost:8080/api/inquiry
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "serviceType": "ODM",
  "message": "Need custom aerospace component",
  "budget": "50000-100000",
  "timeline": "3 months"
}
```

### Get All Inquiries
```bash
GET http://localhost:8080/api/inquiries
```

### Get All Projects
```bash
GET http://localhost:8080/api/projects
```

---

## Troubleshooting

### "Port 8080 already in use"
```powershell
# Find what's using it
netstat -ano | findstr :8080

# Kill the process (replace XXXX with PID)
taskkill /PID XXXX /F

# Or use different port:
$env:PORT=9000
go run ./cmd/server
```

### "Port 3000 already in use"
```powershell
# Find what's using it
netstat -ano | findstr :3000

# Kill it
taskkill /PID XXXX /F
```

### "Cannot connect to MongoDB"
```powershell
# Verify MongoDB is running
mongosh

# Check connection string
# Should match MONGO_URI in .env

# If local:
mongod --dbpath "C:\data\db"
```

### "CORS errors in browser console"
1. Make sure backend is running on :8080
2. Check frontend .env has: `REACT_APP_API_URL=http://localhost:8080`
3. Check backend .env has: `CORS_ORIGIN=http://localhost:3000`
4. Restart both services

### "Module not found" errors
```powershell
# Frontend
cd frontend
npm install --legacy-peer-deps

# Backend
cd backend
go mod tidy
go run ./cmd/server
```

---

## One-Click Startup (Windows)

Double-click: `start-local.bat`

This will:
1. Check prerequisites
2. Start backend in new window
3. Start frontend in new window
4. Open http://localhost:3000

---

## Project Structure

```
madmann-dynamics/
├── backend/
│   ├── cmd/server/main.go          ← Entry point
│   ├── internal/
│   │   ├── handlers/handlers.go    ← API routes
│   │   ├── models/models.go        ← Data models
│   │   ├── database/mongo.go       ← DB connection
│   │   └── middleware/middleware.go ← CORS setup
│   ├── go.mod & go.sum             ← Dependencies
│   └── .env.example                ← Config template
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 ← Main component
│   │   ├── components/             ← UI components
│   │   ├── utils/                  ← API client
│   │   └── styles/globals.css      ← Design system
│   ├── package.json                ← Dependencies
│   ├── tailwind.config.js          ← Styling
│   └── .env.example                ← Config template
│
├── config/
│   └── mongo-init.js               ← DB initialization
│
├── LOCAL_DEVELOPMENT.md            ← Full setup guide
├── CORS_EXPLAINED.md               ← CORS documentation
└── start-local.bat                 ← Quick startup script
```

---

## Next Steps After Setup

1. ✅ Run the app locally
2. ✅ Test contact form submission
3. ✅ Verify data appears in MongoDB
4. ✅ Customize branding/colors
5. ✅ Deploy to production (see DEPLOYMENT.md)

---

**You're all set! Run the commands above and visit http://localhost:3000** 🚀
