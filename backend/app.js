import express from "express";
import cors from "cors";
import { connectDB } from "./Config/DB.js";
import CategoryRouter from "./Routes/CategoryRouter.js";
import ProductRouter from "./Routes/ProductRouter.js";
import BannerRouter from "./Routes/BannerRouter.js";
import UserRouter from "./Routes/UserRouter.js";
import CartRouter from "./Routes/CartRouter.js";
import OrderRouter from "./Routes/OrderRouter.js";
import PaymentRouter from "./Routes/PaymentRouter.js";
import ReviewRouter from "./Routes/ReviewRouter.js";
import AdminRouter from "./Routes/AdminRouter.js";
import CouponRouter from "./Routes/CouponRouter.js";
import ContactRouter from "./Routes/ContactRouter.js";

const app = express();

// CORS — only allow the configured frontend origin (production-safe)
const allowedOrigins = [
  process.env.FRONTEND_URL,   // set this in .env for production (e.g. https://yourdomain.com)
  "http://localhost:5173",     // Vite dev server
  "http://localhost:3000",     // fallback dev port
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or same-origin requests (no origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,            // allow cookies / Authorization headers
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

await connectDB();

app.use("/category", CategoryRouter);

app.use("/product", ProductRouter);

app.use("/banner", BannerRouter);

app.use("/user", UserRouter);

app.use("/cart", CartRouter);

app.use("/order", OrderRouter);

// Stripe Payment Routes
app.use("/payment", PaymentRouter);

// Reviews & Ratings
app.use("/review", ReviewRouter);

// Admin Panel — sab admin operations
app.use("/admin", AdminRouter);

app.use("/coupon", CouponRouter);

app.use("/api", ContactRouter);

app.use((req, res) => {
  res.status(404).json({ status: "fail", message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: "fail", message: "Internal server error" });
});

export default app;




