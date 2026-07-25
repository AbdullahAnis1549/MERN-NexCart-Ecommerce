import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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
        }
      }
    ]
  },
  { timestamps: true }
);

// Helpful for faster lookups
// (Removed explicit unique index to avoid duplicate index warnings)


const Cart = mongoose.model("Cart", cartSchema);
export default Cart;

