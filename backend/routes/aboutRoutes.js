const express = require("express");
const { getAbout, updateAbout } = require("../controllers/aboutController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");

const router = express.Router();

router.get("/", getAbout);
router.put("/", protect, adminOnly, upload.single("image"), updateAbout);

module.exports = router;
