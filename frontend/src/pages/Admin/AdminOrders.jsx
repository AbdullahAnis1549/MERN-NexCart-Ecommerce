import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAdminOrders,
  updateOrderStatusThunk,
  selectAdminOrders,
  selectOrdersLoading,
  selectOrdersError,
} from "../../features/orderSlice";

function AdminOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAdminOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State for Order Details
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatusId(orderId);
      await dispatch(updateOrderStatusThunk({ orderId, status: newStatus })).unwrap();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Failed to update status.");
      console.error(err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const customerName = o.userId?.name || "";
    const orderIdStr = o._id || "";
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderIdStr.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>📋 Customer Orders ({orders.length})</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search by customer or Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-control"
              style={{ width: "auto" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading orders...</div>
        ) : error ? (
          <div style={{ padding: "2rem", color: "red" }}>{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", color: "#64748b" }}>
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <strong style={{ color: "#0284c7" }}>
                          #{order._id.substring(order._id.length - 6).toUpperCase()}
                        </strong>
                      </td>
                      <td>
                        <strong>{order.userId?.name || "Guest Customer"}</strong>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {order.userId?.email || ""}
                        </div>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className="badge badge-user">{order.paymentMethod || "COD"}</span>
                      </td>
                      <td>
                        <strong>Rs. {order.grandTotal?.toLocaleString() || order.totalAmount?.toLocaleString()}</strong>
                      </td>
                      <td>
                        <select
                          value={order.status}
                          disabled={updatingStatusId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="form-control"
                          style={{
                            padding: "0.25rem 0.5rem",
                            fontSize: "0.8rem",
                            fontWeight: "700",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="REFUNDED">REFUNDED</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn-action-edit" onClick={() => openDetailsModal(order)}>
                          👁️ View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: "700px" }}>
            <div className="modal-header">
              <h3>📦 Order Details #{selectedOrder._id.substring(selectedOrder._id.length - 6).toUpperCase()}</h3>
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "#0f172a" }}>👤 Customer Info</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>
                    <strong>Name:</strong> {selectedOrder.userId?.name || "N/A"}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>
                    <strong>Email:</strong> {selectedOrder.userId?.email || "N/A"}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>
                    <strong>Phone:</strong> {selectedOrder.userId?.phone || "N/A"}
                  </p>
                </div>

                <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "#0f172a" }}>🏠 Shipping Address</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem" }}>
                    {selectedOrder.shippingAddress || "No address provided"}
                  </p>
                </div>
              </div>

              <h4 style={{ margin: "0 0 0.75rem 0" }}>Purchased Items</h4>
              <table className="admin-table" style={{ marginBottom: "1.5rem" }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.productId?.name || "Product Item"}</td>
                      <td>Rs. {item.priceAtPurchase || item.productId?.price}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <strong>Rs. {(item.priceAtPurchase || item.productId?.price || 0) * item.quantity}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ textAlign: "right", borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
                <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                  Shipping Fee: Rs. {selectedOrder.shippingCharge || 0}
                </p>
                <h3 style={{ margin: "0.5rem 0", color: "#0f172a" }}>
                  Grand Total: Rs. {selectedOrder.grandTotal?.toLocaleString() || selectedOrder.totalAmount?.toLocaleString()}
                </h3>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
