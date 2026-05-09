import { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my-bookings");
      setBookings(res.data.bookings);
    } catch (e) { toast.error("Failed to load bookings"); } finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (e) { toast.error("Failed to cancel"); }
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter.toUpperCase());

  if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">My <span className="gradient-text">Bookings</span></h1>
            <p className="text-surface-400 mt-1">{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-2">
            {["all", "confirmed", "cancelled"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? "bg-primary-500/20 text-primary-400 border border-primary-500/30" : "text-surface-400 hover:text-surface-200 hover:bg-surface-700/50 border border-transparent"}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center"><span className="text-5xl">📭</span><p className="text-surface-300 mt-4 text-lg">No {filter !== "all" ? filter : ""} bookings</p></div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <div key={b.id} className="glass-card p-5 hover:border-surface-600/50 transition-all group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center shrink-0">
                      <span className="text-xl">🏢</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-100">{b.room?.roomName}</h3>
                      <p className="text-sm text-surface-400">{b.room?.block?.blockName}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-surface-300">
                        <span>📅 {fmtDate(b.date)}</span>
                        <span>🕐 {b.startTime} - {b.endTime}</span>
                        <span>👥 {b.participants}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <span className={b.status === "CONFIRMED" ? "badge-success" : "badge-danger"}>{b.status}</span>
                    <span className="badge-info">{b.purpose}</span>
                    {b.status === "CONFIRMED" && (
                      <button onClick={() => handleCancel(b.id)} className="btn-danger text-xs mt-1">Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyBookings;
