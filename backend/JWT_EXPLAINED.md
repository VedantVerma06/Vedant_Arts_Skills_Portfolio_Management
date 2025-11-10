# JWT Token Explanation

## What is JWT_SECRET?

**JWT_SECRET** is NOT a token - it's a **secret key** used to **sign** (create) JWT tokens.

Think of it like this:
- **JWT_SECRET** = Your secret password/key (stored in .env file)
- **JWT Token** = The signed credential given to users when they login

## You DON'T Need to "Get" a JWT Token Manually

JWT tokens are **automatically generated** by the backend when users authenticate. You don't need to create or get them manually.

## How JWT Tokens Work

### 1. User Logs In
- User clicks "Login with Google" OR enters admin credentials
- Backend authenticates the user

### 2. Backend Generates JWT Token
- Backend uses **JWT_SECRET** (from .env) to sign a token
- Token contains user info (id, role, email)
- Token is sent to frontend

### 3. Frontend Stores Token
- Frontend stores token in `localStorage`
- Token is sent with every API request
- Backend verifies token using **JWT_SECRET**

## What You Actually Need: JWT_SECRET

You need to set **JWT_SECRET** in your `.env` file. This is a random secret string that the backend uses to create tokens.

### How to Generate JWT_SECRET

#### Option 1: Use Setup Script (Easiest)
```bash
cd backend
node setup-env.js
```
This automatically generates a secure JWT_SECRET and creates your .env file.

#### Option 2: Generate Manually

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

**Online Generator:**
- Go to: https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys" or any 64+ character random string

**Any Random String:**
- Minimum 32 characters
- Longer is better
- Mix of letters, numbers, and symbols

Example:
```
JWT_SECRET=MySuperSecretKey12345678901234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()
```

## Complete Flow Example

### 1. Setup JWT_SECRET in .env
```env
JWT_SECRET=your_random_secret_key_here_minimum_32_characters
```

### 2. User Logs In (Google OAuth)
```
User → Clicks "Login with Google" 
     → Backend authenticates with Google
     → Backend creates JWT token using JWT_SECRET
     → Token sent to frontend
     → Frontend stores token in localStorage
```

### 3. User Makes API Request
```
Frontend → Sends request with token in Authorization header
         → Backend verifies token using JWT_SECRET
         → Backend processes request
```

## How to See JWT Tokens (For Debugging)

### In Browser Console
After logging in, open browser console and run:
```javascript
// See stored token
console.log(localStorage.getItem('jwt_token'));

// Decode token (view contents)
const token = localStorage.getItem('jwt_token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload);
}
```

### Token Structure
JWT tokens have 3 parts:
```
header.payload.signature
```

Example decoded payload:
```json
{
  "id": "user_id_here",
  "role": "user",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Common Questions

### Q: Do I need to create JWT tokens manually?
**A:** No! Tokens are automatically generated when users log in.

### Q: What do I put in .env file?
**A:** JWT_SECRET (a random secret string), NOT a token.

### Q: Where are JWT tokens stored?
**A:** In browser localStorage (automatically by frontend).

### Q: How long do tokens last?
**A:** 
- User tokens: 7 days (configured in backend)
- Admin tokens: 6 hours (configured in backend)

### Q: What happens if JWT_SECRET is missing?
**A:** Backend can't create or verify tokens → Authentication fails → "secretOrPrivateKey must have a value" error

### Q: Can I change JWT_SECRET after tokens are issued?
**A:** Yes, but all existing tokens will become invalid. Users will need to login again.

## Summary

1. **JWT_SECRET** = Secret key in .env file (you create this)
2. **JWT Token** = Automatic credential generated on login (backend creates this)
3. **You don't need to manually get tokens** - they're created automatically
4. **You DO need to set JWT_SECRET in .env** - use `node setup-env.js` to generate it

## Quick Setup

```bash
# 1. Generate JWT_SECRET and create .env file
cd backend
node setup-env.js

# 2. The script will create .env with JWT_SECRET already set
# 3. Fill in other credentials (MongoDB, Google OAuth, etc.)
# 4. Restart server
npm start

# 5. When users login, tokens are automatically generated!
```

## Testing JWT Token Generation

### Test Admin Login
```bash
# Login as admin
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'

# Response will include a token:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "admin": {...}
# }
```

### Test Google OAuth
1. Click "Login with Google" on frontend
2. Complete Google authentication
3. Check browser localStorage for token
4. Token is automatically stored

## Troubleshooting

### Error: "secretOrPrivateKey must have a value"
- **Problem:** JWT_SECRET is not set in .env
- **Solution:** Add JWT_SECRET to .env file
- **Quick fix:** Run `node setup-env.js`

### Error: "Token not valid"
- **Problem:** Token expired or JWT_SECRET changed
- **Solution:** User needs to login again

### Error: "No token, authorization denied"
- **Problem:** User not logged in
- **Solution:** User needs to login first

## Important Notes

⚠️ **Security:**
- Never share JWT_SECRET publicly
- Never commit .env file to git
- Use strong, random JWT_SECRET
- Rotate JWT_SECRET periodically in production

✅ **Best Practices:**
- Use `node setup-env.js` to generate secure JWT_SECRET
- Keep JWT_SECRET at least 32 characters long
- Use different JWT_SECRET for production and development
- Store JWT_SECRET securely (environment variables, not in code)

