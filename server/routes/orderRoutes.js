
import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

const router = express.Router();

// GET: Retrieve all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.menuItem", "name category")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Failed to retrieve orders." });
  }
});

// POST: Create a new order
router.post("/", async (req, res) => {
  try {
    const { customerName, items } = req.body;

    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Customer name and at least one food item are required."
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const entry of items) {
      if (
        !mongoose.isValidObjectId(entry.menuItem) ||
        !Number.isInteger(entry.quantity) ||
        entry.quantity < 1
      ) {
        return res.status(400).json({
          message: "Each item needs a valid menu ID and positive quantity."
        });
      }

      const menuItem = await MenuItem.findById(entry.menuItem);

      if (!menuItem || !menuItem.available) {
        return res.status(400).json({
          message: "A selected food item is unavailable or does not exist."
        });
      }

      const lineTotal = menuItem.price * entry.quantity;
      totalAmount += lineTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: entry.quantity,
        price: menuItem.price
      });
    }

    const order = await Order.create({
      customerName: customerName.trim(),
      items: orderItems,
      totalAmount,
      status: "Pending"
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order." });
  }
});

// PUT: Update an order's status
router.put("/:id/status", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Ready",
      "Completed",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(order);
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ message: "Failed to update order." });
  }
});

// PUT: Record payment and complete the order
router.put("/:id/payment", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid order ID."
      });
    }

    const { paymentMethod } = req.body;
    const allowedMethods = ["Cash", "UPI", "Card"];

    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Choose Cash, UPI, or Card."
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found."
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "Cannot pay for a cancelled order."
      });
    }

    order.paymentMethod = paymentMethod;
    order.paymentStatus = "Paid";
    order.status = "Completed";

    await order.save();

    res.json({
      message: "Payment recorded successfully. Order completed.",
      order
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({
      message: "Failed to record payment."
    });
  }
});

export default router;
