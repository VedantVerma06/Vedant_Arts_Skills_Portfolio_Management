# 🔧 Solution: JWT_SECRET Error Fix

## Problem
You're getting this error when trying to login:
```
Error: secretOrPrivateKey must have a value
```

## Root Cause
The backend is trying to sign JWT tokens but the `JWT_SECRET` environment variable is not set in the `.env` file.

## Solution Steps

### Step 1: Create .env File in Backend Directory

1. Navigate to the `backend` folder
2. Create a new file named `.env` (no extension, just `.env`)

### Step 2: Add Minimum Required Variables

Copy this into your `.env` file:

```env
# JWT Secret (REQUIRED - Generate a random string)
JWT_SECRET=your_random_secret_key_minimum_32_characters_long_1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ

# MongoDB Connection (REQUIRED)
MONGO_URI=your_mongodb_connection_string_here

# Frontend URL (REQUIRED)
FRONTEND_URL=http://localhost:8000

# Admin Credentials (REQUIRED)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password_here

# Google OAuth (REQUIRED for Google Login)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Cloudinary (REQUIRED for Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Step 3: Generate JWT_SECRET

**Option A: Use the setup script (Easiest)**
```bash
cd backend
node setup-env.js
```
This will automatically generate a secure JWT_SECRET for you.

**Option B: Generate manually**
- Use this online tool: https://randomkeygen.com/
- Or use this PowerShell command (Windows):
  ```powershell
  [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
  ```
- Or use any random string (minimum 32 characters, longer is better)

### Step 4: Fill in Your Credentials

Replace the placeholder values with your actual credentials:

1. **JWT_SECRET**: Use the generated secret from Step 3
2. **MONGO_URI**: Your MongoDB Atlas connection string
3. **ADMIN_EMAIL**: Your admin email address
4. **ADMIN_PASSWORD**: Your admin password
5. **GOOGLE_CLIENT_ID**: From Google Cloud Console
6. **GOOGLE_CLIENT_SECRET**: From Google Cloud Console
7. **CLOUDINARY_***: From Cloudinary Dashboard

### Step 5: Restart Backend Server

1. Stop your backend server (Ctrl+C if running)
2. Start it again:
   ```bash
   npm start
   ```
   or
   ```bash
   node server.js
   ```

### Step 6: Test

1. Try Google OAuth login - should work now
2. Try Admin login - should work now

## Quick Test .env File

If you want to test quickly with minimal setup:

```env
JWT_SECRET=TestSecretKey123456789012345678901234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vedant_art?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:8000
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=admin123
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

⚠️ **Note**: Replace all `your_*` values with actual credentials before testing.

## Verification

After setting up `.env` and restarting the server, you should see:
- ✅ Server starts without errors
- ✅ No "JWT_SECRET" error in console
- ✅ Google OAuth login works
- ✅ Admin login works

## Common Issues

### Issue: Still getting JWT_SECRET error
**Solution:**
- Make sure `.env` file is in the `backend/` directory (same folder as `server.js`)
- Make sure there are no spaces around the `=` sign: `JWT_SECRET=value` (not `JWT_SECRET = value`)
- Make sure the value is not empty
- Restart the server after creating/editing `.env`

### Issue: Admin login not working
**Solution:**
- Check that `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` match what you're entering
- Make sure there are no extra spaces
- Check server logs for errors

### Issue: Google OAuth not working
**Solution:**
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Make sure redirect URI in Google Cloud Console is: `http://localhost:5000/api/auth/google/callback`
- Make sure Google+ API is enabled in Google Cloud Console

### Issue: MongoDB connection error
**Solution:**
- Check that `MONGO_URI` is correct
- Make sure MongoDB Atlas allows connections from your IP
- Check username and password are correct

## Need More Help?

1. Check `ENV_SETUP.md` for detailed setup instructions
2. Check `QUICK_FIX.md` for quick troubleshooting
3. Check server console logs for specific error messages

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to git (it should be in .gitignore)
- Use strong, random values for JWT_SECRET in production
- Use strong passwords for ADMIN_PASSWORD
- Keep all credentials secret and secure

