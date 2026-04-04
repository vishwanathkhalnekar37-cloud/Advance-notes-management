# ✅ Pre-Deployment Verification Checklist

Use this checklist before deploying to ensure everything is safe and ready.

## Code Quality

### Frontend
- [x] No hardcoded localhost URLs in code ✓
- [x] Environment variables used for API URL ✓
- [x] `.env` file created for development ✓
- [x] `.env.production` file created for production ✓
- [x] All imports are correct
- [x] No console.error or console.warn left in production code
- [ ] TypeScript errors fixed (if using TypeScript)
- [ ] ESLint warnings resolved

### Backend  
- [x] No hardcoded localhost URLs in code ✓
- [x] Environment variables used for database URL ✓
- [x] `.env` file properly configured ✓
- [x] All dependencies in requirements.txt ✓
- [ ] No debug print statements in code
- [ ] Proper error handling on all endpoints
- [ ] Input validation on all routes

## Security Checklist

### Secrets & Credentials
- [ ] `SECRET_KEY` is unique and strong (use: `openssl rand -hex 32`)
- [ ] Database password is changed from default
- [ ] Environment files are in `.gitignore`
- [ ] No secrets committed to Git
- [ ] JWT tokens have appropriate expiration

### Configuration
- [ ] `DEBUG=False` in production backend
- [ ] CORS_ORIGINS properly configured with your domain
- [ ] Only necessary endpoints are exposed
- [ ] Rate limiting is enabled (if implemented)
- [ ] Input validation on all user inputs

### Database
- [ ] Database user has minimal required permissions
- [ ] Database backups configured
- [ ] Connection string is production (not localhost)
- [ ] SSL/TLS enabled for database connection (if remote)

## Environment Files

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Notes Management System
```

### Backend (.env)
```env
DATABASE_URL=mysql+pymysql://prod_user:password@prod_db:3306/notes_db
SECRET_KEY=<generated-random-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
APP_NAME=Notes Management System
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Build & Testing

### Frontend Build
- [ ] Run `npm install` to verify all dependencies
- [ ] Run `npm run build` successfully
- [ ] Check `dist/` folder is created
- [ ] Test production build locally (if possible)
- [ ] Verify no build warnings or errors

### Backend Testing
- [ ] Run unit tests: `pytest tests/`
- [ ] Test all API endpoints with curl or Postman
- [ ] Verify database migrations work
- [ ] Test auth endpoints (login, register)
- [ ] Test note CRUD operations
- [ ] Test lock/unlock functionality
- [ ] Test share functionality

## Deployment Readiness

