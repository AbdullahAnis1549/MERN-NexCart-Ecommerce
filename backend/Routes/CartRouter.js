import express from "express";
import { Authverifyuser } from "../Middleware/Authverify.js";
import {
  AddToCart,
  GetCart,
  RemoveFromCart,
  UpdateCartQuantity,
  AddToWishlist,
  RemoveFromWishlist,
  GetWishlist
} from "../Controllers/CartControllers.js";

const CartRouter = express.Router();

// Cart routes (user specific)
CartRouter.post("/add", Authverifyuser, AddToCart);
CartRouter.delete("/remove/:productId", Authverifyuser, RemoveFromCart);
CartRouter.get("/get", Authverifyuser, GetCart);
CartRouter.patch("/qty/:productId", Authverifyuser, UpdateCartQuantity);

// Wishlist routes (user specific)
CartRouter.post("/wishlist/add", Authverifyuser, AddToWishlist);
CartRouter.delete("/wishlist/remove/:productId", Authverifyuser, RemoveFromWishlist);
CartRouter.get("/wishlist", Authverifyuser, GetWishlist);

export default CartRouter;

