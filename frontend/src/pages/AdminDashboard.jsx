import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
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
  Edit3,
  Plus,
  X,
  Lock,
  Key,
  Award,
  Megaphone,
  BookOpen,
  Calendar,
  Mail,
  User as UserIcon,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const departmentsList = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'AI&DS', 'CHEM', 'BIO', 'Administration'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [reportedDiscussions, setReportedDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search filters
  const [userSearch, setUserSearch] = useState('');
  const [clubSearch, setClubSearch] = useState('');
  const [annSearch, setAnnSearch] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // users, clubs, announcements, moderation

  // Modals state
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: 'CSE',
    yearOfStudy: 1,
    role: 'student',
    gpa: '8.8 / 10',
    semester: 6,
    specialization: 'Full Stack & AI',
    extracurricularActivities: '',
  });

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: 'CSE',
    yearOfStudy: 1,
    role: 'student',
    gpa: '8.5 / 10',
    semester: 2,
    specialization: 'Computer Science',
    extracurricularActivities: '',
  });

  const [showCreateAnnModal, setShowCreateAnnModal] = useState(false);
  const [newAnnData, setNewAnnData] = useState({
    title: '',
    content: '',
    category: 'Academic',
    priority: 'normal',
    targetAudience: 'all',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, clubsRes, repRes, annRes] = await Promise.all([
        API.get('/users'),
        API.get('/clubs'),
        API.get('/discussions/reported'),
        API.get('/announcements'),
      ]);
      setUsers(usersRes.data || []);
      setClubs(clubsRes.data || []);
      setReportedDiscussions(Array.isArray(repRes.data) ? repRes.data : []);
      setAnnouncements(Array.isArray(annRes.data) ? annRes.data : []);
    } catch (err) {
      toast.error('Failed to load administration data');
    } finally {
      setLoading(false);
    }
  };

  // Open Edit User Modal
  const handleOpenEditUser = (u) => {
    setEditingUser(u);
    setEditFormData({
      name: u.name || '',
      email: u.email || '',
      password: '', // blank by default: only changes if filled
      studentId: u.studentId || '',
      department: u.department || 'CSE',
      yearOfStudy: u.yearOfStudy || 1,
      role: u.role || 'student',
      gpa: u.academicInfo?.gpa || '8.8 / 10',
      semester: u.academicInfo?.semester || (u.yearOfStudy ? u.yearOfStudy * 2 : 2),
      specialization: u.academicInfo?.specialization || 'Full Stack Engineering',
      extracurricularActivities: u.extracurricularActivities?.join(', ') || '',
    });
  };

  // Save Edit User
  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    try {
      const payload = {
        name: editFormData.name,
        email: editFormData.email,
        studentId: editFormData.studentId,
        department: editFormData.department,
        yearOfStudy: Number(editFormData.yearOfStudy),
        role: editFormData.role,
        academicInfo: {
          gpa: editFormData.gpa,
          semester: Number(editFormData.semester),
          specialization: editFormData.specialization,
        },
        extracurricularActivities: editFormData.extracurricularActivities
          ? editFormData.extracurricularActivities.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
      };

      if (editFormData.password.trim()) {
        payload.password = editFormData.password.trim();
      }

      const res = await API.put(`/users/${editingUser._id}/manage`, payload);
      toast.success('Student credentials and details updated successfully!');
      setUsers((prev) =>
        prev.map((u) => (u._id === editingUser._id ? { ...u, ...res.data.user } : u))
      );
      setEditingUser(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  // Create New Student / User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: newUserData.name,
        email: newUserData.email,
        password: newUserData.password,
        studentId: newUserData.studentId,
        department: newUserData.department,
        yearOfStudy: Number(newUserData.yearOfStudy),
        role: newUserData.role,
        academicInfo: {
          gpa: newUserData.gpa,
          semester: Number(newUserData.semester),
          specialization: newUserData.specialization,
        },
        extracurricularActivities: newUserData.extracurricularActivities
          ? newUserData.extracurricularActivities.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
      };

      const res = await API.post('/users', payload);
      toast.success('Student account created successfully!');
      setUsers((prev) => [res.data.user, ...prev]);
      setShowAddUserModal(false);
      setNewUserData({
        name: '',
        email: '',
        password: '',
        studentId: '',
        department: 'CSE',
        yearOfStudy: 1,
        role: 'student',
        gpa: '8.5 / 10',
        semester: 2,
        specialization: 'Computer Science',
        extracurricularActivities: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create student account');
    } finally {
      setSaving(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user from the campus directory?'))
      return;
    try {
      await API.delete(`/users/${userId}`);
      toast.success('User removed from campus records');
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Delete Club
  const handleDeleteClub = async (clubId) => {
    if (!window.confirm('Are you sure you want to disband this club?'))
      return;
    try {
      await API.delete(`/clubs/${clubId}`);
      toast.success('Club disbanded');
      setClubs((prev) => prev.filter((c) => c._id !== clubId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete club');
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (annId) => {
    if (!window.confirm('Are you sure you want to permanently delete this announcement?'))
      return;
    try {
      await API.delete(`/announcements/${annId}`);
      toast.success('Announcement deleted');
      setAnnouncements((prev) => prev.filter((a) => a._id !== annId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  // Create Announcement
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.post('/announcements', newAnnData);
      toast.success('Announcement broadcasted successfully!');
      setAnnouncements((prev) => [res.data, ...prev]);
      setShowCreateAnnModal(false);
      setNewAnnData({
        title: '',
        content: '',
        category: 'Academic',
        priority: 'normal',
        targetAudience: 'all',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish announcement');
    } finally {
      setSaving(false);
    }
  };

  // Dismiss Discussion Report
  const handleDismissReport = async (discussionId) => {
    try {
      await API.put(`/discussions/${discussionId}/dismiss-report`);
      toast.success('Report dismissed, content approved');
      setReportedDiscussions((prev) => prev.filter((d) => d._id !== discussionId));
    } catch (err) {
      toast.error('Failed to dismiss report');
    }
  };

  // Delete Reported Discussion
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

  // Filtered queries
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.department?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.studentId?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredClubs = clubs.filter(
    (c) =>
      c.name?.toLowerCase().includes(clubSearch.toLowerCase()) ||
      c.category?.toLowerCase().includes(clubSearch.toLowerCase())
  );

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title?.toLowerCase().includes(annSearch.toLowerCase()) ||
      a.category?.toLowerCase().includes(annSearch.toLowerCase()) ||
      a.content?.toLowerCase().includes(annSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <ShieldAlert size={12} className="text-indigo-400" />
            <span>Institutional Governance & Records Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Faculty & Administration Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage student credentials, update academic records, control announcements, govern student clubs, and moderate campus content.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border-white/10'
            }`}
          >
            Students & Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              activeTab === 'announcements'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border-white/10'
            }`}
          >
            Announcements ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              activeTab === 'clubs'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
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

      {/* ── 2. METRIC OVERVIEW CARDS ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Enrolled Users</p>
            <p className="text-2xl font-bold text-white mt-0.5">{users.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs font-medium text-slate-400">Active Campus Clubs</p>
            <p className="text-2xl font-bold text-white mt-0.5">{clubs.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Building size={18} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs font-medium text-slate-400">Official Circulars</p>
            <p className="text-2xl font-bold text-white mt-0.5">{announcements.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Megaphone size={18} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs font-medium text-slate-400">Flagged For Review</p>
            <p className="text-2xl font-bold text-amber-400 mt-0.5">{reportedDiscussions.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Flag size={18} />
          </div>
        </div>
      </div>

      {/* ── 3. TAB 1: USERS & STUDENTS (FULL CRUD) ────────── */}
      {activeTab === 'users' && (
        <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search by name, roll no, email, dept..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {filteredUsers.length} records
              </span>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors cursor-pointer"
              >
                <Plus size={14} /> Add Student / User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-xs">
                  <th className="py-2.5 px-3">Student / User</th>
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Department & Year</th>
                  <th className="py-2.5 px-3">Academic GPA</th>
                  <th className="py-2.5 px-3">Role</th>
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
                    <td className="py-2.5 px-3 text-slate-300 font-mono">
                      {u.studentId || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-medium">
                      {u.department} {u.yearOfStudy ? `• Yr ${u.yearOfStudy}` : ''}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-semibold font-mono">
                      {u.academicInfo?.gpa || '8.8 / 10'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${roleStyles[u.role] || 'bg-slate-800 text-slate-300'}`}>
                        {u.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditUser(u)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                          title="Edit Credentials, Details & GPA"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Remove User Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 4. TAB 2: ANNOUNCEMENTS MANAGEMENT (CRUD) ─────── */}
      {activeTab === 'announcements' && (
        <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search announcement title, category..."
                value={annSearch}
                onChange={(e) => setAnnSearch(e.target.value)}
                className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={() => setShowCreateAnnModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Publish Announcement
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-xs">
                  <th className="py-2.5 px-3">Title & Content</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Publisher</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAnnouncements.map((ann) => (
                  <tr key={ann._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 max-w-sm">
                      <span className="font-semibold text-white block truncate">{ann.title}</span>
                      <span className="text-xs text-slate-400 line-clamp-1">{ann.content}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/10">
                        {ann.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-md border uppercase ${
                          ann.priority === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : ann.priority === 'urgent'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                        }`}
                      >
                        {ann.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-medium">
                      {ann.author?.name || 'Administration'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">
                      {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteAnnouncement(ann._id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Announcement"
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

      {/* ── 5. TAB 3: CLUBS & MANDRAMS ───────────────────── */}
      {activeTab === 'clubs' && (
        <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search club name, category..."
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredClubs.length} active clubs
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

      {/* ── 6. TAB 4: CONTENT MODERATION ─────────────────── */}
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

      {/* ── 7. MODAL: EDIT STUDENT DETAILS & CREDENTIALS ──── */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit Student Credentials & Details"
        subtitle="Institutional Override: Update profile details, credentials and academic standing"
        icon={Key}
        maxWidth="max-w-2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-user-form"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {saving ? 'Updating...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form id="edit-user-form" onSubmit={handleSaveUser} className="space-y-4">
          {/* Section: Credentials */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
              <Lock size={13} />
              <span>Login Credentials & Identification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Student ID / Roll No</label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    value={editFormData.studentId}
                    onChange={(e) => setEditFormData({ ...editFormData, studentId: e.target.value })}
                    placeholder="e.g. 110725102107"
                    className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">College Email (Login)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-300 mb-1">Reset Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" size={14} />
                  <input
                    type="password"
                    placeholder="Leave blank to keep unchanged"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    className="w-full bg-[#080B12] border border-amber-500/30 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Academic Record */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <GraduationCap size={13} />
              <span>Academic Performance & Enrollment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                <select
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {departmentsList.map((d) => (
                    <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Year of Study</label>
                <select
                  value={editFormData.yearOfStudy}
                  onChange={(e) => setEditFormData({ ...editFormData, yearOfStudy: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map((y) => (
                    <option key={y} value={y} className="bg-slate-900 text-white">Year {y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Academic CGPA</label>
                <input
                  type="text"
                  value={editFormData.gpa}
                  onChange={(e) => setEditFormData({ ...editFormData, gpa: e.target.value })}
                  placeholder="8.8 / 10"
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Specialization / Major</label>
                <input
                  type="text"
                  value={editFormData.specialization}
                  onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">System Role</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="student">Student</option>
                  <option value="club_admin">Club Lead</option>
                  <option value="faculty">Faculty Member</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Extracurricular Activities</label>
              <input
                type="text"
                value={editFormData.extracurricularActivities}
                onChange={(e) => setEditFormData({ ...editFormData, extracurricularActivities: e.target.value })}
                placeholder="Tamil Debate Team, Rotaract Volunteer, Basketball"
                className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* ── 8. MODAL: ADD NEW STUDENT / MEMBER ─────────────── */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Add New Student / Member"
        subtitle="Direct institutional enrolment: create student login credentials and initialize academic records"
        icon={Plus}
        maxWidth="max-w-2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowAddUserModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-user-form"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {saving ? 'Creating...' : 'Enroll Account'}
            </button>
          </>
        }
      >
        <form id="create-user-form" onSubmit={handleCreateUser} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
              <Lock size={13} />
              <span>Credentials Setup</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    required
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    placeholder="e.g. Vignesh Sundar"
                    className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Student ID / Roll No</label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    value={newUserData.studentId}
                    onChange={(e) => setNewUserData({ ...newUserData, studentId: e.target.value })}
                    placeholder="e.g. CS22088"
                    className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">College Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="email"
                    required
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    placeholder="vignesh@campus.edu"
                    className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Initial Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <GraduationCap size={13} />
              <span>Academic Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                <select
                  value={newUserData.department}
                  onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {departmentsList.map((d) => (
                    <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Year of Study</label>
                <select
                  value={newUserData.yearOfStudy}
                  onChange={(e) => setNewUserData({ ...newUserData, yearOfStudy: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map((y) => (
                    <option key={y} value={y} className="bg-slate-900 text-white">Year {y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Initial CGPA</label>
                <input
                  type="text"
                  value={newUserData.gpa}
                  onChange={(e) => setNewUserData({ ...newUserData, gpa: e.target.value })}
                  placeholder="8.5 / 10"
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Specialization</label>
                <input
                  type="text"
                  value={newUserData.specialization}
                  onChange={(e) => setNewUserData({ ...newUserData, specialization: e.target.value })}
                  placeholder="e.g. Data Science & AI"
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="student">Student</option>
                  <option value="club_admin">Club Lead</option>
                  <option value="faculty">Faculty Member</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Extracurricular Activities</label>
              <input
                type="text"
                value={newUserData.extracurricularActivities}
                onChange={(e) => setNewUserData({ ...newUserData, extracurricularActivities: e.target.value })}
                placeholder="Robotics Club, Tennis, NSS Volunteer"
                className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* ── 9. MODAL: PUBLISH ANNOUNCEMENT ────────────────── */}
      <Modal
        isOpen={showCreateAnnModal}
        onClose={() => setShowCreateAnnModal(false)}
        title="Publish Official Notice"
        subtitle="Broadcast academic alerts, circulars, or urgent notifications to all campus students"
        icon={Megaphone}
        maxWidth="max-w-xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowCreateAnnModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-ann-form"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {saving ? 'Publishing...' : 'Broadcast Notice'}
            </button>
          </>
        }
      >
        <form id="create-ann-form" onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notice Title</label>
            <input
              type="text"
              required
              value={newAnnData.title}
              onChange={(e) => setNewAnnData({ ...newAnnData, title: e.target.value })}
              placeholder="e.g. End Semester Exam Timetable Released"
              className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={newAnnData.category}
                onChange={(e) => setNewAnnData({ ...newAnnData, category: e.target.value })}
                className="w-full bg-[#080B12] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Academic">Academic</option>
                <option value="Emergency">Emergency</option>
                <option value="General">General</option>
                <option value="Club Activity">Club Activity</option>
                <option value="Placement & Career">Placement & Career</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
              <select
                value={newAnnData.priority}
                onChange={(e) => setNewAnnData({ ...newAnnData, priority: e.target.value })}
                className="w-full bg-[#080B12] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Announcement Body</label>
            <textarea
              rows="4"
              required
              value={newAnnData.content}
              onChange={(e) => setNewAnnData({ ...newAnnData, content: e.target.value })}
              placeholder="Detail the instructions, hall tickets, deadlines, or contact info..."
              className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
