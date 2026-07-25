import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rating: {
      type: Number,
      required: [true, "Rating required"],
      min: [1, "Rating min 1"],
      max: [5, "Rating max 5"]
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Comment max 500 characters"]
    }
  },
  { timestamps: true }
);

// Ek user ek product ko sirf ek baar review de sakta hai
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
