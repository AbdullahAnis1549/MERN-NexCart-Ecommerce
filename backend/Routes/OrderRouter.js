import express from "express";
import { Authverifyuser } from "../Middleware/Authverify.js";
import { AdminAuthverifyuser } from "../Middleware/AdminProtected.js";
import {
  CancelOrder,
  GetMyOrders,
  GetOrderHistory,
  PlaceOrder,
  RefundOrder,
  UpdateOrderStatus
} from "../Controllers/OrderControllers.js";
import { validatePlaceOrder } from "../Middleware/validate.js";

const OrderRouter = express.Router();

// User
OrderRouter.post("/place", Authverifyuser, validatePlaceOrder, PlaceOrder);
OrderRouter.get("/my-orders", Authverifyuser, GetMyOrders);
OrderRouter.patch("/cancel/:id", Authverifyuser, CancelOrder);

// Admin
OrderRouter.patch("/status/:id", AdminAuthverifyuser, UpdateOrderStatus);
OrderRouter.patch("/refund/:id", AdminAuthverifyuser, RefundOrder);
OrderRouter.get("/history", AdminAuthverifyuser, GetOrderHistory);

export default OrderRouter;


