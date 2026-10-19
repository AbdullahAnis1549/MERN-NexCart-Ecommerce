import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { connectDB } from "../Config/DB.js";
import User from "../Models/UserSchema.js";
import Product from "../Models/ProductSchema.js";
import Review from "../Models/ReviewSchema.js";
import Order from "../Models/OrderSchema.js";
import { recalculateProductRating } from "../utils/updateProductRating.js";

dotenv.config({ quiet: true });

const seedUsersData = [
  { name: "Ayesha Khan", email: "seed.user1@example.com", phone: "03001111111", password: "password123", role: "user" },
  { name: "Bilal Ahmed", email: "seed.user2@example.com", phone: "03002222222", password: "password123", role: "user" },
  { name: "Fatima Noor", email: "seed.user3@example.com", phone: "03003333333", password: "password123", role: "user" },
  { name: "Hamza Ali", email: "seed.user4@example.com", phone: "03004444444", password: "password123", role: "user" },
  { name: "Zainab Tariq", email: "seed.user5@example.com", phone: "03005555555", password: "password123", role: "user" }
];

const sampleReviewPool = [
  { rating: 5, comment: "Exceptional quality! Exactly as described and delivered super fast." },
  { rating: 5, comment: "Loved the fit and color shade. Premium material, definitely buying again!" },
  { rating: 4, comment: "Very good product for the price. Minor delay in courier, but the product itself is 5 stars." },
  { rating: 5, comment: "Exceeded my expectations. Packaging was solid and product feels sturdy." },
  { rating: 4, comment: "Comfortable and looks neat. Sizing was spot on for me." },
  { rating: 3, comment: "Decent purchase for everyday use. Value for money." },
  { rating: 5, comment: "Top-notch quality! Best purchase I have made in a while." },
  { rating: 4, comment: "Nice colors and smooth texture. Satisfied customer!" }
];

const paletteOptions = [
  [
    { name: "Midnight Black", hex: "#111827" },
    { name: "Navy Blue", hex: "#1e3a8a" },
    { name: "Crimson Red", hex: "#b91c1c" }
  ],
  [
    { name: "Space Gray", hex: "#374151" },
    { name: "Silver", hex: "#9ca3af" },
    { name: "Forest Green", hex: "#15803d" }
  ],
  [
    { name: "Charcoal", hex: "#1f2937" },
    { name: "Pure White", hex: "#f9fafb" },
    { name: "Amber Gold", hex: "#d97706" }
  ]
];

const standardSizes = ["S", "M", "L", "XL"];

