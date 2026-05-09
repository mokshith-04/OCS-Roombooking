import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, getStoredUser } from "../services/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks =
    user?.role === "ADMIN"
      ? [
          { path: "/dashboard", label: "Dashboard", icon: "📊" },
          { path: "/admin/users", label: "Manage Users", icon: "👥" },
          { path: "/admin/bookings", label: "All Bookings", icon: "📋" },
        ]
      : [
          { path: "/dashboard", label: "Dashboard", icon: "🏠" },
          { path: "/search", label: "Search Rooms", icon: "🔍" },
          { path: "/my-bookings", label: "My Bookings", icon: "📅" },
        ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-t-0 border-x-0 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
              <span className="text-white font-bold text-sm">RB</span>
            </div>
            <span className="text-lg font-bold text-surface-100 hidden sm:block">
              Room<span className="gradient-text">Booking</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                    : "text-surface-400 hover:text-surface-200 hover:bg-surface-700/50"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* User info & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-surface-200">
                {user?.name}
              </span>
              <span className={`text-xs ${user?.role === "ADMIN" ? "text-amber-400" : "text-primary-400"}`}>
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-surface-400 hover:text-surface-200 hover:bg-surface-700/50 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-primary-500/20 text-primary-400"
                      : "text-surface-400 hover:text-surface-200 hover:bg-surface-700/50"
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
