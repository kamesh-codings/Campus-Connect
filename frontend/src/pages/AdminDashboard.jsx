import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  Trash2,
  CheckCircle,
  Building,
  Search,
  ShieldAlert,
  Flag,
  Check,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [reportedDiscussions, setReportedDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [clubSearch, setClubSearch] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // users, clubs, moderation

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, clubsRes, repRes] = await Promise.all([
        API.get('/users'),
        API.get('/clubs'),
        API.get('/discussions/reported'),
      ]);
      setUsers(usersRes.data);
      setClubs(clubsRes.data);
      setReportedDiscussions(Array.isArray(repRes.data) ? repRes.data : []);
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

  const handleDismissReport = async (discussionId) => {
    try {
      await API.put(`/discussions/${discussionId}/dismiss-report`);
      toast.success('Report dismissed, content approved');
      setReportedDiscussions((prev) => prev.filter((d) => d._id !== discussionId));
    } catch (err) {
      toast.error('Failed to dismiss report');
    }
  };

  const handleDeleteReportedDiscussion = async (discussionId) => {
    if (!window.confirm('Are you sure you want to permanently delete this reported discussion thread?')) return;
    try {
      await API.delete(`/discussions/${discussionId}`);
      toast.success('Inappropriate content removed');
      setReportedDiscussions((prev) => prev.filter((d) => d._id !== discussionId));
    } catch (err) {
      toast.error('Failed to delete discussion');
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
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
    <div className="space-y-6 animate-fade-in-up pb-12 font-sans">
      {/* ── 1. HEADER ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
            <ShieldAlert size={12} className="text-rose-400" />
            <span>Root Governance & Content Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Administrator Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage user roles, moderate student clubs, review flagged community content, and audit campus activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              activeTab === 'users'
                ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border-white/10'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              activeTab === 'clubs'
                ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border-white/10'
            }`}
          >
            Clubs ({clubs.length})
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'moderation'
                ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border-white/10'
            }`}
          >
            <Flag size={12} />
            Moderation ({reportedDiscussions.length})
          </button>
        </div>
      </div>

      {/* ── 2. STAT CARDS ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Campus Users</p>
            <p className="text-2xl font-bold text-white mt-0.5">{users.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs font-medium text-slate-400">Active Student Clubs</p>
            <p className="text-2xl font-bold text-white mt-0.5">{clubs.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Building size={18} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs font-medium text-slate-400">Reported Content</p>
            <p className="text-2xl font-bold text-amber-400 mt-0.5">{reportedDiscussions.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Flag size={18} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs font-medium text-slate-400">System Status</p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <CheckCircle size={16} /> Operational
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Shield size={18} />
          </div>
        </div>
      </div>

      {/* ── 3. TAB 1: USER MANAGEMENT TABLE ──────────────── */}
      {activeTab === 'users' && (
        <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search user name, email, department..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredUsers.length} user records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-xs">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Current Role</th>
                  <th className="py-2.5 px-3">Assign Role</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white shrink-0">
                          {u.name?.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{u.name}</span>
                          <span className="text-xs text-slate-400 font-mono">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-medium">{u.department || 'N/A'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${roleStyles[u.role] || 'bg-slate-800 text-slate-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                      >
                        <option value="student">Student</option>
                        <option value="club_admin">Club Lead</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove User"
                      >
                        <Trash2 size={14} />
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
        <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search club name, category..."
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredClubs.length} club records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-xs">
                  <th className="py-2.5 px-3">Club Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Members</th>
                  <th className="py-2.5 px-3">Faculty Advisor</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClubs.map((c) => (
                  <tr key={c._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-white block">{c.name}</span>
                      <span className="text-xs text-slate-400">{c.tagline}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-indigo-500/20">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-mono">{c.members?.length || 0} students</td>
                    <td className="py-2.5 px-3 text-slate-400">{c.facultyAdvisor?.name || 'Unassigned'}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteClub(c._id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Disband Club"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 5. TAB 3: CONTENT MODERATION ─────────────────── */}
      {activeTab === 'moderation' && (
        <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flag size={16} className="text-amber-400" />
                Reported Content & Discussions Queue
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review flagged posts to ensure campus safety, academic integrity, and community standards.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              {reportedDiscussions.length} items flagged
            </span>
          </div>

          {reportedDiscussions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-white/5 space-y-2">
              <CheckCircle size={32} className="mx-auto text-emerald-400 opacity-60" />
              <p className="font-semibold text-white">All clear! No pending reports</p>
              <p className="text-slate-500">All discussion threads are compliant with campus community guidelines.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reportedDiscussions.map((item) => (
                <div
                  key={item._id}
                  className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Flagged
                        </span>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      </div>
                      <p className="text-xs text-amber-300/90 mt-1 flex items-center gap-1.5 font-medium">
                        <AlertTriangle size={13} />
                        Reason: {item.reportReason || 'Off-topic or non-compliant content'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDismissReport(item._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer"
                        title="Approve post and dismiss report"
                      >
                        <Check size={13} /> Approve Content
                      </button>
                      <button
                        onClick={() => handleDeleteReportedDiscussion(item._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                        title="Delete offending discussion"
                      >
                        <Trash2 size={13} /> Delete Thread
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 whitespace-pre-line bg-slate-950 p-3 rounded-lg border border-white/5">
                    {item.body}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Author: {item.author?.name} ({item.author?.department} Dept)</span>
                    <span className="font-mono">Thread #{item._id?.slice(-6)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