### Infrastructure
- [ ] Server/hosting is set up
- [ ] Domain name is configured
- [ ] SSL certificate is ready (or Let's Encrypt)
- [ ] Database is set up and accessible
- [ ] Firewall rules are configured
- [ ] Ports are open (80, 443)

### Deployment Process
- [ ] Deployment script is prepared
- [ ] Rollback plan is documented
- [ ] Backup strategy is in place
- [ ] Monitoring/logging is configured
- [ ] Health check endpoints are working

## Final Checks (Day of Deployment)

### 24 Hours Before
- [ ] Database backups are verified
- [ ] Rollback procedure is tested
- [ ] All team members are notified
- [ ] Maintenance window is planned

### Right Before Deployment
- [ ] Final code review completed
- [ ] All tests passing locally
- [ ] Environment files double-checked
- [ ] Database credentials verified
- [ ] API URL verified in .env.production

### After Deployment

#### Frontend & UI
- [ ] Frontend loads without errors
- [ ] All background images display correctly
- [ ] Glassmorphic effects are visible
- [ ] Text is readable over background images
- [ ] Navbar displays and functions correctly
- [ ] Login page loads with background image
- [ ] All icons render properly
- [ ] Colors match design specifications
- [ ] No console errors in browser
- [ ] Responsive design works on mobile

#### Authentication
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can logout successfully
- [ ] JWT token is issued and valid
- [ ] Token expiration works correctly

#### Notes Management
- [ ] Can create a note
- [ ] Can view note details
- [ ] Can edit note content
- [ ] Can update note title
- [ ] Can delete a note
- [ ] Can search notes by title/content
- [ ] Note list displays all notes
- [ ] Pagination works correctly

#### 🔒 Lock Feature (Critical)
- [ ] Can lock a note with PIN
- [ ] Locked notes show "🔒 Locked Note" in card
- [ ] Locked notes hide content preview
- [ ] Password modal appears when opening locked note
- [ ] Can unlock with correct PIN
- [ ] Wrong PIN shows error message
- [ ] Lock persists after closing and reopening
- [ ] Unlocked notes display full content
- [ ] Lock badge displays correctly

#### 🔗 Share Feature
- [ ] Can share a note
- [ ] Share link is generated
- [ ] Share link can be copied
- [ ] Shared notes display correctly

#### API & Backend
- [ ] API endpoints respond with correct status codes
- [ ] Lock endpoint (`POST /api/notes/{id}/lock`) works
- [ ] Verify PIN endpoint (`POST /api/notes/{id}/verify-pin`) works
- [ ] All authentication endpoints working
- [ ] Error responses are meaningful
- [ ] No errors in server logs
- [ ] Database queries are fast

#### Static Assets
- [ ] Images load correctly
- [ ] CSS is properly cached
- [ ] JS assets are minified
- [ ] No 404 errors for images
- [ ] `background-image: url('/images/...')` works

#### SSL & Security
- [ ] SSL certificate is valid
- [ ] HTTPS is enforced
- [ ] Mixed content warning (if any)
- [ ] CORS headers are correct
- [ ] Session cookies are secure

### Post-Deployment Monitoring
- [ ] Check error logs for any issues
- [ ] Monitor server performance
- [ ] Verify database connections are stable
- [ ] Test from different devices/browsers
- [ ] Check mobile responsiveness
- [ ] Monitor for any security alerts

## Feature Verification Guide

### 🔒 Lock Feature Testing

**Test Case 1: Lock a Note**
1. Open any note in the editor
2. Click the 🔒 button
3. Enter a PIN (e.g., "1234")
4. Click "Lock Note"
5. Expected: Note is locked, lock button shows feedback

**Test Case 2: Locked Note Display**
1. Go back to notes list
2. Find the locked note
3. Expected: Shows "🔒 Locked Note" title, hides content, no action buttons

**Test Case 3: Unlock with Password**
1. Click on a locked note
2. Password modal appears
3. Enter correct PIN
4. Expected: Note content displays, modal closes

**Test Case 4: Wrong Password**
1. Click on a locked note
2. Enter wrong PIN
3. Click "Unlock"
4. Expected: Error message "Invalid password", modal stays open

**Test Case 5: Re-lock After Closing**
1. Unlock a note with password
2. Edit and save the note
3. Close the note editor
4. Click the same note again
5. Expected: Password modal appears again (persistence)

### 🖼️ Image & Styling Testing

**Test Case 1: Main Background Image**
1. Open the app on a desktop
2. Look at the main dashboard/app area
3. Expected: Beautiful background image visible (wild-deer-nature.jpg)

**Test Case 2: Auth Pages Background**
1. Logout or go to login page
2. Expected: Different background image visible (river landscape)
3. Check landing page
4. Expected: Fantasy anime-style background visible

**Test Case 3: Image Responsiveness**
1. Test on mobile device (or resize browser)
2. Open any page with background image
3. Expected: Image scales properly, no broken/missing image
4. Test on tablet
5. Expected: Image displays correctly at all sizes

**Test Case 4: Transparency & Glassmorphism**
1. Look at note cards on dashboard
2. Expected: Semi-transparent white background, blurred effect
3. Look at navbar
4. Expected: Transparent glassmorphic effect
5. Verify text is readable over background

**Test Case 5: CSS Performance**
1. Open browser DevTools (F12)
2. Go to Performance tab
3. Record page load
4. Expected: Images load quickly (< 2s), no layout shifts

### Complete Feature Checklist

**Before Consider for Production:**

```
AUTHENTICATION:
- [ ] Register: New users can create accounts
- [ ] Login: Users can login with email/password
- [ ] Token: JWT token issued and persisted
- [ ] Logout: Users can logout successfully

NOTES MANAGEMENT:
- [ ] Create: Can create new notes with title/content
- [ ] Read: Can view note details
- [ ] Update: Can edit title and content
- [ ] Delete: Can delete notes (with confirmation)
- [ ] List: Can see all notes in list view
- [ ] Search: Can search notes by title/content
- [ ] Pagination: Can paginate through many notes

LOCKING:
- [ ] Lock: Can lock notes with PIN
- [ ] Locked Display: Locked notes show as "🔒 Locked Note"
- [ ] Unlock: Can unlock with correct PIN
- [ ] Error: Wrong PIN shows error
- [ ] Persistence: Lock persists across sessions
- [ ] Hidden Content: Locked notes don't show preview

SHARING:
- [ ] Share: Can generate share link
- [ ] Copy: Can copy share link to clipboard
- [ ] Badge: Share badge shows on shared notes
- [ ] Link: Share link is accessible

STYLING:
- [ ] Images: All background images display
- [ ] Glassmorphism: Semi-transparent cards visible
- [ ] Text: Text readable over backgrounds
- [ ] Responsive: Works on mobile/tablet/desktop
- [ ] Icons: All emoji icons display correctly
- [ ] Colors: Color scheme consistent

PERFORMANCE:
- [ ] Load Time: App loads in < 3 seconds
- [ ] API Response: API responds in < 1 second
- [ ] Images: Images load in < 500ms
- [ ] No Errors: No console errors/warnings
- [ ] No Memory Leaks: Performance stable over time
- [ ] Mobile: Smooth scrolling and interactions

SECURITY:
- [ ] HTTPS: All traffic is encrypted
- [ ] CORS: API accepts requests from frontend domain
- [ ] Auth: Protected endpoints require valid token
- [ ] Secrets: SECRET_KEY changed from default
- [ ] Passwords: Passwords hashed in database
```

### Quick Feature Test Script

Run these commands to verify features work:

```bash
# 1. Test API is accessible
curl https://api.yourdomain.com/docs

# 2. Register a test user
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"Test123!","full_name":"Test User"}'

# 3. Login (save the token)
TOKEN=$(curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}' | jq -r '.access_token')

# 4. Create a note
curl -X POST https://api.yourdomain.com/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Note","content":"Test content","tags":[],"content_type":"text"}'

# 5. Lock a note (replace 1 with actual note ID)
curl -X POST https://api.yourdomain.com/api/notes/1/lock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"lock_pin":"1234"}'

# 6. Verify PIN (should return 200 OK)
curl -X POST https://api.yourdomain.com/api/notes/1/verify-pin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"lock_pin":"1234"}'

# 7. Check images are accessible
curl -I https://yourdomain.com/images/wild-deer-nature.jpg
# Expected: HTTP/1.1 200 OK
```

## Common Issues & Solutions

### Issue: "Cannot connect to API"
- Solution: Verify `VITE_API_BASE_URL` in .env.production
- Solution: Check CORS_ORIGINS in backend .env
- Solution: Verify API server is running and accessible

### Issue: "Database connection failed"
- Solution: Verify DATABASE_URL in backend .env
- Solution: Check database credentials
- Solution: Verify database server is running
- Solution: Check firewall allows connection

### Issue: "SSL certificate error"
- Solution: Verify certificate is valid and not expired
- Solution: Check domain matches certificate
- Solution: Verify certificate chain is complete

### Issue: "Static files not loading"
- Solution: Run `npm run build` again
- Solution: Check Nginx/server configuration
- Solution: Verify dist folder is properly served

## Deployment Commands

### Quick Deploy (if using systemd)
```bash
cd /path/to/notes-app/backend
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
systemctl restart notes-api

cd /path/to/notes-app/frontend
git pull origin main
npm install
npm run build
# Copy dist to web server
```

### Verify Deployment
```bash
# Check backend health
curl https://api.yourdomain.com/docs

# Check frontend loads
curl https://yourdomain.com | head -20

# Check database connection
# (From backend server)
python -c "from app.database import engine; print('DB OK' if engine.connect() else 'DB FAILED')"
```

## Sign-off

- [ ] All checks completed
- [ ] No outstanding issues
- [ ] Team lead approval obtained
- [ ] Ready for deployment

**Date:** ___________  
**Deployed By:** ___________  
**Approved By:** ___________
