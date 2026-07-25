import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await api.get("/cart/get");
  return res.data.data;
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { dispatch }) => {
    await api.post("/cart/add", { productId, quantity });
    dispatch(fetchCart()); // add hone ke baad fresh cart mangwao
  }
);

export const updateCartQty = createAsyncThunk(
  "cart/updateCartQty",
  async ({ productId, quantity }, { dispatch }) => {
    await api.patch(`/cart/qty/${productId}`, { quantity });
    dispatch(fetchCart());
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { dispatch }) => {
    await api.delete(`/cart/remove/${productId}`);
    dispatch(fetchCart());
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    // Logout hone par cart bhi khaali kar do
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export default cartSlice.reducer;