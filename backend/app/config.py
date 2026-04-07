"""Configuration settings for the Notes Management System"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory
backend_dir = Path(__file__).parent.parent
env_file = backend_dir / ".env"
load_dotenv(env_file)

# Database Configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/notes_db?charset=utf8mb4"
)

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Application Configuration
APP_NAME = "Notes Management System"
APP_VERSION = "1.0.0"
DEBUG = os.getenv("DEBUG", "True") == "True"

# CORS Configuration
CORS_ORIGINS = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003",
    "http://127.0.0.1:5173",
    "https://advance-notes-management.vercel.app",
    "https://advance-notes-management.onrender.com",
    "https://advance-notes-management-frontend.onrender.com",
    os.getenv("FRONTEND_URL", "https://advance-notes-management.onrender.com"),
]

# File Upload Configuration
MAX_FILE_SIZE = 5242880  # 5MB
ALLOWED_EXTENSIONS = {"txt", "json", "py", "js", "ts", "jsx", "tsx", "css", "html"}

# Code Detection Settings
CODE_BLOCK_LANGUAGES = ["python", "javascript", "typescript", "java", "c", "cpp", "json", "xml", "html", "css"]
