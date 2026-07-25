import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    discountType: {
      type: String,
      enum: ["percent", "fixed"],
      default: "percent"
    },
    value: {
      type: Number,
      required: true,
      min: [1, "value must be >= 1"]
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: [0, "minOrderAmount must be >= 0"]
    },
    maxDiscount: {
      type: Number,
      default: 0,
      min: [0, "maxDiscount must be >= 0"]
    },
    maxUsage: {
      type: Number,
      default: 1,
      min: [1, "maxUsage must be >= 1"]
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, "usedCount must be >= 0"]
    },
    expiresAt: {
      type: Date,
      default: null
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
