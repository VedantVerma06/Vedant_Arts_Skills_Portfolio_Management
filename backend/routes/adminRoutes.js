const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const dotenv = require("dotenv");
const AdminSettings = require("../models/AdminSettings");
const { upload, cloudinary } = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/authMiddleware");

dotenv.config();

const router = express.Router();

/* 🔐 Admin Login */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not set in environment variables');
      return res.status(500).json({ 
        success: false,
        message: "Server configuration error: JWT_SECRET is not set. Please check your .env file." 
      });
    }

    // Check if admin credentials are set
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      return res.status(500).json({ 
        success: false,
        message: "Server configuration error: Admin credentials are not set. Please check your .env file." 
      });
    }

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid admin credentials" 
      });
    }

    const token = jwt.sign(
      { id: "admin_unique_id", role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.json({
      success: true,
      message: "Admin login successful ✅",
      token,
      admin: { email, role: "admin" },
    });
  } catch (error) {
    console.error('❌ Error in admin login:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error during login",
      error: error.message 
    });
  }
});

/* 🧾 Get Admin Profile / Settings */
router.get("/profile", protect, adminOnly, async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin settings", error: err.message });
  }
});

/* 📝 Update Admin Profile Text (Bio) */
router.put("/profile", protect, adminOnly, async (req, res) => {
  try {
    const { aboutBio } = req.body;
    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});
    if (aboutBio) settings.aboutBio = aboutBio;
    await settings.save();
    res.json({ message: "Profile updated ✅", settings });
  } catch (err) {
    res.status(500).json({ message: "Update failed ❌", error: err.message });
  }
});

/* 🖼️ Upload Logo or Profile Picture */
router.post("/upload", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.file.path)
      return res.status(400).json({ message: "No image uploaded" });

    const { type } = req.body; // 'logo' or 'profile'
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "vedant_admin_assets",
    });

    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});

    if (type === "logo") settings.logoUrl = uploadResult.secure_url;
    else if (type === "profile") settings.profilePicUrl = uploadResult.secure_url;

    await settings.save();
    res.json({ message: "Image uploaded ✅", settings });
  } catch (err) {
    res.status(500).json({ message: "Image upload failed ❌", error: err.message });
  }
});

/* 🔑 Change Admin Password (updates .env) */
router.put("/password", protect, adminOnly, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (oldPassword !== process.env.ADMIN_PASSWORD)
      return res.status(401).json({ message: "Old password incorrect" });

    // update .env file
    const envPath = ".env";
    const envContent = fs.readFileSync(envPath, "utf-8");
    const newEnv = envContent.replace(
      /ADMIN_PASSWORD=.*/g,
      `ADMIN_PASSWORD=${newPassword}`
    );
    fs.writeFileSync(envPath, newEnv);

    res.json({ message: "Password updated successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: "Password update failed ❌", error: err.message });
  }
});

module.exports = router;

