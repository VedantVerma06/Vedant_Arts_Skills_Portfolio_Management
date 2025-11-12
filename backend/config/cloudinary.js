const express = require("express");
const crypto = require("crypto");
const router = express.Router();

router.get("/signature", (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const paramsToSign = {
      allowed_formats: "jpg,jpeg,png,webp",
      folder: "vedant_artworks",
      timestamp: timestamp,
    };

    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join("&");

    const signature = crypto
      .createHash("sha1")
      .update(sortedParams + process.env.CLOUDINARY_API_SECRET)
      .digest("hex");

    res.json({ timestamp, signature });
  } catch (error) {
    console.error("❌ Signature generation error:", error);
    res.status(500).json({ error: "Failed to generate signature" });
  }
});

module.exports = router;
