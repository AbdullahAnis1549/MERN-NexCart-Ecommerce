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
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  const fetchProductDetails = () => {
    api
      .get(`/product/get/${id}`)
      .then((res) => {
        const prod = res.data.data;
        setProduct(prod);
        // Default to first color if available and none selected yet
        if (prod?.colors?.length > 0 && !selectedColor) {
          setSelectedColor(prod.colors[0].name);
        }
      })
      .catch((err) => {
        setError("Product not found.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  // Determine current active variant stock (if variants are configured)
  const getSelectedVariant = () => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find(
      (v) =>
        (!selectedColor || v.color?.toLowerCase() === selectedColor?.toLowerCase()) &&
        (!selectedSize || v.size?.toLowerCase() === selectedSize?.toLowerCase())
    );
  };

  const selectedVariant = getSelectedVariant();

  // Calculate available stock based on variant selection
  const currentAvailableStock = (() => {
    if (!product) return 0;
    if (product.variants && product.variants.length > 0) {
      if (selectedColor && selectedSize) {
        return selectedVariant ? selectedVariant.stock : 0;
      }
    }
    return product.mainStock || 0;
  })();

  // Check if a specific size is out of stock for the selected color
  const isSizeDisabled = (size) => {
    if (!product?.variants || product.variants.length === 0) return false;
    if (selectedColor) {
      const v = product.variants.find(
        (variant) =>
          variant.color?.toLowerCase() === selectedColor.toLowerCase() &&
          variant.size?.toLowerCase() === size.toLowerCase()
      );
      return !v || v.stock <= 0;
    }
    // If no color selected yet, check if any variant with this size has stock
    const variantsWithSize = product.variants.filter(
      (v) => v.size?.toLowerCase() === size.toLowerCase()
    );
    return variantsWithSize.every((v) => v.stock <= 0);
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setValidationError("");

    // Validate required selections
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setValidationError("Please select a color before adding to cart.");
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setValidationError("Please select a size before adding to cart.");
      return;
    }

    if (currentAvailableStock <= 0) {
      setValidationError("Selected option is currently out of stock.");
      return;
    }

    dispatch(
      addToCart({
        productId: id,
        quantity,
        color: selectedColor || null,
        size: selectedSize || null,
      })
    );

    setMessage("Added to cart!");
    setTimeout(() => setMessage(""), 2500);
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

  if (error || !product) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "#0f1117", minHeight: "80vh", color: "#ef4444" }}>
        {error || "Product not found."}
      </div>
    );
  }

  return (
    <div className="rx-page-pad" style={{ width: "100%", minHeight: "100vh", backgroundColor: "#0f1117", padding: "2.5rem 3rem", color: "#f8fafc" }}>
      <Link to="/products" style={{ color: "#febd69", textDecoration: "none", fontWeight: "700", display: "inline-block", marginBottom: "1.5rem" }}>
        ← Back to Products
      </Link>

      <div className="rx-pd-layout" style={{ display: "grid", gridTemplateColumns: "minmax(300px, 450px) 1fr", gap: "3rem", backgroundColor: "#1e2638", border: "1px solid #2e3a52", borderRadius: "14px", padding: "2.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.4)", position: "relative" }}>

        {/* Sale Badge if on sale */}
        {product.isOnSale && (
          <div
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "1.5rem",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              padding: "0.35rem 0.85rem",
              borderRadius: "8px",
              fontWeight: "800",
              fontSize: "0.85rem",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.4)",
              zIndex: 2,
            }}
          >
            🔥 {product.discountPercent}% OFF
          </div>
        )}

        {/* Product Image */}
        <div>
          <img
            src={product.productimage}
            alt={product.name}
            className="rx-pd-img"
            style={{ width: "100%", height: "420px", objectFit: "cover", borderRadius: "12px", border: "1px solid #2e3a52" }}
          />
        </div>

        {/* Product Details */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h1 className="rx-pd-name" style={{ color: "#ffffff", fontSize: "2.2rem", fontWeight: "800", marginBottom: "0.5rem" }}>
              {product.name}
            </h1>

            {/* Real Rating Summary */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              {product.numReviews > 0 ? (
                <>
                  <div style={{ display: "flex", color: "#f59e0b", fontSize: "1.1rem" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {product.averageRating >= star ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span style={{ color: "#f8fafc", fontWeight: "800", fontSize: "1rem" }}>
                    {product.averageRating}
                  </span>
                  <a
                    href="#reviews-section"
                    style={{ color: "#febd69", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}
                  >
                    ({product.numReviews} customer {product.numReviews === 1 ? "review" : "reviews"})
                  </a>
                </>
              ) : (
                <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No reviews yet</span>
              )}
            </div>

            {/* Price Display */}
            <div style={{ marginBottom: "1.25rem" }}>
              {product.isOnSale ? (
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                  <span style={{ color: "#febd69", fontSize: "2rem", fontWeight: "800" }}>
                    Rs. {product.activePrice?.toLocaleString()}
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: "1.2rem", textDecoration: "line-through" }}>
                    Rs. {product.price?.toLocaleString()}
                  </span>
                  <span style={{ backgroundColor: "#dc2626", color: "#fff", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "700" }}>
                    Save {product.discountPercent}%
                  </span>
                </div>
              ) : (
                <p className="rx-pd-price" style={{ color: "#febd69", fontSize: "1.8rem", fontWeight: "800", margin: 0 }}>
                  Rs. {product.price?.toLocaleString()}
                </p>
              )}
            </div>

            <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              {product.pdescription}
            </p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", color: "#cbd5e1", fontWeight: "700", marginBottom: "0.6rem", fontSize: "0.95rem" }}>
                  Color: <span style={{ color: "#febd69" }}>{selectedColor || "Select a color"}</span>
                </label>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                  {product.colors.map((color, idx) => {
                    const isSelected = selectedColor?.toLowerCase() === color.name?.toLowerCase();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        title={color.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.4rem 0.8rem",
                          backgroundColor: isSelected ? "#1e2a3a" : "#131921",
                          border: isSelected ? "2px solid #febd69" : "1px solid #2e3a52",
                          borderRadius: "8px",
                          color: isSelected ? "#febd69" : "#cbd5e1",
                          cursor: "pointer",
                          fontWeight: isSelected ? "700" : "500",
                          fontSize: "0.85rem",
                          transition: "all 0.2s",
                        }}
                      >
                        <span
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: color.hex,
                            border: "1px solid #cbd5e1",
                            display: "inline-block",
                          }}
                        />
                        {color.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", color: "#cbd5e1", fontWeight: "700", marginBottom: "0.6rem", fontSize: "0.95rem" }}>
                  Size: <span style={{ color: "#febd69" }}>{selectedSize || "Select a size"}</span>
                </label>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  {product.sizes.map((size, idx) => {
                    const isSelected = selectedSize?.toUpperCase() === size.toUpperCase();
                    const disabled = isSizeDisabled(size);
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: isSelected ? "#febd69" : "#131921",
                          color: isSelected ? "#131921" : disabled ? "#64748b" : "#ffffff",
                          border: isSelected ? "2px solid #febd69" : "1px solid #2e3a52",
                          borderRadius: "8px",
                          fontWeight: "700",
                          fontSize: "0.9rem",
                          cursor: disabled ? "not-allowed" : "pointer",
                          opacity: disabled ? 0.4 : 1,
                          textDecoration: disabled ? "line-through" : "none",
                          transition: "all 0.2s",
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Indicator */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p
                style={{
                  color: currentAvailableStock > 0 ? "#10b981" : "#ef4444",
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  margin: 0,
                }}
              >
                {currentAvailableStock > 0
                  ? `In Stock (${currentAvailableStock} available${
                      selectedColor && selectedSize ? " for selected option" : ""
                    })`
                  : "Out of Stock for selected combination"}
              </p>
            </div>

            {/* Quantity Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
              <label style={{ color: "#cbd5e1", fontWeight: "600" }}>Quantity:</label>
              <input
                type="number"
                min="1"
                max={Math.max(1, currentAvailableStock)}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
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

          {/* Action Buttons & Feedback Messages */}
          <div>
            {validationError && (
              <div style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444", padding: "0.75rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                ⚠️ {validationError}
              </div>
            )}

            {message && (
              <div style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "0.6rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem", textAlign: "center" }}>
                {message}
              </div>
            )}

            <div className="rx-pd-btns" style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={handleAddToCart}
                disabled={currentAvailableStock <= 0}
                style={{
                  flex: 1,
                  padding: "0.9rem",
                  background: currentAvailableStock > 0
                    ? "linear-gradient(135deg, #febd69 0%, #f3a847 100%)"
                    : "#334155",
                  color: currentAvailableStock > 0 ? "#131921" : "#94a3b8",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "800",
                  fontSize: "1rem",
                  cursor: currentAvailableStock > 0 ? "pointer" : "not-allowed",
                  boxShadow: currentAvailableStock > 0 ? "0 4px 12px rgba(254, 189, 105, 0.3)" : "none",
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

      {/* Review Section with onReviewAdded callback */}
      <div id="reviews-section" style={{ marginTop: "3rem" }}>
        <div id="reviews" />
        <ReviewSection productId={id} onReviewAdded={fetchProductDetails} />
      </div>
    </div>
  );
}

export default ProductDetail;