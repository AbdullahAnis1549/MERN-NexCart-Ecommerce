import express from "express";
import { Authverifyuser } from "../Middleware/Authverify.js";
import { AdminAuthverifyuser } from "../Middleware/AdminProtected.js";
import {
  AddReview,
  GetProductReviews,
  UpdateReview,
  DeleteReview
} from "../Controllers/ReviewControllers.js";
import { validateReview } from "../Middleware/validate.js";

const ReviewRouter = express.Router();

// Product ke reviews fetch karo (public)
ReviewRouter.get("/product/:productId", GetProductReviews);

// Review add karo (sirf logged in user)
ReviewRouter.post("/add/:productId", Authverifyuser, validateReview, AddReview);

// Apna review update karo
ReviewRouter.patch("/update/:reviewId", Authverifyuser, UpdateReview);

// User apna review delete kare
ReviewRouter.delete("/delete/:reviewId", Authverifyuser, DeleteReview);

// Admin koi bhi review delete kar sakta hai
ReviewRouter.delete("/admin/delete/:reviewId", AdminAuthverifyuser, DeleteReview);

export default ReviewRouter;
