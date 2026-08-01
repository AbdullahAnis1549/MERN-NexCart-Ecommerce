import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../features/authSlice";
import { fetchWishlist, removeFromWishlist, selectWishlistItems, selectWishlistLoading } from "../features/wishlistSlice";
import { addToCart } from "../features/cartSlice";

function Wishlist() {
  const user = useSelector(selectUser);
  const items = useSelector(selectWishlistItems);
  const loading = useSelector(selectWishlistLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) dispatch(fetchWishlist());
  }, [user, dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  if (!user) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "#0f1117", minHeight: "80vh", color: "#f8fafc" }}>
        <h2 style={{ color: "#febd69", marginBottom: "1rem" }}>Your Wishlist</h2>
        <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>Please sign in to view your saved items.</p>
        <Link
          to="/login"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            backgroundColor: "#febd69",
            color: "#131921",
            borderRadius: "8px",
            fontWeight: "800",
            textDecoration: "none",
          }}
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "#0f1117", minHeight: "80vh", color: "#94a3b8" }}>
        Loading wishlist...
      </div>
    );
  }

  return (
<div className="rx-page-pad" style={{ width: "100%", minHeight: "100vh", backgroundColor: "#0f1117", padding: "2.5rem 3rem", color: "#f8fafc" }}>
      <h1 className="rx-wishlist-title" style={{ color: "#febd69", fontSize: "2rem", fontWeight: "800", marginBottom: "2rem" }}>
        ❤️ My Wishlist
      </h1>

      {items.length === 0 ? (
        <div style={{ backgroundColor: "#1e2638", border: "1px solid #2e3a52", borderRadius: "12px", padding: "3rem", textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem", marginBottom: "1.5rem" }}>Your wishlist is currently empty.</p>
          <Link
            to="/products"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              background: "linear-gradient(135deg, #febd69 0%, #f3a847 100%)",
              color: "#131921",
              borderRadius: "8px",
              fontWeight: "800",
              textDecoration: "none",
            }}
          >
            Discover Products →
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {items.map((item) => {
            if (!item.productId) return null;
            return (
              <div
                key={item.productId._id}
                style={{
                  backgroundColor: "#1e2638",
                  border: "1px solid #2e3a52",
                  borderRadius: "12px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <img
                    src={item.productId.productimage}
                    alt={item.productId.name}
                    style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "1rem" }}
                  />
                  <h3 style={{ color: "#ffffff", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{item.productId.name}</h3>
                  <p style={{ color: "#febd69", fontWeight: "800", fontSize: "1.2rem", marginBottom: "1rem" }}>
                    Rs. {item.productId.price?.toLocaleString()}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => handleAddToCart(item.productId._id)}
                    style={{
                      flex: 1,
                      padding: "0.65rem",
                      backgroundColor: "#febd69",
                      color: "#131921",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.productId._id)}
                    style={{
                      padding: "0.65rem 0.9rem",
                      backgroundColor: "transparent",
                      border: "1px solid #ef4444",
                      color: "#ef4444",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                    title="Remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Wishlist;