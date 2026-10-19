import dotenv from "dotenv";
import { connectDB } from "../Config/DB.js";
import User from "../Models/UserSchema.js";
import Product from "../Models/ProductSchema.js";
import Review from "../Models/ReviewSchema.js";
import Order from "../Models/OrderSchema.js";
import { recalculateProductRating } from "../utils/updateProductRating.js";

dotenv.config({ quiet: true });

export const runCleanup = async () => {
  console.log("🧹 Starting cleanup of seeded reviews, orders, and attributes...");
  await connectDB();

  // 1. Delete all seeded reviews
  const reviewResult = await Review.deleteMany({ isSeeded: true });
  console.log(`🗑️ Deleted ${reviewResult.deletedCount} seeded reviews.`);

  // 2. Delete all seeded demo orders
  const orderResult = await Order.deleteMany({ isSeeded: true });
  console.log(`🗑️ Deleted ${orderResult.deletedCount} seeded demo orders.`);

  // 3. Delete dummy seed users
  const userResult = await User.deleteMany({ email: /^seed\.user\d+@example\.com$/i });
  console.log(`🗑️ Deleted ${userResult.deletedCount} dummy seed users.`);

  // 4. Reset seeded product attributes (only products that had hasSeededAttributes: true)
  const productResult = await Product.updateMany(
    { hasSeededAttributes: true },
    {
      $set: {
        colors: [],
        sizes: [],
        variants: [],
        salePrice: null,
        saleStartDate: null,
        saleEndDate: null,
        hasSeededAttributes: false
      }
    }
  );
  console.log(`🔄 Reset seeded attributes on ${productResult.modifiedCount} products. Real admin-entered products were untouched.`);

  // 5. Recalculate averageRating and numReviews for all products
  const products = await Product.find();
  console.log("🔄 Recalculating ratings for all products after cleanup...");
  for (const prod of products) {
    await recalculateProductRating(prod._id);
  }
  console.log("✅ All product ratings recalculated.");
  console.log("🎉 Cleanup completed successfully!");
};

runCleanup()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
  });
