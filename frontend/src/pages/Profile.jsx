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
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login } = useAuth();
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
      // update local user state if token was returned or user object changed
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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const p = profileData || user;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Profile Header Banner Card */}
      <div className="card relative overflow-hidden p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl gradient-primary flex items-center justify-center text-4xl font-extrabold text-white shadow-xl flex-shrink-0">
            {p?.name?.charAt(0) || 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                  {p?.name}
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                  {p?.email}
                </p>
              </div>

              <button
                onClick={() => setShowEditModal(true)}
                className="btn-outline text-xs inline-flex items-center gap-1.5 self-center sm:self-start"
              >
                <Edit3 size={14} />
                Edit Profile
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="badge-primary text-xs uppercase tracking-wider font-semibold">
                {p?.role}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-surface-light text-text-muted flex items-center gap-1.5">
                <Building size={12} /> {p?.department}
              </span>
              {p?.yearOfStudy && (
                <span className="text-xs px-3 py-1 rounded-full bg-surface-light text-text-muted flex items-center gap-1.5">
                  <GraduationCap size={12} /> Year {p?.yearOfStudy}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {p?.bio && (
          <div className="mt-6 pt-6 border-t border-glass-border">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              About Me
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {p.bio}
            </p>
          </div>
        )}
      </div>

      {/* Reputation Points & Achievements Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-amber-500/10">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {p?.points || 125}
                </span>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Reputation Pts
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Level {(Math.floor((p?.points || 125) / 100)) + 1} Campus Contributor • {100 - ((p?.points || 125) % 100)} pts to next milestone
              </p>
            </div>
          </div>

          {/* Badges / Achievements List */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 flex items-center gap-2 text-xs font-semibold text-slate-200">
              <span>🎫</span> Event Explorer
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 flex items-center gap-2 text-xs font-semibold text-slate-200">
              <span>🌟</span> Campus Pioneer
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 flex items-center gap-2 text-xs font-semibold text-slate-200">
              <span>🏛️</span> Muthamil Scholar
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Skills, Interests & Clubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills & Expertise */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Award className="text-primary-light" size={18} />
            <h3 className="text-base font-['Outfit']">Skills & Tech Stack</h3>
          </div>

          {p?.skills && p.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {p.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-surface-light text-primary-light text-xs font-medium border border-primary/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted italic">
              No skills added yet. Click "Edit Profile" to showcase your talents.
            </p>
          )}
        </div>

        {/* Interests */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Tag className="text-secondary" size={18} />
            <h3 className="text-base font-['Outfit']">Fields of Interest</h3>
          </div>

          {p?.interests && p.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {p.interests.map((interest, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-surface-light text-secondary text-xs font-medium border border-secondary/20"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted italic">
              No interests specified yet.
            </p>
          )}
        </div>
      </div>

      {/* Joined Clubs */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 text-white font-bold">
          <Users className="text-success" size={18} />
          <h3 className="text-base font-['Outfit']">Clubs & Organizations</h3>
        </div>

        {p?.joinedClubs && p.joinedClubs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {p.joinedClubs.map((club) => (
              <div
                key={club._id || club}
                className="p-3.5 rounded-xl bg-surface-light/40 border border-glass-border flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center font-bold text-white shadow-sm">
                  {club.name ? club.name.charAt(0) : 'C'}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {club.name || 'Campus Club'}
                  </h4>
                  <p className="text-xs text-text-muted truncate">
                    {club.category || 'Member'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-muted italic">
            You haven't joined any clubs yet. Explore the Clubs tab to find communities!
          </p>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass max-w-lg w-full rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-1 font-['Outfit']">Edit Profile</h2>
            <p className="text-xs text-text-secondary mb-6">
              Update your information visible to peers and clubs.
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Year of Study
                  </label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    className="input-field"
                  >
                    <option value="1" className="bg-surface">Year 1</option>
                    <option value="2" className="bg-surface">Year 2</option>
                    <option value="3" className="bg-surface">Year 3</option>
                    <option value="4" className="bg-surface">Year 4</option>
                    <option value="5" className="bg-surface">Year 5 (PG / Dual)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Bio / Statement
                </label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share a short introduction about your academic and extracurricular passions..."
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, Python, Machine Learning, UI/UX Design, Public Speaking"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Interests (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="Robotics, Open Source, Badminton, Photography, Debate"
                  className="input-field"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-glass-border">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-outline text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Changes
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
