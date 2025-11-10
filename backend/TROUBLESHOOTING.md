# Troubleshooting Guide

## "Failed to fetch" Error

This error means the frontend cannot connect to the backend server. Here are common causes and solutions:

### 1. Backend Server Not Running

**Symptoms:**
- "Failed to fetch" error in browser console
- Network tab shows request failed or pending

**Solution:**
```bash
cd backend
npm start
```

Check that you see:
```
✅ MongoDB Connected
🚀 Server running securely on port 5000
```

### 2. Backend Server Crashed

**Symptoms:**
- Server was running but stopped
- Error messages in backend console

**Solution:**
1. Check backend console for error messages
2. Common issues:
   - Missing `.env` file
   - Missing `JWT_SECRET` in .env
   - MongoDB connection failed
   - Port 5000 already in use

### 3. CORS Issues

**Symptoms:**
- CORS error in browser console
- Requests blocked by browser

**Solution:**
- Backend CORS is already configured to allow all origins in development
- Make sure `FRONTEND_URL` is set in .env (or backend allows all origins)
- Check browser console for specific CORS errors

### 4. Frontend Opened via file:// Protocol

**Symptoms:**
- Frontend opened directly from file system
- CORS errors even though backend allows it

**Solution:**
- Use a local server to serve frontend:
  ```bash
  # Using Python
  python -m http.server 8000
  
  # Using Node.js http-server
  npx http-server -p 8000
  
  # Using PHP
  php -S localhost:8000
  ```
- Then open: `http://localhost:8000`

### 5. Wrong API URL

**Symptoms:**
- Frontend trying to connect to wrong URL
- 404 errors

**Solution:**
- Check `frontend/assets/js/config.js`
- Make sure `API_BASE_URL` is `http://localhost:5000/api`
- If backend runs on different port, update the URL

### 6. Firewall or Antivirus Blocking

**Symptoms:**
- Connection works on some machines but not others
- Timeout errors

**Solution:**
- Check Windows Firewall settings
- Check antivirus software
- Try disabling temporarily to test

### 7. Port Already in Use

**Symptoms:**
- Backend server won't start
- "Port 5000 already in use" error

**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### 8. MongoDB Connection Failed

**Symptoms:**
- Backend crashes on startup
- "MongoDB connection failed" error

**Solution:**
- Check `MONGO_URI` in .env file
- Make sure MongoDB Atlas allows connections from your IP
- Check MongoDB Atlas cluster is running
- Verify username and password are correct

### 9. Missing Environment Variables

**Symptoms:**
- Backend starts but API calls fail
- Specific errors about missing variables

**Solution:**
- Run the setup script: `node backend/setup-env.js`
- Or manually create `.env` file with all required variables
- See `ENV_SETUP.md` for complete list

## Testing Connection

### Use the Connection Test Page

1. Open `frontend/connection-test.html` in browser
2. Click "Run Tests"
3. Review the test results
4. Follow troubleshooting tips if errors found

### Manual Test

Open browser console and run:
```javascript
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

If this works, backend is running. If not, check backend server.

## Common Error Messages

### "Cannot connect to backend server"
- Backend server is not running
- Backend server crashed
- Wrong URL in frontend config

### "CORS policy: No 'Access-Control-Allow-Origin' header"
- CORS not configured correctly
- Frontend opened via file:// protocol
- Backend CORS configuration issue

### "Network request failed"
- Backend server not running
- Firewall blocking connection
- Wrong port number

### "Failed to fetch"
- General network error
- Backend server not running
- CORS issue
- Wrong URL

## Step-by-Step Debugging

1. **Check Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Should see: `🚀 Server running securely on port 5000`

2. **Test Backend Health**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return JSON with status "ok"

3. **Check Frontend Config**
   - Open `frontend/assets/js/config.js`
   - Verify `API_BASE_URL` is `http://localhost:5000/api`

4. **Check Browser Console**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

5. **Check .env File**
   - Verify `.env` exists in `backend/` directory
   - Verify all required variables are set
   - Verify no syntax errors (no spaces around `=`)

6. **Test Connection**
   - Open `frontend/connection-test.html`
   - Run tests
   - Follow suggested fixes

## Still Having Issues?

1. Check backend server logs for detailed error messages
2. Check browser console for specific error messages
3. Verify all environment variables are set correctly
4. Make sure both frontend and backend are running
5. Try restarting both servers
6. Check if port 5000 is available
7. Verify MongoDB connection is working
8. Check network connectivity

## Quick Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend is served via http:// (not file://)
- [ ] .env file exists in backend directory
- [ ] JWT_SECRET is set in .env
- [ ] MONGO_URI is set and correct
- [ ] MongoDB connection is working
- [ ] No firewall blocking port 5000
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows requests to backend

