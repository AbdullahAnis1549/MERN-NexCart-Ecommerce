import mongoose from "mongoose";
import Review from "../Models/ReviewSchema.js";
import Product from "../Models/ProductSchema.js";

/**
 * Recalculate averageRating and numReviews for a given product and persist to Product collection.
 */
export const recalculateProductRating = async (productId) => {
  if (!productId) return { averageRating: 0, numReviews: 0 };

  const objectId = typeof productId === "string" ? new mongoose.Types.ObjectId(productId) : productId;

  const stats = await Review.aggregate([
    { $match: { productId: objectId } },
    {
      $group: {
        _id: "$productId",
        numReviews: { $sum: 1 },
        avgRating: { $avg: "$rating" }
      }
    }
  ]);

  const numReviews = stats.length > 0 ? stats[0].numReviews : 0;
  const averageRating = stats.length > 0 ? Number(stats[0].avgRating.toFixed(1)) : 0;

  await Product.findByIdAndUpdate(objectId, {
    averageRating,
    numReviews
  });

  return { averageRating, numReviews };
};
