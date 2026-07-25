import { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// Har field ka apna alag box banane ke liye common styling
const elementStyle = {
  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: "0.75rem",
};

function OnlinePaymentForm({ shippingAddress }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [cardholderName, setCardholderName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!shippingAddress) {
      setError("Please enter your shipping address first.");
      return;
    }
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    try {
      const intentRes = await api.post("/payment/create-intent");
      const { clientSecret, paymentIntentId } = intentRes.data;

      // Split fields honay par bhi, sirf CardNumberElement pass karna kaafi hai —
      // Stripe automatically usi form ke andar ke expiry/cvc elements ko link kar leta hai
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: cardholderName,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        await api.post("/payment/confirm-order", {
          paymentIntentId,
          shippingAddress,
        });
        navigate("/my-orders");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <input
        type="text"
        placeholder="Cardholder Name"
        value={cardholderName}
        onChange={(e) => setCardholderName(e.target.value)}
        required
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.75rem", boxSizing: "border-box" }}
      />

      <label style={{ fontSize: "0.85rem", color: "gray" }}>Card Number</label>
      <div style={{ ...elementStyle, marginBottom: "0.75rem" }}>
        <CardNumberElement />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "0.85rem", color: "gray" }}>Expiry</label>
          <div style={elementStyle}>
            <CardExpiryElement />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "0.85rem", color: "gray" }}>CVC</label>
          <div style={elementStyle}>
            <CardCvcElement />
          </div>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={!stripe || processing}>
        {processing ? "Processing..." : "Pay Now"}
      </button>

      <p style={{ fontSize: "0.85rem", color: "gray", marginTop: "0.5rem" }}>
        Test card: 4242 4242 4242 4242, any future expiry, any CVC
      </p>
    </form>
  );
}

export default OnlinePaymentForm;