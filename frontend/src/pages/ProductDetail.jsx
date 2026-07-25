import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../api/axios";
import { selectUser } from "../features/authSlice";
import { addToCart } from "../features/cartSlice";
import { addToWishlist } from "../features/wishlistSlice";
import ReviewSection from "../components/ReviewSection";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get(`/product/get/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch((err) => {
        setError("Product not found.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ productId: id, quantity }));
    setMessage("Added to cart!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleAddToWishlist = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(addToWishlist(id));
    setMessage("Added to wishlist!");
    setTimeout(() => setMessage(""), 2000);
  };

  if (loading) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "#0f1117", minHeight: "80vh", color: "#94a3b8" }}>
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "#0f1117", minHeight: "80vh", color: "#ef4444" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#0f1117", padding: "2.5rem 3rem", color: "#f8fafc" }}>
      <Link to="/products" style={{ color: "#febd69", textDecoration: "none", fontWeight: "700", display: "inline-block", marginBottom: "1.5rem" }}>
        ← Back to Products
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 450px) 1fr", gap: "3rem", backgroundColor: "#1e2638", border: "1px solid #2e3a52", borderRadius: "14px", padding: "2.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.4)" }}>
        {/* Product Image */}
        <div>
          <img
            src={product.productimage}
            alt={product.name}
            style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "12px", border: "1px solid #2e3a52" }}
          />
        </div>

        {/* Product Details */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ color: "#ffffff", fontSize: "2.2rem", fontWeight: "800", marginBottom: "0.75rem" }}>{product.name}</h1>
            <p style={{ color: "#febd69", fontSize: "1.8rem", fontWeight: "800", marginBottom: "1.25rem" }}>
              Rs. {product.price?.toLocaleString()}
            </p>
            <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              {product.pdescription}
            </p>
            <p style={{ color: product.mainStock > 0 ? "#10b981" : "#ef4444", fontWeight: "700", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              {product.mainStock > 0 ? `In Stock (${product.mainStock} available)` : "Out of Stock"}
            </p>

            {/* Quantity Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
              <label style={{ color: "#cbd5e1", fontWeight: "600" }}>Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.mainStock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{
                  width: "70px",
                  padding: "0.5rem",
                  backgroundColor: "#131921",
                  border: "1px solid #2e3a52",
                  borderRadius: "6px",
                  color: "#ffffff",
                  textAlign: "center",
                  fontSize: "1rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            {message && (
              <div style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "0.6rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem", textAlign: "center" }}>
                {message}
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={handleAddToCart}
                disabled={product.mainStock <= 0}
                style={{
                  flex: 1,
                  padding: "0.9rem",
                  background: "linear-gradient(135deg, #febd69 0%, #f3a847 100%)",
                  color: "#131921",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "800",
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(254, 189, 105, 0.3)",
                }}
              >
                🛒 Add to Cart
              </button>

              <button
                onClick={handleAddToWishlist}
                style={{
                  padding: "0.9rem 1.5rem",
                  backgroundColor: "transparent",
                  border: "1px solid #febd69",
                  color: "#febd69",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                ❤️ Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div style={{ marginTop: "3rem" }}>
        <ReviewSection productId={id} />
      </div>
    </div>
  );
}

export default ProductDetail;