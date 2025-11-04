// models/AdminSettings.js
const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema({
  // 🌟 Home Page
  logoUrl: { type: String, default: "" },
  backgroundArtworks: [{ type: String }], // URLs of images shown in the moving background
  funFacts: [
    {
      fact: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],

  // 🧍 About Section
  profilePicUrl: { type: String, default: "" },
  aboutBio: { type: String, default: "" },

  // 📞 Contact & Service Section
  contactEmail: { type: String, default: "" },
  contactPhone: { type: String, default: "" },
  whatsappNumber: { type: String, default: "" },
  instagramLink: { type: String, default: "" },

  commissionPricing: [
    {
      size: String,
      price: Number,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
