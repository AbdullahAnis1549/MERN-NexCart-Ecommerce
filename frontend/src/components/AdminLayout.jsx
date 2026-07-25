import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../features/authSlice";
import "../pages/Admin/Admin.css";

function AdminLayout() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>⚡ Store Admin</h2>
        </div>
        <nav className="admin-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
          >
            📊 Dashboard
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
          >
            📦 Products
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
          >
            🗂️ Categories
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
          >
            📋 Orders
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
          >
            👥 Users
          </NavLink>
          <NavLink
            to="/admin/banners"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
          >
            🖼️ Banners
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <NavLink to="/" className="btn-store-link">
            🛒 Back to Storefront
          </NavLink>
          <button className="btn-admin-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <h1>Admin Control Panel</h1>
          <div className="admin-user-profile">
            <span>Welcome, <strong>{user?.name || "Admin"}</strong></span>
            <span className="admin-user-badge">{user?.role || "admin"}</span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;