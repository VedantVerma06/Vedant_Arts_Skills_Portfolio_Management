# Environment Variables Setup Guide

## Quick Fix for JWT_SECRET Error

The error you're seeing (`secretOrPrivateKey must have a value`) means the `JWT_SECRET` environment variable is not set.

## Step 1: Create .env File

1. Create a file named `.env` in the `backend/` directory
2. Copy the contents from `.env.example` to `.env`
3. Fill in all the required values (see below)

## Step 2: Required Environment Variables

### 1. JWT_SECRET (REQUIRED - Most Important!)
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_to_a_random_string
```
**Generate a random secret:**
- You can use: `openssl rand -base64 32` in terminal
- Or use any long random string (at least 32 characters)
- Example: `JWT_SECRET=MySuperSecretKey123!@#$%^&*()_+{}[]|;:,.<>?`

### 2. MONGO_URI (REQUIRED)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vedant_art_portfolio?retryWrites=true&w=majority
```
- Get this from your MongoDB Atlas dashboard
- Replace `username`, `password`, and `cluster` with your actual values

### 3. Google OAuth (REQUIRED for Google Login)
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```
**How to get Google OAuth credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set Application type to "Web application"
6. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
7. Copy Client ID and Client Secret to .env file

### 4. Admin Credentials (REQUIRED)
```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password_here
```
- Set your admin email and password here
- These are used for admin login on the frontend

### 5. Cloudinary (REQUIRED for Image Uploads)
```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
**How to get Cloudinary credentials:**
1. Go to [Cloudinary](https://cloudinary.com/) and sign up
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret to .env file

### 6. FRONTEND_URL (REQUIRED)
```env
FRONTEND_URL=http://localhost:8000
```
- This is the URL where your frontend is running
- Change if your frontend runs on a different port

### 7. PORT (Optional)
```env
PORT=5000
```
- Default is 5000
- Change if you want to use a different port

## Step 3: Example .env File

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:8000

# JWT Secret
JWT_SECRET=MySuperSecretJWTKey123!@#$%^&*()_+{}[]|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ

# MongoDB Connection
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/vedant_art_portfolio?retryWrites=true&w=majority

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz

# Admin Credentials
ADMIN_EMAIL=admin@vedantart.com
ADMIN_PASSWORD=SecurePassword123!

# Cloudinary
CLOUDINARY_CLOUD_NAME=mycloudname
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## Step 4: Restart Server

After creating/updating the `.env` file:
1. Stop your backend server (Ctrl+C)
2. Start it again: `npm start` or `node server.js`
3. The server should now start without the JWT_SECRET error

## Troubleshooting

### Error: "secretOrPrivateKey must have a value"
- **Solution:** Make sure JWT_SECRET is set in .env file
- **Check:** Verify .env file is in the `backend/` directory
- **Check:** Make sure there are no spaces around the `=` sign
- **Check:** Make sure the value is not empty

### Error: "MongoDB connection failed"
- **Solution:** Check your MONGO_URI is correct
- **Check:** Make sure your MongoDB Atlas cluster allows connections from your IP
- **Check:** Verify username and password are correct

### Error: "Google OAuth not working"
- **Solution:** Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- **Check:** Make sure redirect URI is set correctly in Google Cloud Console
- **Check:** Make sure Google+ API is enabled

### Error: "Admin login not working"
- **Solution:** Check ADMIN_EMAIL and ADMIN_PASSWORD match what you're entering
- **Check:** Make sure there are no extra spaces in .env file

### Error: "Image upload not working"
- **Solution:** Check Cloudinary credentials are correct
- **Check:** Make sure CLOUDINARY_CLOUD_NAME, API_KEY, and API_SECRET are all set

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to git (it's already in .gitignore)
- Use strong, random values for JWT_SECRET
- Use strong passwords for ADMIN_PASSWORD
- Keep your credentials secret and secure

## Quick Start (Minimal Setup)

If you just want to fix the JWT error quickly, at minimum you need:

```env
JWT_SECRET=changeme_this_is_not_secure_use_a_random_string_in_production
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:8000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

Then add the other credentials (Google OAuth, Cloudinary) as you configure them.

