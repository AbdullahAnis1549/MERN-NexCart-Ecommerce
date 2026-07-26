import Cart from "../Models/CartSchema.js";
import Wishlist from "../Models/WishlistSchema.js";
import Product from "../Models/ProductSchema.js";

// -----------------------
// Cart
// -----------------------
export const AddToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        status: "fail",
        message: "productId is required"
      });
    }

    const qty = quantity === undefined ? 1 : quantity;

    if (qty === null || qty === undefined || Number(qty) < 1) {
      return res.status(400).json({
        status: "fail",
        message: "quantity must be >= 1"
      });
    }

    // Ensure product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found"
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity: Number(qty) }]
      });
    } else {
      const existing = cart.items.find((i) => i.productId.toString() === productId);
      if (existing) {
        existing.quantity += Number(qty);
      } else {
        cart.items.push({ productId, quantity: Number(qty) });
      }
      await cart.save();
    }

    const populated = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "catid" }
    });

    return res.status(200).json({
      status: "success",
      data: populated
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

export const RemoveFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({
        status: "success",
        message: "Cart is empty"
      });
    }

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();

    const populated = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "catid" }
    });

    return res.status(200).json({
      status: "success",
      data: populated
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

export const GetCart = async (req, res) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "catid" }
    });

    return res.status(200).json({
      status: "success",
      data: cart || { userId, items: [] }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

export const UpdateCartQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        status: "fail",
        message: "quantity is required"
      });
    }

    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty < 1) {
      return res.status(400).json({
        status: "fail",
        message: "quantity must be >= 1"
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        status: "fail",
        message: "Cart not found"
      });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Product not in cart"
      });
    }

    item.quantity = qty;
    await cart.save();

    const populated = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "catid" }
    });

    return res.status(200).json({
      status: "success",
      data: populated
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

// -----------------------
// Wishlist
// -----------------------
export const AddToWishlist = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        status: "fail",
        message: "productId is required"
      });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found"
      });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        items: [{ productId }]
      });
    } else {
      const exists = wishlist.items.some((i) => i.productId.toString() === productId);
      if (!exists) {
        wishlist.items.push({ productId });
        await wishlist.save();
      }
    }

    const populated = await Wishlist.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "catid" }
    });

    return res.status(200).json({
      status: "success",
      data: populated
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

export const RemoveFromWishlist = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(200).json({
        status: "success",
        message: "Wishlist is empty"
      });
    }

    wishlist.items = wishlist.items.filter((i) => i.productId.toString() !== productId);
    await wishlist.save();

    const populated = await Wishlist.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "catid" }
    });

    return res.status(200).json({
      status: "success",
      data: populated
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

export const GetWishlist = async (req, res) => {
  try {
    const userId = req.id;

    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "catid" }
    });

    return res.status(200).json({
      status: "success",
      data: wishlist || { userId, items: [] }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

