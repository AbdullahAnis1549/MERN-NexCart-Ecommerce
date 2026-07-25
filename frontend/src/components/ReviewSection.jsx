import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import api from "../api/axios";
import { selectUser } from "../features/authSlice";

function ReviewSection({ productId }) {
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
        setReviews(res.data.data);
        setAvgRating(res.data.avgRating);
        setTotalRatings(res.data.totalRatings);
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
      setSuccessMsg("Review added successfully!");
      reset();
      fetchReviews(); // list refresh karo taake naya review turant dikhe
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to add review.");
    }
  };

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div style={{ marginTop: "2rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
      <h2>Reviews</h2>

      <p>
        <strong>{avgRating} / 5</strong> ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
      </p>

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div key={r._id} style={{ borderBottom: "1px solid #eee", padding: "0.75rem 0" }}>
            <p><strong>{r.userId?.name || "User"}</strong> — {r.rating} / 5</p>
            {r.comment && <p>{r.comment}</p>}
          </div>
        ))
      )}

      {user && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Write a Review</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <select {...register("rating", { required: "Rating is required" })} defaultValue="">
              <option value="" disabled>Select rating</option>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
            {errors.rating && <p style={{ color: "red" }}>{errors.rating.message}</p>}
            <br /><br />

            <textarea
              placeholder="Write your comment (optional)"
              rows={3}
              style={{ width: "100%", maxWidth: "400px" }}
              {...register("comment")}
            />
            <br />

            {serverError && <p style={{ color: "red" }}>{serverError}</p>}
            {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

            <button type="submit" disabled={isSubmitting} style={{ marginTop: "0.5rem" }}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ReviewSection;