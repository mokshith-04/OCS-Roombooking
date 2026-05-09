import { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try { const r = await api.get("/admin/users"); setUsers(r.data.users); }
    catch (e) { toast.error("Failed to load users"); } finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error("All fields required"); return; }
    setCreating(true);
    try {
      await api.post("/admin/create-member", form);
      toast.success("Member created successfully!");
      setForm({ name: "", email: "", password: "" });
      setShowForm(false);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || "Failed to create"); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This will also delete their bookings.`)) return;
    try { await api.delete(`/admin/users/${id}`); toast.success("User deleted"); fetchUsers(); }
    catch (e) { toast.error(e.response?.data?.message || "Failed"); }
  };

  if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">Manage <span className="gradient-text">Users</span></h1>
            <p className="text-surface-400 mt-1">{users.length} registered user{users.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">{showForm ? "✕ Close" : "+ Add Member"}</button>
        </div>

        {showForm && (
          <div className="glass-card p-6 animate-slide-down">
            <h2 className="text-lg font-semibold text-surface-100 mb-4">Create Member Account</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-surface-300 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Full Name" />
              </div>
              <div>
                <label className="block text-sm text-surface-300 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm text-surface-300 mb-1">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="Secure password" />
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <button type="submit" disabled={creating} className="btn-success text-sm">{creating ? "Creating..." : "Create Member"}</button>
              </div>
            </form>
          </div>
        )}

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-left text-xs text-surface-400 uppercase tracking-wider border-b border-surface-700/50">
                <th className="px-6 py-4">Name</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Joined</th><th className="px-6 py-4">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-surface-700/30">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-surface-200">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-surface-300">{u.email}</td>
                    <td className="px-6 py-4"><span className={u.role === "ADMIN" ? "badge-warning" : "badge-info"}>{u.role}</span></td>
                    <td className="px-6 py-4 text-sm text-surface-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {u.role !== "ADMIN" && <button onClick={() => handleDelete(u.id, u.name)} className="btn-danger text-xs">Delete</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageUsers;
