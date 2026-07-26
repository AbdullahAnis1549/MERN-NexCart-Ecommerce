import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await api.get("/cart/get");
  return res.data.data;
});

// Ab dobara fetchCart() call nahi karte — backend ka apna response
// (jo already updated + populated cart deta hai) seedha state me daal rahe hain.
// Isse har action ek hi network call me complete ho jata hai, do nahi.
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }) => {
    const res = await api.post("/cart/add", { productId, quantity });
    return res.data.data;
  }
);

export const updateCartQty = createAsyncThunk(
  "cart/updateCartQty",
  async ({ productId, quantity }) => {
    const res = await api.patch(`/cart/qty/${productId}`, { quantity });
    return res.data.data;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId) => {
    const res = await api.delete(`/cart/remove/${productId}`);
    return res.data.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
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
      })
      // Teeno mutation actions ka response bhi isi tarah state me jata hai
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(updateCartQty.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      });
  },
});

export const { clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export default cartSlice.reducer;
