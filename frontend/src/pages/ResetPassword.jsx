import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();
  
  const password = watch("password");

  const onSubmit = async (data) => {
    setServerError("");
    setServerSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/user/resetpassword", { 
        verifycode: data.verifycode,
        password: data.password,
        cpassword: data.cpassword
      });
      setServerSuccess(res.data.message || "Password reset successfully");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
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
        padding: "2rem",
      }}
    >
      <div
        className="rx-auth-card"
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#1e2638",
          border: "1px solid #2e3a52",
          borderRadius: "14px",
          padding: "2.5rem",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.5)",
          color: "#f8fafc",
        }}
      >
        <h1 className="rx-auth-title" style={{ color: "#febd69", textAlign: "center", marginBottom: "0.5rem", fontSize: "2rem" }}>
          Reset Password
        </h1>
        <p style={{ color: "#94a3b8", textAlign: "center", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Enter the verification code sent to your email and your new password
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
              Verification Code
            </label>
            <input
              type="text"
              placeholder="e.g. 12345"
              {...register("verifycode", { required: "Verification code is required" })}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "#131921",
                border: "1px solid #2e3a52",
                borderRadius: "8px",
                color: "#ffffff",
                outline: "none",
                fontSize: "0.95rem",
              }}
            />
            {errors.verifycode && <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.3rem" }}>{errors.verifycode.message}</p>}
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "#131921",
                border: "1px solid #2e3a52",
                borderRadius: "8px",
                color: "#ffffff",
                outline: "none",
                fontSize: "0.95rem",
              }}
            />
            {errors.password && <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.3rem" }}>{errors.password.message}</p>}
          </div>
          
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("cpassword", { 
                required: "Confirm Password is required",
                validate: value => value === password || "Passwords do not match"
              })}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "#131921",
                border: "1px solid #2e3a52",
                borderRadius: "8px",
                color: "#ffffff",
                outline: "none",
                fontSize: "0.95rem",
              }}
            />
            {errors.cpassword && <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.3rem" }}>{errors.cpassword.message}</p>}
          </div>

          {serverError && (
            <div style={{ color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.6rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.85rem", textAlign: "center" }}>
              {serverError}
            </div>
          )}
          
          {serverSuccess && (
            <div style={{ color: "#22c55e", backgroundColor: "rgba(34, 197, 94, 0.1)", padding: "0.6rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.85rem", textAlign: "center" }}>
              {serverSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          Remembered your password?{" "}
          <Link to="/login" style={{ color: "#febd69", fontWeight: "700" }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
