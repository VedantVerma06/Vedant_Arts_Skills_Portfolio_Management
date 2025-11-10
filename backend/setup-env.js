9// setup-env.js - Helper script to create .env file
const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Generate a random JWT secret
function generateJWTSecret() {
  return crypto.randomBytes(64).toString('base64');
}

// Check if .env file exists
if (fs.existsSync('.env')) {
  console.log('⚠️  .env file already exists!');
  rl.question('Do you want to overwrite it? (yes/no): ', (answer) => {
    if (answer.toLowerCase() !== 'yes') {
      console.log('Cancelled. Existing .env file will be kept.');
      rl.close();
      return;
    }
    createEnvFile();
  });
} else {
  createEnvFile();
}

function createEnvFile() {
  console.log('\n🔧 Creating .env file...\n');
  
  // Generate JWT secret
  const jwtSecret = generateJWTSecret();
  console.log('✅ Generated JWT_SECRET');
  
  // Create .env file content
  const envContent = `# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:8000

# JWT Secret (Auto-generated - Change this in production!)
JWT_SECRET=${jwtSecret}

# MongoDB Connection (REQUIRED - Replace with your MongoDB URI)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vedant_art_portfolio?retryWrites=true&w=majority

# Google OAuth (REQUIRED - Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Admin Credentials (REQUIRED - Change these!)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Cloudinary Configuration (REQUIRED - Get from Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
`;

  // Write .env file
  fs.writeFileSync('.env', envContent);
  
  console.log('✅ .env file created successfully!');
  console.log('\n📝 IMPORTANT: Please update the following in .env file:');
  console.log('   1. MONGO_URI - Your MongoDB connection string');
  console.log('   2. GOOGLE_CLIENT_ID - From Google Cloud Console');
  console.log('   3. GOOGLE_CLIENT_SECRET - From Google Cloud Console');
  console.log('   4. ADMIN_EMAIL - Your admin email');
  console.log('   5. ADMIN_PASSWORD - Your admin password (change from admin123!)');
  console.log('   6. CLOUDINARY_* - Your Cloudinary credentials');
  console.log('\n🚀 After updating .env, restart your server!');
  console.log('   JWT_SECRET has been auto-generated and is ready to use.\n');
  
  rl.close();
}

