import Review from "../Models/ReviewSchema.js";
import Order from "../Models/OrderSchema.js";

// ─────────────────────────────────────────────────
// Add Review
// Sirf woh user review de sakta hai jisne product kharida ho
// ─────────────────────────────────────────────────
export const AddReview = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({
        status: "fail",
        message: "Rating required (1-5)"
      });
    }

    // Check karo kya user ne ye product order kiya tha
    const hasPurchased = await Order.findOne({
      userId,
      "items.productId": productId,
      status: "DELIVERED"
    });

    if (!hasPurchased) {
      return res.status(403).json({
        status: "fail",
        message: "Sirf delivered order wala product review kar sakte hain"
      });
    }

    // Duplicate check — ek user ek product ko sirf ek baar review kar sakta hai
    const existing = await Review.findOne({ productId, userId });
    if (existing) {
      return res.status(400).json({
        status: "fail",
        message: "Aap ne ye product pehle se review kar diya hai"
      });
    }

    const review = await Review.create({
      productId,
      userId,
      rating: Number(rating),
      comment
    });

    const populated = await Review.findById(review._id).populate(
      "userId",
      "name image"
    );

    return res.status(201).json({
      status: "success",
      data: populated
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

// ─────────────────────────────────────────────────
// Get Product Reviews + Average Rating
// ─────────────────────────────────────────────────
export const GetProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "name image")
      .sort({ createdAt: -1 });

    // Average rating calculate karo
    const totalRatings = reviews.length;
    const avgRating =
      totalRatings > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
        : 0;

    // Rating distribution (1 star se 5 star kitne)
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    return res.status(200).json({
      status: "success",
      totalRatings,
      avgRating: Number(avgRating),
      distribution,
      data: reviews
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

// ─────────────────────────────────────────────────
// Update My Review
// ─────────────────────────────────────────────────
export const UpdateReview = async (req, res) => {
  try {
    const userId = req.id;
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId, userId });

    if (!review) {
      return res.status(404).json({
        status: "fail",
        message: "Review nahi mila ya aap ka nahi hai"
      });
    }

    if (rating) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment;

    await review.save();

    const populated = await Review.findById(review._id).populate(
      "userId",
      "name image"
    );

    return res.status(200).json({
      status: "success",
      data: populated
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

// ─────────────────────────────────────────────────
// Delete Review (User apna, Admin koi bhi)
// ─────────────────────────────────────────────────
export const DeleteReview = async (req, res) => {
  try {
    const userId = req.id;
    const { reviewId } = req.params;
    const isAdmin = req.isAdmin; // Admin middleware se aayega

    const query = isAdmin ? { _id: reviewId } : { _id: reviewId, userId };

    const review = await Review.findOneAndDelete(query);

    if (!review) {
      return res.status(404).json({
        status: "fail",
        message: "Review nahi mila"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Review delete ho gaya"
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};
