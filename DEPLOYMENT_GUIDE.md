# 🚀 Deployment Guide

This guide provides step-by-step instructions for deploying the Notes Management System safely to production.

## Pre-Deployment Checklist

### Backend Setup
- [ ] Environment variables configured in `.env`
- [ ] Database URL points to production database
- [ ] `SECRET_KEY` is a strong random string (use: `openssl rand -hex 32`)
- [ ] `DEBUG=False` in production
- [ ] CORS_ORIGINS updated with your domain(s)
- [ ] All dependencies installed: `pip install -r requirements.txt`

### Frontend Setup
- [ ] `.env.production` file created with correct API URL
- [ ] `VITE_API_BASE_URL` points to your production API (e.g., `https://api.yourdomain.com/api`)
- [ ] All dependencies installed: `npm install`
- [ ] Build tested locally: `npm run build`
- [ ] `public/` folder with images is copied to deployment

### Feature-Specific Setup
- [ ] **Lock Feature:** Database has `is_locked` and `lock_pin` columns
- [ ] **Images & Styling:** All image files from `public/images/` are served correctly
- [ ] **API Endpoints:** All secret routes (`/verify-pin`, `/lock`, etc.) are accessible
- [ ] **CORS:** Configured to allow requests from frontend domain

## Environment Variables

### Backend (.env)
```env
# Production Database
DATABASE_URL=mysql+pymysql://user:password@prod-db-host:3306/notes_db

# Security (Generate with: openssl rand -hex 32)
SECRET_KEY=<your-random-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Production Settings
DEBUG=False
APP_NAME=Notes Management System

# CORS - Update with your domain
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend (.env.production)
```env
# Production API URL
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Notes Management System
```

## Ensuring All Features Work in Production

### 🔒 Lock Feature
The lock feature allows users to password-protect notes with a PIN. To ensure it works:

1. **Database Columns** (automatically created with models):
   - `is_locked` (Boolean) - Tracks if note is locked
   - `lock_pin` (String) - Stores hashed PIN

2. **API Endpoints** (all configured):
   - `POST /api/notes/{note_id}/lock` - Lock a note with PIN
   - `POST /api/notes/{note_id}/unlock` - Unlock a note
   - `POST /api/notes/{note_id}/verify-pin` - Verify PIN without changing lock status

3. **Frontend** (all configured):
   - Locked notes show "🔒 Locked Note" in cards
   - Password modal appears when opening locked notes
   - Lock button in note editor

4. **Testing in Production**:
   ```bash
   # Test lock endpoint
   curl -X POST https://api.yourdomain.com/api/notes/1/lock \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"lock_pin": "1234"}'
   
   # Test verify PIN
   curl -X POST https://api.yourdomain.com/api/notes/1/verify-pin \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"lock_pin": "1234"}'
   ```

### 🖼️ Images & Background Images
The app uses beautiful background images. To ensure they display correctly:

1. **Image Files** (in `frontend/public/images/`):
   - `wild-deer-nature.jpg` - Main app background
   - `digital-art-style-river-nature-landscape.jpg` - Auth pages background
   - `fantasy-scene-anime-style.jpg` - Landing page background
   - Other supporting images

2. **CSS References**:
   ```css
   background-image: url('/images/wild-deer-nature.jpg');
   background-image: url('/images/digital-art-style-river-nature-landscape.jpg');
   ```

3. **Deployment Requirements**:
   - [ ] `public/images/` folder copied to server
   - [ ] Nginx/Web server configured to serve `/images/` from public folder
   - [ ] Or: Images included in `dist/` after build
   - [ ] MIME types correctly set for jpg/jpeg/png

4. **Vite Configuration** (already configured):
   ```javascript
   publicDir: 'public'  // Files here copied to dist/
   assetsDir: 'assets'  // JS/CSS assets go here
   ```

5. **Testing Images in Production**:
   ```bash
   # Verify images are accessible
   curl -I https://yourdomain.com/images/wild-deer-nature.jpg
   # Expected: HTTP 200 OK
   ```

### 📝 Complete Feature List for Production Testing

**Authentication:**
- [ ] User registration works
- [ ] User login works
- [ ] JWT tokens are issued and valid
- [ ] Logout clears session

**Notes CRUD:**
- [ ] Create new note
- [ ] Read note details
- [ ] Update note content/title
- [ ] Delete note with confirmation
- [ ] List all notes with pagination

**Note Features:**
- [ ] Lock note with PIN
- [ ] Locked notes show as "🔒 Locked Note"
- [ ] Unlock note after entering correct PIN
- [ ] Wrong PIN shows error
- [ ] Share note generates link
- [ ] Search notes by title/content
- [ ] Filter locked vs unlocked notes

**UI/Styling:**
- [ ] Background images display correctly
- [ ] Glassmorphism effects visible
- [ ] Text shadows readable over background
- [ ] Responsive design on mobile/tablet
- [ ] Navbar displays correctly
- [ ] Icons render properly
- [ ] Colors consistent with design

**Performance:**
- [ ] Page loads in < 3 seconds
- [ ] Images load quickly (CDN recommended)
- [ ] API responses < 1 second
- [ ] No console errors
- [ ] No memory leaks

### Nginx Configuration for Static Files

Add this to your Nginx server block to serve images correctly:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # Serve frontend
    root /var/www/notes-app/dist;
    
    # Cache static images aggressively
    location /images/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Cache other assets
    location /assets/ {
        expires 7d;
        add_header Cache-Control "public";
    }
    
    # API proxy
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # SPA routing - send all non-file requests to index.html
    location / {
        try_files $uri /index.html;
    }
}
```

