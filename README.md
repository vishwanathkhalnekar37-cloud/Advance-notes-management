<<<<<<< HEAD
# Advance-notes-management
=======
# README.md - Notes Management System

<div align="center">

## 📝 Notes Management System

A **production-ready** Notes Management System with Bug0-inspired UI/UX, featuring modern SaaS design with clean, minimal aesthetic.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-Active-success.svg)

> Build, share, and manage your notes with style 🚀

</div>

---

## ✨ Features

### Core Features
- ✅ User authentication (Register/Login)
- ✅ Full CRUD operations on notes
- ✅ Rich text editor
- ✅ Code syntax highlighting
- ✅ Auto-detect code/JSON
- ✅ Tag-based organization
- ✅ Note search
- ✅ Pagination

### Advanced Features
- 🔒 **Lock Notes** - Protect notes with PIN
- 🔗 **Share Notes** - Generate unique shareable links
- 📊 **Code Detection** - Auto-format code blocks
- 🏷️ **Smart Tags** - Organize with tags
- 💾 **Auto-save** - Save changes automatically
- 📈 **View Tracking** - Track note views
- 🌙 **Dark Mode** - Modern dark theme (light mode coming)
- 📱 **Responsive** - Works on all devices

### UI/UX
- 🎨 **Modern Design** - Bug0-inspired minimal aesthetic
- ⚡ **Smooth Animations** - Polished interactions
- 📐 **Card-Based Layout** - Clean organization
- 🧭 **Sidebar Navigation** - Easy navigation
- 🎯 **Premium SaaS Feel** - Professional look

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **CSS3** - Styling (Custom, no frameworks)
- **Context API** - State management
- **Fetch API** - HTTP client

### Backend
- **FastAPI** - Web framework
- **Python 3.9+** - Language
- **SQLAlchemy** - ORM
- **Pydantic** - Validation
- **JWT** - Authentication
- **MySQL** - Database

### Deployment Ready
- Docker support (to be added)
- Environment-based config
- Production-ready error handling

---

## 📦 Installation

### Quick Start (5 minutes)

#### Prerequisites
- Python 3.9+
- Node.js 18+
- MySQL 8.0+

#### Step 1: Clone/Setup
```bash
cd C:\notes-app
```

#### Step 2: Database
```bash
mysql -u root -p notes_db < docs/DATABASE_SCHEMA.sql
```

#### Step 3: Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env with your database credentials
uvicorn app.main:app --reload
```

#### Step 4: Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:3000** - Done! ✅

---

## 📚 Documentation

- [Setup Guide](docs/SETUP_GUIDE.md) - Complete installation guide
- [API Reference](docs/API_REFERENCE.md) - Full API documentation
- [Database Schema](docs/DATABASE_SCHEMA.md) - Database design

---

## 🎯 Project Structure

```
notes-app/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API endpoints
│   │   ├── utils/           # Helper functions
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # DB connection
│   │   └── main.py          # FastAPI app
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context
│   │   ├── hooks/          # Custom hooks
│   │   ├── styles/         # CSS files
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── docs/
    ├── SETUP_GUIDE.md
    ├── API_REFERENCE.md
    └── DATABASE_SCHEMA.md
```

---

## 🚀 Usage

### Create a Note
1. Click **"+ New Note"** in sidebar
2. Enter title and content
3. Add tags (optional)
4. Click **"Save"**

### Share a Note
1. Open a note
2. Click **"Share"** button
3. Toggle "Make Public" if desired
4. Copy the share link
5. Share with others

### Lock a Note
1. Open a note
2. Click **"Lock"** button
3. Enter a PIN
4. Confirm
5. Note is now protected

### Search Notes
1. Use the search bar in "My Notes"
2. Type to filter by title or content
3. Results update in real-time

---

## 📋 API Examples

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user123",
    "password": "pass123"
  }'
```

### Create Note
```bash
curl -X POST http://localhost:8000/api/notes \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Note",
    "content": "Content here",
    "tags": ["tag1"],
    "content_type": "text"
  }'
```

### Search
```bash
curl -X GET "http://localhost:8000/api/notes/search?q=python" \
  -H "Authorization: Bearer {token}"
```

See [API_REFERENCE.md](docs/API_REFERENCE.md) for complete API docs.

---

## 🎨 Design Highlights

### Color Palette (Dark Mode)
- **Background**: `#0f172a` (Dark blue)
- **Secondary**: `#1e293b` (Slate)
- **Primary**: `#2563eb` (Blue)
- **Accent**: `#8b5cf6` (Purple)
- **Text**: `#f1f5f9` (Light)

### Typography
- **Font**: System fonts (-apple-system, BlinkMacSystemFont, etc.)
- **Headlines**: 700 weight
- **Body**: 400-600 weight
- **Size**: 12px-32px scale

### Components
- Cards with hover effects
- Smooth transitions (200ms)
- Icons with emojis
- Rounded corners (8px-16px)
- Subtle shadows

---

## 🔐 Security

### Implemented
- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ PIN-based note locking
- ✅ User isolation
- ✅ CORS protection
- ✅ SQL injection prevention (SQLAlchemy)

### Recommended for Production
- [ ] HTTPS/SSL
- [ ] Rate limiting
- [ ] Input validation enhancement
- [ ] Audit logging
- [ ] Two-factor authentication
- [ ] Database encryption

---

## 🗺️ Roadmap

### Phase 2 (Coming Soon)
- [ ] Light mode
- [ ] Rich text editor (TipTap)
- [ ] Collaborative editing
- [ ] Note templates
- [ ] AI summary generation
- [ ] Smart tagging with AI
- [ ] Mobile app (React Native)

### Phase 3
- [ ] End-to-end encryption
- [ ] Offline support
- [ ] Sync across devices
- [ ] Version history
- [ ] Comments & mentions
- [ ] Real-time collaboration

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Send a pull request

---

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Ensure MySQL is running
mysql -u root -p
# Check .env file
# Install dependencies
pip install -r requirements.txt
```

### Frontend won't load
```bash
# Clear node_modules
rm -rf frontend/node_modules
npm install
# Check port 3000 is free
```

### Database connection error
- Verify MySQL credentials in `.env`
- Check database exists
- Ensure user has permissions

See [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) for more troubleshooting.

---

## 📞 Support

- 📖 Read the [Setup Guide](docs/SETUP_GUIDE.md)
- 🔗 Check [API Reference](docs/API_REFERENCE.md)
- 🐛 Report issues in GitHub

---

<div align="center">

Made with ❤️ by your development team

**Version 1.0.0** | **2024**

</div>
>>>>>>> 9407ad2 (Initial commit: Add Notes Management Application with frontend and backend)
