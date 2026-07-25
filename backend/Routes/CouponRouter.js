import express from "express";
import { AdminAuthverifyuser } from "../Middleware/AdminProtected.js";
import { Authverifyuser } from "../Middleware/Authverify.js";
import { ApplyCoupon, CreateCoupon, GetAllCoupons } from "../Controllers/CouponControllers.js";

const CouponRouter = express.Router();

CouponRouter.get("/", GetAllCoupons);
CouponRouter.post("/apply", Authverifyuser, ApplyCoupon);
CouponRouter.post("/create", AdminAuthverifyuser, CreateCoupon);

export default CouponRouter;
