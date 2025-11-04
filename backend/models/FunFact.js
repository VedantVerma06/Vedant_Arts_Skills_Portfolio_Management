// models/FunFact.js
const mongoose = require('mongoose');

const funFactSchema = new mongoose.Schema({
  fact: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('FunFact', funFactSchema);
    