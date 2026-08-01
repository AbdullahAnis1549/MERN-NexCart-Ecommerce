import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axios";
import { selectUser } from "../features/authSlice";

function MyOrders() {
  const user = useSelector(selectUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchOrders = () => {
    api
      .get("/order/my-orders")
      .then((res) => setOrders(res.data.data))
      .catch((err) => {
        setError("Failed to load orders.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) fetchOrders();
    else setLoading(false);
  }, [user]);

  const handleCancel = async (orderId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmed) return;

    try {
      await api.patch(`/order/cancel/${orderId}`);
      setMessage("Order cancelled successfully.");
      fetchOrders();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to cancel order.");
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "#0f1117", minHeight: "80vh", color: "#f8fafc" }}>
        <h2 style={{ color: "#febd69", marginBottom: "1rem" }}>My Orders</h2>
        <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>Please sign in to view your order history.</p>
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
        Loading order history...
      </div>
    );
  }

  return (
<div className="rx-page-pad" style={{ width: "100%", minHeight: "100vh", backgroundColor: "#0f1117", padding: "2.5rem 3rem", color: "#f8fafc" }}>
      <h1 className="rx-orders-title" style={{ color: "#febd69", fontSize: "2rem", fontWeight: "800", marginBottom: "2rem" }}>
        📦 My Orders
      </h1>

      {message && (
        <div style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "0.8rem 1.2rem", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.8rem 1.2rem", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div style={{ backgroundColor: "#1e2638", border: "1px solid #2e3a52", borderRadius: "12px", padding: "3rem", textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem", marginBottom: "1.5rem" }}>You haven't placed any orders yet.</p>
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
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              className="rx-orders-card"
              style={{
                backgroundColor: "#1e2638",
                border: "1px solid #2e3a52",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #2e3a52", paddingBottom: "1rem", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>ORDER ID: </span>
                  <span style={{ color: "#febd69", fontWeight: "700" }}>#{order._id}</span>
                </div>
                <div>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      fontSize: "0.8rem",
                      fontWeight: "800",
                      backgroundColor:
                        order.status === "DELIVERED"
                          ? "#065f46"
                          : order.status === "CANCELLED"
                          ? "#991b1b"
                          : "#854d0e",
                      color:
                        order.status === "DELIVERED"
                          ? "#34d399"
                          : order.status === "CANCELLED"
                          ? "#fca5a5"
                          : "#fef08a",
                    }}
                  >
                    STATUS: {order.status}
                  </span>
                </div>
              </div>

<div className="rx-orders-grid" style={{ display: "grid", gridTemplateColumns: "1fr 250px", gap: "1.5rem" }}>
                <div>
                  <h4 style={{ color: "#cbd5e1", fontSize: "0.9rem", marginBottom: "0.75rem" }}>ITEMS ORDERED</h4>
                  {order.items.map((item) => {
                    if (!item.productId) return null;
                    return (
                      <div key={item.productId._id} style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.75rem" }}>
                        <img
                          src={item.productId.productimage}
                          alt={item.productId.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px", border: "1px solid #2e3a52" }}
                        />
                        <div>
                          <p style={{ color: "#ffffff", fontWeight: "600", margin: 0, fontSize: "0.95rem" }}>{item.productId.name}</p>
                          <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.85rem" }}>
                            Qty: {item.quantity} × Rs. {item.priceAtPurchase?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ backgroundColor: "#131921", padding: "1rem", borderRadius: "8px", border: "1px solid #2e3a52", height: "fit-content" }}>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                    Payment: <strong style={{ color: "#ffffff" }}>{order.paymentMethod}</strong> ({order.paymentStatus})
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "0.8rem" }}>
                    Address: <span style={{ color: "#cbd5e1" }}>{order.shippingAddress}</span>
                  </p>
                  <div style={{ borderTop: "1px solid #2e3a52", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "700", color: "#ffffff" }}>Total:</span>
                    <span style={{ fontWeight: "800", color: "#febd69", fontSize: "1.1rem" }}>Rs. {order.grandTotal?.toLocaleString()}</span>
                  </div>

                  {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      style={{
                        width: "100%",
                        marginTop: "0.8rem",
                        padding: "0.4rem",
                        backgroundColor: "transparent",
                        border: "1px solid #ef4444",
                        color: "#ef4444",
                        borderRadius: "6px",
                        fontWeight: "600",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;