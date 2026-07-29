import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Outlet } from "react-router-dom";
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

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [user, dispatch]);

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