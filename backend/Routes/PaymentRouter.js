import express from "express";
import { Authverifyuser } from "../Middleware/Authverify.js";
import {
  CreatePaymentIntent,
  ConfirmOrder,
  GetPublishableKey
} from "../Controllers/PaymentControllers.js";

const PaymentRouter = express.Router();

// Publishable key frontend ko deta hai (public route)
PaymentRouter.get("/config", GetPublishableKey);

// Step 1: Cart se PaymentIntent banao
PaymentRouter.post("/create-intent", Authverifyuser, CreatePaymentIntent);

// Step 2: Payment successful hone ke baad order confirm karo
PaymentRouter.post("/confirm-order", Authverifyuser, ConfirmOrder);

export default PaymentRouter;
