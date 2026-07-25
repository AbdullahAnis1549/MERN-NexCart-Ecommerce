import { loadStripe } from "@stripe/stripe-js";
import api from "./axios";

// Backend se publishable key mangwate hain (hardcode nahi karte, security ke liye)
export const getStripePromise = async () => {
  const res = await api.get("/payment/config");
  return loadStripe(res.data.publishableKey);
};