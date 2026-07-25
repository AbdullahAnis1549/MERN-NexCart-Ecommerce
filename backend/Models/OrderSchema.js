import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "quantity must be >= 1"]
        },
        priceAtPurchase: {
          type: Number,
          required: true,
          min: [0, "price must be >= 0"]
        }
      }
    ],
    // Address fields (keep it generic)
    shippingAddress: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD"
    },
    paymentIntentId: {
      type: String,
      default: null
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING"
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "SHIPPED", "DELIVERED", "REFUNDED"],
      default: "PENDING",
      index: true
    },
    refundReason: {
      type: String,
      default: null
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "totalAmount must be >= 0"]
    },
    shippingCharge: {
      type: Number,
      default: 0,
      min: [0, "shippingCharge must be >= 0"]
    },
    grandTotal: {
      type: Number,
      required: true,
      min: [0, "grandTotal must be >= 0"]
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;

