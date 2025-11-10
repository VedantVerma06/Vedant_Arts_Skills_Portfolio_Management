# 🚨 QUICK FIX for JWT_SECRET Error

## The Problem
You're getting this error:
```
Error: secretOrPrivateKey must have a value
```

This means the `JWT_SECRET` environment variable is missing from your `.env` file.

## Quick Solution (2 minutes)

### Option 1: Use the Setup Script (Recommended)
```bash
cd backend
node setup-env.js
```
This will create a `.env` file with a randomly generated JWT_SECRET.

Then edit the `.env` file and add your other credentials (MongoDB, Google OAuth, etc.)

### Option 2: Create .env File Manually

1. **Create a file named `.env` in the `backend/` folder**

2. **Add this minimum content:**
```env
JWT_SECRET=your_random_secret_key_here_minimum_32_characters_long
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:8000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3. **Generate a JWT_SECRET:**
   - **Windows PowerShell:** `[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString()))`
   - **Or use any random string** (at least 32 characters)
   - **Or use this online generator:** https://randomkeygen.com/

4. **Replace `your_random_secret_key_here_minimum_32_characters_long` with your generated secret**

5. **Fill in your other credentials:**
   - **MONGO_URI:** From MongoDB Atlas
   - **GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET:** From Google Cloud Console
   - **ADMIN_EMAIL & ADMIN_PASSWORD:** Your admin credentials
   - **CLOUDINARY_*:** From Cloudinary Dashboard

6. **Restart your server:**
```bash
# Stop server (Ctrl+C)
# Then start again:
npm start
```

## Minimal Working Example

If you just want to test and fix the error quickly, use this minimal `.env`:

```env
JWT_SECRET=MySuperSecretKey12345678901234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/vedant_art?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:8000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Verify It's Working

After creating the `.env` file and restarting the server:

1. ✅ Server should start without JWT_SECRET error
2. ✅ Google OAuth login should work
3. ✅ Admin login should work

## Still Having Issues?

1. **Check .env file location:** Must be in `backend/` folder (same folder as `server.js`)
2. **Check for typos:** Make sure `JWT_SECRET` is spelled correctly
3. **Check for spaces:** No spaces around the `=` sign
4. **Restart server:** Always restart after changing .env file
5. **Check file encoding:** Make sure .env is saved as plain text (UTF-8)

## Need Help?

See `ENV_SETUP.md` for detailed instructions on getting all the credentials.

