import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  GraduationCap,
  Building,
  Calendar,
  Award,
  Edit3,
  X,
  Tag,
  Users,
  Ticket,
  CheckCircle,
  Sparkles,
  Trophy,
  Flame,
  Shield,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, clubs, events, achievements

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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const p = profileData || user;
  const userPoints = p?.points || 75;

  const getTier = (pts) => {
    if (pts >= 150) return { name: 'Campus Legend', color: 'from-amber-400 to-orange-500', badge: 'Tier 3 Gold' };
    if (pts >= 75) return { name: 'Campus Contributor', color: 'from-indigo-400 to-cyan-400', badge: 'Tier 2 Silver' };
    return { name: 'Campus Explorer', color: 'from-slate-400 to-slate-200', badge: 'Tier 1 Bronze' };
  };

  const tier = getTier(userPoints);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-12">
      {/* ── 1. STUDENT IDENTITY HERO BANNER ──────────────────── */}
      <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-4xl font-extrabold text-white shadow-2xl shrink-0">
            {p?.name?.charAt(0) || 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                  {p?.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
                  {p?.email} • ID: {p?.studentId || '21CS089'}
                </p>
              </div>

              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer self-center sm:self-start"
              >
                <Edit3 size={14} /> Edit Profile
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-2">
              {p?.bio || 'Campus student participating in hackathons, open source clubs, and technical workshops.'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4 pt-3 border-t border-white/5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Building size={14} className="text-indigo-400" />
                {p?.department || 'CSE'} Department
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap size={14} className="text-cyan-400" />
                Year {p?.yearOfStudy || '3'} of 4
              </span>
              <span className="flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-400" />
                Role: {p?.role === 'club_admin' ? 'Club Lead' : p?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. REPUTATION & ACHIEVEMENTS BANNER ──────────────── */}
      <div className="glass p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-900 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Trophy size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-['Outfit']">Campus Reputation Tier</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {tier.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Earned through event attendance, club memberships, and answering forum questions.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-3xl font-black bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent font-['Outfit']">
              {userPoints}
            </span>
            <span className="text-xs text-slate-400 block font-mono font-semibold">Reputation Points</span>
          </div>
        </div>

        {/* Badges showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/5">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center gap-2.5">
            <Sparkles size={16} className="text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Campus Pioneer</p>
              <p className="text-[10px] text-slate-400">Early adopter</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center gap-2.5">
            <Ticket size={16} className="text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Pass Holder</p>
              <p className="text-[10px] text-slate-400">QR Verified</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center gap-2.5">
            <Users size={16} className="text-cyan-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Club Member</p>
              <p className="text-[10px] text-slate-400">Active member</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center gap-2.5">
            <Flame size={16} className="text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Top Contributor</p>
              <p className="text-[10px] text-slate-400">+25 pts check-in</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. SKILLS & INTERESTS ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Skills */}
        <div className="glass p-6 rounded-3xl border border-white/10 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Tag size={16} className="text-indigo-400" />
            Technical Skills & Domains
          </h3>
          <div className="flex flex-wrap gap-2">
            {p?.skills && p.skills.length > 0 ? (
              p.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 text-xs font-semibold"
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
        <div className="glass p-6 rounded-3xl border border-white/10 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-cyan-400" />
            Campus Interests & Passions
          </h3>
          <div className="flex flex-wrap gap-2">
            {p?.interests && p.interests.length > 0 ? (
              p.interests.map((i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 text-xs font-semibold"
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
          <div className="glass max-w-lg w-full rounded-3xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-black text-white mb-1 font-['Outfit']">Edit Student Profile</h2>
            <p className="text-xs text-slate-400 mb-6">
              Update your public campus identity and portfolio details.
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Year of Study</label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {[1, 2, 3, 4].map((y) => (
                      <option key={y} value={y} className="bg-slate-900 text-white">Year {y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Bio / Statement</label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share your interests, club leadership roles, or tech stack..."
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, Node.js, Python, Figma"
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Interests (comma-separated)</label>
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="Hackathons, AI Research, Robotics, Music"
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 cursor-pointer"
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
