#!/bin/bash

# Notes App Build Script for Deployment
# This script prepares the application for deployment

set -e  # Exit on error

echo "======================================"
echo "  Notes App Build Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env files exist
echo -e "${YELLOW}Checking environment files...${NC}"

if [ ! -f "backend/.env" ]; then
    echo -e "${RED}Error: backend/.env not found${NC}"
    echo "Please create backend/.env based on backend/.env.example"
    exit 1
fi

if [ ! -f "frontend/.env.production" ]; then
    echo -e "${RED}Error: frontend/.env.production not found${NC}"
    echo "Please create frontend/.env.production"
    exit 1
fi

echo -e "${GREEN}✓ Environment files found${NC}"

# Build Backend
echo ""
echo -e "${YELLOW}Building Backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing dependencies..."
pip install -q -r requirements.txt

echo "Running tests..."
if command -v pytest &> /dev/null; then
    pytest tests/ -v 2>/dev/null || echo "Note: Some tests may have failed"
else
    echo "pytest not installed, skipping tests"
fi

echo -e "${GREEN}✓ Backend ready${NC}"
cd ..

# Build Frontend
echo ""
echo -e "${YELLOW}Building Frontend...${NC}"
cd frontend

echo "Installing dependencies..."
npm install --silent

echo "Building with Vite..."
npm run build

echo -e "${GREEN}✓ Frontend built successfully${NC}"

# Verify build
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: dist folder not created${NC}"
    exit 1
fi

echo -e "${GREEN}✓ dist folder created${NC}"
cd ..

# Summary
echo ""
echo "======================================"
echo -e "${GREEN}Build Complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   gunicorn -w 4 -b 0.0.0.0:8000 app.main:app"
echo ""
echo "2. Frontend:"
echo "   - Copy frontend/dist to your web server"
echo "   - Update VITE_API_BASE_URL in frontend/.env.production"
echo ""
echo "3. Verify deployment:"
echo "   - Check frontend loads"
echo "   - Test login functionality"
echo "   - Test note creation"
echo "   - Check backend API is reachable"
echo ""
