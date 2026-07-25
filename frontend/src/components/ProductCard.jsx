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
        }}
      >
        ♥
      </button>

      <img
        src={imageSrc}
        alt={product.name}
        style={{ width: "100%", height: "170px", objectFit: "cover", borderRadius: "8px" }}
      />
      <h3 style={{ fontSize: "1rem", color: "#f8fafc", margin: 0, fontWeight: "600" }}>{product.name}</h3>
      <p style={{ margin: 0, color: "#febd69", fontWeight: "800", fontSize: "1.1rem" }}>
        Rs. {product.price?.toLocaleString()}
      </p>

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
          marginTop: "auto",
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