### Docker Configuration (if using Docker)

If deploying with Docker, ensure Dockerfile includes:

```dockerfile
# Build stage
FROM node:18 AS builder
WORKDIR /app/frontend
COPY frontend . 
RUN npm install && npm run build

# Server stage
FROM nginx:alpine
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY --from=builder /app/frontend/public/images /usr/share/nginx/html/images
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Deployment Steps

### 1. Backend Deployment (FastAPI)

#### Option A: Using Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set SECRET_KEY="<random-key>"
heroku config:set DEBUG=False
heroku config:set DATABASE_URL="<production-db-url>"
heroku config:set CORS_ORIGINS="https://yourdomain.com"

# Deploy
git push heroku main
```

#### Option B: Using PythonAnywhere
1. Create account on pythonywhere.com
2. Upload code via Git
3. Configure virtual environment
4. Set environment variables
5. Configure WSGI file with gunicorn

#### Option C: Using DigitalOcean/AWS/Azure
```bash
# SSH into server
ssh user@server-ip

# Install Python 3.9+
sudo apt-get update
sudo apt-get install python3.9 python3.9-venv python3-pip

# Clone repository
git clone <repo-url>
cd notes-app/backend

# Create virtual environment
python3.9 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with production values

# Run with Gunicorn (production ASGI server)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
```

#### Using Systemd Service (Ubuntu/Linux)
Create `/etc/systemd/system/notes-api.service`:
```ini
[Unit]
Description=Notes API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/notes-app/backend
Environment="PATH=/home/ubuntu/notes-app/backend/venv/bin"
ExecStart=/home/ubuntu/notes-app/backend/venv/bin/gunicorn -w 4 -b 127.0.0.1:8000 app.main:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Then enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable notes-api
sudo systemctl start notes-api
```

### 2. Frontend Deployment (React + Vite)

#### Option A: Using Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel
# Follow prompts to set environment variables
```

#### Option B: Using Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: Self-hosted (Nginx)
```bash
# Build production bundle
npm run build

# Copy dist folder to your server
scp -r dist/ user@server:/var/www/notes-app/

# Configure Nginx
sudo nano /etc/nginx/sites-available/notes-app
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    root /var/www/notes-app;
    index index.html;
    
    # Frontend routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy (optional if on same server)
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/notes-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. SSL/TLS Certificate (for HTTPS)

Using Let's Encrypt (recommended):
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

### 4. Database Setup

#### For MySQL in Production:
```bash
# Create database
mysql -u root -p

# In MySQL shell:
CREATE DATABASE notes_db_prod;
CREATE USER 'notes_user'@'%' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON notes_db_prod.* TO 'notes_user'@'%';
FLUSH PRIVILEGES;
```

Run migrations:
```bash
cd backend
python -m alembic upgrade head
```

## Monitoring & Maintenance

### Health Check
```bash
# Test API
curl https://api.yourdomain.com/docs

# Test frontend
curl https://yourdomain.com
```

### Logs
```bash
# Systemd logs
journalctl -u notes-api -f

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Performance
- Use a CDN for static files (CloudFlare, AWS CloudFront)
- Enable gzip compression
- Implement caching headers
- Monitor response times

## Security Checklist

- [ ] HTTPS/SSL enabled
- [ ] CORS properly configured
- [ ] SECRET_KEY is random and strong
- [ ] DEBUG mode is disabled
- [ ] Database password is strong
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Regular backups of database
- [ ] Firewall rules configured
- [ ] DDoS protection enabled (if using CDN)

## Troubleshooting

### API Connection Issues
1. Verify backend is running: `curl https://api.yourdomain.com/api/health`
2. Check CORS settings in backend
3. Verify frontend .env.production has correct URL
4. Check network logs in browser DevTools

### Database Issues
1. Verify connection string
2. Check firewall allows database connections
3. Verify user permissions
4. Check database logs

### HTTPS/SSL Issues
1. Verify certificate is valid: `openssl s_client -connect yourdomain.com:443`
2. Check certificate expiration
3. Verify DNS records point to server

## Rollback Plan

Keep previous version backed up:
```bash
# Tag current production version
git tag -a v1.0.0-prod -m "Production release"
git push origin v1.0.0-prod

# Create deployment branch
git checkout -b deploy/v1.0.0
```

If deployment fails:
```bash
# Revert to previous tag
git checkout v1.0.0-prod

# Redeploy
# (follow your deployment process)
```

## Performance Tuning

### Backend
- Use connection pooling (SQLAlchemy)
- Enable query caching
- Optimize database indexes
- Use async operations where possible

### Frontend
- Enable gzip compression
- Minify CSS/JS (Vite does this)
- Use lazy loading for routes
- Optimize images

## Support & Updates

For issues during deployment, check:
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vite Documentation](https://vitejs.dev/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
