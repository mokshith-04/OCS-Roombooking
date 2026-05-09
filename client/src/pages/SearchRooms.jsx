import { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

const SearchRooms = () => {
  const [blocks, setBlocks] = useState([]);
  const [form, setForm] = useState({ date: "", startTime: "", endTime: "", purpose: "", capacity: "", blockId: "" });
  const [rooms, setRooms] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [participants, setParticipants] = useState(1);

  useEffect(() => { api.get("/rooms/blocks").then((r) => setBlocks(r.data.blocks)).catch(console.error); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.date || !form.startTime || !form.endTime || !form.purpose || !form.capacity) {
      toast.error("Please fill all required fields"); return;
    }
    if (form.startTime >= form.endTime) { toast.error("End time must be after start time"); return; }
    setLoading(true);
    try {
      const res = await api.post("/rooms/search", { ...form, capacity: parseInt(form.capacity), blockId: form.blockId ? parseInt(form.blockId) : undefined });
      setRooms(res.data.rooms);
      setSearched(true);
      if (res.data.rooms.length === 0) toast("No rooms available for the selected criteria", { icon: "ℹ️" });
    } catch (err) { toast.error(err.response?.data?.message || "Search failed"); }
    finally { setLoading(false); }
  };

  const handleBook = async (room) => {
    try {
      await api.post("/bookings/create", { roomId: room.id, date: form.date, startTime: form.startTime, endTime: form.endTime, purpose: form.purpose, participants });
      toast.success(`${room.roomName} booked successfully!`);
      setBookingRoom(null);
      setRooms(rooms.filter((r) => r.id !== room.id));
    } catch (err) { toast.error(err.response?.data?.message || "Booking failed"); }
  };

  const purposes = ["OA", "INTERVIEW", "PPT"];

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">Search <span className="gradient-text">Available Rooms</span></h1>
          <p className="text-surface-400 mt-1">Find and book the perfect room for your needs</p>
        </div>

        {/* Search Form */}
        <div className="glass-card p-6 sm:p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Date *</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} className="input-field" min={new Date().toISOString().split("T")[0]} />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Start Time *</label>
                <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">End Time *</label>
                <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Purpose *</label>
                <select name="purpose" value={form.purpose} onChange={handleChange} className="input-field">
                  <option value="">Select purpose</option>
                  {purposes.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Min Capacity *</label>
                <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className="input-field" placeholder="e.g. 10" min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Block <span className="text-surface-500">(optional)</span></label>
                <select name="blockId" value={form.blockId} onChange={handleChange} className="input-field">
                  <option value="">All Blocks</option>
                  {blocks.map((b) => <option key={b.id} value={b.id}>{b.blockName}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Searching...</> : <><span>🔍</span> Search Rooms</>}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="space-y-4 animate-slide-up">
            <h2 className="text-lg font-semibold text-surface-100">{rooms.length} Room{rooms.length !== 1 ? "s" : ""} Available</h2>
            {rooms.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <span className="text-5xl">🏚️</span>
                <p className="text-surface-300 mt-4 text-lg">No rooms match your criteria</p>
                <p className="text-surface-500 mt-1 text-sm">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <div key={room.id} className="glass-card p-6 hover:border-primary-500/30 transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-surface-100 group-hover:text-primary-400 transition-colors">{room.roomName}</h3>
                        <p className="text-sm text-surface-400">{room.block.blockName}</p>
                      </div>
                      {room.isAvailableForBooking ? (
                        <span className="badge-success">Available</span>
                      ) : (
                        <span className="badge-danger">Unavailable</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="flex items-center gap-1.5 text-sm text-surface-300">
                        <span>👥</span><span>Capacity: {room.capacity}</span>
                      </div>
                    </div>
                    {room.isAvailableForBooking ? (
                      bookingRoom?.id === room.id ? (
                        <div className="space-y-3 p-4 bg-surface-900/50 rounded-xl border border-surface-700/30 animate-scale-in">
                          <div>
                            <label className="text-xs text-surface-400">Participants</label>
                            <input type="number" value={participants} onChange={(e) => setParticipants(parseInt(e.target.value) || 1)} min="1" max={room.capacity} className="input-field mt-1 text-sm py-2" />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleBook(room)} className="btn-success flex-1 text-sm py-2">Confirm</button>
                            <button onClick={() => setBookingRoom(null)} className="btn-secondary flex-1 text-sm py-2">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => { setBookingRoom(room); setParticipants(1); }} className="btn-primary w-full text-sm">Book Room</button>
                      )
                    ) : (
                      <button disabled className="btn-secondary w-full text-sm opacity-50 cursor-not-allowed">Not Available</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchRooms;
