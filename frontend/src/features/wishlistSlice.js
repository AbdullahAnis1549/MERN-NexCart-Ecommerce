import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async () => {
  const res = await api.get("/cart/wishlist");
  return res.data.data;
});

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { dispatch }) => {
    await api.post("/cart/wishlist/add", { productId });
    dispatch(fetchWishlist());
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",async (productId, { dispatch }) => {
    await api.delete(`/cart/wishlist/remove/${productId}`);
    dispatch(fetchWishlist());
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistCount = (state) => state.wishlist.items?.length || 0;
// Ek helper — kisi product ka ID wishlist me hai ya nahi, ye check karne ke liye
export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.items.some((item) => item.productId._id === productId);

export default wishlistSlice.reducer;