export const runSeed = async () => {
  console.log("🌱 Starting review & product attribute seeding...");
  await connectDB();

  // 1. Create or update dummy seed users
  const seedUsers = [];
  for (const u of seedUsersData) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const userDoc = await User.findOneAndUpdate(
      { email: u.email },
      {
        name: u.name,
        email: u.email,
        phone: u.phone,
        password: hashedPassword,
        role: u.role,
        verifystatus: true
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    seedUsers.push(userDoc);
  }
  console.log(`✅ Seeded/verified ${seedUsers.length} dummy seed users.`);

  // 2. Fetch existing products
  const products = await Product.find();
  if (products.length === 0) {
    console.log("⚠️ No products found in database. Please ensure products exist first.");
    return;
  }
  console.log(`📦 Found ${products.length} existing products.`);

  // 3. Augment missing colors, sizes, and sale prices without overwriting real data
  let augmentedCount = 0;
  for (let idx = 0; idx < products.length; idx++) {
    const prod = products[idx];
    const updates = {};
    let modified = false;

    // Only populate colors if empty
    if (!prod.colors || prod.colors.length === 0) {
      updates.colors = paletteOptions[idx % paletteOptions.length];
      modified = true;
    }

    // Only populate sizes if empty
    if (!prod.sizes || prod.sizes.length === 0) {
      updates.sizes = standardSizes;
      modified = true;
    }

    // Populate a realistic sale price for ~40% of products if salePrice is empty
    if ((prod.salePrice == null || prod.salePrice <= 0) && idx % 2 === 0) {
      updates.salePrice = Math.round(prod.price * 0.8); // 20% discount
      modified = true;
    }

    if (modified) {
      updates.hasSeededAttributes = true;
      await Product.findByIdAndUpdate(prod._id, updates);
      augmentedCount++;
    }
  }
  console.log(`✅ Augmented missing attributes on ${augmentedCount} products (marked hasSeededAttributes: true).`);

  // 4. Create demo DELIVERED orders for verified-purchase review testing
  // a) For user's personal account if available
  const myEmail = "abdullahanis266@gmail.com";
  let myUser = await User.findOne({ email: myEmail });
  if (myUser) {
    const existingOrder = await Order.findOne({ userId: myUser._id, isSeeded: true });
    if (!existingOrder) {
      // Pick first 3 products
      const orderProducts = products.slice(0, Math.min(3, products.length));
      await Order.create({
        userId: myUser._id,
        items: orderProducts.map((p) => ({
          productId: p._id,
          quantity: 1,
          color: p.colors?.[0]?.name || null,
          size: p.sizes?.[0] || null,
          priceAtPurchase: p.salePrice || p.price
        })),
        shippingAddress: "House 123, Street 4, Clifton, Karachi",
        paymentMethod: "COD",
        paymentStatus: "PAID",
        status: "DELIVERED",
        totalAmount: orderProducts.reduce((sum, p) => sum + (p.salePrice || p.price), 0),
        shippingCharge: 0,
        grandTotal: orderProducts.reduce((sum, p) => sum + (p.salePrice || p.price), 0),
        isSeeded: true
      });
      console.log(`✅ Created demo DELIVERED order for ${myEmail} (verified-purchase enabled!).`);
    } else {
      console.log(`ℹ️ Demo order already exists for ${myEmail}.`);
    }
  } else {
    console.log(`ℹ️ User ${myEmail} not found in DB yet. You can sign up with this email or run seed again after signing up.`);
  }

  // b) For seed user 1
  const seedUser1 = seedUsers[0];
  const existingSeedOrder = await Order.findOne({ userId: seedUser1._id, isSeeded: true });
  if (!existingSeedOrder) {
    await Order.create({
      userId: seedUser1._id,
      items: products.slice(0, Math.min(5, products.length)).map((p) => ({
        productId: p._id,
        quantity: 1,
        color: p.colors?.[0]?.name || null,
        size: p.sizes?.[0] || null,
        priceAtPurchase: p.salePrice || p.price
      })),
      shippingAddress: "Seed Delivery Address, Lahore",
      paymentMethod: "COD",
      paymentStatus: "PAID",
      status: "DELIVERED",
      totalAmount: 5000,
      shippingCharge: 0,
      grandTotal: 5000,
      isSeeded: true
    });
    console.log("✅ Created demo DELIVERED order for seed.user1@example.com.");
  }

  // 5. Seed realistic reviews spread across products
  let createdReviewsCount = 0;
  for (let pIdx = 0; pIdx < products.length; pIdx++) {
    const prod = products[pIdx];
    // Assign 2 to 4 seed users to review each product
    const numReviewsForProduct = 2 + (pIdx % 3); // 2, 3, or 4 reviews
    for (let uIdx = 0; uIdx < numReviewsForProduct; uIdx++) {
      const user = seedUsers[(pIdx + uIdx) % seedUsers.length];
      const reviewSample = sampleReviewPool[(pIdx * 2 + uIdx) % sampleReviewPool.length];

      // Upsert to ensure idempotency (won't duplicate if run twice)
      const existing = await Review.findOne({ productId: prod._id, userId: user._id });
      if (!existing) {
        await Review.create({
          productId: prod._id,
          userId: user._id,
          rating: reviewSample.rating,
          comment: reviewSample.comment,
          isSeeded: true
        });
        createdReviewsCount++;
      }
    }
  }
  console.log(`⭐ Seeded ${createdReviewsCount} realistic reviews (marked isSeeded: true).`);

  // 6. Recalculate averageRating and numReviews on all products
  console.log("🔄 Recalculating ratings for all products...");
  for (const prod of products) {
    await recalculateProductRating(prod._id);
  }
  console.log("✅ Ratings recalculated successfully on all products!");
  console.log("🎉 Seed process completed successfully.");
};

runSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
