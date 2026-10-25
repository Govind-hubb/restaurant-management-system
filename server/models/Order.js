
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },

    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true
        },

        name: {
          type: String,
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        },

        price: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },


    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid"
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card"],
      default: "Cash"
    },


    status: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Completed", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
