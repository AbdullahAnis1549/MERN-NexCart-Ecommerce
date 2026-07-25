import express from "express";
import { AdminAuthverifyuser } from "../Middleware/AdminProtected.js";
import { uploadImage } from "../utils/Uploadimage.js";

// ── Admin Controllers ──
import {
  GetDashboardStats,
  GetAllUsers,
  GetUserDetail,
  DeleteUser,
  GetAllOrdersAdmin,
  GetOrderDetailAdmin
} from "../Controllers/AdminControllers.js";

// ── Product Controllers ──
import {
  GetAllProduct,
  GetProduct,
  CreateProduct,
  UpdateProduct,
  DeleteProduct
} from "../Controllers/ProductControllers.js";

// ── Category Controllers ──
import {
  GetAllCategory,
  GetCategory,
  CreateCategory,
  UpdateCategory,
  DeleteCategory
} from "../Controllers/CategoryControllers.js";

// ── Banner Controllers ──
import {
  GetAllBanners,
  CreateBanner,
  UpdateBanner,
  DeleteBanner
} from "../Controllers/BannerControllers.js";

// ── Order Controllers ──
import {
  GetOrderHistory,
  UpdateOrderStatus
} from "../Controllers/OrderControllers.js";

// ── Review Controllers ──
import { DeleteReview } from "../Controllers/ReviewControllers.js";

import {
  validateCreateProduct,
  validateCreateCategory,
  validateCreateBanner,
} from "../Middleware/validate.js";

const AdminRouter = express.Router();

// Sab routes pe AdminAuthverifyuser middleware apply karo
AdminRouter.use(AdminAuthverifyuser);

// ═══════════════════════════════════════
// 📊 DASHBOARD
// ═══════════════════════════════════════
AdminRouter.get("/dashboard", GetDashboardStats);

// ═══════════════════════════════════════
// 👤 USER MANAGEMENT
// ═══════════════════════════════════════
AdminRouter.get("/users", GetAllUsers);
AdminRouter.get("/users/:id", GetUserDetail);
AdminRouter.delete("/users/:id", DeleteUser);

// ═══════════════════════════════════════
// 📦 PRODUCT MANAGEMENT
// ═══════════════════════════════════════
AdminRouter.get("/products", GetAllProduct);
AdminRouter.get("/products/:id", GetProduct);
AdminRouter.post("/products/create", uploadImage("image"), validateCreateProduct, CreateProduct);
AdminRouter.patch("/products/update/:id", uploadImage("image"), UpdateProduct);
AdminRouter.delete("/products/del/:id", DeleteProduct);

// ═══════════════════════════════════════
// 🗂️ CATEGORY MANAGEMENT
// ═══════════════════════════════════════
AdminRouter.get("/categories", GetAllCategory);
AdminRouter.get("/categories/:id", GetCategory);
AdminRouter.post("/categories/create", uploadImage("image"), validateCreateCategory, CreateCategory);
AdminRouter.patch("/categories/update/:id", uploadImage("image"), UpdateCategory);
AdminRouter.delete("/categories/del/:id", DeleteCategory);

// ═══════════════════════════════════════
// 🖼️ BANNER MANAGEMENT
// ═══════════════════════════════════════
AdminRouter.get("/banners", GetAllBanners);
AdminRouter.post("/banners/create", uploadImage("image"), validateCreateBanner, CreateBanner);
AdminRouter.patch("/banners/update/:id", uploadImage("image"), UpdateBanner);
AdminRouter.delete("/banners/del/:id", DeleteBanner);

// ═══════════════════════════════════════
// 📋 ORDER MANAGEMENT
// ═══════════════════════════════════════
AdminRouter.get("/orders", GetAllOrdersAdmin);
AdminRouter.get("/orders/:id", GetOrderDetailAdmin);
AdminRouter.patch("/orders/status/:id", UpdateOrderStatus);

// ═══════════════════════════════════════
// ⭐ REVIEW MANAGEMENT
// ═══════════════════════════════════════
AdminRouter.delete("/reviews/:reviewId", (req, res, next) => {
  req.isAdmin = true;
  next();
}, DeleteReview);

export default AdminRouter;
