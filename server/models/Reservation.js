
import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    tableNumber: {
      type: Number,
      required: true,
      min: 1
    },

    guests: {
      type: Number,
      required: true,
      min: 1
    },

    reservationDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["Booked", "Seated", "Completed", "Cancelled"],
      default: "Booked"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
