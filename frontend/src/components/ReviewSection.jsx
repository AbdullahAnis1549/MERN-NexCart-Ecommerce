import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import api from "../api/axios";
import { selectUser } from "../features/authSlice";

function ReviewSection({ productId, onReviewAdded }) {
  const user = useSelector(selectUser);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const fetchReviews = () => {
    api
      .get(`/review/product/${productId}`)
      .then((res) => {
        setReviews(res.data.data || []);
        setAvgRating(res.data.avgRating || 0);
        setTotalRatings(res.data.totalRatings || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMsg("");
    try {
      await api.post(`/review/add/${productId}`, {
        rating: data.rating,
        comment: data.comment,
      });
      setSuccessMsg("Review submitted successfully!");
      reset();
      fetchReviews();
      if (typeof onReviewAdded === "function") {
        onReviewAdded();
      }
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to add review.");
    }
  };

  if (loading) {
    return <div style={{ color: "#94a3b8", padding: "1.5rem 0" }}>Loading verified customer reviews...</div>;
  }

  return (
    <div style={{ backgroundColor: "#1e2638", border: "1px solid #2e3a52", borderRadius: "14px", padding: "2rem", color: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2e3a52", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>
          Customer Reviews & Ratings
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#f59e0b", fontSize: "1.25rem" }}>★</span>
          <span style={{ fontSize: "1.2rem", fontWeight: "800", color: "#febd69" }}>
            {avgRating} / 5
          </span>
          <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            ({totalRatings} {totalRatings === 1 ? "review" : "reviews"})
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p style={{ color: "#94a3b8", margin: "1rem 0" }}>No customer reviews yet. Be the first to review this product!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
          {reviews.map((r) => (
            <div
              key={r._id}
              style={{
                backgroundColor: "#131921",
                border: "1px solid #2e3a52",
                borderRadius: "10px",
                padding: "1rem 1.25rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{ fontWeight: "700", color: "#ffffff", fontSize: "0.95rem" }}>
                  {r.userId?.name || "Verified Customer"}
                </span>
                <div style={{ display: "flex", color: "#f59e0b", fontSize: "0.9rem" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>{r.rating >= star ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>
              {r.comment && (
                <p style={{ color: "#cbd5e1", margin: "0.3rem 0 0", fontSize: "0.9rem", lineHeight: "1.5" }}>
                  {r.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Form */}
      <div style={{ borderTop: "1px solid #2e3a52", paddingTop: "1.5rem", marginTop: "1rem" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#febd69", marginBottom: "0.85rem" }}>
          Write a Verified Review
        </h3>

        {!user ? (
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Please log in with an account that has a delivered order for this product to write a review.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "550px" }}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
                Your Rating (1 to 5 Stars) *
              </label>
              <select
                {...register("rating", { required: "Please select a rating" })}
                defaultValue=""
                style={{
                  width: "100%",
                  padding: "0.65rem 0.9rem",
                  backgroundColor: "#131921",
                  border: "1px solid #2e3a52",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              >
                <option value="" disabled>Select your rating</option>
                <option value="5">★★★★★ (5 - Excellent)</option>
                <option value="4">★★★★☆ (4 - Good)</option>
                <option value="3">★★★☆☆ (3 - Average)</option>
                <option value="2">★★☆☆☆ (2 - Poor)</option>
                <option value="1">★☆☆☆☆ (1 - Terrible)</option>
              </select>
              {errors.rating && (
                <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.3rem" }}>
                  {errors.rating.message}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
                Comment / Feedback
              </label>
              <textarea
                placeholder="Share your experience with this item..."
                rows={3}
                {...register("comment")}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#131921",
                  border: "1px solid #2e3a52",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {serverError && (
              <div style={{ color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.6rem 0.9rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                {serverError}
              </div>
            )}
            {successMsg && (
              <div style={{ color: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "0.6rem 0.9rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.85rem", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "0.75rem 1.6rem",
                background: "linear-gradient(135deg, #febd69 0%, #f3a847 100%)",
                color: "#131921",
                border: "none",
                borderRadius: "8px",
                fontWeight: "800",
                fontSize: "0.95rem",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(254, 189, 105, 0.3)",
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReviewSection;