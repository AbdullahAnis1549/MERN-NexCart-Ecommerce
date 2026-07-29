import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("cpassword", data.cpassword);
      formData.append("phone", data.phone);

      await api.post("/user/register", formData);
      navigate("/verify", { state: { email: data.email } });
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
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
          maxWidth: "460px",
          backgroundColor: "#1e2638",
          border: "1px solid #2e3a52",
          borderRadius: "14px",
          padding: "2.5rem",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.5)",
          color: "#f8fafc",
        }}
      >
        <h1 style={{ color: "#febd69", textAlign: "center", marginBottom: "0.5rem", fontSize: "2rem", fontWeight: "800" }}>
          Create Account
        </h1>
        <p style={{ color: "#94a3b8", textAlign: "center", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Join NexCart and enjoy exclusive deals
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
              Full Name
            </label>
            <input
              placeholder="John Doe"
              {...register("name", { required: "Full Name is required" })}
              style={inputStyle}
            />
            {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
          </div>

          {/* Email Address */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
              style={inputStyle}
            />
            {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
              Phone Number
            </label>
            <input
              placeholder="03001234567"
              {...register("phone", { required: "Phone number is required" })}
              style={inputStyle}
            />
            {errors.phone && <p style={errorStyle}>{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters required" },
              })}
              style={inputStyle}
            />
            {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("cpassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              style={inputStyle}
            />
            {errors.cpassword && <p style={errorStyle}>{errors.cpassword.message}</p>}
          </div>

          {serverError && (
            <div style={{ color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.6rem", borderRadius: "6px", marginBottom: "1.25rem", fontSize: "0.85rem", textAlign: "center" }}>
              {serverError}
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
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#febd69", fontWeight: "700" }}>
            Sign In
          </Link>
        </p>
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

export default Register;