# MadMann Dynamics - Project Setup Instructions

## 🎯 QUICK START GUIDE

### Prerequisites
- Docker Desktop (recommended for easiest setup)
- OR: Node.js 18+, Go 1.21+, MongoDB 7.0+
- Git

### Installation & Setup

#### Option A: Docker Compose (Recommended - 1 Command)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/madmann-dynamics.git
cd madmann-dynamics

# 2. Start all services
docker-compose up -d

# 3. Wait for services to be ready (30-60 seconds)
# Check status:
docker-compose ps

# 4. Access the application
# Frontend: http://localhost:3000
# API: http://localhost:8080/api/health
# MongoDB: localhost:27017
```

#### Option B: Local Development Setup

**Step 1: MongoDB Setup**
```bash
# Using Docker
docker run -d \
  --name madmann-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=madmann_secure_2025 \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  mongo:7.0

# Initialize database
docker exec madmann-mongo mongosh \
  -u admin -p madmann_secure_2025 \
  /docker-entrypoint-initdb.d/init-mongo.js
```

**Step 2: Backend Setup**
```bash
cd backend

# Copy environment file
cp .env.example .env

# Install Go dependencies
go mod download

# Run the server
go run ./cmd/server/main.go

# Server runs at http://localhost:8080
```

**Step 3: Frontend Setup**
```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install Node dependencies
npm install

# Start development server
npm start

# Frontend runs at http://localhost:3000
```

---

## 🔧 CONFIGURATION

### Environment Variables

**Backend** (`backend/.env`)
```
MONGO_URI=mongodb://admin:madmann_secure_2025@localhost:27017/madmann_db
PORT=8080
ENVIRONMENT=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`frontend/.env`)
```
REACT_APP_API_URL=http://localhost:8080
NODE_ENV=development
```

### Docker Compose Customization

Edit `docker-compose.yml` to:
- Change exposed ports
- Modify environment variables
- Adjust MongoDB credentials
- Add environment-specific configurations

---

## 📚 AVAILABLE ENDPOINTS

### Health Check
```bash
curl http://localhost:8080/api/health
```

### Submit Inquiry (Contact Form)
```bash
curl -X POST http://localhost:8080/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "company": "Tech Corp",
    "serviceType": "ODM",
    "message": "Interested in aerospace components",
    "budget": "$50K - $500K",
    "timeline": "1-3 months"
  }'
```

### Get All Inquiries
```bash
curl http://localhost:8080/api/inquiries
```

### Get Projects
```bash
curl http://localhost:8080/api/projects
```

---

## 🎨 DESIGN SYSTEM

All design guidelines are documented in [CREATIVE_MANIFESTO.md](./CREATIVE_MANIFESTO.md)

Key elements:
- **Colors**: Deep Black (#0A0A0A), Caution Yellow (#FFD700), Stainless Steel (#C0C0C0)
- **Typography**: IBM Plex Mono / Courier New
- **Animations**: Framer Motion entrance & hover effects
- **Layout**: Grid-based, tactical minimalism

---

## 🚀 DEPLOYMENT

### Docker Production Build
```bash
# Build optimized images
docker-compose -f docker-compose.yml build --no-cache

# Push to registry
docker tag madmann-frontend your-registry/madmann-frontend:1.0.0
docker tag madmann-backend your-registry/madmann-backend:1.0.0
docker push your-registry/madmann-frontend:1.0.0
docker push your-registry/madmann-backend:1.0.0
```

### Environment-Specific Configs
Create additional compose files:
- `docker-compose.prod.yml` - Production overrides
- `docker-compose.staging.yml` - Staging environment

Run with:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 🧪 TESTING

### Frontend Tests
```bash
cd frontend

# Run test suite
npm test

# Build for production
npm run build
```

### Backend Tests
```bash
cd backend

# Run all tests
go test ./...

# Run with verbose output
go test -v ./...

# Run with coverage
go test -cover ./...
```

---

## 📊 PROJECT STRUCTURE

```
madmann-dynamics/
├── frontend/                 # React SPA
├── backend/                  # Go API
├── config/                   # Configuration files
├── docker-compose.yml        # Container orchestration
├── CREATIVE_MANIFESTO.md     # Design system
├── README.md                 # Full documentation
└── SETUP.md                  # This file
```

---

## 🛠️ COMMON COMMANDS

### Docker Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild services
docker-compose build [service-name]

# Access container shell
docker-compose exec [service-name] /bin/bash
```

### Frontend Commands
```bash
cd frontend

# Development
npm start

# Build
npm run build

# Test
npm test

# Format code
npm run format
```

### Backend Commands
```bash
cd backend

# Development (with hot reload)
air

# Build binary
go build -o bin/madmann-api ./cmd/server

# Run
./bin/madmann-api

# Tests
go test ./...
```

---

## 🐛 TROUBLESHOOTING

### Port Already in Use
```bash
# Linux/Mac: Kill process
lsof -ti:3000 | xargs kill -9
lsof -ti:8080 | xargs kill -9

# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### MongoDB Connection Failed
```bash
# Check if container is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Verify credentials in .env match docker-compose.yml
```

### Frontend Can't Reach Backend
```bash
# Check backend is running
curl http://localhost:8080/api/health

# Verify REACT_APP_API_URL in frontend/.env
# In Docker, use service name: http://backend:8080
```

### Hot Reload Not Working
```bash
# Backend (Go)
go install github.com/cosmtrek/air@latest

# Frontend (React)
# Restart npm start - it usually auto-detects changes
```

---

## 📞 SUPPORT & RESOURCES

- **Documentation**: [README.md](./README.md)
- **Design Guide**: [CREATIVE_MANIFESTO.md](./CREATIVE_MANIFESTO.md)
- **API Reference**: See README.md API Documentation section
- **Stack**:
  - Frontend: React 18, Tailwind CSS, Framer Motion
  - Backend: Go 1.21, Gorilla Mux
  - Database: MongoDB 7.0
  - Docker: 20.10+

---

## ✅ VERIFICATION CHECKLIST

After setup, verify:
- [ ] MongoDB running and accessible
- [ ] Backend API responding at `/api/health`
- [ ] Frontend loads at http://localhost:3000
- [ ] Hero section displays correctly
- [ ] Services section shows all 4 pillars
- [ ] Contact form submits successfully
- [ ] Can view inquiries in database
- [ ] No console errors in browser
- [ ] API CORS working (no blocked requests)

---

**Setup completed! Happy coding! 🚀**

Last Updated: February 2026
