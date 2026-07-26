import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { getImageUrl } from "../utils/getImageUrl";

function Home() {
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [hoveredCat, setHoveredCat] = useState(null);
  // Jab tak saari initial API calls resolve na ho jayein, ye true rehta hai —
  // taake "blank sections" ki jagah ek clean loading screen dikhe
  const [initialLoading, setInitialLoading] = useState(true);
  const intervalRef = useRef(null);
  const catScrollRef = useRef(null);

  /* ── auto-advance hero ── */
  const startAutoPlay = (total) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(
      () => setBannerIndex((p) => (p + 1) % total),
      4500
    );
  };

  /* ── category scroll ── */
  const scrollCats = (dir) =>
    catScrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  useEffect(() => {
    const catPromise = api.get("/category/get").then((r) => setCategories(r.data.data || [])).catch(console.error);
    const bestPromise = api.get("/product/get?isBestSeller=true&limit=8").then((r) => setBestSellers(r.data.data || [])).catch(console.error);
    const featPromise = api.get("/product/get?isFeatured=true&limit=8").then((r) => setFeaturedProducts(r.data.data || [])).catch(console.error);
    const bannerPromise = api.get("/banner/get").then((r) => {
      const data = r.data.data || [];
      setBanners(data);
      if (data.length > 1) startAutoPlay(data.length);
    }).catch(console.error);

    // Chaaron calls (chahe kisi me error aaye) settle hone ke baad hi loading hataate hain
    Promise.allSettled([catPromise, bestPromise, featPromise, bannerPromise]).finally(() => {
      setInitialLoading(false);
    });

    return () => clearInterval(intervalRef.current);
  }, []);

  const getImg = getImageUrl;

  /* shared arrow button style */
  const arrowStyle = (extra = {}) => ({
    background: "rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "#fff",
    width: "40px", height: "40px",
    borderRadius: "50%",
    fontSize: "1.25rem",
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.2s",
    backdropFilter: "blur(6px)",
    ...extra,
  });

  const curBanner = banners[bannerIndex];

  const cleanText = (str) =>
    str ? str.replace(/[^\x00-\x7F]/g, "").trim() : "";

  // Initial loading screen — dark theme se match karta hai, blank white flash ki jagah
  if (initialLoading) {
    return (
      <div style={{
        width: "100%", minHeight: "100vh",
        backgroundColor: "#0f1117", color: "#f8fafc",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "1.2rem",
      }}>
        <style>{`
          @keyframes nexcart-spin { to { transform: rotate(360deg); } }
        `}</style>
        <div style={{
          width: "48px", height: "48px",
          border: "4px solid #2e3a52",
          borderTopColor: "#febd69",
          borderRadius: "50%",
          animation: "nexcart-spin 0.8s linear infinite",
        }} />
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", letterSpacing: "0.5px" }}>
          Loading NexCart...
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", backgroundColor: "#0f1117", color: "#f8fafc", minHeight: "100vh" }}>

      {/* ════════════════════════════════════════════
          HERO  —  banner image as full background
          ════════════════════════════════════════════ */}
      <Link to="/products" style={{ display: "block", textDecoration: "none" }}>
        <div style={{
          position: "relative",
          height: "calc(97vh - 90px)",
          minHeight: "500px",
          maxHeight: "720px",
          overflow: "hidden",
          cursor: "pointer",
          background: "#0a0d14",
        }}>
          {/* Background image */}
          {curBanner?.imageurl && (
            <img
              key={curBanner._id}
              src={curBanner.imageurl}
              alt={curBanner.title}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                transition: "opacity 0.6s ease",
              }}
            />
          )}

          {/* Dark overlay so text stays readable */}
          <div style={{
            position: "absolute", inset: 0,
            background: curBanner?.imageurl
              ? "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%)"
              : "linear-gradient(135deg, #131921 0%, #1e2638 100%)",
          }} />

          {/* Text content */}
          <div style={{
            position: "absolute", top: "50%", left: "3.5rem",
            transform: "translateY(-50%)",
            maxWidth: "560px",
            pointerEvents: "none",
          }}>
            {curBanner && (
              <span style={{
                display: "inline-block",
                background: "#febd69", color: "#131921",
                fontSize: "0.68rem", fontWeight: "800", letterSpacing: "2px",
                padding: "0.22rem 0.8rem", borderRadius: "20px",
                marginBottom: "1rem", textTransform: "uppercase",
              }}>
                Special Offer
              </span>
            )}
            <h1 style={{
              fontSize: "3rem", fontWeight: "900", color: "#febd69",
              marginBottom: "0.9rem", letterSpacing: "-1px", lineHeight: 1.15,
              textShadow: "0 2px 18px rgba(0,0,0,0.7)",
            }}>
              {cleanText(curBanner?.title) || "LUXURY SHOPPING REDEFINED"}
            </h1>
            <p style={{
              fontSize: "1.1rem", color: "#cbd5e1",
              maxWidth: "500px", margin: "0 0 2rem 0", lineHeight: 1.65,
              textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}>
              {cleanText(curBanner?.description) || "Discover top-tier products, premium deals, and lightning-fast delivery with our exclusive Black & Gold Collection."}
            </p>
            <span style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #febd69 0%, #f3a847 100%)",
              color: "#131921",
              padding: "0.85rem 2.2rem",
              borderRadius: "8px",
              fontWeight: "800",
              fontSize: "1.05rem",
              boxShadow: "0 4px 15px rgba(254,189,105,0.45)",
            }}>
              {curBanner ? "Shop Now" : "Explore All Products"}
            </span>
          </div>

          {/* Dot indicators */}
          {banners.length > 1 && (
            <div style={{
              position: "absolute", bottom: "1.25rem", left: "50%",
              transform: "translateX(-50%)", display: "flex", gap: "0.5rem", zIndex: 2,
            }}>
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    setBannerIndex(i);
                    startAutoPlay(banners.length);
                  }}
                  style={{
                    width: i === bannerIndex ? "26px" : "9px",
                    height: "9px",
                    borderRadius: "5px",
                    background: i === bannerIndex ? "#febd69" : "rgba(255,255,255,0.38)",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* ════════════════════════════════════════════
          SHOP BY CATEGORY  —  single scrollable row
          ════════════════════════════════════════════ */}
      <div style={{ padding: "2.5rem 2.5rem 2.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem" }}>
          <div>
            <h2 style={{ color: "#ffffff", fontSize: "1.8rem", margin: 0, fontWeight: "800" }}>
              Shop by Category
            </h2>
            <p style={{ color: "#64748b", margin: "0.3rem 0 0", fontSize: "0.9rem" }}>
              Browse your favourite category and find what you love
            </p>
          </div>
          <Link to="/products" style={{ color: "#febd69", fontWeight: "700", textDecoration: "none", fontSize: "0.9rem" }}>
            View All →
          </Link>
        </div>

        {categories.length === 0 ? (
          <p style={{ color: "#64748b" }}>No categories found.</p>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            {/* Left arrow */}
            <button
              onClick={() => scrollCats(-1)}
              style={arrowStyle()}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(254,189,105,0.75)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
            >‹</button>

            {/* Scrollable strip */}
            <div
              ref={catScrollRef}
              style={{
                display: "flex", gap: "1rem",
                overflowX: "auto", flex: 1,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                paddingBottom: "4px",
              }}
            >
              <style>{`
                div::-webkit-scrollbar { display: none; }
              `}</style>

              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat._id}`}
                  style={{ textDecoration: "none", flexShrink: 0 }}
                  onMouseEnter={() => setHoveredCat(cat._id)}
                  onMouseLeave={() => setHoveredCat(null)}
                >
                  <div style={{
                    width: "148px",
                    backgroundColor: hoveredCat === cat._id ? "#1e2a3a" : "#161d2b",
                    border: hoveredCat === cat._id ? "2px solid #febd69" : "2px solid #2e3a52",
                    borderRadius: "14px",
                    overflow: "hidden",
                    transition: "all 0.22s ease",
                    transform: hoveredCat === cat._id ? "translateY(-6px)" : "none",
                    boxShadow: hoveredCat === cat._id ? "0 12px 30px rgba(254,189,105,0.18)" : "0 3px 10px rgba(0,0,0,0.25)",
                    cursor: "pointer", textAlign: "center",
                  }}>
                    {cat.imageurl ? (
                      <img
                        src={getImg(cat.imageurl)}
                        alt={cat.name}
                        style={{ width: "100%", height: "108px", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <div style={{
                        height: "108px",
                        background: "linear-gradient(135deg, #1e2638, #2e3a52)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "2.4rem",
                      }}>🏷️</div>
                    )}
                    <div style={{ padding: "0.65rem 0.4rem" }}>
                      <span style={{
                        color: hoveredCat === cat._id ? "#febd69" : "#e2e8f0",
                        fontWeight: "700", fontSize: "0.82rem",
                        lineHeight: "1.3", display: "block",
                        transition: "color 0.2s",
                      }}>
                        {cat.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scrollCats(1)}
              style={arrowStyle()}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(254,189,105,0.75)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
            >›</button>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════
          BEST SELLING
          ════════════════════════════════════════════ */}
      {bestSellers.length > 0 && (
        <div style={{
          padding: "3rem 2.5rem",
          background: "linear-gradient(180deg, #0f1117 0%, #131921 100%)",
          borderTop: "1px solid #1e2638",
          borderBottom: "1px solid #1e2638",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <div>
              <h2 style={{ color: "#ffffff", fontSize: "1.8rem", margin: 0, fontWeight: "800" }}>🔥 Best Selling</h2>
              <p style={{ color: "#64748b", margin: "0.3rem 0 0", fontSize: "0.9rem" }}>Our most loved products — flying off the shelves</p>
            </div>
            <Link to="/products" style={{ color: "#febd69", fontWeight: "700", textDecoration: "none", fontSize: "0.9rem" }}>View All →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {bestSellers.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          FEATURED COLLECTION
          ════════════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <div style={{ padding: "3rem 2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <div>
              <h2 style={{ color: "#ffffff", fontSize: "1.8rem", margin: 0, fontWeight: "800" }}>⭐ Featured Collection</h2>
              <p style={{ color: "#64748b", margin: "0.3rem 0 0", fontSize: "0.9rem" }}>Handpicked premium selections just for you</p>
            </div>
            <Link to="/products" style={{ color: "#febd69", fontWeight: "700", textDecoration: "none", fontSize: "0.9rem" }}>View All →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {featuredProducts.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      {/* Fallback */}
      {bestSellers.length === 0 && featuredProducts.length === 0 && (
        <div style={{ padding: "3rem 2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ color: "#ffffff", fontSize: "1.8rem", margin: 0, fontWeight: "800" }}>⭐ Latest Products</h2>
            <Link to="/products" style={{ color: "#febd69", fontWeight: "700", textDecoration: "none" }}>View All →</Link>
          </div>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
            No featured or best-selling products yet. Admin panel se products ko mark karein!
          </p>
        </div>
      )}

    </div>
  );
}

export default Home;
