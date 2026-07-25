import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const emailFromRegister = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: emailFromRegister, verifycode: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await api.post("/user/verify", {
        email: data.email,
        verifycode: data.verifycode,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Verification failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "#0f1117",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#1e2638",
          border: "1px solid #2e3a52",
          borderRadius: "14px",
          padding: "2.5rem",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.5)",
          color: "#f8fafc",
        }}
      >
        <h1 style={{ color: "#febd69", textAlign: "center", marginBottom: "0.5rem", fontSize: "1.8rem", fontWeight: "800" }}>
          Verify Your Email
        </h1>
        <p style={{ color: "#94a3b8", textAlign: "center", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Please enter the verification code sent to your email.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              {...register("email", { required: "Email is required" })}
              style={inputStyle}
            />
            {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
              Verification Code
            </label>
            <input
              placeholder="Enter Code"
              {...register("verifycode", { required: "Verification code is required" })}
              style={inputStyle}
            />
            {errors.verifycode && <p style={errorStyle}>{errors.verifycode.message}</p>}
          </div>

          {serverError && (
            <div style={{ color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.6rem", borderRadius: "6px", marginBottom: "1.25rem", fontSize: "0.85rem", textAlign: "center" }}>
              {serverError}
            </div>
          )}

          {success && (
            <div style={{ color: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "0.6rem", borderRadius: "6px", marginBottom: "1.25rem", fontSize: "0.85rem", textAlign: "center" }}>
              ✅ Email verified successfully! Redirecting to login...
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
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
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  backgroundColor: "#131921",
  border: "1px solid #2e3a52",
  borderRadius: "8px",
  color: "#ffffff",
  outline: "none",
  fontSize: "0.95rem",
};

const errorStyle = {
  color: "#ef4444",
  fontSize: "0.8rem",
  marginTop: "0.3rem",
};

export default Verify;