import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Async Thunk: Fetch Categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/categories");
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
    }
  }
);

// Async Thunk: Create Category
export const createCategoryThunk = createAsyncThunk(
  "categories/createCategory",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.post("/admin/categories/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(fetchCategories());
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create category");
    }
  }
);

// Async Thunk: Update Category
export const updateCategoryThunk = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, formData }, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.patch(`/admin/categories/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(fetchCategories());
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update category");
    }
  }
);

// Async Thunk: Delete Category
export const deleteCategoryThunk = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/admin/categories/del/${id}`);
      dispatch(fetchCategories());
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete category");
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectAllCategories = (state) => state.categories.items;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;

export default categorySlice.reducer;
