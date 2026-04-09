"""Main FastAPI application"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.config import (
    CORS_ORIGINS,
    CORS_METHODS,
    CORS_HEADERS,
    CORS_ALLOW_CREDENTIALS,
    APP_NAME,
    APP_VERSION,
)
from app.routes import auth, notes

# Create all database tables (skip if connection fails)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create database tables: {e}")

# Initialize FastAPI app
app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="Production-ready Notes Management System with modern UI/UX"
)

# Add CORS middleware with explicit configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=CORS_ALLOW_CREDENTIALS,
    allow_methods=CORS_METHODS,
    allow_headers=CORS_HEADERS,
)

# Include routers
app.include_router(auth.router)
app.include_router(notes.router)


@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "Notes Management System API",
        "version": APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
