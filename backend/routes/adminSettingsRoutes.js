// routes/adminSettingsRoutes.js
const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");
const {
  getSettings,
  updateSettings,
  addBackgroundArtwork,
  addFunFact,
  deleteFunFact,
} = require("../controllers/adminSettingsController");

const router = express.Router();

/* 🌐 Public route for frontend */
router.get("/", getSettings);

/* 🛠️ Admin-only routes */
router.put("/", protect, adminOnly, upload.single("logo"), updateSettings);
router.post("/background", protect, adminOnly, upload.single("image"), addBackgroundArtwork);
router.post("/funfact", protect, adminOnly, addFunFact);
router.delete("/funfact/:factId", protect, adminOnly, deleteFunFact);

module.exports = router;
