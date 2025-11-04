const express = require("express");
const { upload } = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  addArtwork,
  editArtwork,
  getArtworks,
  likeArtwork,
  commentArtwork,
  deleteComment,
  deleteArtwork,
} = require("../controllers/artworkController");

const router = express.Router();

/* Public */
router.get("/", getArtworks);
router.put("/:id/like", likeArtwork);
router.post("/:id/comment", commentArtwork);

/* Admin Only */
router.post("/", protect, adminOnly, upload.single("image"), addArtwork);
router.put("/:id", protect, adminOnly, upload.single("image"), editArtwork);
router.delete("/:artworkId/comment/:commentId", protect, adminOnly, deleteComment);
router.delete("/:id", protect, adminOnly, deleteArtwork);

module.exports = router;
