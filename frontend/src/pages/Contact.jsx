import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    subject: "General Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const subjects = [
    "General Inquiry",
    "Order Status & Tracking",
    "Returns & Refunds",
    "Product Information",
    "Payment Issues",
    "Other",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/contact`, formData);

      if (response.data.success) {
        setStatus({
          type: "success",
          message: response.data.message || "Thank you! Your message has been sent. Check your email for confirmation.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          orderNumber: "",
          subject: "General Inquiry",
          message: "",
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Header Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #131921 0%, #1e293b 100%)",
          padding: "4rem 2rem",
          textAlign: "center",
          borderBottom: "1px solid #334155",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
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
              marginBottom: "1rem",
              border: "1px solid rgba(254, 189, 105, 0.3)",
            }}
          >
            NexCart Support Center
          </span>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "900", color: "#ffffff", marginBottom: "1rem" }}>
            Get in Touch With Us
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#94a3b8", lineHeight: "1.6" }}>
            Have a question about an order, shipping, returns, or products? Fill out the form below and our customer support team will assist you promptly.
          </p>
        </div>
      </section>

      {/* Form & Info Section */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Left: Contact Info Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={infoCardStyle}>
              <div style={iconCircleStyle}>📞</div>
              <div>
                <h4 style={{ color: "#ffffff", margin: "0 0 0.3rem 0", fontSize: "1.1rem", fontWeight: "700" }}>
                  Customer Support Phone
                </h4>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>+1 (800) 555-NEXCART</p>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Mon - Fri, 9am - 8pm EST</span>
              </div>
            </div>

            <div style={infoCardStyle}>
              <div style={iconCircleStyle}>📧</div>
              <div>
                <h4 style={{ color: "#ffffff", margin: "0 0 0.3rem 0", fontSize: "1.1rem", fontWeight: "700" }}>
                  Direct Email Inquiry
                </h4>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>support@nexcart.com</p>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Average response time: 2-4 hrs</span>
              </div>
            </div>

            <div style={infoCardStyle}>
              <div style={iconCircleStyle}>📌</div>
              <div>
                <h4 style={{ color: "#ffffff", margin: "0 0 0.3rem 0", fontSize: "1.1rem", fontWeight: "700" }}>
                  Corporate Headquarters
                </h4>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>
                  123 Tech Plaza, E-Commerce Way, NY 10001
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(254, 189, 105, 0.08)",
                border: "1px dashed rgba(254, 189, 105, 0.4)",
                borderRadius: "14px",
                padding: "1.5rem",
              }}
            >
              <h5 style={{ color: "#febd69", margin: "0 0 0.5rem 0", fontSize: "1rem" }}>💡 Quick Tip</h5>
              <p style={{ color: "#cbd5e1", margin: 0, fontSize: "0.9rem", lineHeight: "1.5" }}>
                If your inquiry is regarding an existing purchase, please mention your <strong>Order Number</strong> for faster resolution.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div
            style={{
              backgroundColor: "#1e293b",
              borderRadius: "16px",
              padding: "2.5rem",
              border: "1px solid #334155",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4)",
            }}
          >
            <h3 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#ffffff", marginBottom: "1.5rem" }}>
              Send Us a Message
            </h3>

            {status.message && (
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                  backgroundColor: status.type === "success" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  border: `1px solid ${status.type === "success" ? "#22c55e" : "#ef4444"}`,
                  color: status.type === "success" ? "#4ade80" : "#f87171",
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <span>{status.type === "success" ? "✅" : "⚠️"}</span>
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Order Number (Optional)</label>
                  <input
                    type="text"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    placeholder="e.g. #ORD-9842"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Topic / Subject *</label>
                <select name="subject" value={formData.subject} onChange={handleChange} style={inputStyle}>
                  {subjects.map((sub, idx) => (
                    <option key={idx} value={sub} style={{ backgroundColor: "#1e293b", color: "#ffffff" }}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Type your message or inquiry here..."
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#64748b" : "#febd69",
                  color: "#131921",
                  border: "none",
                  padding: "0.9rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: "800",
                  fontSize: "1rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "backgroundColor 0.2s",
                  marginTop: "0.5rem",
                }}
              >
                {loading ? "Sending Message..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "0.88rem",
  fontWeight: "600",
  color: "#cbd5e1",
  marginBottom: "0.4rem",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  backgroundColor: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box",
};

const infoCardStyle = {
  backgroundColor: "#1e293b",
  padding: "1.5rem",
  borderRadius: "14px",
  border: "1px solid #334155",
  display: "flex",
  alignItems: "center",
  gap: "1.2rem",
};

const iconCircleStyle = {
  width: "48px",
  height: "48px",
  backgroundColor: "rgba(254, 189, 105, 0.1)",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.4rem",
  border: "1px solid rgba(254, 189, 105, 0.2)",
};

export default Contact;
