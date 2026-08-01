import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{ backgroundColor: "#131921", color: "#94a3b8", borderTop: "2px solid #febd69", fontFamily: "sans-serif" }}>
{/* Main Footer Links */}
      <div
        className="rx-footer-grid"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3.5rem 2rem 2.5rem 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2.5rem",
        }}
      >
        {/* Brand Info */}
        <div>
          <Link
            to="/"
            style={{
              fontSize: "1.4rem",
              fontWeight: "900",
              color: "#febd69",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/logo.png" alt="NexCart Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <span>
              Nex<span style={{ color: "#f97316" }}>Cart</span>
            </span>
          </Link>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "#94a3b8" }}>
            Your ultimate destination for premium quality products, fast delivery, and unbeatable customer service.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: "#ffffff", fontSize: "1.05rem", fontWeight: "700", marginBottom: "1.2rem" }}>Quick Links</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.9rem" }}>
            <li><Link to="/" style={footerLinkStyle}>Home</Link></li>
            <li><Link to="/products" style={footerLinkStyle}>Shop</Link></li>
            <li><Link to="/about" style={footerLinkStyle}>About Us</Link></li>
            <li><Link to="/contact" style={footerLinkStyle}>Contact Us</Link></li>

          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 style={{ color: "#ffffff", fontSize: "1.05rem", fontWeight: "700", marginBottom: "1.2rem" }}>Customer Support</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.9rem" }}>
            <li><Link to="/my-orders" style={footerLinkStyle}>Track My Order</Link></li>
            <li><span style={{ cursor: "pointer", color: "#94a3b8" }}>Privacy Policy</span></li>
            <li><span style={{ cursor: "pointer", color: "#94a3b8" }}>Terms of Service</span></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ color: "#ffffff", fontSize: "1.05rem", fontWeight: "700", marginBottom: "1.2rem" }}>Contact Us</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem", color: "#94a3b8" }}>
            <p style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              📌 <span>123 Tech Plaza, E-Commerce Way</span>
            </p>
            <p style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              📧 <span>support@nexcart.com</span>
            </p>
            <p style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              📞 <span>+1 (800) 555-NEXCART</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div style={{ backgroundColor: "#0b0e14", padding: "1.2rem 2rem", textAlign: "center", fontSize: "0.85rem", color: "#64748b", borderTop: "1px solid #1e293b" }}>
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} <strong style={{ color: "#febd69" }}>NexCart</strong> Inc. All Rights Reserved. Designed for premium shopping experiences.
        </p>
      </div>
    </footer>
  );
}

const footerLinkStyle = {
  color: "#94a3b8",
  textDecoration: "none",
  transition: "color 0.2s",
};

export default Footer;
