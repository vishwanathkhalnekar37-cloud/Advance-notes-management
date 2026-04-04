# Notes Management System - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Features](#features)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Python 3.9+** - For FastAPI backend
- **Node.js 18+** - For React frontend
- **MySQL 8.0+** - Database
- **npm or yarn** - Package manager
- **Git** - Version control

### Installation Commands
```bash
# Check Python
python --version

# Check Node.js
node --version
npm --version

# Check MySQL
mysql --version
```

## Installation

### 1. Clone/Download Project
```bash
cd C:\notes-app
```

### 2. Create Project Directories
All directories are already created. Verify structure:
```
notes-app/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── docs/
    └── DATABASE_SCHEMA.md
```

## Database Setup

### Step 1: Create Database
```bash
# Open MySQL CLI
mysql -u root -p

# Create database and user
CREATE DATABASE notes_db;
CREATE USER 'notes_user'@'localhost' IDENTIFIED BY 'secure_password_123';
GRANT ALL PRIVILEGES ON notes_db.* TO 'notes_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Or use the SQL from `docs/DATABASE_SCHEMA.md`:
```bash
mysql -u root -p notes_db < docs/DATABASE_SCHEMA.sql
```

### Step 2: Configure Database Connection
```bash
# Create .env file in backend directory
cd C:\notes-app\backend
copy .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=mysql+pymysql://notes_user:secure_password_123@localhost:3306/notes_db
SECRET_KEY=your-super-secret-key-change-in-production-2024
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
```

**Important:** Change `SECRET_KEY` to a random string before production!

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd C:\notes-app\backend
```

### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Or use conda
conda create -n notes-app python=3.9
conda activate notes-app
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Create Tables
```bash
# Tables will be created automatically when app starts
# Or manually run using Python
python
```

```python
from app.database import Base, engine
Base.metadata.create_all(bind=engine)
exit()
```

### Step 5: Run Backend Server
```bash
python -m app.main
# Or
uvicorn app.main:app --reload --port 8000
```

**Backend will be available at:** `http://localhost:8000`
**API Docs:** `http://localhost:8000/docs`

## Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd C:\notes-app\frontend
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Create Environment File
```bash
copy .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Notes Management System
```

### Step 4: Run Development Server
```bash
npm run dev
# or
yarn dev
```

**Frontend will be available at:** `http://localhost:3000` or `http://localhost:5173`

## Running the Application

### Full Application Setup (Step-by-Step)

**Terminal 1 - Backend:**
```bash
cd C:\notes-app\backend
# Activate venv (if using venv)
venv\Scripts\activate
# Run server
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd C:\notes-app\frontend
npm install  # if dependencies not installed
npm run dev
```

### Quick Start Script (Optional)
Create `start.bat` in `C:\notes-app`:
```batch
@echo off
start "Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload"
start "Frontend" cmd /k "cd frontend && npm run dev"
pause
```

Then just run: `start.bat`

## Features

### ✅ Implemented Features

1. **Authentication**
   - User registration & login
   - JWT token-based authentication
   - Secure password hashing (bcrypt)

2. **Notes Management**
   - Create, Read, Update, Delete notes
   - Auto-save functionality
   - Rich text editor
   - Code syntax highlighting
   - Tag filtering and search

3. **Advanced Features**
   - 🔒 Lock notes with PIN protection
   - 🔗 Generate shareable links
   - 📊 Auto-detect code/JSON
   - 🏷️ Tag-based organization
   - 💻 Code language detection
   - 📈 View count tracking

4. **UI/UX**
   - Bug0-inspired modern design
   - Dark theme (default)
   - Smooth animations
   - Responsive design
   - Card-based layout
   - Sidebar navigation

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "John Doe"
}

