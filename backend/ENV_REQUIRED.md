# 📋 Required Environment Variables for .env File

## Quick Setup

### Option 1: Use the Setup Script (Recommended)
```bash
cd backend
node setup-env.js
```
This will create a `.env` file with a randomly generated JWT_SECRET. Then you just need to fill in your other credentials.

### Option 2: Create .env File Manually

Create a file named `.env` in the `backend/` directory with the following content:

## Required Variables

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
FRONTEND_URL=http://localhost:8000

# ============================================
# JWT SECRET (REQUIRED - Most Important!)
# ============================================
JWT_SECRET=your_random_secret_key_minimum_32_characters_long

# ============================================
# MONGODB CONNECTION (REQUIRED)
# ============================================
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vedant_art_portfolio?retryWrites=true&w=majority

# ============================================
# ADMIN CREDENTIALS (REQUIRED)
# ============================================
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password

# ============================================
# GOOGLE OAUTH (REQUIRED for Google Login)
# ============================================
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# ============================================
# CLOUDINARY (REQUIRED for Image Uploads)
# ============================================
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Detailed Explanation

### 1. PORT (Optional)
```env
PORT=5000
```
- **What it is:** Port number for the backend server
- **Default:** 5000 (if not set)
- **Example:** `5000`, `3000`, `8000`

### 2. FRONTEND_URL (Required)
```env
FRONTEND_URL=http://localhost:8000
```
- **What it is:** URL where your frontend is running
- **Used for:** OAuth callbacks and CORS
- **Example:** `http://localhost:8000`, `http://localhost:3000`

### 3. JWT_SECRET (REQUIRED - Critical!)
```env
JWT_SECRET=your_random_secret_key_minimum_32_characters_long
```
- **What it is:** Secret key for signing JWT tokens
- **Why it's important:** Without this, authentication will fail
- **How to generate:**
  - Use the setup script: `node setup-env.js`
  - Use online generator: https://randomkeygen.com/
  - Use PowerShell: `[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))`
- **Example:** `MySuperSecretKey12345678901234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()`

