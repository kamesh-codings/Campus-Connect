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
  BookOpen,
  Activity,
  Award,
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
    extracurricularActivities: '',
    gpa: '',
    specialization: '',
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
        extracurricularActivities: res.data.extracurricularActivities?.join(', ') || '',
        gpa: res.data.academicInfo?.gpa || '8.8 / 10',
        specialization: res.data.academicInfo?.specialization || 'Full Stack & AI',
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
        extracurricularActivities: formData.extracurricularActivities.split(',').map((a) => a.trim()).filter(Boolean),
        academicInfo: {
          gpa: formData.gpa,
          specialization: formData.specialization,
          semester: formData.yearOfStudy ? Number(formData.yearOfStudy) * 2 : 6,
        },
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

  const defaultAchievements = [
    { title: '1st Prize Hackathon 2025', icon: '🏆', description: 'Winner of State-Level Smart Tamil Nadu Hackathon' },
    { title: 'Centum in Data Structures', icon: '⭐', description: 'Academic excellence certificate from HOD' },
    { title: 'Best Campus Volunteer', icon: '🎖️', description: 'Recognized for organizing Pongal Thiruvizha' }
  ];

  const achievementsList = p?.achievements && p.achievements.length > 0 ? p.achievements : defaultAchievements;

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

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3.5 pt-3 border-t border-white/5 text-xs text-slate-400">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5">
                <Building size={13} className="text-indigo-400" />
                {p?.department || 'CSE'} Department
              </span>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5">
                <GraduationCap size={13} className="text-cyan-400" />
                Year {p?.yearOfStudy || '3'} of 4 (Sem {p?.academicInfo?.semester || (p?.yearOfStudy ? p.yearOfStudy * 2 : 6)})
              </span>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5">
                <BookOpen size={13} className="text-emerald-400" />
                CGPA: {p?.academicInfo?.gpa || '8.8 / 10'}
              </span>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5">
                <Shield size={13} className="text-amber-400" />
                Role: {p?.role === 'club_admin' ? 'Club Lead' : p?.role || 'Student'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. ACADEMIC INFO & REPUTATION BANNER ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Academic Profile */}
        <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Academic Information
          </span>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-400">Current CGPA:</span>
              <span className="font-bold text-white font-mono">{p?.academicInfo?.gpa || '8.8 / 10'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-400">Specialization:</span>
              <span className="font-semibold text-indigo-300 truncate max-w-[150px]">{p?.academicInfo?.specialization || 'Full Stack & AI'}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Enrolled Clubs:</span>
              <span className="font-semibold text-cyan-300 font-mono">{p?.joinedClubs?.length || 2} active</span>
            </div>
          </div>
        </div>

        {/* Reputation Tier */}
        <div className="md:col-span-2 p-4 rounded-xl bg-[#0D111A] border border-indigo-500/20 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Trophy size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white">Campus Reputation Tier</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {tier.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Awarded for hackathon RSVP check-ins and forum contributions.</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-bold text-white">{userPoints}</span>
              <span className="text-xs text-indigo-300 ml-1 font-mono font-medium">pts</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5 mt-2">
            <div className="text-center p-1.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-xs font-bold text-white block">Pioneer</span>
              <span className="text-xs text-slate-400">Verified</span>
            </div>
            <div className="text-center p-1.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-xs font-bold text-white block">Passes</span>
              <span className="text-xs text-slate-400">QR Ready</span>
            </div>
            <div className="text-center p-1.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-xs font-bold text-white block">Member</span>
              <span className="text-xs text-slate-400">Active</span>
            </div>
            <div className="text-center p-1.5 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-xs font-bold text-white block">Top +25</span>
              <span className="text-xs text-slate-400">Contributor</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. SKILLS, INTERESTS & EXTRACURRICULARS ────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Skills */}
        <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <Tag size={13} className="text-indigo-400" />
            Technical Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {p?.skills && p.skills.length > 0 ? (
              p.skills.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 text-xs font-medium"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">React, Node.js, Python</span>
            )}
          </div>
        </div>

        {/* Interests */}
        <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <Sparkles size={13} className="text-cyan-400" />
            Campus Interests
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {p?.interests && p.interests.length > 0 ? (
              p.interests.map((i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 text-xs font-medium"
                >
                  {i}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">Hackathons, Robotics, AI</span>
            )}
          </div>
        </div>

        {/* Extracurricular Activities */}
        <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <Activity size={13} className="text-emerald-400" />
            Extracurriculars
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {p?.extracurricularActivities && p.extracurricularActivities.length > 0 ? (
              p.extracurricularActivities.map((act) => (
                <span
                  key={act}
                  className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-xs font-medium"
                >
                  {act}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">Tamil Debate Team, Rotaract Volunteer, Basketball</span>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. STUDENT ACHIEVEMENTS SHOWCASE ──────────────── */}
      <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-md space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Award size={14} className="text-amber-400" />
          Verified Achievements & Honors
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {achievementsList.map((ach, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-slate-900 border border-white/5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{ach.icon || '🏆'}</span>
                <h4 className="text-xs font-bold text-white truncate">{ach.title}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-snug">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. EDIT PROFILE MODAL ────────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="bg-[#0D111A] max-w-lg w-full rounded-xl p-6 relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl font-sans">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Edit Student Community Profile</h2>
            <p className="text-xs text-slate-400 mb-5">
              Update your academic info, skills, achievements, and extracurricular activities.
            </p>

            <form onSubmit={handleUpdate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {['admin', 'faculty'].includes(user?.role) ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-[#080B12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Year of Study</label>
                      <select
                        value={formData.yearOfStudy}
                        onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                        className="w-full bg-[#080B12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        {[1, 2, 3, 4, 5].map((y) => (
                          <option key={y} value={y} className="bg-slate-900 text-white">Year {y}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">CGPA (e.g. 8.8)</label>
                      <input
                        type="text"
                        value={formData.gpa}
                        onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                        placeholder="8.8 / 10"
                        className="w-full bg-[#080B12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Academic Specialization / Minor</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="e.g. Full Stack & Indic NLP"
                      className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </>
              ) : (
                <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
                    <Shield size={13} />
                    <span>Verified Institutional Records</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Department: <strong className="text-white">{p?.department}</strong> • Year: <strong className="text-white">{p?.yearOfStudy}</strong> • CGPA: <strong className="text-emerald-400">{p?.academicInfo?.gpa || '8.8 / 10'}</strong>
                  </p>
                  <p className="text-[10px] text-slate-500 italic">
                    Academic records and official credentials can only be edited by Faculty Advisors and Campus Administration.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Statement</label>
                <textarea
                  rows="2"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share your interests, club leadership roles, or tech stack..."
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Technical Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, Node.js, Python, Tailwind"
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Campus Interests (comma-separated)</label>
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="Hackathons, AI Research, Robotics"
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Extracurricular Activities (comma-separated)</label>
                <input
                  type="text"
                  value={formData.extracurricularActivities}
                  onChange={(e) => setFormData({ ...formData, extracurricularActivities: e.target.value })}
                  placeholder="Tamil Debate Team, NSS Volunteer, Chess Club"
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
