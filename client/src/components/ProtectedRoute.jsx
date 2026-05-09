import { Navigate } from "react-router-dom";
import { isAuthenticated, getStoredUser } from "../services/auth";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    const user = getStoredUser();
    if (user?.role !== "ADMIN") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
