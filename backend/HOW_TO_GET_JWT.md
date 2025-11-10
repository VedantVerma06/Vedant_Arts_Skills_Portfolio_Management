# How to Get JWT Token - Quick Answer

## Short Answer: You DON'T Get JWT Tokens Manually!

**JWT tokens are automatically generated when users log in.** You don't need to create or get them manually.

## What You Actually Need: JWT_SECRET

You need to set **JWT_SECRET** in your `.env` file. This is a secret key (not a token) that the backend uses to create tokens.

## Quick Setup

### Step 1: Generate JWT_SECRET

**Option A: Use Setup Script (Recommended)**
```bash
cd backend
node setup-env.js
```

**Option B: Generate Manually**
Add this to your `.env` file:
```env
JWT_SECRET=your_random_secret_key_minimum_32_characters_long_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
```

### Step 2: Restart Server
```bash
npm start
```

### Step 3: Login (Token is Generated Automatically)
- **Google Login:** Click "Login with Google" → Token generated automatically
- **Admin Login:** Enter credentials → Token generated automatically

## How JWT Tokens Are Generated

### When User Logs In with Google:
1. User clicks "Login with Google"
2. Backend authenticates with Google
3. Backend creates JWT token using JWT_SECRET
4. Token is sent to frontend automatically
5. Frontend stores token in localStorage

### When Admin Logs In:
1. Admin enters email and password
2. Backend verifies credentials
3. Backend creates JWT token using JWT_SECRET
4. Token is returned in response
5. Frontend stores token in localStorage

## How to See JWT Tokens (After Login)

### In Browser Console:
```javascript
// 1. Open browser console (F12)
// 2. After logging in, run:

// See the token
console.log(localStorage.getItem('jwt_token'));

// Decode and see token contents
const token = localStorage.getItem('jwt_token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('User ID:', payload.id);
  console.log('Role:', payload.role);
  console.log('Expires:', new Date(payload.exp * 1000));
}
```

### Token Example:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWJjZGUxMjM0NTY3ODkwIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MDk4NzY1NDMsImV4cCI6MTcxMDQ4MTM0M30.abc123def456ghi789...
```

## Complete Flow

```
1. Setup JWT_SECRET in .env
   ↓
2. User/Admin logs in
   ↓
3. Backend generates JWT token (using JWT_SECRET)
   ↓
4. Token sent to frontend
   ↓
5. Frontend stores token in localStorage
   ↓
6. Token sent with every API request
   ↓
7. Backend verifies token (using JWT_SECRET)
```

## Common Mistakes

### ❌ Wrong: Trying to create JWT token manually
**Correct:** Tokens are created automatically on login

### ❌ Wrong: Looking for JWT token to put in .env
**Correct:** You need JWT_SECRET (a secret key), not a token

### ❌ Wrong: Asking where to get JWT token
**Correct:** Login first, then token is generated automatically

## What Goes in .env File

```env
# This is JWT_SECRET (a secret key), NOT a token
JWT_SECRET=your_random_secret_key_here_minimum_32_characters

# Other required variables...
MONGO_URI=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
```

## Testing Token Generation

### Test Admin Login (Get Token):
```bash
# 1. Make sure backend is running
cd backend
npm start

# 2. Test admin login (replace with your credentials)
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'

# 3. Response will include token:
# {
#   "success": true,
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "admin": {...}
# }
```

### Test Google Login:
1. Open frontend: `http://localhost:8000/login.html`
2. Click "Login with Google"
3. Complete Google authentication
4. Check browser console for token in localStorage

## Summary

| What | Where | How |
|------|-------|-----|
| **JWT_SECRET** | `.env` file | Generate with `node setup-env.js` |
| **JWT Token** | `localStorage` (browser) | Automatically generated on login |
| **Token Creation** | Backend | Automatic when user/admin logs in |
| **Token Storage** | Frontend | Automatic in localStorage |

## Quick Checklist

- [ ] JWT_SECRET is set in `.env` file
- [ ] Backend server is running
- [ ] User/Admin logs in
- [ ] Token is automatically generated
- [ ] Token is stored in localStorage
- [ ] Token is sent with API requests

## Still Confused?

**Remember:**
1. **JWT_SECRET** = Secret key in .env (you create this once)
2. **JWT Token** = Automatic credential (backend creates this on login)
3. **You don't manually get tokens** - they're created automatically when users login

## Need Help?

- See `JWT_EXPLAINED.md` for detailed explanation
- See `SOLUTION.md` for complete setup
- Check browser console after login to see token

