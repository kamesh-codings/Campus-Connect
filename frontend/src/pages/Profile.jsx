import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Building,
  Edit3,
  X,
  Tag,
  Users,
  Ticket,
  Sparkles,
  Trophy,
  Flame,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    yearOfStudy: '',
    bio: '',
    skills: '',
    interests: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/users/profile/${user?._id || ''}`);
      setProfileData(res.data);
      setFormData({
        name: res.data.name || '',
        department: res.data.department || '',
        yearOfStudy: res.data.yearOfStudy || '',
        bio: res.data.bio || '',
        skills: res.data.skills?.join(', ') || '',
        interests: res.data.interests?.join(', ') || '',
      });
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        yearOfStudy: formData.yearOfStudy ? Number(formData.yearOfStudy) : undefined,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map((i) => i.trim()).filter(Boolean),
      };

      const res = await API.put('/users/profile', payload);
      setProfileData(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Profile updated successfully!');
      setShowEditModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const p = profileData || user;
  const userPoints = p?.points || 75;

  const getTier = (pts) => {
    if (pts >= 150) return { name: 'Campus Legend', badge: 'Tier 3 Gold' };
    if (pts >= 75) return { name: 'Campus Contributor', badge: 'Tier 2 Silver' };
    return { name: 'Campus Explorer', badge: 'Tier 1 Bronze' };
  };

  const tier = getTier(userPoints);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-12 font-sans">
      {/* ── 1. STUDENT IDENTITY HERO BANNER ──────────────────── */}
      <div className="p-6 sm:p-7 rounded-xl bg-[#0D111A] border border-white/10 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shrink-0">
            {p?.name?.charAt(0) || 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {p?.name}
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {p?.email} • ID: {p?.studentId || '21CS089'}
                </p>
              </div>

              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-colors cursor-pointer self-center sm:self-start"
              >
                <Edit3 size={13} /> Edit Profile
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-2">
              {p?.bio || 'Campus student participating in hackathons, open source clubs, and technical workshops.'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-3.5 pt-3 border-t border-white/5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-white/5">
                <Building size={13} className="text-indigo-400" />
                {p?.department || 'CSE'} Department
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-white/5">
                <GraduationCap size={13} className="text-cyan-400" />
                Year {p?.yearOfStudy || '3'} of 4
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-white/5">
                <Shield size={13} className="text-emerald-400" />
                Role: {p?.role === 'club_admin' ? 'Club Lead' : p?.role || 'Student'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. REPUTATION & ACHIEVEMENTS BANNER ──────────────── */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#0D111A] border border-indigo-500/20 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Trophy size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Campus Reputation Tier</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {tier.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Earned through event attendance, club memberships, and forum participation.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-2xl font-bold text-white">
              {userPoints}
            </span>
            <span className="text-xs text-indigo-300 ml-1 font-mono font-medium">pts</span>
            <span className="text-xs text-slate-400 block mt-0.5">Reputation Score</span>
          </div>
        </div>

        {/* Badges showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3.5 border-t border-white/5">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 flex items-center gap-2.5">
            <Sparkles size={16} className="text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">Campus Pioneer</p>
              <p className="text-xs text-slate-400">Early adopter</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 flex items-center gap-2.5">
            <Ticket size={16} className="text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">Pass Holder</p>
              <p className="text-xs text-slate-400">QR Verified</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 flex items-center gap-2.5">
            <Users size={16} className="text-cyan-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">Club Member</p>
              <p className="text-xs text-slate-400">Active member</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 flex items-center gap-2.5">
            <Flame size={16} className="text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">Top Contributor</p>
              <p className="text-xs text-slate-400">+25 pts check-in</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. SKILLS & INTERESTS ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Skills */}
        <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Tag size={14} className="text-indigo-400" />
            Technical Skills & Domains
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {p?.skills && p.skills.length > 0 ? (
              p.skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 text-xs font-medium"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">No skills added yet. Click edit profile to add.</span>
            )}
          </div>
        </div>

        {/* Interests */}
        <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-cyan-400" />
            Campus Interests & Passions
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {p?.interests && p.interests.length > 0 ? (
              p.interests.map((i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 text-xs font-medium"
                >
                  {i}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">No interests added yet. Click edit profile to add.</span>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. EDIT PROFILE MODAL ────────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="bg-[#0D111A] max-w-lg w-full rounded-xl p-6 relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl font-sans">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Edit Student Profile</h2>
            <p className="text-xs text-slate-400 mb-5">
              Update your public campus identity and portfolio details.
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Year of Study</label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {[1, 2, 3, 4].map((y) => (
                      <option key={y} value={y} className="bg-slate-900 text-white">Year {y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Statement</label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share your interests, club leadership roles, or tech stack..."
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, Node.js, Python, Figma"
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Interests (comma-separated)</label>
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="Hackathons, AI Research, Robotics, Music"
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
