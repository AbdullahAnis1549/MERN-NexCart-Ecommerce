import Order from "../Models/OrderSchema.js";
import Cart from "../Models/CartSchema.js";
import Product from "../Models/ProductSchema.js";
import User from "../Models/UserSchema.js";
import sendEmail from "../utils/SendEmail.js";
import { orderConfirmationEmail } from "../utils/OrderEmailTemplate.js";
import { invoiceHtml as buildInvoiceHtml } from "../utils/InvoiceTemplate.js";

// ─────────────────────────────────────────────────
// Shipping Charge Logic
// Rules:
//   - 2000 se zyada order → FREE shipping
//   - 1000 - 2000         → Rs. 150
//   - 1000 se kam         → Rs. 250
// ─────────────────────────────────────────────────
export const calculateShipping = (subtotal) => {
  if (subtotal >= 2000) return 0;
  if (subtotal >= 1000) return 150;
  return 250;
};

export const PlaceOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        status: "fail",
        message: "shippingAddress is required"
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price mainStock catid"
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Cart is empty"
      });
    }

    // Stock validation + compute subtotal
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

    // Shipping charge calculate karo
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
      paymentMethod: paymentMethod || "COD",
      totalAmount,
      shippingCharge,
      grandTotal,
      status: "CONFIRMED"
    });

    // Cart clear karo
    cart.items = [];
    await cart.save();

    // ── Email Notification ──
    try {
      const user = await User.findById(userId);
      if (user?.email) {
        // populated order se product names nikaal lo
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
          paymentMethod: paymentMethod || "COD",
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
      // Email fail hone par order cancel na ho
      console.log("Order email error:", emailErr);
    }

    return res.status(201).json({
      status: "success",
      data: {
        ...order.toObject(),
        shippingCharge,
        grandTotal
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

export const GetMyOrders = async (req, res) => {
  try {
    const userId = req.id;

    const orders = await Order.find({ userId })
      .populate("items.productId", "name productimage price catid")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      data: orders
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

export const CancelOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found"
      });
    }

    if (order.status === "CANCELLED" || order.status === "DELIVERED") {
      return res.status(400).json({
        status: "fail",
        message: "Order can't be cancelled"
      });
    }

    // Stock wapas karo
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { mainStock: item.quantity }
      });
    }

    order.status = "CANCELLED";
    await order.save();

    return res.status(200).json({
      status: "success",
      data: order
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

// Admin: order status update
export const UpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["PENDING", "CONFIRMED", "CANCELLED", "SHIPPED", "DELIVERED", "REFUNDED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status"
      });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found"
      });
    }

    return res.status(200).json({
      status: "success",
      data: order
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

export const GetOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      data: orders
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

export const RefundOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ status: "fail", message: "Order not found" });
    }

    if (order.status === "REFUNDED") {
      return res.status(400).json({ status: "fail", message: "Order already refunded" });
    }

    order.status = "REFUNDED";
    order.refundReason = reason || "Requested by customer";
    await order.save();

    return res.status(200).json({ status: "success", data: order });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};
