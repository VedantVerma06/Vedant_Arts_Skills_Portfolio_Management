// models/Artwork.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    instagramLink: { type: String },
    imageUrl: { type: String, required: true },

    category: {
      type: String,
      enum: ["sketch", "portrait", "digital", "painting", "other"],
      default: "other",
    },
    artistNotes: { type: String },
    sizeMedium: { type: String, default: "Not specified" },

    // 💰 Sale info
    price: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: false },
    isForSale: { type: Boolean, default: false },

    likes: { type: Number, default: 0 },
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artwork", artworkSchema);
