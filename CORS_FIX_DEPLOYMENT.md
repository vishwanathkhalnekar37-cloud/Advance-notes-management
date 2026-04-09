# CORS Configuration and Deployment Guide

## Changes Made

### 1. **Backend (FastAPI) - CORS Configuration**
   - Updated `app/config.py`:
     - Added explicit `CORS_METHODS`: GET, POST, PUT, DELETE, OPTIONS, PATCH
     - Added explicit `CORS_HEADERS`: Content-Type, Authorization, Accept, etc.
     - Added `CORS_ALLOW_CREDENTIALS = True` for JWT authentication support
     - Maintained existing `CORS_ORIGINS` list with both development and production URLs

   - Updated `app/main.py`:
     - Now uses explicit CORS configuration instead of wildcards (`["*"]`)
     - Imports the CORS settings from config
     - More secure for production

### 2. **Frontend (React) - Environment Configuration**
   - `.env.development`: Points to `http://localhost:8000/api` for local development
   - `.env.production`: Points to `https://advance-notes-management.onrender.com/api` (HTTPS)
   
   - Updated `src/utils/api.js`:
     - Added `credentials: 'include'` to all fetch requests for CORS with credentials
     - Added proper error handling with `response.ok` checks
     - Consolidated common headers in `DEFAULT_HEADERS`
     - Optional token header handling (only added when token exists)

### 3. **Backend Environment (.env.example)**
   - Updated to include `FRONTEND_URL` variable for production deployment
   - Clearly documented all configuration options

## Deployment Steps

### Step 1: Render Deployment (Backend)

1. **Create `.env` file on Render**:
   ```
   DATABASE_URL=your_mysql_database_url_on_render
   SECRET_KEY=your_super_secret_key_change_this
   DEBUG=False
   FRONTEND_URL=https://advance-notes-management.vercel.app
   ```

2. **Deploy to Render**:
   - Push the updated backend code with CORS changes
   - Render will automatically redeploy from your git repository
   - Monitor the logs to ensure it deploys without errors
   - Test the health endpoint: `https://advance-notes-management.onrender.com/health`

### Step 2: Vercel Deployment (Frontend)

1. **Ensure environment variables are set in Vercel dashboard**:
   - `VITE_API_BASE_URL=https://advance-notes-management.onrender.com/api`
   - `VITE_APP_NAME=Notes Management System`

2. **Deploy to Vercel**:
   - Push the updated frontend code with API client changes
   - Vercel will auto-build from your git repository
   - The build will use the production environment variables

### Step 3: Testing

1. **Local Testing** (before deployment):
   ```bash
   # Terminal 1: Backend
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```
   
   Test at: `http://localhost:5173` (or `http://localhost:3000`)

2. **Production Testing** (after deployment):
   - Open https://advance-notes-management.vercel.app
   - Try signing up, creating notes, etc.
   - Check browser console for any CORS errors
   - Check browser Network tab to verify API requests are successful (HTTP 200)

3. **Verify CORS Headers**:
   - Open DevTools → Network tab
   - Look at any API request and check Response Headers:
     - Should see: `Access-Control-Allow-Origin: https://advance-notes-management.vercel.app`
     - Should see: `Access-Control-Allow-Credentials: true`

## What's Fixed

✅ **CORS Policy Error**: Now properly configured with specific origins instead of wildcards
✅ **Production Security**: Explicit methods/headers instead of `["*"]`
✅ **Authentication**: `allow_credentials=True` for JWT tokens
✅ **HTTPS**: Backend points to HTTPS URLs, frontend references HTTPS backend
✅ **API Client**: Includes proper error handling and credentials support
✅ **Environment Management**: Separate configs for development and production

## Key URLs

- **Backend (Production)**: https://advance-notes-management.onrender.com
- **Backend Health**: https://advance-notes-management.onrender.com/health
- **Backend Docs**: https://advance-notes-management.onrender.com/docs
- **Frontend (Production)**: https://advance-notes-management.vercel.app
- **Local Backend**: http://localhost:8000
- **Local Frontend**: http://localhost:5173

## Troubleshooting

### Still Getting CORS Errors?

1. **Check CORS_ORIGINS list**: Verify your Vercel URL is in the list in `config.py`
2. **Verify HTTPS**: Both frontend and backend must use HTTPS in production
3. **Check backend logs**: `Error: Could not add middleware...` would indicate CORS misconfiguration
4. **Browser cache**: Clear cache or do a hard refresh (Ctrl+Shift+Delete)
5. **Backend redeploy**: Make sure changes were deployed to Render after git push

### API Requests Failing?

1. **Check API_BASE_URL**: Verify frontend is using correct backend URL
2. **Network tab**: Check if request is reaching the backend
3. **Authentication**: Ensure token is being sent in Authorization header
4. **Backend status**: Check if backend is running and healthy

## Next Steps

After deployment:
1. Monitor error logs on both Vercel and Render
2. Test all CRUD operations (create, read, update, delete notes)
3. Test authentication flow (signup, login, refresh token)
4. Verify data persists across sessions
