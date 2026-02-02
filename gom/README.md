# MadMann Dynamics - Full Stack Development Guide

## 📋 PROJECT OVERVIEW

MadMann Dynamics is a high-tech industrial manufacturing company website built with:
- **Frontend**: React.js + Tailwind CSS + Framer Motion
- **Backend**: Go (Golang) REST API
- **Database**: MongoDB
- **Orchestration**: Docker Compose
- **Deployment**: Container-ready

---

## 🏗️ PROJECT STRUCTURE

```
madmann-dynamics/
├── frontend/                      # React SPA
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/                # Page-level components (for routing)
│   │   ├── utils/
│   │   │   ├── api.js            # API constants
│   │   │   └── apiClient.js      # Axios instance & API calls
│   │   ├── styles/
│   │   │   └── globals.css       # Global Tailwind + custom styles
│   │   ├── App.jsx               # Root component
│   │   ├── index.jsx             # Entry point
│   │   └── index.css             # Base styles
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   └── .env.example
│
├── backend/                       # Go REST API
│   ├── cmd/
│   │   └── server/
│   │       └── main.go           # Server entry point
│   ├── internal/
│   │   ├── models/
│   │   │   └── models.go         # Data models
│   │   ├── handlers/
│   │   │   └── handlers.go       # API endpoint handlers
│   │   ├── database/
│   │   │   └── mongo.go          # MongoDB connection
│   │   └── middleware/
│   │       └── middleware.go     # HTTP middleware
│   ├── go.mod
│   ├── .air.toml                 # Hot reload config
│   ├── Dockerfile
│   └── .env.example
│
├── config/
│   └── mongo-init.js             # MongoDB initialization script
│
├── docker-compose.yml            # Multi-container orchestration
├── CREATIVE_MANIFESTO.md         # Design system documentation
└── README.md                      # Project setup guide

```

---

## 🚀 QUICK START

### Prerequisites
- Docker & Docker Compose (recommended)
- OR Node.js 18+, Go 1.21+, MongoDB

### Option 1: Docker Compose (Recommended)

```bash
# Clone and navigate to project
cd madmann-dynamics

# Start all services
docker-compose up -d

# Services will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# MongoDB: localhost:27017
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend

# Install Go modules
go mod download

# Create .env file
cp .env.example .env

# Run server
go run ./cmd/server/main.go
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start dev server
npm start
```

#### MongoDB Setup
```bash
# Using Docker
docker run -d \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=madmann_secure_2025 \
  -p 27017:27017 \
  mongo:7.0

# OR install locally and run mongod
mongod --dbpath /path/to/data
```

---

## 🔌 API DOCUMENTATION

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### Health Check
```
GET /api/health

Response:
{
  "status": "healthy",
  "service": "MadMann Dynamics API"
}
```

#### Submit Inquiry
```
POST /api/inquiry
Content-Type: application/json

Body:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "company": "Tech Corp",
  "serviceType": "ODM",
  "message": "We need aerospace components...",
  "budget": "$50K - $500K",
  "timeline": "1-3 months"
}

Response (201):
{
  "success": true,
  "id": "507f1f77bcf86cd799439011",
  "message": "Inquiry submitted successfully"
}
```

#### Get All Inquiries
```
GET /api/inquiries

Response:
[
  {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "serviceType": "ODM",
    "status": "pending",
    "createdAt": "2026-02-01T10:00:00Z"
  }
]
```

#### Get Projects
```
GET /api/projects

Response:
[
  {
    "id": "507f1f77bcf86cd799439012",
    "category": "ODM",
    "projectName": "Aerospace Component Manufacturing",
    "description": "High-precision components...",
    "status": "active",
    "createdAt": "2026-02-01T10:00:00Z"
  }
]
```

---

## 📦 DEPENDENCIES

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "tailwindcss": "^3.4.0",
  "framer-motion": "^10.16.0",
  "axios": "^1.6.0",
  "react-router-dom": "^6.18.0",
  "lucide-react": "^0.292.0"
}
```

### Backend Dependencies
```
github.com/gorilla/mux v1.8.1
go.mongodb.org/mongo-driver v1.14.0
github.com/joho/godotenv v1.5.1
github.com/rs/cors v1.10.1
```

---

## 🗄️ DATABASE SCHEMA

### Inquiries Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String,
  phone: String,
  company: String,
  serviceType: String,        // "ODM", "SCM", "EMS", "Wire Harnessing"
  message: String,
  budget: String,
  timeline: String,
  status: String,             // "pending", "reviewed", "contacted"
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.inquiries.createIndex({ email: 1 })
db.inquiries.createIndex({ createdAt: -1 })
db.inquiries.createIndex({ status: 1 })
```

### Projects Collection
```javascript
{
  _id: ObjectId,
  projectName: String,
  category: String,           // "ODM", "SCM", "EMS", "Wire Harnessing"
  description: String,
  status: String,             // "active", "completed", "archived"
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.projects.createIndex({ projectName: 1 })
db.projects.createIndex({ createdAt: -1 })
db.projects.createIndex({ category: 1 })
```

