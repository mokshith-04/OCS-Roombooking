import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStoredUser } from "../services/auth";
import api from "../services/api";
import Layout from "../components/Layout";

const Dashboard = () => {
  const user = getStoredUser();
  const [stats, setStats] = useState({ bookings: 0, upcoming: 0, rooms: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const ep = user?.role === "ADMIN" ? "/bookings/all" : "/bookings/my-bookings";
      const [bRes, rRes] = await Promise.all([api.get(ep), api.get("/rooms")]);
      const bookings = bRes.data.bookings;
      const today = new Date().toISOString().split("T")[0];
      const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
      const upcoming = confirmed.filter((b) => new Date(b.date).toISOString().split("T")[0] >= today);
      setStats({ bookings: confirmed.length, upcoming: upcoming.length, rooms: rRes.data.rooms.length });
      setRecentBookings(bookings.slice(0, 5));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

  if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">{greeting()}, <span className="gradient-text">{user?.name}</span></h1>
            <p className="text-surface-400 mt-1">{user?.role === "ADMIN" ? "Manage your rooms and bookings" : "Overview of your room bookings"}</p>
          </div>
          {user?.role === "ADMIN" ? <Link to="/admin/users" className="btn-primary text-sm">+ Add Member</Link> : <Link to="/search" className="btn-primary text-sm">🔍 Search Rooms</Link>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Bookings", val: stats.bookings, icon: "📋", color: "primary" },
            { label: "Upcoming", val: stats.upcoming, icon: "📅", color: "emerald" },
            { label: "Available Rooms", val: stats.rooms, icon: "🏢", color: "purple" },
          ].map((s) => (
            <div key={s.label} className={`glass-card p-6 group hover:border-${s.color}-500/30 transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-surface-400">{s.label}</p><p className="text-3xl font-bold text-surface-100 mt-1">{s.val}</p></div>
                <div className={`w-12 h-12 rounded-xl bg-${s.color}-500/20 flex items-center justify-center`}><span className="text-2xl">{s.icon}</span></div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-700/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-100">Recent Bookings</h2>
            <Link to={user?.role === "ADMIN" ? "/admin/bookings" : "/my-bookings"} className="text-sm text-primary-400 hover:text-primary-300">View all →</Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="px-6 py-12 text-center"><span className="text-4xl">📭</span><p className="text-surface-400 mt-3">No bookings yet</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-left text-xs text-surface-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Room</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Time</th><th className="px-6 py-3">Purpose</th><th className="px-6 py-3">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-surface-700/30">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-surface-800/30 transition-colors">
                      <td className="px-6 py-4"><p className="text-sm font-medium text-surface-200">{b.room?.roomName}</p><p className="text-xs text-surface-500">{b.room?.block?.blockName}</p></td>
                      <td className="px-6 py-4 text-sm text-surface-300">{fmtDate(b.date)}</td>
                      <td className="px-6 py-4 text-sm text-surface-300">{b.startTime} - {b.endTime}</td>
                      <td className="px-6 py-4"><span className="badge-info">{b.purpose}</span></td>
                      <td className="px-6 py-4"><span className={b.status === "CONFIRMED" ? "badge-success" : "badge-danger"}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
