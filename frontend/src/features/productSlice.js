import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Async Thunk: Fetch All Products (PUBLIC - no login needed)
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { search = "", catid = "", minPrice = "", maxPrice = "", isBestSeller = "", isFeatured = "", page = 1, limit = 100 } = queryParams;
      let url = `/product/get?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (catid) url += `&catid=${catid}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (isBestSeller) url += `&isBestSeller=${isBestSeller}`;
      if (isFeatured) url += `&isFeatured=${isFeatured}`;

      const res = await api.get(url);
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);

// Async Thunk: Create Product (Admin Only)
export const createProductThunk = createAsyncThunk(
  "products/createProduct",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.post("/admin/products/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(fetchProducts());
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create product");
    }
  }
);

// Async Thunk: Update Product (Admin Only)
export const updateProductThunk = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.patch(`/admin/products/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(fetchProducts());
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update product");
    }
  }
);

// Async Thunk: Delete Product (Admin Only)
export const deleteProductThunk = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/admin/products/del/${id}`);
      dispatch(fetchProducts());
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectAllProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;

export default productSlice.reducer;
