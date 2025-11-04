// controllers/adminSettingsController.js
const AdminSettings = require("../models/AdminSettings");
const { cloudinary } = require("../middleware/upload");

/* 🟢 Get All Settings (Public for Frontend) */
exports.getSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 🔵 Update General Settings (Admin Only) */
exports.updateSettings = async (req, res) => {
  try {
    const { contactEmail, contactPhone, whatsappNumber, instagramLink, commissionPricing } = req.body;

    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});

    // Upload new logo if provided
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, { folder: "vedant_admin_assets" });
      settings.logoUrl = uploaded.secure_url;
    }

    // Update contact info
    settings.contactEmail = contactEmail || settings.contactEmail;
    settings.contactPhone = contactPhone || settings.contactPhone;
    settings.whatsappNumber = whatsappNumber || settings.whatsappNumber;
    settings.instagramLink = instagramLink || settings.instagramLink;

    // Update commission pricing if provided
    if (commissionPricing) {
      settings.commissionPricing = JSON.parse(commissionPricing);
    }

    await settings.save();
    res.json({ message: "Settings updated ✅", settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 🖼️ Add Background Artwork */
exports.addBackgroundArtwork = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "vedant_background_artworks",
    });

    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});
    settings.backgroundArtworks.push(uploaded.secure_url);
    await settings.save();

    res.json({ message: "Background artwork added ✅", settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 💬 Add a Fun Fact */
exports.addFunFact = async (req, res) => {
  try {
    const { fact } = req.body;
    if (!fact) return res.status(400).json({ message: "Fact is required" });

    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});
    settings.funFacts.push({ fact });
    await settings.save();

    res.json({ message: "Fun fact added ✅", settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ❌ Delete a Fun Fact */
exports.deleteFunFact = async (req, res) => {
  try {
    const { factId } = req.params;
    const settings = await AdminSettings.findOne();
    if (!settings) return res.status(404).json({ message: "Settings not found" });

    settings.funFacts = settings.funFacts.filter(f => f._id.toString() !== factId);
    await settings.save();

    res.json({ message: "Fun fact deleted ✅", settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
