const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  bio: String,
  imageUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);

