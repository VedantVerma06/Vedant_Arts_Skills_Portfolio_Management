const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");
const {
  getDashboardStats,
  getHomeSettings,
  updateHomeSettings,
  addFunFact,
  deleteFunFact,
} = require("../controllers/adminController");

const router = express.Router();

// Dashboard overview
router.get("/stats", protect, adminOnly, getDashboardStats);

// Home page customization
router.get("/home-settings", protect, adminOnly, getHomeSettings);
router.put(
  "/home-settings",
  protect,
  adminOnly,
  upload.single("logo"),
  updateHomeSettings
);

// Fun facts management
router.post("/funfact", protect, adminOnly, addFunFact);
router.delete("/funfact/:id", protect, adminOnly, deleteFunFact);

module.exports = router;

