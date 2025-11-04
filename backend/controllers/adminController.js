// controllers/adminController.js
const Artwork = require("../models/Artwork");
const Order = require("../models/Order");
const User = require("../models/User");
const AdminSettings = require("../models/AdminSettings");

/* 📊 Dashboard Stats Overview */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalArtworks = await Artwork.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalLikes = await Artwork.aggregate([
      { $group: { _id: null, total: { $sum: "$likes" } } },
    ]);
    const likesCount = totalLikes[0]?.total || 0;

    res.status(200).json({
      message: "Dashboard stats fetched successfully",
      data: {
        artworks: totalArtworks,
        orders: totalOrders,
        users: totalUsers,
        totalLikes: likesCount,
      },
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

/* 🎨 Manage Home Settings (Logo + Slider + Fun Facts) */
exports.getHomeSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateHomeSettings = async (req, res) => {
  try {
    const { funFacts, backgroundArtworks } = req.body;
    const logoFile = req.file;

    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});

    if (funFacts) settings.funFacts = funFacts;
    if (backgroundArtworks) settings.backgroundArtworks = backgroundArtworks;

    // If logo is uploaded
    if (logoFile && logoFile.path) {
      const { cloudinary } = require("../middleware/upload");
      const uploaded = await cloudinary.uploader.upload(logoFile.path, {
        folder: "vedant_home_assets",
      });
      settings.logoUrl = uploaded.secure_url;
    }

    await settings.save();

    res.status(200).json({
      message: "Home settings updated successfully ✅",
      settings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 🧠 Add or Remove a Fun Fact */
exports.addFunFact = async (req, res) => {
  try {
    const { text } = req.body;
    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});

    settings.funFacts.push({ text });
    await settings.save();

    res.status(201).json({ message: "Fun fact added 🎉", settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFunFact = async (req, res) => {
  try {
    const { id } = req.params;
    let settings = await AdminSettings.findOne();
    if (!settings) return res.status(404).json({ message: "Settings not found" });

    settings.funFacts = settings.funFacts.filter(
      (fact) => fact._id.toString() !== id
    );
    await settings.save();

    res.status(200).json({ message: "Fun fact removed 🗑️", settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