---

## 🎨 DESIGN SYSTEM

See [CREATIVE_MANIFESTO.md](./CREATIVE_MANIFESTO.md) for comprehensive design documentation.

### Key Design Elements
- **Color Scheme**: Deep Black (#0A0A0A), Dark Grey (#1F1F1F), Stainless Steel (#C0C0C0), Caution Yellow (#FFD700)
- **Typography**: IBM Plex Mono / Courier New
- **Animations**: Framer Motion for entrance & hover effects
- **Grid**: Subtle background grid overlay at 50px intervals
- **Effects**: Glow, glitch, scan lines for tactical aesthetic

---

## 🔧 DEVELOPMENT WORKFLOW

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start development server (hot reload)
npm start

# Build for production
npm run build

# Test
npm test
```

### Backend Development
```bash
cd backend

# Download dependencies
go mod download

# Run with air (hot reload)
go install github.com/cosmtrek/air@latest
air

# Build binary
go build -o bin/madmann-api ./cmd/server

# Run tests
go test ./...
```

### Docker Development
```bash
# Build all containers
docker-compose build

# Start services with logs
docker-compose up

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild single service
docker-compose build [service-name]
```

---

## 🔐 ENVIRONMENT VARIABLES

### Backend (.env)
```
MONGO_URI=mongodb://admin:madmann_secure_2025@mongodb:27017/madmann_db
PORT=8080
ENVIRONMENT=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080
NODE_ENV=development
```

---

## 📊 COMPONENT DOCUMENTATION

### Hero Component
- Full-height hero section with gradient animations
- Glitch effect on brand name
- Feature cards with icons
- Statistics display
- CTA buttons
- Scroll indicator

### Services Component
- 2-column grid layout (responsive)
- Dynamic service cards from API
- Icon animations on hover
- Fallback to default data if API fails

### Contact Form Component
- 8-field form (name, email, phone, company, service type, budget, timeline, message)
- Form validation
- API integration for submission
- Success/error messages
- Loading state

### Navbar Component
- Fixed positioning with transparency
- Mobile responsive hamburger menu
- Smooth scroll navigation
- CTA button

### Footer Component
- Multi-column layout
- Social links
- Company information
- Quick links

---

## 🚀 DEPLOYMENT

### Docker Deployment
```bash
# Build production images
docker-compose -f docker-compose.yml build

# Push to registry
docker tag madmann-frontend:latest your-registry/madmann-frontend:latest
docker push your-registry/madmann-frontend:latest

# Deploy to cloud platform (AWS ECS, GKE, etc.)
```

### Kubernetes Deployment (Optional)
Create `k8s/` folder with manifests for:
- Frontend Deployment
- Backend Deployment
- MongoDB StatefulSet
- Services
- Ingress

---

## 🧪 TESTING

### Frontend Testing
```bash
cd frontend
npm test

# E2E testing with Cypress
npm install cypress --save-dev
npx cypress open
```

### Backend Testing
```bash
cd backend
go test ./...
go test -v ./...
go test -cover ./...
```

---

## 📈 PERFORMANCE OPTIMIZATION

### Frontend
1. Code splitting with React.lazy()
2. Image optimization (WebP format)
3. Tailwind CSS purging unused styles
4. Lazy loading for below-fold content
5. Minimize animations on slow networks

### Backend
1. MongoDB indexing on frequently queried fields
2. Connection pooling
3. Request rate limiting
4. GZIP compression
5. Caching strategies

---

## 🐛 TROUBLESHOOTING

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Check MongoDB is running
2. Verify MONGO_URI in .env
3. Ensure credentials are correct
4. In Docker: use service name (mongodb) instead of localhost
```

### CORS Errors
```
Error: Access to XMLHttpRequest blocked by CORS policy

Solution:
1. Check CORS_ORIGIN in backend .env
2. Ensure it matches frontend URL
3. Verify CORS middleware in Go backend
4. Check browser console for exact origin
```

### Port Already in Use
```
Error: listen EADDRINUSE :::3000

Solution:
kill -9 $(lsof -ti:3000)  # Kill process on port 3000
# OR use different port
PORT=3001 npm start
```

---

## 📝 BEST PRACTICES

1. **Frontend**
   - Component composition over inheritance
   - Use custom hooks for logic reuse
   - Separate concerns (components, utils, styles)
   - Prop validation with PropTypes or TypeScript

2. **Backend**
   - RESTful API design principles
   - Input validation on all endpoints
   - Proper error handling and logging
   - Database transaction where appropriate
   - Security headers (CORS, CSP)

3. **Both**
   - Environment variable management
   - DRY (Don't Repeat Yourself) code
   - Clear naming conventions
   - Documentation and comments
   - Version control with meaningful commits

---

## 📞 SUPPORT

For issues or questions:
1. Check troubleshooting section
2. Review component documentation
3. Check API documentation
4. Review design system guide

---

## 📄 LICENSE

MadMann Dynamics © 2026. All rights reserved.

---

**Last Updated**: February 2026
**Version**: 1.0
**Status**: Production Ready
