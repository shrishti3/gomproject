# MadMann Dynamics - Deployment & Operations Guide

## 🚀 DEPLOYMENT STRATEGIES

### Pre-Deployment Checklist

- [x] All environment variables configured
- [x] Database migrations tested
- [x] API endpoints documented
- [x] Frontend builds without errors
- [x] Backend compiles successfully
- [x] Docker images build cleanly
- [x] Security headers configured
- [x] CORS properly configured
- [x] Error handling implemented
- [x] Logging configured

---

## 📦 PRODUCTION DEPLOYMENT

### Docker Hub Deployment

**Step 1: Build and Tag Images**
```bash
# Frontend
docker build -t madmann-frontend:1.0.0 ./frontend
docker tag madmann-frontend:1.0.0 your-registry/madmann-frontend:1.0.0
docker push your-registry/madmann-frontend:1.0.0

# Backend
docker build -t madmann-backend:1.0.0 ./backend
docker tag madmann-backend:1.0.0 your-registry/madmann-backend:1.0.0
docker push your-registry/madmann-backend:1.0.0
```

**Step 2: Update Docker Compose for Production**
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    image: your-registry/madmann-backend:1.0.0
    environment:
      MONGO_URI: mongodb://prod-mongo:27017/madmann_db
      ENVIRONMENT: production
      PORT: 8080
    restart: always

  frontend:
    image: your-registry/madmann-frontend:1.0.0
    environment:
      REACT_APP_API_URL: https://api.madmanndynamics.com
    restart: always

  mongodb:
    image: mongo:7.0
    volumes:
      - prod_mongo_data:/data/db
    restart: always
```

**Step 3: Deploy**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## ☁️ CLOUD PLATFORM DEPLOYMENT

### AWS ECS (Elastic Container Service)

**1. Create ECR Repositories**
```bash
aws ecr create-repository --repository-name madmann-frontend
aws ecr create-repository --repository-name madmann-backend
```

**2. Push Images**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag madmann-frontend:1.0.0 [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/madmann-frontend:1.0.0
docker push [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/madmann-frontend:1.0.0
```

**3. Create ECS Task Definition**
```json
{
  "family": "madmann-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "madmann-backend",
      "image": "[ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/madmann-backend:1.0.0",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "MONGO_URI",
          "value": "mongodb://admin:password@mongo-host:27017/madmann_db"
        },
        {
          "name": "ENVIRONMENT",
          "value": "production"
        }
      ]
    }
  ]
}
```

### Google Cloud Run

**1. Build and Push to Artifact Registry**
```bash
gcloud builds submit --tag gcr.io/[PROJECT_ID]/madmann-backend ./backend
gcloud builds submit --tag gcr.io/[PROJECT_ID]/madmann-frontend ./frontend
```

**2. Deploy Backend**
```bash
gcloud run deploy madmann-backend \
  --image gcr.io/[PROJECT_ID]/madmann-backend \
  --memory 512M \
  --allow-unauthenticated \
  --set-env-vars MONGO_URI=mongodb://...,ENVIRONMENT=production
```

**3. Deploy Frontend**
```bash
gcloud run deploy madmann-frontend \
  --image gcr.io/[PROJECT_ID]/madmann-frontend \
  --memory 256M \
  --allow-unauthenticated
```

### DigitalOcean App Platform

**1. Create app.yaml**
```yaml
name: madmann-dynamics
services:
  - name: backend
    github:
      repo: your-org/madmann-dynamics
      branch: main
    build_command: "go build -o bin/madmann-api ./cmd/server"
    run_command: "./bin/madmann-api"
    envs:
      - key: MONGO_URI
        value: ${db.connection_string}
      - key: ENVIRONMENT
        value: "production"

  - name: frontend
    github:
      repo: your-org/madmann-dynamics
      branch: main
    build_command: "npm run build"
    http_port: 3000

databases:
  - name: mongodb
    engine: MONGODB
    version: "7.0"
```

**2. Deploy**
```bash
doctl apps create --spec app.yaml
```

---

## 🔐 PRODUCTION SECURITY

### Environment Variables
```bash
# .env.production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/madmann_db
PORT=8080
ENVIRONMENT=production
CORS_ORIGIN=https://madmanndynamics.com
JWT_SECRET=your-very-secure-secret-key
NODE_ENV=production
REACT_APP_API_URL=https://api.madmanndynamics.com
```

### Security Headers (Add to Nginx/Load Balancer)
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:" always;
```

### SSL/TLS Certificate
```bash
# Using Let's Encrypt with Certbot
certbot certonly --standalone -d madmanndynamics.com -d api.madmanndynamics.com
```

### Database Security
```javascript
// MongoDB Atlas - Configure IP Whitelist
// 1. Go to MongoDB Atlas Dashboard
// 2. Network Access → IP Whitelist
// 3. Add your deployment server IPs
// 4. Enable encryption at rest and in transit
```

---

## 📊 MONITORING & LOGGING

### Application Performance Monitoring (APM)

**New Relic Integration**
```bash
# Backend (Go)
go get github.com/newrelic/go-agent

# Frontend (React)
npm install newrelic-browser-monitoring
```

**Prometheus Metrics** (future)
```go
import "github.com/prometheus/client_golang/prometheus"

