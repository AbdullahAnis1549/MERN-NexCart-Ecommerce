import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/authSlice";

// Ye component "wrapper" ki tarah kaam karta hai — jo bhi page ise children
// ke through diya jayega, wo sirf tab render hoga jab user admin ho
function AdminRoute({ children }) {
  const user = useSelector(selectUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;