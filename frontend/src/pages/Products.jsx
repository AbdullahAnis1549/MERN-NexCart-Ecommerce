import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from "../features/productSlice";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

function Products() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get("category") || searchParams.get("catid") || "";

  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(catParam);

  useEffect(() => {
    setSelectedCategory(catParam);
  }, [catParam]);

  useEffect(() => {
    api
      .get("/category/get")
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    dispatch(fetchProducts(selectedCategory ? { catid: selectedCategory } : {}));
  }, [dispatch, selectedCategory]);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    if (val) {
      setSearchParams({ category: val });
    } else {
      setSearchParams({});
    }
  };

  return (
<div className="rx-page-pad" style={{ padding: "2rem 2rem", width: "100%", minHeight: "100vh", backgroundColor: "#0f1117", boxSizing: "border-box" }}>
      <div className="rx-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ color: "#febd69", margin: 0, fontSize: "2rem", fontWeight: "800" }}>🛍️ Explore Products</h1>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{
            padding: "0.7rem 1.2rem",
            borderRadius: "8px",
            backgroundColor: "#131921",
            border: "1px solid #febd69",
            color: "#f8fafc",
            fontSize: "0.95rem",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <div style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Loading products...</div>}
      {error && <div style={{ color: "#ef4444" }}>{error}</div>}

{!loading && !error && (
        <div className="rx-prod-grid-4" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.5rem",
          width: "100%",
        }}>
          {products.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No products found in this category.</p>
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Products;