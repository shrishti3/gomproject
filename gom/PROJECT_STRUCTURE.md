# MadMann Dynamics - Project File Structure & Overview

## 📁 COMPLETE FILE STRUCTURE

```
madmann-dynamics/
│
├── 📄 docker-compose.yml
│   └── Container orchestration for Go backend, React frontend, MongoDB
│
├── 📄 CREATIVE_MANIFESTO.md
│   └── Comprehensive design system, color palette, typography, animations, components
│
├── 📄 README.md
│   └── Main project documentation, setup, deployment, troubleshooting
│
├── 📄 SETUP.md
│   └── Quick start guide with installation & configuration instructions
│
├── 📄 API_REFERENCE.md
│   └── Complete API documentation with endpoints, examples, error handling
│
├── 📄 .env.example
│   └── Global environment variables template
│
├── 📄 .gitignore
│   └── Git ignore patterns
│
│
├── frontend/
│   ├── 📄 package.json
│   │   └── React dependencies (React 18, Tailwind, Framer Motion, Axios)
│   │
│   ├── 📄 tailwind.config.js
│   │   └── Tailwind customization with custom colors, fonts, animations
│   │
│   ├── 📄 postcss.config.js
│   │   └── PostCSS configuration for Tailwind
│   │
│   ├── 📄 Dockerfile
│   │   └── Multi-stage build for production React app
│   │
│   ├── 📄 .env.example
│   │   └── Frontend environment variables
│   │
│   ├── public/
│   │   └── 📄 index.html
│   │       └── HTML entry point with meta tags, font links
│   │
│   └── src/
│       ├── 📄 App.jsx
│       │   └── Root component combining all sections
│       │
│       ├── 📄 index.jsx
│       │   └── React DOM render entry point
│       │
│       ├── styles/
│       │   └── 📄 globals.css
│       │       └── Global CSS with grid overlay, buttons, animations, theme
│       │
│       ├── components/
│       │   ├── 📄 Navbar.jsx
│       │   │   └── Fixed navigation bar with mobile menu, branding, CTAs
│       │   │
│       │   ├── 📄 Hero.jsx
│       │   │   └── Full-height hero with animations, stats, scroll indicator
│       │   │
│       │   ├── 📄 Services.jsx
│       │   │   └── 2-column grid showing ODM, SCM, EMS, Wire Harnessing
│       │   │
│       │   ├── 📄 Projects.jsx
│       │   │   └── Dynamic project display (optional component)
│       │   │
│       │   ├── 📄 ContactForm.jsx
│       │   │   └── Contact form with validation, API integration
│       │   │
│       │   └── 📄 Footer.jsx
│       │       └── Footer with links, branding, social media
│       │
│       ├── pages/
│       │   └── (Reserved for future page components)
│       │
│       └── utils/
│           ├── 📄 api.js
│           │   └── API endpoint constants
│           │
│           ├── 📄 apiClient.js
│           │   └── Axios instance and API call functions
│           │
│           └── 📄 constants.js
│               └── Theme configuration, services list, design tokens
│
│
├── backend/
│   ├── 📄 go.mod
│   │   └── Go module definition with dependencies
│   │
│   ├── 📄 .air.toml
│   │   └── Hot reload configuration for development
│   │
│   ├── 📄 Dockerfile
│   │   └── Multi-stage build for Go backend
│   │
│   ├── 📄 .env.example
│   │   └── Backend environment variables
│   │
│   ├── cmd/server/
│   │   └── 📄 main.go
│   │       └── Server entry point with routing, CORS, MongoDB connection
│   │
│   └── internal/
│       ├── models/
│       │   └── 📄 models.go
│       │       └── Data models: Inquiry, Project, Contact
│       │
│       ├── handlers/
│       │   └── 📄 handlers.go
│       │       └── API endpoint handlers for inquiry, projects, health check
│       │
│       ├── database/
│       │   └── 📄 mongo.go
│       │       └── MongoDB connection and client management
│       │
│       ├── middleware/
│       │   └── 📄 middleware.go
│       │       └── HTTP middleware (logging, JSON headers)
│       │
│       └── helpers/
│           └── 📄 response.go
│               └── Response helper functions for JSON responses
│
│
└── config/
    └── 📄 mongo-init.js
        └── MongoDB initialization script with collections and indexes
```

---

## 📊 FILE SUMMARY TABLE

| File | Type | Purpose | Language |
|------|------|---------|----------|
| docker-compose.yml | Config | Container orchestration | YAML |
| CREATIVE_MANIFESTO.md | Docs | Design system & guidelines | Markdown |
| README.md | Docs | Main project documentation | Markdown |
| SETUP.md | Docs | Installation & setup guide | Markdown |
| API_REFERENCE.md | Docs | API endpoints documentation | Markdown |
| .env.example | Config | Environment variables template | Environment |
| .gitignore | Config | Git ignore patterns | Git |
| frontend/package.json | Config | React dependencies | JSON |
| frontend/tailwind.config.js | Config | Tailwind customization | JavaScript |
| frontend/postcss.config.js | Config | PostCSS setup | JavaScript |
| frontend/Dockerfile | Config | Container build for frontend | Dockerfile |
| frontend/public/index.html | Markup | HTML entry point | HTML |
| frontend/src/App.jsx | Component | Root React component | JSX |
| frontend/src/index.jsx | Component | React DOM entry | JSX |
| frontend/src/styles/globals.css | Stylesheet | Global styles & CSS | CSS |
| frontend/src/components/Navbar.jsx | Component | Navigation bar | JSX |
| frontend/src/components/Hero.jsx | Component | Hero section | JSX |
| frontend/src/components/Services.jsx | Component | Services grid | JSX |
| frontend/src/components/Projects.jsx | Component | Projects display | JSX |
| frontend/src/components/ContactForm.jsx | Component | Contact form | JSX |
| frontend/src/components/Footer.jsx | Component | Footer | JSX |
| frontend/src/utils/api.js | Utility | API constants | JavaScript |
| frontend/src/utils/apiClient.js | Utility | Axios instance | JavaScript |
| frontend/src/utils/constants.js | Utility | Theme & constants | JavaScript |
| backend/go.mod | Config | Go module definition | Go Module |
| backend/.air.toml | Config | Hot reload config | TOML |
| backend/Dockerfile | Config | Container build for backend | Dockerfile |
| backend/cmd/server/main.go | Source | Server entry point | Go |
| backend/internal/models/models.go | Source | Data models | Go |
| backend/internal/handlers/handlers.go | Source | HTTP handlers | Go |
| backend/internal/database/mongo.go | Source | MongoDB client | Go |
| backend/internal/middleware/middleware.go | Source | HTTP middleware | Go |
| backend/internal/helpers/response.go | Source | Response utilities | Go |
| config/mongo-init.js | Script | MongoDB initialization | JavaScript |

