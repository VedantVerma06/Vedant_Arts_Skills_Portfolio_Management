// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },

    // Order details
    artworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
    },
    type: {
      type: String,
      enum: ["commission", "artwork"],
      required: true,
    },
    description: { type: String, required: true },
    size: { type: String },
    medium: { type: String },
    budget: { type: Number },
    referenceImages: [String],

    // Status
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "in_progress",
        "completed",
        "rejected",
        "cancelled",
      ],
      default: "pending",
    },
    reason: { type: String }, // reason for rejection/cancellation

    // Timeline
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
