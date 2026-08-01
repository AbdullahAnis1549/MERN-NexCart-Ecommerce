import React from "react";
import { Link } from "react-router-dom";

function About() {
  const stats = [
    { number: "500K+", label: "Happy Customers", icon: "👥" },
    { number: "10M+", label: "Products Delivered", icon: "📦" },
    { number: "99.9%", label: "Satisfaction Rate", icon: "⭐" },
    { number: "24/7", label: "Customer Support", icon: "💬" },
  ];

  const features = [
    {
      title: "Fast & Free Shipping",
      description: "Get your orders delivered to your doorstep in express time with zero delivery charge on qualifying purchases.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#febd69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      title: "100% Secure Payments",
      description: "We use bank-grade SSL encryption and certified payment gateways to ensure your transactions are always safe.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#febd69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      title: "Authentic & Verified Products",
      description: "Every item in our store undergoes strict quality control and authenticity verification before shipment.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#febd69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      title: "Hassle-Free Returns",
      description: "Not satisfied with your order? Return it within 30 days for a full refund or instant replacement with no questions asked.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#febd69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Hero Section */}
<section
        className="rx-about-hero"
        style={{
          background: "linear-gradient(135deg, #131921 0%, #1e293b 100%)",
          padding: "5rem 2rem",
          textAlign: "center",
          borderBottom: "1px solid #334155",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span
            style={{
              backgroundColor: "rgba(254, 189, 105, 0.15)",
              color: "#febd69",
              padding: "0.4rem 1rem",
              borderRadius: "50px",
              fontSize: "0.85rem",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
              display: "inline-block",
              marginBottom: "1.5rem",
              border: "1px solid rgba(254, 189, 105, 0.3)",
            }}
          >
            About NexCart
          </span>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", color: "#ffffff", marginBottom: "1.2rem", lineHeight: "1.2" }}>
            Redefining the Future of Online Shopping
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#94a3b8", lineHeight: "1.8", marginBottom: "2.5rem" }}>
            NexCart was built with a single vision: to deliver premium products with an unparalleled customer experience. We combine cutting-edge technology, curated quality, and lightning-fast logistics to bring you seamless e-commerce excellence.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link
              to="/products"
              style={{
                backgroundColor: "#febd69",
                color: "#131921",
                padding: "0.85rem 2rem",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "1rem",
                textDecoration: "none",
                transition: "transform 0.2s, backgroundColor 0.2s",
                display: "inline-block",
              }}
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section style={{ maxWidth: "1200px", margin: "-2.5rem auto 4rem auto", padding: "0 1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
            backgroundColor: "#1e293b",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
            border: "1px solid #334155",
          }}
        >
          {stats.map((stat, idx) => (
            <div key={idx} style={{ textAlign: "center", padding: "1rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{stat.icon}</div>
              <div style={{ fontSize: "2.2rem", fontWeight: "800", color: "#febd69" }}>{stat.number}</div>
              <div style={{ fontSize: "0.95rem", color: "#94a3b8", fontWeight: "500", marginTop: "0.2rem" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Mission & Values */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem 5rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#ffffff", marginBottom: "0.8rem" }}>
            Why Choose NexCart?
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>
            Our commitment to quality, trust, and continuous innovation sets us apart in today’s retail industry.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#1e293b",
                padding: "2rem",
                borderRadius: "14px",
                border: "1px solid #334155",
                transition: "transform 0.2s",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "rgba(254, 189, 105, 0.1)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  border: "1px solid rgba(254, 189, 105, 0.2)",
                }}
              >
                {feature.icon}
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#ffffff", marginBottom: "0.6rem" }}>
                {feature.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6" }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section style={{ padding: "4rem 1.5rem 6rem 1.5rem", textAlign: "center", borderTop: "1px solid #334155" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#ffffff", marginBottom: "1rem" }}>
            Ready to experience better shopping?
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", marginBottom: "2rem" }}>
            Join thousands of happy customers who rely on NexCart for their daily tech, fashion, and lifestyle needs.
          </p>
          <Link
            to="/products"
            style={{
              backgroundColor: "#febd69",
              color: "#131921",
              padding: "0.9rem 2.2rem",
              borderRadius: "8px",
              fontWeight: "800",
              fontSize: "1.05rem",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Start Shopping Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
