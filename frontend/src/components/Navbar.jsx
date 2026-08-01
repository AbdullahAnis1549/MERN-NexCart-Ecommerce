import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../features/authSlice";
import { selectCartCount, clearCart } from "../features/cartSlice";
import { selectWishlistCount, clearWishlist } from "../features/wishlistSlice";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useSelector(selectUser);
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishlist());
    navigate("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav
        className="rx-nav"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0.85rem 2.5rem",
          backgroundColor: "#131921",
          borderBottom: "2px solid #febd69",
          color: "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxSizing: "border-box",
        }}
      >
        {/* Logo - Left */}
        <Link
          to="/"
          className="rx-nav-logo"
          style={{
            fontSize: "1.4rem",
            fontWeight: "800",
            color: "#febd69",
            textDecoration: "none",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            justifySelf: "start",
          }}
        >
          <div className="rx-logo-box" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            overflow: "hidden",
            padding: "2px",
          }}>
            <img
              src="/logo.png"
              alt="NexCart Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
          </div>
          <span style={{ fontSize: "1.4rem", fontWeight: "900", color: "#febd69", letterSpacing: "0.5px" }}>
            Nex<span style={{ color: "#f97316" }}>Cart</span>
          </span>
        </Link>

        {/* Center Nav Links — Home & Shop */}
        <div className="rx-nav-links" style={{ display: "flex", gap: "2rem", alignItems: "center", justifySelf: "center" }}>
          <Link to="/" style={linkStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            <span>Home</span>
          </Link>

          <Link to="/products" style={linkStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
            <span>Shop</span>
          </Link>

          <Link to="/about" style={linkStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            <span>About Us</span>
          </Link>

          <Link to="/contact" style={linkStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            <span>Contact</span>
          </Link>
        </div>

        {/* Right — Icons + Auth */}
        <div className="rx-nav-right" style={{ display: "flex", gap: "1.5rem", alignItems: "center", justifySelf: "end" }}>

          {/* Wishlist Icon with Badge */}
          <Link to="/wishlist" style={{ ...linkStyle, position: "relative" }} title="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            {wishlistCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-10px",
                  backgroundColor: "#febd69",
                  color: "#131921",
                  padding: "1px 6px",
                  borderRadius: "9999px",
                  fontWeight: "800",
                  fontSize: "0.7rem",
                  minWidth: "18px",
                  textAlign: "center",
                }}
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon with Badge */}
          <Link to="/cart" style={{ ...linkStyle, position: "relative" }} title="Shopping Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-10px",
                  backgroundColor: "#febd69",
                  color: "#131921",
                  padding: "1px 6px",
                  borderRadius: "9999px",
                  fontWeight: "800",
                  fontSize: "0.7rem",
                  minWidth: "18px",
                  textAlign: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Divider */}
          <div className="rx-nav-divider" style={{ width: "1px", height: "24px", backgroundColor: "#2e3a52" }} />

          {/* Hamburger */}
          <button className="rx-hamburger" onClick={() => setMobileOpen(true)} aria-label="Menu">
            ☰
          </button>

          {user ? (
            <div className="rx-nav-auth" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              {/* User Orders Icon */}
              <Link to="/my-orders" style={linkStyle} title="My Orders">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              </Link>

              {/* User Name */}
              <span className="rx-nav-user-name" style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                Hi, <strong style={{ color: "#febd69" }}>{user.name?.split(" ")[0]}</strong>
              </span>

              {/* Admin Panel Link */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    color: "#131921",
                    backgroundColor: "#febd69",
                    padding: "0.35rem 0.8rem",
                    borderRadius: "6px",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                  Admin
                </Link>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #475569",
                  color: "#94a3b8",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                <span className="rx-nav-logout-label">Logout</span>
              </button>
            </div>
          ) : (
            <div className="rx-nav-auth" style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <Link
                to="/login"
                style={{
                  color: "#e2e8f0",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                <span className="rx-nav-signin-label">Sign In</span>
              </Link>
              <Link
                to="/register"
                className="rx-nav-register"
                style={{
                  backgroundColor: "#febd69",
                  color: "#131921",
                  padding: "0.4rem 1rem",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div className="rx-mobile-menu-backdrop" onClick={closeMobile} />
      )}

      {/* Mobile Drawer */}
      <div className={`rx-mobile-menu ${mobileOpen ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ color: "#febd69", fontWeight: "800", fontSize: "1.1rem" }}>Menu</span>
          <button className="rx-hamburger" onClick={closeMobile} style={{ display: "flex" }} aria-label="Close menu">
            ✕
          </button>
        </div>

        {/* Mobile Nav Links */}
        <Link to="/" className="menu-link" onClick={closeMobile}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          Home
        </Link>
        <Link to="/products" className="menu-link" onClick={closeMobile}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
          Shop
        </Link>
        <Link to="/about" className="menu-link" onClick={closeMobile}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
          About Us
        </Link>
        <Link to="/contact" className="menu-link" onClick={closeMobile}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          Contact
        </Link>

        <div style={{ borderTop: "1px solid #2e3a52", margin: "0.5rem 0", paddingTop: "0.5rem" }}>
          <Link to="/wishlist" className="menu-link" onClick={closeMobile}>❤️ Wishlist</Link>
          <Link to="/cart" className="menu-link" onClick={closeMobile}>🛒 Cart ({cartCount})</Link>
          {user && <Link to="/my-orders" className="menu-link" onClick={closeMobile}>📦 My Orders</Link>}
        </div>

        {/* Mobile Auth */}
        <div className="rx-mobile-auth">
          {user ? (
            <>
              <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Hi, <strong style={{ color: "#febd69" }}>{user.name}</strong></span>
              {user.role === "admin" && (
                <Link to="/admin" className="menu-link" onClick={closeMobile} style={{ color: "#febd69" }}>⚙️ Admin Panel</Link>
              )}
              <button
                onClick={() => { handleLogout(); closeMobile(); }}
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  background: "transparent",
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                  borderRadius: "6px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="menu-link" onClick={closeMobile}>🔑 Sign In</Link>
              <Link
                to="/register"
                onClick={closeMobile}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "0.7rem",
                  background: "#febd69",
                  color: "#131921",
                  borderRadius: "6px",
                  fontWeight: "700",
                  textDecoration: "none",
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const linkStyle = {
  color: "#e2e8f0",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "0.9rem",
  display: "flex",
  alignItems: "center",
  gap: "0.35rem",
  transition: "color 0.2s",
};

export default Navbar;