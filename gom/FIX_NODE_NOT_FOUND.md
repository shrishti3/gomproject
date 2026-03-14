# ⚠️ Node.js Not Installed

Your system doesn't have Node.js installed, which is required for the React frontend.

## 🔧 Quick Fix

### Step 1: Download Node.js
1. Go to: https://nodejs.org
2. Download **LTS version** (recommended)
3. Run the installer

### Step 2: Install Node.js
1. Open the downloaded `.msi` file
2. Click "Next" through the installation wizard
3. **IMPORTANT**: When asked, check the box: "Add to PATH"
4. Complete the installation
5. **Restart PowerShell** (close and reopen)

### Step 3: Verify Installation
```powershell
node --version
npm --version
```

Both should show version numbers.

---

## 🚀 After Installation

Once Node.js is installed and you've restarted PowerShell:

```powershell
cd c:\Users\shris\gom\frontend
npm install
npm start
```

---

## 🆘 Still Having Issues?

### Option A: Use Command Prompt (cmd) instead of PowerShell
```cmd
cd c:\Users\shris\gom\frontend
npm install
npm start
```

### Option B: Verify Node.js Installation
```powershell
# Check where Node.js is installed
Get-Command node

# Should show the path to node.exe
```

### Option C: Reinstall Node.js
1. Uninstall Node.js from Control Panel
2. Restart your computer
3. Download and reinstall from https://nodejs.org
4. Make sure "Add to PATH" is checked

---

## ✅ Success Check

After installing, you should be able to run:
```powershell
node --version     # Should show v18.x.x or higher
npm --version      # Should show 9.x.x or higher
```

---

**Once installed, try again:**
```powershell
cd c:\Users\shris\gom\frontend
npm install
npm start
```

Your app should then load at http://localhost:3000