var httpRequestsTotal = prometheus.NewCounterVec(
    prometheus.CounterOpts{
        Name: "http_requests_total",
    },
    []string{"method", "endpoint", "status"},
)
```

### Logging Configuration

**Backend Logging**
```go
// Use structured logging
log.Printf("[%s] %s - %s", time.Now(), level, message)
```

**Frontend Logging**
```javascript
// Use console groups in development
console.group('API Request');
console.log('Endpoint:', url);
console.log('Method:', method);
console.groupEnd();
```

### Log Aggregation
```bash
# Using ELK Stack (Elasticsearch, Logstash, Kibana)
# OR Cloud solutions: CloudWatch, Stackdriver, Datadog
```

---

## 🔄 CI/CD PIPELINE

### GitHub Actions Workflow

**File: `.github/workflows/deploy.yml`**
```yaml
name: Deploy MadMann Dynamics

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-go@v2
        with:
          go-version: 1.21
      - run: cd backend && go test ./...

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm ci && npm run build

  build-and-push:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - uses: docker/setup-buildx-action@v1
      - uses: docker/login-action@v1
        with:
          registry: ${{ secrets.REGISTRY }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}
      
      - uses: docker/build-push-action@v2
        with:
          context: ./backend
          push: true
          tags: |
            ${{ secrets.REGISTRY }}/madmann-backend:${{ github.sha }}
            ${{ secrets.REGISTRY }}/madmann-backend:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # Deploy commands here
          echo "Deploying to production..."
```

---

## 🔧 SCALING STRATEGIES

### Horizontal Scaling (Multiple Instances)

**Load Balancer Configuration (Nginx)**
```nginx
upstream backend {
    server backend1:8080;
    server backend2:8080;
    server backend3:8080;
}

server {
    listen 80;
    server_name api.madmanndynamics.com;
    
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Vertical Scaling (Larger Instances)
```yaml
# In docker-compose.prod.yml
services:
  backend:
    resources:
      limits:
        cpus: '2'
        memory: 2G
      reservations:
        cpus: '1'
        memory: 1G
```

### Database Optimization
```javascript
// MongoDB Replication Set
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})

// Add indexes
db.inquiries.createIndex({ email: 1 })
db.inquiries.createIndex({ createdAt: -1 })
db.projects.createIndex({ category: 1 })
```

---

## 🚨 BACKUP & DISASTER RECOVERY

### Database Backups

**Automated MongoDB Backups**
```bash
# Using MongoDB Atlas automated backups
# Or manual backup:
mongodump --uri "mongodb://user:pass@host:27017/madmann_db" \
  --out /backups/$(date +%Y-%m-%d)
```

**Restore from Backup**
```bash
mongorestore --uri "mongodb://user:pass@host:27017" \
  /backups/2026-02-01
```

### Disaster Recovery Plan
1. **RPO** (Recovery Point Objective): 1 hour
2. **RTO** (Recovery Time Objective): 4 hours
3. **Backup Frequency**: Daily automated + weekly manual
4. **Retention Policy**: 30 days rolling backups

---

## 📈 PERFORMANCE TUNING

### Frontend Optimization
```bash
# Lighthouse scores target
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 95
# SEO: > 95

# Commands
npm run build  # Optimized production build
npm run analyze  # Analyze bundle size
```

### Backend Optimization
```go
// Connection pooling
mongoOpts := options.Client().SetMaxPoolSize(100)

// Request timeout
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

// Database indexing
db.inquiries.createIndex({ email: 1 })
```

---

## 🔍 TROUBLESHOOTING PRODUCTION

### High Memory Usage
```bash
# Check memory usage
docker stats

# Reduce memory limits or optimize code
```

### Slow API Responses
```bash
# Check MongoDB performance
db.currentOp()
db.system.profile.find().limit(1).sort({ts:-1})

# Check Go profiling
go tool pprof http://localhost:6060/debug/pprof/profile
```

### Database Connection Issues
```bash
# Test MongoDB connection
mongosh --uri "mongodb://user:pass@host:27017"

# Check connection pool
db.serverStatus().connections
```

---

## 📋 PRODUCTION CHECKLIST

- [ ] All environment variables set
- [ ] SSL/TLS certificate installed
- [ ] Database backups configured
- [ ] Monitoring and alerting set up
- [ ] CI/CD pipeline configured
- [ ] Load balancer configured
- [ ] Security headers enabled
- [ ] CORS properly configured
- [ ] Error tracking enabled (Sentry)
- [ ] APM (Application Performance Monitoring) running
- [ ] Log aggregation configured
- [ ] Database indexes created
- [ ] Firewall rules configured
- [ ] DDoS protection enabled
- [ ] Failover configured
- [ ] Health checks configured
- [ ] Rate limiting enabled
- [ ] API documentation deployed
- [ ] Admin panel configured (future)
- [ ] Analytics integrated

---

## 🎯 PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| Page Load Time | < 2 seconds |
| API Response Time | < 200ms (p95) |
| Database Query | < 50ms |
| CPU Usage | < 70% under normal load |
| Memory Usage | < 80% of allocated |
| Uptime | > 99.9% |
| Error Rate | < 0.1% |

---

## 📞 SUPPORT & MAINTENANCE

**Regular Maintenance Tasks**
- Weekly: Review error logs and metrics
- Monthly: Database optimization, security audit
- Quarterly: Load testing, penetration testing
- Annually: Disaster recovery drill

**Emergency Contacts**
- DevOps Lead: [contact]
- Backend Lead: [contact]
- Frontend Lead: [contact]
- On-Call Support: [contact]

---

**Last Updated**: February 2026
**Version**: 1.0
**Status**: Production Ready
