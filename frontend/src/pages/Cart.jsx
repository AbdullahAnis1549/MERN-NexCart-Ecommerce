import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../features/authSlice";
import { fetchCart, updateCartQty, removeFromCart, selectCartItems, selectCartLoading } from "../features/cartSlice";

function Cart() {
  const user = useSelector(selectUser);
  const items = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [user, dispatch]);

  const handleQuantityChange = (productId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateCartQty({ productId, quantity: newQty }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  if (!user) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "#0f1117", minHeight: "80vh", color: "#f8fafc" }}>
        <h2 style={{ color: "#febd69", marginBottom: "1rem" }}>Your Shopping Cart</h2>
        <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>Please sign in to view your cart items.</p>
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
        Loading your cart...
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);

  return (
<div className="rx-page-pad" style={{ width: "100%", minHeight: "100vh", backgroundColor: "#0f1117", padding: "2.5rem 3rem", color: "#f8fafc" }}>
      <h1 className="rx-cart-title" style={{ color: "#febd69", fontSize: "2rem", fontWeight: "800", marginBottom: "2rem" }}>
        🛒 Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div style={{ backgroundColor: "#1e2638", border: "1px solid #2e3a52", borderRadius: "12px", padding: "3rem", textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem", marginBottom: "1.5rem" }}>Your shopping cart is currently empty.</p>
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
            Explore Catalog →
          </Link>
        </div>
      ) : (
<div className="rx-cart-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }}>
          {/* Cart Items List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {items.map((item) => {
              if (!item.productId) return null;
              return (
                <div
                  key={item.productId._id}
                  className="rx-cart-item"
                  style={{
                    backgroundColor: "#1e2638",
                    border: "1px solid #2e3a52",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                  }}
                >
                  <img
                    src={item.productId.productimage}
                    alt={item.productId.name}
                    className="rx-cart-item-img"
                    style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "8px", border: "1px solid #2e3a52" }}
                  />

                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: "#ffffff", fontSize: "1.1rem", marginBottom: "0.4rem" }}>{item.productId.name}</h3>
                    <p style={{ color: "#febd69", fontWeight: "700", fontSize: "1rem" }}>Rs. {item.productId.price?.toLocaleString()}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: "flex", alignItems: "center", backgroundColor: "#131921", border: "1px solid #2e3a52", borderRadius: "6px" }}>
                    <button
                      onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                      style={{ padding: "0.4rem 0.8rem", backgroundColor: "transparent", color: "#ffffff", border: "none", cursor: "pointer", fontWeight: "bold" }}
                    >
                      -
                    </button>
                    <span style={{ padding: "0 0.8rem", color: "#febd69", fontWeight: "700" }}>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                      style={{ padding: "0.4rem 0.8rem", backgroundColor: "transparent", color: "#ffffff", border: "none", cursor: "pointer", fontWeight: "bold" }}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
<div className="rx-cart-subtotal" style={{ width: "120px", textAlign: "right" }}>
                    <p style={{ color: "#ffffff", fontWeight: "800", fontSize: "1.1rem", margin: 0 }}>
                      Rs. {(item.productId.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.productId._id)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      padding: "0.5rem",
                    }}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Summary Box */}
          <div
            style={{
              backgroundColor: "#1e2638",
              border: "1px solid #2e3a52",
              borderRadius: "12px",
              padding: "1.75rem",
              height: "fit-content",
            }}
          >
            <h2 style={{ color: "#febd69", fontSize: "1.3rem", fontWeight: "800", marginBottom: "1.25rem" }}>Order Summary</h2>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", color: "#cbd5e1" }}>
              <span>Subtotal</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem", color: "#cbd5e1" }}>
              <span>Shipping</span>
              <span style={{ color: "#10b981", fontWeight: "600" }}>FREE</span>
            </div>

            <div style={{ borderTop: "1px solid #2e3a52", paddingTop: "1rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ffffff" }}>Grand Total</span>
              <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "#febd69" }}>Rs. {total.toLocaleString()}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              style={{
                width: "100%",
                padding: "0.85rem",
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
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;