---

## 🎯 KEY FEATURES BY FILE

### Frontend Components

**Navbar.jsx**
- Fixed header with branding
- Mobile hamburger menu
- Navigation links
- CTA button
- Smooth animations

**Hero.jsx**
- Full-viewport hero section
- Glitch effect on brand text
- Animated background elements
- Feature cards with icons
- Statistics display
- Scroll indicator animation

**Services.jsx**
- 4-column grid (responsive)
- Dynamic data from API
- Icon animations on hover
- Gradient accent bars
- Service descriptions

**ContactForm.jsx**
- 8-field form
- Input validation
- File upload ready
- Success/error messages
- Loading state
- API integration

**Footer.jsx**
- Multi-column layout
- Social links
- Company information
- Quick links
- Year-based copyright

**Projects.jsx**
- Dynamic project list
- Category filtering
- Loading states
- API integration

---

## 🔌 Backend API Routes

**Health Check**
- `GET /api/health` - Server status

**Inquiries**
- `POST /api/inquiry` - Create new inquiry
- `GET /api/inquiries` - List all inquiries

**Projects**
- `GET /api/projects` - List projects

---

## 🎨 Design System Files

**globals.css**
- Grid overlay patterns
- Glitch animation
- Neon text effects
- Button styles
- Input styles
- Scroll bar styling
- Border effects

**tailwind.config.js**
- Custom colors (Deep Black, Caution Yellow, Steel, Tech Blue)
- Custom typography (monospace fonts)
- Custom animations (pulse-glow, scan-line, flicker)
- Extended theme utilities

---

## 📦 Dependencies

### Frontend (package.json)
- React 18.2.0
- Tailwind CSS 3.4.0
- Framer Motion 10.16.0
- Axios 1.6.0
- React Router DOM 6.18.0
- Lucide React 0.292.0

### Backend (go.mod)
- Gorilla Mux 1.8.1
- MongoDB Driver 1.14.0
- godotenv 1.5.1
- rs/cors 1.10.1

---

## 📝 DOCUMENTATION FILES

1. **README.md** (Main Guide)
   - Project overview
   - Setup instructions
   - API endpoints
   - Database schema
   - Component documentation
   - Development workflow
   - Deployment guide

2. **CREATIVE_MANIFESTO.md** (Design Guide)
   - Design philosophy
   - Color palette
   - Typography rules
   - Animation specifications
   - Component library
   - Spacing system
   - Accessibility guidelines

3. **SETUP.md** (Quick Start)
   - Prerequisites
   - Installation steps
   - Configuration guide
   - Verification checklist
   - Troubleshooting

4. **API_REFERENCE.md** (API Guide)
   - Endpoint specifications
   - Request/response formats
   - Data models
   - Error handling
   - Code examples
   - SDK usage

---

## 🔄 DATA FLOW

```
User Interaction (Frontend)
    ↓
React Component (ContactForm.jsx)
    ↓
API Call via Axios (apiClient.js)
    ↓
Go Handler (handlers.go)
    ↓
MongoDB Database (mongo-init.js schema)
    ↓
Response JSON back to Frontend
    ↓
Success/Error Message displayed
```

---

## 🚀 BUILD & DEPLOYMENT

### Development Build
- Frontend: `npm start` → React dev server (hot reload)
- Backend: `air` → Go hot reload
- Database: Docker MongoDB instance

### Production Build
- Frontend: `npm run build` → Optimized React bundle
- Backend: `go build` → Compiled binary
- All in Docker containers via docker-compose

---

## ✅ CONFIGURATION CHECKLIST

- [x] Docker Compose orchestration
- [x] Frontend React app with Tailwind
- [x] Framer Motion animations
- [x] Go backend with CORS
- [x] MongoDB integration
- [x] API endpoints (inquiry, projects)
- [x] Contact form with validation
- [x] Design system documentation
- [x] Comprehensive README
- [x] API reference guide
- [x] Setup guide
- [x] Environment templates
- [x] Git ignore file

---

## 🎯 NEXT STEPS FOR CUSTOMIZATION

1. **Replace placeholder content** in components
2. **Add your logo** to Navbar and Footer
3. **Customize color palette** in tailwind.config.js
4. **Add more projects** to MongoDB seed data
5. **Set up authentication** for inquiries management
6. **Configure email notifications** for new inquiries
7. **Add analytics** (Google Analytics, Mixpanel)
8. **Set up CI/CD pipeline** (GitHub Actions)
9. **Configure CDN** for static assets
10. **Add caching** strategies

---

**Project Version**: 1.0
**Last Updated**: February 2026
**Status**: Production Ready
