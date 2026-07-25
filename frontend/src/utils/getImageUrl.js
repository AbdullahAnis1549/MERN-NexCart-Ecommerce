// Cloudinary URLs already start with "http" — us case me seedha wahi return hota hai.
// Sirf purane/local paths ke liye backend base URL laga dete hain (env se, hardcoded nahi).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function getImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}/${url.replace(/\\/g, "/")}`;
}
