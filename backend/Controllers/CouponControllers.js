import Coupon from "../Models/CouponSchema.js";

export const CreateCoupon = async (req, res) => {
  try {
    const { code, description, discountType, value, minOrderAmount, maxDiscount, maxUsage, expiresAt, active } = req.body;

    if (!code || value === undefined) {
      return res.status(400).json({ status: "fail", message: "code and value are required" });
    }

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      description,
      discountType: discountType || "percent",
      value: Number(value),
      minOrderAmount: Number(minOrderAmount || 0),
      maxDiscount: Number(maxDiscount || 0),
      maxUsage: Number(maxUsage || 1),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      active: active !== undefined ? active : true
    });

    return res.status(201).json({ status: "success", data: coupon });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};

export const GetAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: "success", data: coupons });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};

export const ApplyCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || subtotal === undefined) {
      return res.status(400).json({ status: "fail", message: "code and subtotal are required" });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ status: "fail", message: "Coupon not found" });
    }

    if (!coupon.active) {
      return res.status(400).json({ status: "fail", message: "Coupon is inactive" });
    }

    if (coupon.usedCount >= coupon.maxUsage) {
      return res.status(400).json({ status: "fail", message: "Coupon usage limit reached" });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ status: "fail", message: "Coupon expired" });
    }

    if (Number(subtotal) < coupon.minOrderAmount) {
      return res.status(400).json({ status: "fail", message: "Minimum order amount not met" });
    }

    let discountAmount = 0;
    if (coupon.discountType === "percent") {
      discountAmount = Math.round((Number(subtotal) * coupon.value) / 100);
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.value;
    }

    const finalTotal = Math.max(0, Number(subtotal) - discountAmount);

    return res.status(200).json({
      status: "success",
      data: {
        code: coupon.code,
        discountAmount,
        finalTotal,
        message: "Coupon applied successfully"
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};
