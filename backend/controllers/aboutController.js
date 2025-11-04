// controllers/aboutController.js
const AdminSettings = require("../models/AdminSettings");

/* 🎨 Get About Section (Public) */
const getAbout = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();

    if (!settings) {
      settings = await AdminSettings.create({
        aboutBio: "Welcome to my art portfolio. This section will soon tell you about my journey 🎨",
        profilePicUrl: "",
      });
    }

    res.status(200).json({
      profilePicUrl: settings.profilePicUrl,
      aboutBio: settings.aboutBio,
    });
  } catch (err) {
    console.error("Error fetching About data:", err);
    res.status(500).json({ message: "Failed to fetch About data" });
  }
};

/* 🛠️ Update About Section (Admin Only) */
const updateAbout = async (req, res) => {
  try {
    const { aboutBio } = req.body;
    const imageFile = req.file; // optional if admin uploads a new profile picture

    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});

    // Update bio if provided
    if (aboutBio) settings.aboutBio = aboutBio;

    // Update profile picture if new image is uploaded
    if (imageFile && imageFile.path) {
      const { cloudinary } = require("../middleware/upload");
      const uploaded = await cloudinary.uploader.upload(imageFile.path, {
        folder: "vedant_admin_assets",
      });
      settings.profilePicUrl = uploaded.secure_url;
    }

    await settings.save();

    res.status(200).json({
      message: "About section updated successfully ✅",
      settings,
    });
  } catch (err) {
    console.error("Error updating About section:", err);
    res.status(500).json({ message: "Failed to update About section" });
  }
};

module.exports = { getAbout, updateAbout };
