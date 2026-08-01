function NotFound() {
  return (
    <div className="rx-not-found">
      <h1>404</h1>
      <p>Page Not Found</p>
      <a href="/" style={{ color: "#febd69", fontWeight: "700", textDecoration: "none", padding: "0.75rem 2rem", background: "#131921", borderRadius: "8px", border: "1px solid #febd69" }}>
        Go Home
      </a>
    </div>
  );
}

export default NotFound;
