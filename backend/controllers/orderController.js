// controllers/orderController.js
const Order = require("../models/Order");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const emailTemplates = require("../utils/emailTemplates");

/**
 * @desc  Place a new order (User)
 * @route POST /api/orders
 * @access Private (User)
 */
const placeOrder = async (req, res) => {
  try {
    const user = req.user; // ✅ already fetched from middleware
    const { type, size, description, budget, deadline } = req.body;

    if (!type || !description) {
      return res.status(400).json({ message: "Type and description are required." });
    }

    const order = await Order.create({
    userId: user._id,
      userName: user.username,   // ✅ correct
    userEmail: user.email,
    type,
    size,
    description,
    budget,
    deadline,
    status: "pending",
  });


    res.status(201).json({
      message: "✅ Order placed successfully!",
      order,
    });
  } catch (err) {
    console.error("❌ Order creation failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc  Get all orders (Admin)
 * @route GET /api/orders
 * @access Private (Admin)
 */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc  Get my orders (User)
 * @route GET /api/orders/my
 * @access Private (User)
 */
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.json({ message: "You have no orders till now." });
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching user's orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc  Update order status (Admin)
 * @route PUT /api/orders/:id
 * @access Private (Admin)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    // 🔔 Send status update emails
    switch (status) {
      case "accepted":
        await sendEmail(
          order.user.email,
          "Your Order Has Been Accepted 🎨",
          emailTemplates.orderAccepted(order.user.name, reason)
        );
        break;
      case "rejected":
        await sendEmail(
          order.user.email,
          "Your Order Has Been Rejected ❌",
          emailTemplates.orderRejected(order.user.name, reason)
        );
        break;
      case "in-progress":
        await sendEmail(
          order.user.email,
          "Your Order Is In Progress 🖌️",
          emailTemplates.orderInProgress(
            order.user.name,
            "Vedant has started working on your artwork!"
          )
        );
        break;
      case "completed":
        await sendEmail(
          order.user.email,
          "Your Order Is Complete ✅",
          emailTemplates.orderCompleted(order.user.name)
        );
        break;
      case "cancelled":
        await sendEmail(
          order.user.email,
          "Your Order Has Been Cancelled 🚫",
          emailTemplates.orderCancelled(order.user.name, reason)
        );
        break;
    }

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc  Cancel my order (User)
 * @route PUT /api/orders/:id/cancel
 * @access Private (User)
 */
const cancelMyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { reason } = req.body;

    const order = await Order.findOne({ _id: id, user: userId }).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["in-progress", "completed"].includes(order.status)) {
      return res.status(400).json({
        message: "You cannot cancel this order as work has already started.",
      });
    }

    order.status = "cancelled";
    await order.save();

    await sendEmail(
      order.user.email,
      "Order Cancelled by User",
      emailTemplates.orderCancelled(order.user.name, reason)
    );

    res.json({ message: "Order cancelled successfully ✅", order });
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  placeOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
  cancelMyOrder,
};