### 4. MONGO_URI (REQUIRED)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vedant_art_portfolio?retryWrites=true&w=majority
```
- **What it is:** MongoDB connection string
- **Where to get it:**
  1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
  2. Create a cluster (free tier available)
  3. Click "Connect" → "Connect your application"
  4. Copy the connection string
  5. Replace `<username>` and `<password>` with your database credentials
- **Example:** `mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/vedant_art?retryWrites=true&w=majority`

### 5. ADMIN_EMAIL (REQUIRED)
```env
ADMIN_EMAIL=admin@example.com
```
- **What it is:** Email address for admin login
- **Used for:** Admin authentication
- **Example:** `admin@vedantart.com`, `vedant@example.com`

### 6. ADMIN_PASSWORD (REQUIRED)
```env
ADMIN_PASSWORD=your_secure_admin_password
```
- **What it is:** Password for admin login
- **Security:** Use a strong password
- **Example:** `SecurePassword123!`, `Admin@2024`

### 7. GOOGLE_CLIENT_ID (REQUIRED for Google Login)
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
```
- **What it is:** Google OAuth Client ID
- **Where to get it:**
  1. Go to Google Cloud Console (https://console.cloud.google.com/)
  2. Create a new project or select existing
  3. Enable Google+ API
  4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
  5. Application type: "Web application"
  6. Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
  7. Copy the Client ID
- **Example:** `123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`

### 8. GOOGLE_CLIENT_SECRET (REQUIRED for Google Login)
```env
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```
- **What it is:** Google OAuth Client Secret
- **Where to get it:** Same as Client ID (from Google Cloud Console)
- **Example:** `GOCSPX-abcdefghijklmnopqrstuvwxyz123456`

### 9. CLOUDINARY_CLOUD_NAME (REQUIRED for Image Uploads)
```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```
- **What it is:** Cloudinary cloud name
- **Where to get it:**
  1. Go to Cloudinary (https://cloudinary.com/)
  2. Sign up for free account
  3. Go to Dashboard
  4. Copy "Cloud name"
- **Example:** `mycloudname`, `vedant-art`

### 10. CLOUDINARY_API_KEY (REQUIRED for Image Uploads)
```env
CLOUDINARY_API_KEY=your_cloudinary_api_key
```
- **What it is:** Cloudinary API Key
- **Where to get it:** Cloudinary Dashboard
- **Example:** `123456789012345`

### 11. CLOUDINARY_API_SECRET (REQUIRED for Image Uploads)
```env
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
- **What it is:** Cloudinary API Secret
- **Where to get it:** Cloudinary Dashboard
- **Example:** `abcdefghijklmnopqrstuvwxyz123456`

## Complete Example .env File

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:8000

# JWT Secret (Auto-generated - Keep this secret!)
JWT_SECRET=dGhpc0lzQVN1cGVyU2VjcmV0SldUU2VjcmV0S2V5MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaIQ==

# MongoDB Connection
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/vedant_art_portfolio?retryWrites=true&w=majority

# Admin Credentials
ADMIN_EMAIL=admin@vedantart.com
ADMIN_PASSWORD=SecureAdminPassword123!

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456

# Cloudinary
CLOUDINARY_CLOUD_NAME=mycloudname
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## Minimum Required (To Fix JWT Error)

If you just want to fix the JWT error quickly, you need at minimum:

```env
JWT_SECRET=TestSecretKey123456789012345678901234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vedant_art?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:8000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

Then add Google OAuth and Cloudinary credentials later.

## Step-by-Step Setup

### Step 1: Create .env File
```bash
cd backend
# Create .env file (use setup script or create manually)
node setup-env.js
```

### Step 2: Edit .env File
Open `backend/.env` in a text editor and fill in:
1. ✅ JWT_SECRET (already generated by script)
2. ✅ MONGO_URI (from MongoDB Atlas)
3. ✅ ADMIN_EMAIL (your admin email)
4. ✅ ADMIN_PASSWORD (your admin password)
5. ✅ GOOGLE_CLIENT_ID (from Google Cloud Console)
6. ✅ GOOGLE_CLIENT_SECRET (from Google Cloud Console)
7. ✅ CLOUDINARY_CLOUD_NAME (from Cloudinary)
8. ✅ CLOUDINARY_API_KEY (from Cloudinary)
9. ✅ CLOUDINARY_API_SECRET (from Cloudinary)

### Step 3: Verify .env File
Make sure:
- File is named `.env` (not `.env.txt`)
- File is in `backend/` directory
- No spaces around `=` sign
- No quotes around values (unless value contains spaces)
- Each variable on its own line

### Step 4: Restart Server
```bash
# Stop server (Ctrl+C)
# Restart server
npm start
```

## Troubleshooting

### Error: "JWT_SECRET must have a value"
- **Solution:** Make sure JWT_SECRET is set in .env file
- **Check:** No spaces around `=` sign
- **Check:** Value is not empty

### Error: "MongoDB connection failed"
- **Solution:** Check MONGO_URI is correct
- **Check:** Replace `<username>` and `<password>` in connection string
- **Check:** MongoDB Atlas allows connections from your IP

### Error: "Google OAuth not working"
- **Solution:** Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- **Check:** Redirect URI is set correctly in Google Cloud Console
- **Check:** Google+ API is enabled

### Error: "Image upload not working"
- **Solution:** Check Cloudinary credentials are correct
- **Check:** All three Cloudinary variables are set

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to git (it should be in .gitignore)
- Use strong, random values for JWT_SECRET
- Use strong passwords for ADMIN_PASSWORD
- Keep all credentials secret and secure
- Don't share your .env file with anyone

## Quick Reference

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| PORT | No | Server port | `5000` |
| FRONTEND_URL | Yes | Frontend URL | `http://localhost:8000` |
| JWT_SECRET | **Yes** | JWT signing key | `random_string_64_chars` |
| MONGO_URI | **Yes** | Database connection | `mongodb+srv://...` |
| ADMIN_EMAIL | **Yes** | Admin email | `admin@example.com` |
| ADMIN_PASSWORD | **Yes** | Admin password | `SecurePassword123!` |
| GOOGLE_CLIENT_ID | **Yes** | Google OAuth | `123...apps.googleusercontent.com` |
| GOOGLE_CLIENT_SECRET | **Yes** | Google OAuth | `GOCSPX-...` |
| CLOUDINARY_CLOUD_NAME | **Yes** | Image hosting | `mycloudname` |
| CLOUDINARY_API_KEY | **Yes** | Image hosting | `123456789012345` |
| CLOUDINARY_API_SECRET | **Yes** | Image hosting | `abc...xyz` |

## Need Help?

See:
- `SOLUTION.md` - Complete setup solution
- `QUICK_FIX.md` - Quick troubleshooting
- `ENV_SETUP.md` - Detailed setup instructions
- `TROUBLESHOOTING.md` - General troubleshooting guide


