# 🚀 QUICK START GUIDE

## ⚡ Start in 5 Minutes

### Prerequisites Check
```bash
python --version  # Should be 3.9+
node --version    # Should be 18+
npm --version
mysql --version   # Should be 8.0+
```

---

## Step 1️⃣: Database Setup (2 minutes)

```bash
# Start MySQL
mysql -u root -p

# Create database
CREATE DATABASE notes_db;
CREATE USER 'notes_user'@'localhost' IDENTIFIED BY 'secure_password_123';
GRANT ALL PRIVILEGES ON notes_db.* TO 'notes_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Step 2️⃣: Backend Setup (1 minute)

```bash
cd C:\notes-app\backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env: Set DATABASE_URL with your credentials
```

**Edit `.backend/.env`:**
```env
DATABASE_URL=mysql+pymysql://notes_user:secure_password_123@localhost:3306/notes_db
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
```

**Start Backend:**
```bash
uvicorn app.main:app --reload --port 8000
```

✅ Backend running at: **http://localhost:8000**
📚 API Docs at: **http://localhost:8000/docs**

---

## Step 3️⃣: Frontend Setup (1 minute)

**Open new terminal:**

```bash
cd C:\notes-app\frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

**Start Frontend:**
```bash
npm run dev
```

✅ Frontend running at: **http://localhost:3000** (or http://localhost:5173)

---

## 🎉 Done! 

Visit **http://localhost:3000** and start using the app!

### Test Account
```
Email: test@example.com
Password: test123456
```

---

## 📁 Project Files

### Backend
- `backend/app/main.py` - FastAPI app
- `backend/app/models/` - Database models
- `backend/app/routes/` - API endpoints
- `backend/app/services/` - Business logic
- `backend/requirements.txt` - Dependencies

### Frontend
- `frontend/src/App.jsx` - Main app component
- `frontend/src/pages/` - Page components
- `frontend/src/components/` - Reusable components
- `frontend/src/context/` - State management
- `frontend/src/styles/` - CSS files
- `frontend/package.json` - Dependencies

### Documentation
- `README.md` - Project overview
- `docs/SETUP_GUIDE.md` - Complete setup guide
- `docs/API_REFERENCE.md` - API documentation
- `docs/DATABASE_SCHEMA.md` - Database design

---

## 🔗 Important Links

📖 **Full Setup Guide:** `docs/SETUP_GUIDE.md`
📚 **API Documentation:** `docs/API_REFERENCE.md`
🗄️ **Database Schema:** `docs/DATABASE_SCHEMA.md`
📖 **Project README:** `README.md`

---

## 🆘 Troubleshooting

### MySQL Connection Failed
```bash
# Verify MySQL is running
mysql -u root -p
# Check DATABASE_URL in .env
```

### Port Already in Use
```bash
# Backend (port 8000)
lsof -i :8000
kill -9 <PID>

# Frontend (port 3000/5173)
# Use: npm run dev -- --port 3001
```

### Module Not Found
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

---

## 📋 Features Implemented

✅ User authentication (Register/Login)
✅ Create, Read, Update, Delete notes
✅ Rich text editor with formatting
✅ Tag-based organization
✅ Full-text search
✅ Auto-detect code/JSON
✅ Lock notes with PIN
✅ Generate shareable links
✅ Note view tracking
✅ Dark theme UI
✅ Responsive design
✅ Bug0-inspired modern design

---

## 🎨 UI/UX Design

The frontend features a **Bug0-inspired** modern SaaS design:
- 🌙 Dark theme (default)
- 📐 Card-based layout
- 🎯 Minimum viable design
- ⚡ Smooth animations
- 🧭 Sidebar navigation
- 📱 Fully responsive
- 🎨 Professional color scheme

---

## 🔒 Security

- Password hashing with bcrypt
- JWT token authentication
- PIN-based note locking
- User data isolation
- CORS protection
- SQL injection prevention

---

## 🚀 Next Steps

1. ✅ Complete setup
2. ✅ Test with sample notes
3. ✅ Explore advanced features
4. 📖 Read full documentation
5. 🌟 Deploy to production (see SETUP_GUIDE.md)

---

## 📧 Support

Issues or questions?
- Read `docs/SETUP_GUIDE.md` for detailed instructions
- Check `docs/API_REFERENCE.md` for API issues
- Check browser console for frontend errors
- Check backend logs for server errors

---

**Happy note-taking! 📝✨**

---

Created: 2024 | Version: 1.0.0
