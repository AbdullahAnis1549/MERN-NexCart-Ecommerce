import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import api from "../api/axios";
import { getStripePromise } from "../api/stripe";
import OnlinePaymentForm from "../components/OnlinePaymentForm";

function Checkout() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [serverError, setServerError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (paymentMethod === "ONLINE" && !stripePromise) {
      getStripePromise().then(setStripePromise);
    }
  }, [paymentMethod, stripePromise]);

  const onSubmitCOD = async (data) => {
    setServerError("");
    setPlacing(true);
    try {
      await api.post("/order/place", {
        shippingAddress: data.shippingAddress,
        paymentMethod: "COD",
      });
      navigate("/my-orders");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacing(false);
    }
  };

  return (
<div
      className="rx-page-pad"
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#0f1117",
        padding: "2.5rem 3rem",
        color: "#f8fafc",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="rx-checkout-box"
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#1e2638",
          border: "1px solid #2e3a52",
          borderRadius: "14px",
          padding: "2.5rem",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.5)",
          height: "fit-content",
        }}
      >
        <h1 className="rx-checkout-title" style={{ color: "#febd69", fontSize: "2rem", fontWeight: "800", marginBottom: "1.5rem", textAlign: "center" }}>
          💳 Checkout & Payment
        </h1>

        {/* Payment Method Selector */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.95rem", color: "#cbd5e1", fontWeight: "600" }}>
            Select Payment Method:
          </label>
<div className="rx-checkout-options" style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => setPaymentMethod("COD")}
              style={{
                flex: 1,
                padding: "0.85rem",
                backgroundColor: paymentMethod === "COD" ? "#febd69" : "#131921",
                color: paymentMethod === "COD" ? "#131921" : "#ffffff",
                border: paymentMethod === "COD" ? "2px solid #febd69" : "1px solid #2e3a52",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              💵 Cash on Delivery
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("ONLINE")}
              style={{
                flex: 1,
                padding: "0.85rem",
                backgroundColor: paymentMethod === "ONLINE" ? "#febd69" : "#131921",
                color: paymentMethod === "ONLINE" ? "#131921" : "#ffffff",
                border: paymentMethod === "ONLINE" ? "2px solid #febd69" : "1px solid #2e3a52",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              💳 Pay Online (Stripe)
            </button>
          </div>
        </div>

        {paymentMethod === "COD" && (
          <form onSubmit={handleSubmit(onSubmitCOD)}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
                Full Shipping Address
              </label>
              <textarea
                placeholder="Enter complete delivery address (House #, Street, Area, City, Phone)..."
                rows={4}
                {...register("shippingAddress", { required: "Shipping address is required" })}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  backgroundColor: "#131921",
                  border: "1px solid #2e3a52",
                  borderRadius: "8px",
                  color: "#ffffff",
                  outline: "none",
                  fontSize: "0.95rem",
                }}
              />
              {errors.shippingAddress && <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.3rem" }}>{errors.shippingAddress.message}</p>}
            </div>

            {serverError && (
              <div style={{ color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.6rem", borderRadius: "6px", marginBottom: "1.25rem", fontSize: "0.85rem", textAlign: "center" }}>
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={placing}
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
              {placing ? "Placing Order..." : "Confirm & Place Order (COD)"}
            </button>
          </form>
        )}

        {paymentMethod === "ONLINE" && (
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
                Full Shipping Address
              </label>
              <textarea
                placeholder="Enter complete delivery address..."
                rows={4}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  backgroundColor: "#131921",
                  border: "1px solid #2e3a52",
                  borderRadius: "8px",
                  color: "#ffffff",
                  outline: "none",
                  fontSize: "0.95rem",
                }}
              />
            </div>

            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <OnlinePaymentForm shippingAddress={shippingAddress} />
              </Elements>
            ) : (
              <p style={{ color: "#94a3b8", textAlign: "center" }}>Loading secure payment gateway...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;