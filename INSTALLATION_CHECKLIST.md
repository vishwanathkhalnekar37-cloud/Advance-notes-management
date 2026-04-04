# ✅ Installation & Setup Checklist

## 🎯 Pre-Installation

- [ ] Python 3.9+ installed (`python --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MySQL 8.0+ installed (`mysql --version`)
- [ ] Git installed (optional)

---

## 📦 Step 1: Database Setup

### Create MySQL Database
- [ ] Open MySQL CLI: `mysql -u root -p`
- [ ] Run: `CREATE DATABASE notes_db;`
- [ ] Run: `CREATE USER 'notes_user'@'localhost' IDENTIFIED BY 'secure_password_123';`
- [ ] Run: `GRANT ALL PRIVILEGES ON notes_db.* TO 'notes_user'@'localhost';`
- [ ] Run: `FLUSH PRIVILEGES;`
- [ ] Exit MySQL: `EXIT;`

### Alternative: Script Method
- [ ] Navigate to docs folder
- [ ] Run: `mysql -u root -p < docs/DATABASE_SCHEMA.sql`

### Verify Database
- [ ] Connect: `mysql -u notes_user -p`
- [ ] Use database: `USE notes_db;`
- [ ] Check tables: `SHOW TABLES;` (should show 'users' and 'notes')
- [ ] Exit: `EXIT;`

---

## 🔧 Step 2: Backend Setup

### Create Virtual Environment
- [ ] Navigate to: `cd C:\notes-app\backend`
- [ ] Create venv: `python -m venv venv`
- [ ] Activate venv: `venv\Scripts\activate`
- [ ] Verify activated (should see `(venv)` in terminal)

### Install Dependencies
- [ ] Run: `pip install -r requirements.txt`
- [ ] Verify: `pip list` (should show fastapi, sqlalchemy, etc.)

### Configure Environment
- [ ] Copy template: `copy .env.example .env`
- [ ] Edit `.backend/.env` with editor:
  ```env
  DATABASE_URL=mysql+pymysql://notes_user:secure_password_123@localhost:3306/notes_db
  SECRET_KEY=your-super-secret-key-change-this-in-production
  ALGORITHM=HS256
  ACCESS_TOKEN_EXPIRE_MINUTES=30
  DEBUG=True
  ```

### Start Backend Server
- [ ] Run: `uvicorn app.main:app --reload --port 8000`
- [ ] Wait for: "Uvicorn running on http://0.0.0.0:8000"
- [ ] Test API: Open http://localhost:8000 in browser
- [ ] View docs: Open http://localhost:8000/docs

**Keep this terminal running!**

---

## 🎨 Step 3: Frontend Setup

### In New Terminal Window
- [ ] Navigate to: `cd C:\notes-app\frontend`

### Install Dependencies
- [ ] Run: `npm install`
- [ ] Verify: `npm list` (shows all dependencies)

### Configure Environment
- [ ] Copy template: `copy .env.example .env`
- [ ] Edit `.env` (usually no changes needed):
  ```env
  VITE_API_BASE_URL=http://localhost:8000/api
  VITE_APP_NAME=Notes Management System
  ```

### Start Frontend Server
- [ ] Run: `npm run dev`
- [ ] Wait for: "Local: http://localhost:5173" or "http://localhost:3000"
- [ ] Open in browser

**Keep this terminal running!**

---

## 🧪 Step 4: Test Application

### Create Test Account
- [ ] Go to Signup page
- [ ] Create account:
  - Email: `test@example.com`
  - Username: `testuser`
  - Password: `test123`
  - Full Name: `Test User`
- [ ] Click "Sign Up"

### Test Dashboard
- [ ] Should see dashboard with stats
- [ ] Should see "Recent Notes" section (empty)
- [ ] Should see user info in sidebar

### Create First Note
- [ ] Click "Create" in sidebar or "+ New Note"
- [ ] Enter title: `My First Note`
- [ ] Enter content: `Hello World!`
- [ ] Add tag: `test`
- [ ] Click "Save"

### Test Note List
- [ ] Click "My Notes" in sidebar
- [ ] Should see your note in list
- [ ] Click note to edit
- [ ] Edit content and save

### Test Search
- [ ] In "My Notes" page
- [ ] Type search query
- [ ] Results should filter in real-time

### Test Lock Feature
- [ ] Open a note
- [ ] Click lock icon (🔒)
- [ ] Enter PIN: `1234`
- [ ] Click "Lock Note"
- [ ] Refresh page - note should be locked

### Test Share Feature
- [ ] Open a note
- [ ] Click share icon (🔗)
- [ ] Click "Generate Share Link"
- [ ] Copy the share link
- [ ] Open in new incognito window
- [ ] Should see note preview (copy link from modal)

---

## ✅ Verification Checklist

### Backend Running
- [ ] Terminal shows "Uvicorn running"
- [ ] No Python errors
- [ ] API Docs available at http://localhost:8000/docs

### Frontend Running
- [ ] Terminal shows "X modules hot updated"
- [ ] No npm errors
- [ ] App visible at http://localhost:3000 or http://localhost:5173

### Database Connected
- [ ] No connection errors in backend terminal
- [ ] Can create/delete notes without errors
- [ ] Data persists after refresh

### Features Working
- [ ] ✅ User registration
- [ ] ✅ User login
- [ ] ✅ Create note
- [ ] ✅ Edit note
- [ ] ✅ Delete note
- [ ] ✅ Search notes
- [ ] ✅ Lock note
- [ ] ✅ Share note

---

## 🐛 Troubleshooting

### Database Issues
**Error: "Access Denied for user"**
- [ ] Check MySQL credentials in `.env`
- [ ] Verify MySQL is running
- [ ] Verify user created correctly

**Error: "Can't connect to MySQL server"**
- [ ] Verify MySQL is running: `mysql -u root -p`
- [ ] Check DATABASE_URL format
- [ ] Restart MySQL service

### Backend Issues
**Error: "Address already in use :8000"**
- [ ] Kill process: `lsof -i :8000`
- [ ] Or use different port: `--port 8001`

**Error: "ModuleNotFoundError"**
- [ ] Activate venv: `venv\Scripts\activate`
- [ ] Install deps: `pip install -r requirements.txt`

**Error: "No module named fastapi"**
- [ ] Reinstall: `pip install -r requirements.txt --force-reinstall`

### Frontend Issues
**Error: "EACCES permission denied"**
- [ ] Delete node_modules: `rm -rf node_modules`
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Reinstall: `npm install`

**Error: "Port 3000 already in use"**
- [ ] Use different port: `npm run dev -- --port 3001`

**Error: "Cannot find module 'react'"**
- [ ] Reinstall: `npm install`

### API Connection Issues
**Frontend can't connect to backend**
- [ ] Verify backend running on http://localhost:8000
- [ ] Check browser console for CORS errors
- [ ] Verify CORS_ORIGINS in backend config.py

---

## 📱 Testing on Different Devices

### Test Responsive Design
- [ ] Desktop (1920x1080) ✓
- [ ] Laptop (1366x768) ✓
- [ ] Tablet (768x1024) - Resize browser
- [ ] Mobile (375x667) - Resize browser

**Test with:** Browser DevTools → Toggle device toolbar

---

## 📚 Documentation Ready

- [ ] `README.md` - Project overview
- [ ] `QUICK_START.md` - 5-minute setup
- [ ] `PROJECT_SUMMARY.md` - Complete summary
- [ ] `docs/SETUP_GUIDE.md` - Detailed guide
- [ ] `docs/API_REFERENCE.md` - API docs
- [ ] `docs/DATABASE_SCHEMA.md` - DB design

---

## 🚀 Ready for Development!

### Next Steps
1. [ ] Read all documentation
2. [ ] Understand project structure
3. [ ] Make sample modifications
4. [ ] Deploy locally for testing
5. [ ] Plan additional features

### Development Commands

**Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Build Frontend (Production):**
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

---

## 🌟 Pro Tips

1. **Keep Both Terminals Open** - Backend and Frontend must run simultaneously
2. **Use DevTools** - Browser DevTools for debugging frontend
3. **Check Logs** - Terminal shows helpful error messages
4. **Clear Cache** - Sometimes clearing browser cache helps
5. **Restart if Issues** - Kill processes and restart cleanly

---

## 🎓 Learning Path

### Week 1: Basics
- [ ] Learn project structure
- [ ] Create/edit notes
- [ ] Test all features
- [ ] Read documentation

### Week 2: Customization
- [ ] Modify UI components
- [ ] Add new endpoints
- [ ] Change styling
- [ ] Customize features

### Week 3: Enhancement
- [ ] Add new features
- [ ] Optimize performance
- [ ] Improve security
- [ ] Plan deployment

---

## 📊 Project Size

| Component | Files | Size |
|-----------|-------|------|
| Backend | 15+ | ~50KB |
| Frontend | 50+ | ~100KB |
| Docs | 4 | ~50KB |
| Styles | 12 | ~30KB |
| **Total** | **81+** | **~230KB** |

---

## ✨ Features Implemented

### ✅ Complete (11)
- [x] User Registration
- [x] User Login/Logout
- [x] Create Notes
- [x] Edit Notes
- [x] Delete Notes
- [x] Search Notes
- [x] Tag Organization
- [x] Lock Notes
- [x] Share Notes
- [x] Dark Theme UI
- [x] Responsive Design

### 🎯 Ready for Extension
- [ ] AI Summarization
- [ ] Collaborative Editing
- [ ] Notifications
- [ ] Encryption
- [ ] Mobile App
- [ ] Version History

---

## 🎉 Completion Checklist

### Setup Complete When:
- [x] ✅ All files created and organized
- [x] ✅ Backend running without errors
- [x] ✅ Frontend running without errors
- [x] ✅ Database created and connected
- [x] ✅ Can create notes and they persist
- [x] ✅ All features tested and working
- [x] ✅ Documentation complete
- [x] ✅ Ready for development/deployment

---

## 📞 Support Resources

| Issue | Resource |
|-------|----------|
| Setup | `docs/SETUP_GUIDE.md` |
| API | `docs/API_REFERENCE.md` |
| Database | `docs/DATABASE_SCHEMA.md` |
| Quick | `QUICK_START.md` |
| Overview | `README.md` |

---

<div align="center">

## 🎊 INSTALLATION COMPLETE!

You now have a **production-ready Notes Management System**

### Start Creating! 📝✨

```bash
# Backend: cd backend && venv\Scripts\activate && uvicorn app.main:app --reload
# Frontend: cd frontend && npm run dev
# Visit: http://localhost:3000
```

---

**Status:** ✅ Ready
**Version:** 1.0.0
**Date:** 2024

</div>
