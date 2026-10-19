import Order from "../Models/OrderSchema.js";
import Cart from "../Models/CartSchema.js";
import Product from "../Models/ProductSchema.js";
import User from "../Models/UserSchema.js";
import sendEmail from "../utils/SendEmail.js";
import { orderConfirmationEmail } from "../utils/OrderEmailTemplate.js";
import { invoiceHtml as buildInvoiceHtml } from "../utils/InvoiceTemplate.js";
import { formatProduct } from "../utils/productHelper.js";

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

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Cart is empty"
      });
    }

    // Stock validation + compute subtotal using active sale price
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (!product) {
        return res.status(404).json({ status: "fail", message: "Product not found" });
      }

      // Check variant stock if product has variants
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find(
          (v) =>
            (!item.color || v.color?.toLowerCase() === item.color?.toLowerCase()) &&
            (!item.size || v.size?.toLowerCase() === item.size?.toLowerCase())
        );
        if (!variant || variant.stock < item.quantity) {
          return res.status(400).json({
            status: "fail",
            message: `Insufficient stock for ${product.name} (${item.color || ""} ${item.size || ""})`
          });
        }
      } else {
        if (product.mainStock < item.quantity) {
          return res.status(400).json({
            status: "fail",
            message: `Insufficient stock for ${product.name}`
          });
        }
      }

      const formatted = formatProduct(product);
      const unitPrice = formatted.activePrice;
      totalAmount += unitPrice * item.quantity;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        color: item.color || null,
        size: item.size || null,
        priceAtPurchase: unitPrice
      });
    }

    // Shipping charge calculate karo
    const shippingCharge = calculateShipping(totalAmount);
    const grandTotal = totalAmount + shippingCharge;

    // Stock decrement + mainStock sync
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (product) {
        if (product.variants && product.variants.length > 0) {
          const variant = product.variants.find(
            (v) =>
              (!item.color || v.color?.toLowerCase() === item.color?.toLowerCase()) &&
              (!item.size || v.size?.toLowerCase() === item.size?.toLowerCase())
          );
          if (variant) {
            variant.stock = Math.max(0, variant.stock - item.quantity);
          }
          product.mainStock = product.variants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
          await product.save();
        } else {
          await Product.findByIdAndUpdate(product._id, {
            $inc: { mainStock: -item.quantity }
          });
        }
      }
    }

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
      .populate("items.productId")
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map((order) => {
      const orderObj = order.toObject();
      orderObj.items = (orderObj.items || []).map((item) => ({
        ...item,
        productId: item.productId ? formatProduct(item.productId) : null
      }));
      return orderObj;
    });

    return res.status(200).json({
      status: "success",
      data: formattedOrders
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

    // Stock wapas karo (variant-aware)
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        if (product.variants && product.variants.length > 0) {
          const variant = product.variants.find(
            (v) =>
              (!item.color || v.color?.toLowerCase() === item.color?.toLowerCase()) &&
              (!item.size || v.size?.toLowerCase() === item.size?.toLowerCase())
          );
          if (variant) {
            variant.stock += item.quantity;
          }
          product.mainStock = product.variants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
          await product.save();
        } else {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { mainStock: item.quantity }
          });
        }
      }
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
