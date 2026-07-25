import Stripe from "stripe";
import dotenv from "dotenv";
import Cart from "../Models/CartSchema.js";
import Order from "../Models/OrderSchema.js";
import Product from "../Models/ProductSchema.js";
import User from "../Models/UserSchema.js";
import sendEmail from "../utils/SendEmail.js";
import { orderConfirmationEmail } from "../utils/OrderEmailTemplate.js";
import { calculateShipping } from "./OrderControllers.js";
import { invoiceHtml as buildInvoiceHtml } from "../utils/InvoiceTemplate.js";

dotenv.config({ quiet: true });

const stripe = new Stripe(process.env.SecretKey?.trim() || "sk_test_dummy");

// ─────────────────────────────────────────────────
// STEP 1 — Create Payment Intent
// Cart se subtotal + shipping nikalo aur
// Stripe ka client_secret return karo
// ─────────────────────────────────────────────────
export const CreatePaymentIntent = async (req, res) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price mainStock"
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ status: "fail", message: "Cart is empty" });
    }

    // Stock check + subtotal
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (!product) {
        return res.status(404).json({ status: "fail", message: "Product not found" });
      }
      if (product.mainStock < item.quantity) {
        return res.status(400).json({
          status: "fail",
          message: `Insufficient stock for ${product.name}`
        });
      }
      totalAmount += product.price * item.quantity;
    }

    // Shipping calculate karo
    const shippingCharge = calculateShipping(totalAmount);
    const grandTotal = totalAmount + shippingCharge;

    // Stripe ko grandTotal bhejo (paisa mein)
    const amountInPaisa = Math.round(grandTotal * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaisa,
      currency: "pkr",
      metadata: { userId: userId.toString() }
    });

    return res.status(200).json({
      status: "success",
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      totalAmount,
      shippingCharge,
      grandTotal
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};

// ─────────────────────────────────────────────────
// STEP 2 — Confirm Order (payment ke baad call karo)
// ─────────────────────────────────────────────────
export const ConfirmOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { paymentIntentId, shippingAddress } = req.body;

    if (!paymentIntentId || !shippingAddress) {
      return res.status(400).json({
        status: "fail",
        message: "paymentIntentId and shippingAddress required"
      });
    }

    // Stripe se payment verify karo
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        status: "fail",
        message: `Payment not completed. Status: ${paymentIntent.status}`
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price mainStock"
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ status: "fail", message: "Cart is empty" });
    }

    // Stock validate + total
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (!product) return res.status(404).json({ status: "fail", message: "Product not found" });
      if (product.mainStock < item.quantity) {
        return res.status(400).json({
          status: "fail",
          message: `Insufficient stock for ${product.name}`
        });
      }
      totalAmount += product.price * item.quantity;
    }

    const shippingCharge = calculateShipping(totalAmount);
    const grandTotal = totalAmount + shippingCharge;

    // Stock decrement
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { mainStock: -item.quantity }
      });
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      priceAtPurchase: item.productId.price
    }));

    const order = await Order.create({
      userId,
      items: orderItems,
      shippingAddress,
      paymentMethod: "ONLINE",
      paymentIntentId,
      paymentStatus: "PAID",
      totalAmount,
      shippingCharge,
      grandTotal,
      status: "CONFIRMED"
    });

    // Cart clear
    cart.items = [];
    await cart.save();

    // ── Email Notification ──
    try {
      const user = await User.findById(userId);
      if (user?.email) {
        const populatedOrder = await Order.findById(order._id).populate(
          "items.productId",
          "name price"
        );

        const emailItemsList = populatedOrder.items.map((i) => ({
          name: i.productId?.name || "Product",
          quantity: i.quantity,
          price: i.priceAtPurchase
        }));

        const html = orderConfirmationEmail({
          userName: user.name,
          orderId: order._id.toString(),
          items: emailItemsList,
          shippingAddress,
          paymentMethod: "ONLINE",
          totalAmount,
          shippingCharge,
          grandTotal
        });

        const invoiceMarkup = buildInvoiceHtml({ order: populatedOrder, user });

        await sendEmail({
          to: user.email,
          subject: `✅ Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()}`,
          html: `${html}<hr />${invoiceMarkup}`
        });
      }
    } catch (emailErr) {
      console.log("Order email error:", emailErr);
    }

    return res.status(201).json({
      status: "success",
      data: order
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};

// ─────────────────────────────────────────────────
// Get Publishable Key
// ─────────────────────────────────────────────────
export const GetPublishableKey = async (req, res) => {
  return res.status(200).json({
    status: "success",
    publishableKey: process.env.PublishableKey?.trim() || "pk_test_dummy"
  });
};
