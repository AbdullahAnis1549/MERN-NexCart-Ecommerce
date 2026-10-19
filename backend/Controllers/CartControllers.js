import Cart from "../Models/CartSchema.js";
import Wishlist from "../Models/WishlistSchema.js";
import Product from "../Models/ProductSchema.js";
import { formatProduct } from "../utils/productHelper.js";

const formatCartResponse = (cart) => {
  if (!cart) return { items: [] };
  const raw = typeof cart.toObject === "function" ? cart.toObject() : { ...cart };
  const items = (raw.items || []).map((item) => {
    return {
      ...item,
      productId: item.productId ? formatProduct(item.productId) : null
    };
  });
  return {
    ...raw,
    items
  };
};

const formatWishlistResponse = (wishlist) => {
  if (!wishlist) return { items: [] };
  const raw = typeof wishlist.toObject === "function" ? wishlist.toObject() : { ...wishlist };
  const items = (raw.items || []).map((item) => {
    return {
      ...item,
      productId: item.productId ? formatProduct(item.productId) : null
    };
  });
  return {
    ...raw,
    items
  };
};

// -----------------------
// Cart
// -----------------------
export const AddToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, quantity, color, size } = req.body;

    if (!productId) {
      return res.status(400).json({
        status: "fail",
        message: "productId is required"
      });
    }

    const qty = quantity === undefined ? 1 : Number(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        status: "fail",
        message: "quantity must be >= 1"
      });
    }

    // Ensure product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found"
      });
    }

    // Validate required color/size if product has them
    if (product.colors && product.colors.length > 0 && !color) {
      return res.status(400).json({
        status: "fail",
        message: "Please select a color"
      });
    }

    if (product.sizes && product.sizes.length > 0 && !size) {
      return res.status(400).json({
        status: "fail",
        message: "Please select a size"
      });
    }

    // Validate variant stock if product has variants
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants.find(
        (v) =>
          (!color || v.color?.toLowerCase() === color?.toLowerCase()) &&
          (!size || v.size?.toLowerCase() === size?.toLowerCase())
      );
      if (!variant || variant.stock < qty) {
        return res.status(400).json({
          status: "fail",
          message: `Selected variant is out of stock (${variant ? variant.stock : 0} available)`
        });
      }
    } else if (product.mainStock < qty) {
      return res.status(400).json({
        status: "fail",
        message: `Insufficient stock (${product.mainStock} available)`
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{
          productId,
          quantity: qty,
          color: color || null,
          size: size || null
        }]
      });
    } else {
      const existing = cart.items.find(
        (i) =>
          i.productId.toString() === productId &&
          (i.color || null) === (color || null) &&
          (i.size || null) === (size || null)
      );

      if (existing) {
        existing.quantity += qty;
      } else {
        cart.items.push({
          productId,
          quantity: qty,
          color: color || null,
          size: size || null
        });
      }
      await cart.save();
    }

    const populated = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "catid" }
    });

    return res.status(200).json({
      status: "success",
      data: formatCartResponse(populated)
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
    const { productId } = req.params; // Can be item._id or productId

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({
        status: "success",
        message: "Cart is empty"
      });
    }

    // Match by item._id first, or by productId
    const initialLen = cart.items.length;
    cart.items = cart.items.filter(
      (i) => i._id?.toString() !== productId && i.productId?.toString() !== productId
    );

    if (cart.items.length !== initialLen) {
      await cart.save();
    }

    const populated = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "catid" }
    });

    return res.status(200).json({
      status: "success",
      data: formatCartResponse(populated)
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
      data: formatCartResponse(cart) || { userId, items: [] }
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
    const { productId } = req.params; // Can be item._id or productId
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

    const item =
      cart.items.find((i) => i._id?.toString() === productId) ||
      cart.items.find((i) => i.productId?.toString() === productId);

    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Product not in cart"
      });
    }

    // Validate stock
    const product = await Product.findById(item.productId);
    if (product) {
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find(
          (v) =>
            (!item.color || v.color?.toLowerCase() === item.color?.toLowerCase()) &&
            (!item.size || v.size?.toLowerCase() === item.size?.toLowerCase())
        );
        if (!variant || variant.stock < qty) {
          return res.status(400).json({
            status: "fail",
            message: `Only ${variant ? variant.stock : 0} items available for this variant`
          });
        }
      } else if (product.mainStock < qty) {
        return res.status(400).json({
          status: "fail",
          message: `Only ${product.mainStock} items available in stock`
        });
      }
    }

    item.quantity = qty;
    await cart.save();

    const populated = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "catid" }
    });

    return res.status(200).json({
      status: "success",
      data: formatCartResponse(populated)
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

