import { Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, getStoredUser } from "./services/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import SearchRooms from "./pages/SearchRooms";
import MyBookings from "./pages/MyBookings";
import ManageUsers from "./pages/ManageUsers";
import AllBookings from "./pages/AllBookings";

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <LoginPage />} />

      {/* Protected - All roles */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Protected - Member */}
      <Route path="/search" element={<ProtectedRoute><SearchRooms /></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />

      {/* Protected - Admin only */}
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><AllBookings /></ProtectedRoute>} />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

export default App;
