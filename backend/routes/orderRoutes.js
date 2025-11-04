// routes/orderRoutes.js
const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  placeOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  cancelMyOrder,
} = require("../controllers/orderController");

const router = express.Router();

/* 🧑‍🎨 User routes */
router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.put("/:id/cancel", protect, cancelMyOrder);

/* 🛠️ Admin routes */
router.get("/", protect, adminOnly, getOrders);
router.put("/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;
