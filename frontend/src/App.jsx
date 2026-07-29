import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Outlet, useLocation, useNavigate } from "react-router-dom";
import { selectUser } from "./features/authSlice";
import { fetchCart } from "./features/cartSlice";
import { fetchWishlist } from "./features/wishlistSlice";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminBanners from "./pages/Admin/AdminBanners";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

// User Layout (Includes User Navbar and Footer)
function UserLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const splashPlayedRef = useRef(false);
  const initialPathRef = useRef(location.pathname);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (splashPlayedRef.current) return;

    if (!initialPathRef.current.startsWith("/admin")) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        splashPlayedRef.current = true;
        navigate("/");
      }, 2800);

      return () => clearTimeout(timer);
    }

    splashPlayedRef.current = true;
    setShowSplash(false);
  }, [navigate]);

  if (showSplash) {
    return (
      <div style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "radial-gradient(circle at top, #1d2230 0%, #090b10 45%, #06070a 100%)",
        color: "#f8fafc",
        textAlign: "center",
      }}>
        <style>{`
          @keyframes splashPulse {
            0%, 100% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(-6px); opacity: 0.88; }
          }
          @keyframes splashGlow {
            0%, 100% { text-shadow: 0 0 18px rgba(254,189,105,0.18); }
            50% { text-shadow: 0 0 32px rgba(254,189,105,0.35); }
          }
        `}</style>
        <div style={{ maxWidth: "640px", width: "100%", animation: "splashPulse 2.8s ease-in-out both" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.65rem 1rem",
              borderRadius: "999px",
              background: "rgba(254,189,105,0.16)",
              color: "#febd69",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontSize: "0.78rem",
            }}>
              NexCart Intro
            </span>
          </div>
          <h1 style={{
            margin: 0,
            fontSize: "clamp(2.4rem, 4vw, 4.2rem)",
            lineHeight: 1.03,
            letterSpacing: "-0.05em",
            color: "#ffffff",
            animation: "splashGlow 2.8s ease-in-out infinite",
          }}>
            MERN Stack E-Commerce
            <br />
            Web Application
          </h1>
          <p style={{
            margin: "1.6rem auto 0",
            maxWidth: "560px",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "#cbd5e1",
          }}>
            Developed with: React.js • Node.js • Express.js • MongoDB
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Main User Storefront Routes (with User Navbar) */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Panel Routes (without User Navbar) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="banners" element={<AdminBanners />} />
      </Route>
    </Routes>
  );
}

export default App;