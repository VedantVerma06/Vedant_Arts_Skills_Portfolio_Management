// controllers/artworkController.js
const Artwork = require("../models/Artwork");
const { cloudinary } = require("../middleware/upload");
const axios = require("axios");

/* 🎨 Add new artwork (manual upload) */
exports.addArtwork = async (req, res) => {
  try {
    const {
      title,
      caption,
      instagramLink,
      price,
      category,
      artistNotes,
      sizeMedium,
      isForSale,
    } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image required" });

    // ✅ No need to upload manually — multer-storage-cloudinary already did it
    const imageUrl = req.file.path; // Cloudinary URL from multer
    console.log("✅ Cloudinary image URL:", imageUrl);

    const artwork = await Artwork.create({
      title,
      caption,
      instagramLink,
      price: price || 0,
      category,
      artistNotes,
      sizeMedium,
      isForSale: isForSale || false,
      isAvailable: isForSale || false,
      imageUrl,
    });

    res.status(201).json({ message: "Artwork added ✅", artwork });
  } catch (err) {
    console.error("❌ addArtwork error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* 🖌️ Edit artwork details */
exports.editArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const artwork = await Artwork.findById(id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });

    Object.assign(artwork, updates);

    // ✅ Replace old image if new one uploaded
    if (req.file) {
      artwork.imageUrl = req.file.path; // Cloudinary URL
    }

    await artwork.save();
    res.json({ message: "Artwork updated ✅", artwork });
  } catch (err) {
    console.error("❌ editArtwork error:", err);
    res.status(500).json({ message: err.message });
  }
};


/* 🧭 Get all artworks (public, with filters) */
exports.getArtworks = async (req, res) => {
  try {
    const { category, forSale, page = 1, limit = 12 } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (forSale === "true") filters.isForSale = true;

    const artworks = await Artwork.find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ❤️ Like Artwork */
exports.likeArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const artwork = await Artwork.findById(id);
    if (!artwork) return res.status(404).json({ message: "Not found" });

    artwork.likes += 1;
    await artwork.save();

    res.json({ likes: artwork.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 💬 Comment on Artwork */
exports.commentArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, user } = req.body;

    if (!text) return res.status(400).json({ message: "Comment text required" });

    const artwork = await Artwork.findById(id);
    if (!artwork) return res.status(404).json({ message: "Not found" });

    artwork.comments.push({ user, text });
    await artwork.save();

    res.json({ message: "Comment added ✅", comments: artwork.comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 🧹 Delete a comment (Admin Only) */
exports.deleteComment = async (req, res) => {
  try {
    const { artworkId, commentId } = req.params;
    const artwork = await Artwork.findById(artworkId);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });

    artwork.comments = artwork.comments.filter(c => c._id.toString() !== commentId);
    await artwork.save();

    res.json({ message: "Comment deleted ✅", artwork });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 🗑️ Delete Artwork */
exports.deleteArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const artwork = await Artwork.findById(id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });

    await artwork.deleteOne();
    res.json({ message: "Artwork deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

