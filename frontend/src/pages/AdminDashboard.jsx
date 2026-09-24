import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Building,
  Calendar,
  Search,
  Filter,
  Sparkles,
  UserCheck,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [clubSearch, setClubSearch] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // users, clubs

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, clubsRes] = await Promise.all([
        API.get('/users'),
        API.get('/clubs'),
      ]);
      setUsers(usersRes.data);
      setClubs(clubsRes.data);
    } catch (err) {
      toast.error('Failed to load administration data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      toast.success('User role updated');
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user from campus directory?'))
      return;
    try {
      await API.delete(`/users/${userId}`);
      toast.success('User removed');
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteClub = async (clubId) => {
    if (!window.confirm('Are you sure you want to disband this club?'))
      return;
    try {
      await API.delete(`/clubs/${clubId}`);
      toast.success('Club removed');
      setClubs((prev) => prev.filter((c) => c._id !== clubId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete club');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.department?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredClubs = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(clubSearch.toLowerCase()) ||
      c.category?.toLowerCase().includes(clubSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  const roleStyles = {
    admin: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    faculty: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    club_admin: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    student: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* ── 1. HEADER ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
            <ShieldAlert size={13} className="text-rose-400" />
            <span>Root Governance & Access Control</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-['Outfit']">
            Administrator Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage user roles, moderate student clubs, audit permissions, and control campus operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'clubs'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Clubs ({clubs.length})
          </button>
        </div>
      </div>

      {/* ── 2. STAT CARDS ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass p-5 rounded-3xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Campus Users</p>
            <p className="text-3xl font-black text-white mt-1 font-['Outfit']">{users.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="glass p-5 rounded-3xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Active Student Clubs</p>
            <p className="text-3xl font-black text-white mt-1 font-['Outfit']">{clubs.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Building size={22} />
          </div>
        </div>

        <div className="glass p-5 rounded-3xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">System Status</p>
            <p className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5 font-['Outfit']">
              <CheckCircle size={18} /> Operational
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Shield size={22} />
          </div>
        </div>
      </div>

      {/* ── 3. TAB 1: USER MANAGEMENT TABLE ──────────────── */}
      {activeTab === 'users' && (
        <div className="glass p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search user name, email, department..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-[#080B12] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredUsers.length} user records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Current Role</th>
                  <th className="py-3 px-3">Assign Role</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                          {u.name?.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{u.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-medium">{u.department || 'N/A'}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleStyles[u.role] || 'bg-slate-800 text-slate-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                      >
                        <option value="student">Student</option>
                        <option value="club_admin">Club Lead</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove User"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 4. TAB 2: CLUB MODERATION TABLE ──────────────── */}
      {activeTab === 'clubs' && (
        <div className="glass p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search club name, category..."
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                className="w-full bg-[#080B12] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredClubs.length} club records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Club Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Members</th>
                  <th className="py-3 px-3">Faculty Advisor</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClubs.map((c) => (
                  <tr key={c._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-white block">{c.name}</span>
                      <span className="text-[10px] text-slate-400 italic">{c.tagline}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-indigo-500/20">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{c.members?.length || 0} students</td>
                    <td className="py-3 px-3 text-slate-400">{c.facultyAdvisor?.name || 'Unassigned'}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteClub(c._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Disband Club"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
