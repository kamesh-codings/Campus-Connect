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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-danger/10 text-danger text-xs font-semibold mb-2">
          <Shield size={14} />
          Super Admin Console
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-['Outfit']">
          Campus Governance & Moderation
        </h1>
        <p className="text-text-secondary mt-1">
          Manage system users, assign institutional roles, and oversee clubs and contents.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-glass-border pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-primary text-white shadow-md'
              : 'text-text-secondary hover:text-white hover:bg-surface-light'
          }`}
        >
          User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('clubs')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'clubs'
              ? 'bg-primary text-white shadow-md'
              : 'text-text-secondary hover:text-white hover:bg-surface-light'
          }`}
        >
          Campus Clubs ({clubs.length})
        </button>
      </div>

      {/* Users Management Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                placeholder="Search user name, email, dept..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="input-field pl-10 text-xs"
              />
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-text-secondary">
                <thead className="bg-surface-light text-text-primary uppercase tracking-wider text-[11px] font-bold border-b border-glass-border">
                  <tr>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Year</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-surface-light/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {u.name?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{u.name}</p>
                            <p className="text-[11px] text-text-muted truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-primary">{u.department}</td>
                      <td className="py-3 px-4">{u.yearOfStudy ? `Year ${u.yearOfStudy}` : '-'}</td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-surface border border-glass-border text-xs text-white focus:outline-none focus:border-primary"
                        >
                          <option value="student">Student</option>
                          <option value="club_admin">Club Lead</option>
                          <option value="faculty">Faculty</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u._id !== user?._id && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                            title="Remove User"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Clubs Management Tab */}
      {activeTab === 'clubs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                placeholder="Search club name or category..."
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                className="input-field pl-10 text-xs"
              />
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-text-secondary">
                <thead className="bg-surface-light text-text-primary uppercase tracking-wider text-[11px] font-bold border-b border-glass-border">
                  <tr>
                    <th className="py-3.5 px-4">Club Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Active Members</th>
                    <th className="py-3.5 px-4">Faculty Advisor</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {filteredClubs.map((c) => (
                    <tr key={c._id} className="hover:bg-surface-light/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {c.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{c.name}</p>
                            <p className="text-[11px] text-text-muted truncate max-w-[200px]">
                              {c.tagline || c.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="badge-primary text-[11px]">{c.category}</span>
                      </td>
                      <td className="py-3 px-4 text-text-primary font-semibold">
                        {c.members?.length || 0}
                      </td>
                      <td className="py-3 px-4">
                        {c.facultyAdvisor?.name || 'Unassigned'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteClub(c._id)}
                          className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                          title="Disband Club"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
