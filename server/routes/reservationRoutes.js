
import express from "express";
import mongoose from "mongoose";
import Reservation from "../models/Reservation.js";

const router = express.Router();

// GET: View all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .sort({ reservationDate: 1 });

    res.json(reservations);
  } catch (error) {
    console.error("Get reservations error:", error);
    res.status(500).json({
      message: "Failed to retrieve reservations."
    });
  }
});

// POST: Create a reservation
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      tableNumber,
      guests,
      reservationDate
    } = req.body;

    const table = Number(tableNumber);
    const guestCount = Number(guests);
    const date = new Date(reservationDate);

    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      !Number.isInteger(table) ||
      table < 1 ||
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      !reservationDate ||
      Number.isNaN(date.getTime()) ||
      date <= new Date()
    ) {
      return res.status(400).json({
        message: "Enter valid customer details, table, guests, and a future date."
      });
    }

    // Reservations last 90 minutes.
    const durationMs = 90 * 60 * 1000;
    const endTime = new Date(date.getTime() + durationMs);

    // Check for overlapping bookings on the same table.
    const conflict = await Reservation.findOne({
      tableNumber: table,
      status: { $nin: ["Cancelled", "Completed"] },
      reservationDate: {
        $lt: endTime,
        $gt: new Date(date.getTime() - durationMs)
      }
    });

    if (conflict) {
      return res.status(409).json({
        message: "This table already has a reservation around that time."
      });
    }

    const reservation = await Reservation.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      tableNumber: table,
      guests: guestCount,
      reservationDate: date,
      status: "Booked"
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error("Create reservation error:", error);
    res.status(500).json({
      message: "Failed to create reservation."
    });
  }
});

// PUT: Update reservation status
router.put("/:id/status", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid reservation ID."
      });
    }

    const allowedStatuses = [
      "Booked",
      "Seated",
      "Completed",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        message: "Invalid reservation status."
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found."
      });
    }

    res.json(reservation);
  } catch (error) {
    console.error("Update reservation error:", error);
    res.status(500).json({
      message: "Failed to update reservation."
    });
  }
});

export default router;
