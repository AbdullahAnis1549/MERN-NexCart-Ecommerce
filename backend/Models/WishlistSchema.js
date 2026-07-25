import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
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
        }
      }
    ]
  },
  { timestamps: true }
);

// (Removed explicit unique index to avoid duplicate index warnings)


const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;

