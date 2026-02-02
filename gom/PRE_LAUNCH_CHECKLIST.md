# Pre-Launch Checklist

## ✅ Prerequisites Installed?

- [ ] Node.js 18+ - https://nodejs.org
- [ ] Go 1.21+ - https://golang.org  
- [ ] MongoDB - https://www.mongodb.com/try/download/community

### Verify Installation
```powershell
node --version      # Should show v18 or higher
go version          # Should show 1.21 or higher
mongosh --version   # Should show version number
```

---

## 📁 Project Files Ready?

- [ ] `backend/cmd/server/main.go` exists
- [ ] `backend/internal/` folder with handlers, models, etc.
- [ ] `frontend/src/` folder with React components
- [ ] `frontend/package.json` exists
- [ ] `config/mongo-init.js` exists

---

## 🔧 Configuration Ready?

### Backend Environment
```powershell
# c:\Users\shris\gom\backend\.env
MONGO_URI=mongodb://admin:madmann_secure_2025@localhost:27017/madmann_db
PORT=8080
CORS_ORIGIN=http://localhost:3000
ENVIRONMENT=development
```

### Frontend Environment
```powershell
# c:\Users\shris\gom\frontend\.env
REACT_APP_API_URL=http://localhost:8080
NODE_ENV=development
```

- [ ] Backend .env configured
- [ ] Frontend .env configured

---

## 🗄️ Database Ready?

Choose ONE option:

### Option A: Local MongoDB
- [ ] MongoDB installed
- [ ] Data directory created: `C:\data\db`
- [ ] Can connect: `mongosh`

### Option B: MongoDB Atlas (Cloud)
- [ ] Account created
- [ ] Cluster created
- [ ] Connection string obtained
- [ ] MONGO_URI updated in backend/.env

---

## 📝 Documentation Files Present?

- [ ] 00_START_HERE_LOCAL.md
- [ ] LOCAL_DEVELOPMENT.md
- [ ] QUICK_START_COMMANDS.md
- [ ] CORS_EXPLAINED.md
- [ ] start-local.bat

---

## 🚀 Ready to Launch?

### Startup Method 1: Automatic (Easiest)
```powershell
# Just double-click this file:
start-local.bat
```

### Startup Method 2: Manual (Recommended for Development)

**Terminal 1:**
```powershell
mongod --dbpath "C:\data\db"
```

**Terminal 2:**
```powershell
cd c:\Users\shris\gom\backend
go run ./cmd/server
```

**Terminal 3:**
```powershell
cd c:\Users\shris\gom\frontend
npm install
npm start
```

---

## ✨ Verification After Launch

### Frontend Loads?
- [ ] Visit http://localhost:3000
- [ ] Page loads without errors
- [ ] See hero section with services

### Backend Responds?
- [ ] API health check: http://localhost:8080/api/health
- [ ] Returns JSON response

### Can Submit Form?
- [ ] Fill contact form on frontend
- [ ] Submit button works
- [ ] See success message

### Data in Database?
```powershell
mongosh
use madmann_db
db.inquiries.find()
```
- [ ] See submitted inquiry in results

---

## 🐛 Troubleshooting Checklist

### If Frontend Won't Load
- [ ] Check npm install completed without errors
- [ ] Check no other process on port 3000: `netstat -ano | findstr :3000`
- [ ] Check REACT_APP_API_URL in frontend/.env

### If Backend Won't Start
- [ ] Check no other process on port 8080: `netstat -ano | findstr :8080`
- [ ] Check go.mod and go.sum files exist
- [ ] Check MONGO_URI in backend/.env is correct
- [ ] Check MongoDB is running: `mongosh`

### If MongoDB Won't Connect
- [ ] Check MongoDB is running: `mongosh`
- [ ] Check data directory exists: `C:\data\db`
- [ ] Check MONGO_URI matches actual MongoDB setup
- [ ] Try: `mongod --dbpath "C:\data\db"` in new terminal

### If Form Submission Fails
- [ ] Check backend and frontend both running
- [ ] Check CORS_ORIGIN in backend/.env matches frontend URL
- [ ] Check browser console for error messages
- [ ] Check backend logs for API errors

---

## 🎯 Success Indicators

When everything is working:

✅ Frontend loads at http://localhost:3000
✅ Navigation works smoothly
✅ Hero section animates
✅ Contact form is visible
✅ Backend responds at http://localhost:8080/api/health
✅ Can submit form without CORS errors
✅ Data appears in MongoDB
✅ No console errors

---

## 📞 Need Help?

1. Check [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md)
2. Read [QUICK_START_COMMANDS.md](QUICK_START_COMMANDS.md)
3. Review [CORS_EXPLAINED.md](CORS_EXPLAINED.md)
4. Check specific error in browser console or terminal

---

## 🎉 You're Ready!

If all checkboxes are complete, your application is ready to run!

**Next Step: Launch the app** ↓

```powershell
# Option 1: Double-click
start-local.bat

# OR Option 2: Use Terminals 1-3 above
```

**Then visit: http://localhost:3000** 🚀
