import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../features/authSlice";
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from "../features/wishlistSlice";
import { getImageUrl } from "../utils/getImageUrl";

function ProductCard({ product }) {
  const user = useSelector(selectUser);
  const isWishlisted = useSelector(selectIsInWishlist(product._id));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleWishlistToggle = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  };

  const cardStyle = {
    backgroundColor: "#1e2638",
    border: "1px solid #2e3a52",
    borderRadius: "12px",
    padding: "1.25rem",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
    transition: "transform 0.2s, border-color 0.2s",
    boxSizing: "border-box",
  };

  const imageSrc = getImageUrl(product.productimage) || "https://via.placeholder.com/200?text=No+Image";

  return (
    <div style={cardStyle}>
      {/* Sale Discount Badge */}
      {product.isOnSale && (
        <span
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            backgroundColor: "#dc2626",
            color: "#ffffff",
            padding: "0.25rem 0.6rem",
            borderRadius: "6px",
            fontWeight: "800",
            fontSize: "0.75rem",
            letterSpacing: "0.5px",
            boxShadow: "0 2px 8px rgba(220, 38, 38, 0.4)",
            zIndex: 1,
          }}
        >
          {product.discountPercent}% OFF
        </span>
      )}

      <button
        onClick={handleWishlistToggle}
        title="Toggle Wishlist"
        style={{
          position: "absolute",
          top: "0.75rem",
          right: "0.75rem",
          background: "rgba(19, 25, 33, 0.8)",
          border: "1px solid #2e3a52",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          cursor: "pointer",
          color: isWishlisted ? "#ef4444" : "#94a3b8",
          fontSize: "1.1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
          zIndex: 2,
        }}
      >
        ♥
      </button>

      <img
        src={imageSrc}
        alt={product.name}
        style={{ width: "100%", height: "170px", objectFit: "cover", borderRadius: "8px" }}
      />

      <h3 style={{ fontSize: "1rem", color: "#f8fafc", margin: 0, fontWeight: "600", lineHeight: "1.3" }}>
        {product.name}
      </h3>

      {/* Real Rating from DB */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", minHeight: "18px" }}>
        {product.numReviews > 0 ? (
          <>
            <div style={{ display: "flex", color: "#f59e0b", fontSize: "0.85rem" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {product.averageRating >= star
                    ? "★"
                    : product.averageRating >= star - 0.5
                    ? "★"
                    : "☆"}
                </span>
              ))}
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#f8fafc" }}>
              {product.averageRating}
            </span>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              ({product.numReviews})
            </span>
          </>
        ) : (
          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>No reviews yet</span>
        )}
      </div>

      {/* Color Swatches Preview */}
      {product.colors && product.colors.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
          {product.colors.slice(0, 5).map((color, idx) => (
            <span
              key={idx}
              title={color.name}
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: color.hex,
                border: "1px solid #94a3b8",
                display: "inline-block",
                boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
              }}
            />
          ))}
          {product.colors.length > 5 && (
            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>+{product.colors.length - 5}</span>
          )}
        </div>
      )}

      {/* Sizes Preview */}
      {product.sizes && product.sizes.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexWrap: "wrap" }}>
          {product.sizes.slice(0, 4).map((size, idx) => (
            <span
              key={idx}
              style={{
                fontSize: "0.7rem",
                padding: "0.1rem 0.35rem",
                borderRadius: "4px",
                backgroundColor: "#131921",
                border: "1px solid #2e3a52",
                color: "#cbd5e1",
              }}
            >
              {size}
            </span>
          ))}
          {product.sizes.length > 4 && (
            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>+{product.sizes.length - 4}</span>
          )}
        </div>
      )}

      {/* Dynamic Price with Active Sale Handling */}
      <div style={{ marginTop: "auto" }}>
        {product.isOnSale ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ color: "#febd69", fontWeight: "800", fontSize: "1.15rem" }}>
              Rs. {product.activePrice?.toLocaleString()}
            </span>
            <span style={{ color: "#94a3b8", textDecoration: "line-through", fontSize: "0.85rem" }}>
              Rs. {product.price?.toLocaleString()}
            </span>
          </div>
        ) : (
          <p style={{ margin: 0, color: "#febd69", fontWeight: "800", fontSize: "1.1rem" }}>
            Rs. {product.price?.toLocaleString()}
          </p>
        )}
      </div>

      <Link
        to={`/products/${product._id}`}
        style={{
          display: "inline-block",
          textAlign: "center",
          backgroundColor: "#131921",
          color: "#febd69",
          border: "1px solid #febd69",
          padding: "0.5rem",
          borderRadius: "6px",
          fontWeight: "700",
          textDecoration: "none",
          marginTop: "0.5rem",
          fontSize: "0.85rem",
          transition: "all 0.2s",
        }}
      >
        View Details
      </Link>
    </div>
  );
}

export default ProductCard;