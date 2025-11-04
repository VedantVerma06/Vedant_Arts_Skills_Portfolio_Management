// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  googleId: { type: String, index: true, sparse: true },
  profileImage: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
