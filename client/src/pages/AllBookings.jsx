import { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try { const r = await api.get("/bookings/all"); setBookings(r.data.bookings); }
    catch (e) { toast.error("Failed to load bookings"); } finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try { await api.put(`/bookings/${id}/cancel`); toast.success("Booking cancelled"); fetchBookings(); }
    catch (e) { toast.error("Failed to cancel"); }
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">All <span className="gradient-text">Bookings</span></h1>
          <p className="text-surface-400 mt-1">{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</p>
        </div>

        {bookings.length === 0 ? (
          <div className="glass-card p-12 text-center"><span className="text-5xl">📭</span><p className="text-surface-300 mt-4">No bookings found</p></div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-left text-xs text-surface-400 uppercase tracking-wider border-b border-surface-700/50">
                  <th className="px-6 py-4">User</th><th className="px-6 py-4">Room</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Time</th><th className="px-6 py-4">Purpose</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-surface-700/30">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-surface-800/30 transition-colors">
                      <td className="px-6 py-4"><p className="text-sm font-medium text-surface-200">{b.user?.name}</p><p className="text-xs text-surface-500">{b.user?.email}</p></td>
                      <td className="px-6 py-4"><p className="text-sm text-surface-200">{b.room?.roomName}</p><p className="text-xs text-surface-500">{b.room?.block?.blockName}</p></td>
                      <td className="px-6 py-4 text-sm text-surface-300">{fmtDate(b.date)}</td>
                      <td className="px-6 py-4 text-sm text-surface-300">{b.startTime} - {b.endTime}</td>
                      <td className="px-6 py-4"><span className="badge-info">{b.purpose}</span></td>
                      <td className="px-6 py-4"><span className={b.status === "CONFIRMED" ? "badge-success" : "badge-danger"}>{b.status}</span></td>
                      <td className="px-6 py-4">{b.status === "CONFIRMED" && <button onClick={() => handleCancel(b.id)} className="btn-danger text-xs">Cancel</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllBookings;
