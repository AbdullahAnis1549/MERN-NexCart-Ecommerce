import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchDashboardStats,
  selectDashboardStats,
  selectAdminLoading,
  selectAdminError,
} from "../../features/adminSlice";

function AdminDashboard() {
  const dispatch = useDispatch();
  const stats = useSelector(selectDashboardStats);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading || !stats) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading dashboard...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;

  const { counts, ordersByStatus, recentOrders = [], lowStockProducts = [] } = stats || {};

  return (
    <div>
      {/* Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <p>Total Revenue</p>
            <h2>Rs. {counts?.totalRevenue?.toLocaleString() || 0}</h2>
          </div>
          <div className="stat-icon green">💰</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Total Orders</p>
            <h2>{counts?.totalOrders || 0}</h2>
          </div>
          <div className="stat-icon blue">📋</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Total Products</p>
            <h2>{counts?.totalProducts || 0}</h2>
          </div>
          <div className="stat-icon purple">📦</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Total Users</p>
            <h2>{counts?.totalUsers || 0}</h2>
          </div>
          <div className="stat-icon amber">👥</div>
        </div>
      </div>

      {/* Orders Status Breakdown */}
      <h3 style={{ marginBottom: "1rem", color: "#0f172a" }}>Order Status Breakdown</h3>
      <div className="status-grid">
        {ordersByStatus &&
          Object.entries(ordersByStatus).map(([status, count]) => (
            <div key={status} className="status-card">
              <div className="status-name">{status}</div>
              <div className="status-count">{count}</div>
            </div>
          ))}
      </div>

      {/* Low Stock Warning */}
      {lowStockProducts.length > 0 && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ backgroundColor: "#fff7ed" }}>
            <h3 style={{ color: "#c2410c" }}>⚠️ Low Stock Alerts</h3>
            <Link to="/admin/products" className="btn-secondary" style={{ fontSize: "0.8rem" }}>
              Manage Inventory
            </Link>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Stock Left</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((p) => (
                  <tr key={p._id}>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="badge badge-cancelled">{p.mainStock} remaining</span></td>
                    <td>Rs. {p.price}</td>
                    <td>
                      <Link to="/admin/products" className="btn-action-edit">Edit Stock</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Recent Customer Orders</h3>
          <Link to="/admin/orders" className="btn-primary" style={{ fontSize: "0.85rem" }}>
            View All Orders
          </Link>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "#64748b" }}>
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                    <td>{order.userId?.name || order.shippingAddress?.fullName || "Guest Customer"}</td>
                    <td><strong>Rs. {order.grandTotal?.toLocaleString()}</strong></td>
                    <td>
                      <span className={`badge badge-${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;