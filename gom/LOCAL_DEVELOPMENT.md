# Local Development Setup (Without Docker)

## Prerequisites
- **Node.js 18+** - Download from https://nodejs.org
- **Go 1.21+** - Download from https://golang.org
- **MongoDB** - Either:
  - Local install: https://www.mongodb.com/try/download/community
  - OR Cloud: MongoDB Atlas free tier at https://www.mongodb.com/cloud/atlas

---

## Option A: Using Local MongoDB

### Step 1: Install & Start MongoDB
**Windows:**
```powershell
# If using Windows installer, MongoDB runs as a service automatically
# Verify it's running:
mongosh
# Should connect successfully

# If installed but not running:
net start MongoDB
```

**Or use MongoDB locally with:**
```powershell
# If you have MongoDB installed via chocolatey or direct download
mongod --dbpath "C:\data\db"
```

### Step 2: Initialize MongoDB with Sample Data
```powershell
cd c:\Users\shris\gom
mongosh < config/mongo-init.js
```

### Step 3: Start Backend (Go)
```powershell
cd c:\Users\shris\gom\backend

# Build and run
go build -o server.exe ./cmd/server
.\server.exe

# Or run directly without building
go run ./cmd/server
```

Backend will be available at: **http://localhost:8080**

### Step 4: Start Frontend (React)
```powershell
cd c:\Users\shris\gom\frontend

# Install dependencies (first time only)
npm install

# Start development server
npm start
```

Frontend will open at: **http://localhost:3000**

---

## Option B: Using MongoDB Atlas (Cloud)

### Step 1: Create Free MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster (free tier)
4. Get connection string

### Step 2: Create `.env` file in Backend
```powershell
# c:\Users\shris\gom\backend\.env

MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/madmann_db?retryWrites=true&w=majority
PORT=8080
CORS_ORIGIN=http://localhost:3000
ENVIRONMENT=development
```

### Step 3: Start Backend
```powershell
cd c:\Users\shris\gom\backend
go run ./cmd/server
```

Backend will be available at: **http://localhost:8080**

### Step 4: Create `.env` file in Frontend
```powershell
# c:\Users\shris\gom\frontend\.env

REACT_APP_API_URL=http://localhost:8080
NODE_ENV=development
```

### Step 5: Start Frontend
```powershell
cd c:\Users\shris\gom\frontend
npm install
npm start
```

Frontend will open at: **http://localhost:3000**

---

## CORS Configuration (Already Set Up)

Your backend already has CORS configured! Check [backend/cmd/server/main.go](../backend/cmd/server/main.go):

```go
c := cors.New(cors.Options{
    AllowedOrigins:   []string{corsOrigin},  // http://localhost:3000
    AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders:   []string{"Content-Type", "Authorization"},
    ExposedHeaders:   []string{"Content-Length"},
    MaxAge:           300,
})
```

This allows the React frontend to make requests to the Go backend without CORS errors.

---

## Quick Start Script

Create `c:\Users\shris\gom\start-local.ps1`:

```powershell
# Start Local Development Environment

Write-Host "Starting MadMann Dynamics Locally..." -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$checks = @{
    "Node.js" = { node --version }
    "npm" = { npm --version }
    "Go" = { go version }
    "MongoDB" = { mongosh --version }
}

foreach ($name in $checks.Keys) {
    try {
        & $checks[$name] | Out-Null
        Write-Host "✓ $name installed" -ForegroundColor Green
    } catch {
        Write-Host "✗ $name NOT installed - Install from https://www.google.com/search?q=$name" -ForegroundColor Red
    }
}

Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    mongosh --eval "db.adminCommand('ping')" --quiet
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} catch {
    Write-Host "⚠ MongoDB is not running. Start it first!" -ForegroundColor Yellow
    Write-Host "  Command: mongod --dbpath 'C:\data\db'" -ForegroundColor Gray
    Write-Host ""
}

Write-Host ""

# Start Backend
Write-Host "Starting Backend (Go)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList {
    cd c:\Users\shris\gom\backend
    Write-Host "Backend starting on http://localhost:8080" -ForegroundColor Green
    go run ./cmd/server
}

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting Frontend (React)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList {
    cd c:\Users\shris\gom\frontend
    npm install --legacy-peer-deps
    Write-Host "Frontend starting on http://localhost:3000" -ForegroundColor Green
    npm start
}

Write-Host ""
Write-Host "✓ Both services started!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend:  http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend:   http://localhost:8080" -ForegroundColor Yellow
Write-Host "MongoDB:   localhost:27017" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C in either window to stop services" -ForegroundColor Gray
```

Run with:
```powershell
.\start-local.ps1
```

---

## Testing Locally

### Test Backend API
```powershell
# Health check
curl http://localhost:8080/api/health

# Get projects
curl http://localhost:8080/api/projects

# Submit inquiry
curl -X POST http://localhost:8080/api/inquiry `
  -H "Content-Type: application/json" `
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "serviceType": "ODM",
    "message": "Test inquiry",
    "budget": "100k",
    "timeline": "3 months"
  }'
```

### Test Frontend
1. Open http://localhost:3000 in browser
2. Fill out contact form
3. Submit - data should go to backend
4. Check MongoDB for stored data

---

## Environment Variables

### Backend (backend/.env)
```
MONGO_URI=mongodb://admin:madmann_secure_2025@localhost:27017/madmann_db
PORT=8080
CORS_ORIGIN=http://localhost:3000
ENVIRONMENT=development
```

### Frontend (frontend/.env)
```
REACT_APP_API_URL=http://localhost:8080
NODE_ENV=development
```

---

## Troubleshooting

**Port Already in Use**
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**MongoDB Connection Error**
```powershell
# Make sure MongoDB is running
mongosh

# If not running, start it:
mongod --dbpath "C:\data\db"
```

**CORS Errors**
- Ensure backend is running on port 8080
- Ensure frontend .env has: `REACT_APP_API_URL=http://localhost:8080`
- Ensure backend CORS_ORIGIN matches frontend URL

**Module Errors in Frontend**
```powershell
cd c:\Users\shris\gom\frontend
npm install --legacy-peer-deps
npm start
```

---

## Comparison: Docker vs Local

| Aspect | Docker | Local |
|--------|--------|-------|
| **Setup** | More complex | Simpler |
| **Performance** | Slightly slower | Faster |
| **Environment** | Isolated | Uses your system |
| **Best for** | Production | Development |
| **MongoDB** | Container or cloud | Local or cloud |

---

## Next Steps

1. **Choose MongoDB option** (Local or Atlas)
2. **Create .env files** in backend and frontend
3. **Start MongoDB** (if using local)
4. **Run backend**: `go run ./cmd/server`
5. **Run frontend**: `npm start`
6. **Visit**: http://localhost:3000

---

**That's it! Your full-stack app is now running locally without Docker.** 🎉
