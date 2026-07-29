import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectAuthLoading } from "../features/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const result = await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
      if (result?.data?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setServerError(err || "Invalid email or password");
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
        <h1 style={{ color: "#febd69", textAlign: "center", marginBottom: "0.5rem", fontSize: "2rem" }}>
          Welcome Back
        </h1>
        <p style={{ color: "#94a3b8", textAlign: "center", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Sign in to your NexCart account
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
            {errors.email && <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.3rem" }}>{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
              Password
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

          {serverError && (
            <div style={{ color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.6rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.85rem", textAlign: "center" }}>
              {serverError}
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
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#febd69", fontWeight: "700" }}>
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;