Response: {
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": { ... }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: {
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": { ... }
}
```

### Notes Endpoints

#### Create Note
```
POST /api/notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Note",
  "content": "Note content here",
  "tags": ["tag1", "tag2"],
  "content_type": "text"
}
```

#### Get All Notes
```
GET /api/notes?skip=0&limit=20
Authorization: Bearer {token}
```

#### Get Single Note
```
GET /api/notes/{note_id}
Authorization: Bearer {token}
```

#### Update Note
```
PUT /api/notes/{note_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "content": "Updated content",
  "tags": ["new_tag"],
  "content_type": "code"
}
```

#### Delete Note
```
DELETE /api/notes/{note_id}
Authorization: Bearer {token}
```

#### Search Notes
```
GET /api/notes/search?q=search_term
Authorization: Bearer {token}
```

#### Lock Note
```
POST /api/notes/{note_id}/lock
Authorization: Bearer {token}
Content-Type: application/json

{
  "lock_pin": "1234"
}
```

#### Unlock Note
```
POST /api/notes/{note_id}/unlock
Authorization: Bearer {token}
Content-Type: application/json

{
  "lock_pin": "1234"
}
```

#### Share Note
```
POST /api/notes/{note_id}/share
Authorization: Bearer {token}
Content-Type: application/json

{
  "is_shared": true,
  "is_public": false
}
```

#### Get Shared Note (Public)
```
GET /api/notes/shared/{share_token}
(No authentication required)
```

#### Unshare Note
```
DELETE /api/notes/{note_id}/share
Authorization: Bearer {token}
```

## Troubleshooting

### Backend Issues

#### Database Connection Error
```
Error: (pymysql.err.OperationalError) ... Connection refused
```
**Solution:**
- Verify MySQL is running: `mysql -u root -p`
- Check DATABASE_URL in `.env`
- Ensure database exists: `SHOW DATABASES;`

#### Port Already in Use
```
Error: Address already in use :::8000
```
**Solution:**
```bash
# Kill process on port 8000
lsof -i :8000
kill -9 <PID>

# Or use different port
uvicorn app.main:app --port 8001
```

#### Module Not Found
```
Error: ModuleNotFoundError: No module named 'fastapi'
```
**Solution:**
```bash
pip install -r requirements.txt
```

### Frontend Issues

#### Node Modules Not Installed
```bash
cd frontend
npm install
```

#### Port 3000 Already in Use
```bash
# Use different port
npm run dev -- --port 3001
```

#### API Connection Error
- Check backend is running on `http://localhost:8000`
- Verify CORS configuration in `backend/app/config.py`
- Check network tab in browser DevTools

## Development Tips

### Code Structure

**Backend (FastAPI):**
- `models/` - SQLAlchemy ORM models
- `schemas/` - Pydantic validation schemas
- `services/` - Business logic
- `routes/` - API endpoints
- `utils/` - Helper functions
- `config.py` - Configuration
- `database.py` - Database connection

**Frontend (React):**
- `components/` - Reusable UI components
- `pages/` - Page components
- `context/` - React Context API
- `hooks/` - Custom React hooks
- `styles/` - CSS styling
- `utils/` - Helper functions

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL=mysql+pymysql://user:pass@localhost:3306/notes_db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
CORS_ORIGINS=http://localhost:3000
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Notes Management System
```

## Testing

### Test User Account
You can create a test account through the signup page:
- Email: `test@example.com`
- Password: `test123456`

### Test API with cURL
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"test123456"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
```

## Production Deployment

Before deploying:

1. **Update SECRET_KEY** in `.env`
2. **Disable DEBUG mode**: `DEBUG=False`
3. **Update CORS_ORIGINS** for your domain
4. **Use proper database**: Configure for production MySQL
5. **Add SSL/HTTPS** to API
6. **Build React frontend**: `npm run build`

### Deployment Platforms
- **Backend:** Heroku, Railway, AWS, Azure, DigitalOcean
- **Frontend:** Vercel, Netlify, GitHub Pages, AWS S3
- **Database:** AWS RDS, Azure Database, DigitalOcean

## Support & Documentation

- FastAPI Docs: `http://localhost:8000/docs`
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

## License
MIT License

---

**Created:** 2024
**Version:** 1.0.0
