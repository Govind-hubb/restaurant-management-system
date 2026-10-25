
import express from "express";
import mongoose from "mongoose";
import MenuItem from "../models/MenuItem.js";

const router = express.Router();

// GET: Retrieve all menu items
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Get menu error:", error);
    res.status(500).json({ message: "Failed to retrieve menu." });
  }
});

// POST: Add a new menu item
router.post("/", async (req, res) => {
  try {
    const { name, category, price, description, available } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      price === undefined ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        message: "Valid name, category, and non-negative price are required."
      });
    }

    const item = await MenuItem.create({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      description: description ?? "",
      available: available ?? true
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Create menu item error:", error);

    res.status(500).json({
      message: "Failed to create menu item.",
      error: error.message
    });
  }
});

// PUT: Update an existing menu item
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid menu item ID." });
    }

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Menu item not found." });
    }

    res.json(item);
  } catch (error) {
    console.error("Update menu error:", error);
    res.status(400).json({ message: "Failed to update menu item." });
  }
});

// DELETE: Remove a menu item
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid menu item ID." });
    }

    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found." });
    }

    res.json({ message: "Menu item deleted successfully." });
  } catch (error) {
    console.error("Delete menu error:", error);
    res.status(500).json({ message: "Failed to delete menu item." });
  }
});

export default router;
