import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  ExternalLink,
  X,
  UserCheck,
  UserPlus,
  Award,
  Sparkles,
  BookOpen,
  Code,
  Palette,
  Trophy,
  HeartHandshake,
  GraduationCap,
  ChevronRight,
  Globe,
  Github,
  Linkedin,
} from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Social & Outreach', 'Academic'];

const categoryIcons = {
  Technical: Code,
  Cultural: Palette,
  Sports: Trophy,
  'Social & Outreach': HeartHandshake,
  Academic: GraduationCap,
};

const categoryGradients = {
  Technical: 'from-indigo-600/30 to-cyan-600/20 border-indigo-500/30 text-indigo-400',
  Cultural: 'from-purple-600/30 to-pink-600/20 border-purple-500/30 text-purple-400',
  Sports: 'from-amber-600/30 to-orange-600/20 border-amber-500/30 text-amber-400',
  'Social & Outreach': 'from-emerald-600/30 to-teal-600/20 border-emerald-500/30 text-emerald-400',
  Academic: 'from-blue-600/30 to-indigo-600/20 border-blue-500/30 text-blue-400',
};

const Clubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Technical',
    tagline: '',
    description: '',
    socialLinks: {
      github: '',
      linkedin: '',
      instagram: '',
      website: '',
    },
  });

  const canCreate = ['admin', 'faculty', 'club_admin'].includes(user?.role);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/clubs');
      setClubs(res.data);
    } catch (err) {
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (clubId) => {
    try {
      await API.post(`/clubs/${clubId}/join`);
      toast.success('Joined club successfully!');
      fetchClubs();
      if (selectedClub && selectedClub._id === clubId) {
        const updated = await API.get(`/clubs/${clubId}`);
        setSelectedClub(updated.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join club');
    }
  };

  const handleLeave = async (clubId) => {
    try {
      await API.post(`/clubs/${clubId}/leave`);
      toast.success('Left club');
      fetchClubs();
      if (selectedClub && selectedClub._id === clubId) {
        const updated = await API.get(`/clubs/${clubId}`);
        setSelectedClub(updated.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to leave club');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/clubs', formData);
      toast.success('Club registered successfully!');
      setShowCreateModal(false);
      setFormData({
        name: '',
        category: 'Technical',
        tagline: '',
        description: '',
        socialLinks: { github: '', linkedin: '', instagram: '', website: '' },
      });
      fetchClubs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create club');
    }
  };

  const filteredClubs = clubs.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tagline?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* ── 1. HEADER ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Sparkles size={13} className="text-cyan-400" />
            <span>Campus Student Organizations & Chapters</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-['Outfit']">
            Clubs & Mandrams
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Connect with student teams, collaborate on hackathons, and attend chapter workshops.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} /> Charter a Club
          </button>
        )}
      </div>

      {/* ── 2. SEARCH & CATEGORIES ──────────────────────── */}
      <div className="glass p-4 sm:p-5 rounded-2xl space-y-4 border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by club name, tech domain, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#080B12] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {filteredClubs.length} verified campus organizations
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. CLUBS GRID ────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredClubs.length === 0 ? (
        <div className="p-10 text-center rounded-xl bg-[#0D111A] border border-white/10">
          <Users size={40} className="mx-auto text-slate-600 mb-3 opacity-50" />
          <h3 className="text-base font-semibold text-white">No communities found</h3>
          <p className="text-slate-400 text-xs mt-1">Try another category or search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club) => {
            const isMember = club.members?.some(
              (m) => m.user?._id === user?._id || m.user === user?._id
            );

            return (
              <div
                key={club._id}
                className="p-4 rounded-xl bg-[#0D111A] border border-white/10 hover:border-indigo-500/40 transition-all duration-200 shadow-sm flex flex-col justify-between group"
              >
                <div>
                  {/* Top: Avatar & Category */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center font-bold text-base text-white">
                      {club.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-indigo-500/20">
                      {club.category}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                    {club.name}
                  </h3>

                  {club.tagline && (
                    <p className="text-xs text-cyan-400 font-medium mb-2 italic">
                      "{club.tagline}"
                    </p>
                  )}

                  <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                    {club.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-white/5 pt-2.5 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Users size={12} className="text-indigo-400" />
                      <span>{club.members?.length || 0} Members</span>
                    </div>
                    {club.facultyAdvisor && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Award size={12} className="text-amber-400" />
                        <span className="truncate">Faculty Guided</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedClub(club)}
                    className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    View Workspace
                  </button>

                  {isMember ? (
                    <button
                      onClick={() => handleLeave(club._id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 hover:bg-rose-500/20 text-emerald-400 hover:text-rose-300 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <UserCheck size={12} /> Joined
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(club._id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors cursor-pointer shadow-sm"
                    >
                      <UserPlus size={12} /> Join Club
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 4. CLUB DETAIL / WORKSPACE MODAL ─────────────── */}
      {selectedClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="glass max-w-lg w-full rounded-xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <button
              onClick={() => setSelectedClub(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-base text-white">
                {selectedClub.name.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                  {selectedClub.category}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedClub.name}</h2>
              </div>
            </div>

            {selectedClub.tagline && (
              <p className="text-xs text-cyan-400 font-medium italic mb-3">
                "{selectedClub.tagline}"
              </p>
            )}

            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-white/5 text-xs space-y-1.5 mb-3">
              <p className="text-slate-300">
                <strong className="text-white">Active Members:</strong> {selectedClub.members?.length || 0} students
              </p>
              {selectedClub.facultyAdvisor && (
                <p className="text-slate-300">
                  <strong className="text-white">Faculty Advisor:</strong>{' '}
                  {selectedClub.facultyAdvisor?.name || 'Assigned Faculty'}
                </p>
              )}
            </div>

            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1.5">About this Organization</h4>
            <p className="text-slate-300 text-xs leading-relaxed mb-4 whitespace-pre-line">
              {selectedClub.description}
            </p>

            {/* Social Links */}
            {selectedClub.socialLinks && Object.values(selectedClub.socialLinks).some(Boolean) && (
              <div className="mb-4 border-t border-white/5 pt-3">
                <h5 className="text-xs font-semibold text-white mb-2">Club Links & Repos</h5>
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedClub.socialLinks.website && (
                    <a
                      href={selectedClub.socialLinks.website}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 rounded-md text-indigo-300 border border-white/5 flex items-center gap-1.5"
                    >
                      <Globe size={12} /> Website
                    </a>
                  )}
                  {selectedClub.socialLinks.github && (
                    <a
                      href={selectedClub.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 rounded-md text-indigo-300 border border-white/5 flex items-center gap-1.5"
                    >
                      <Github size={12} /> GitHub
                    </a>
                  )}
                  {selectedClub.socialLinks.linkedin && (
                    <a
                      href={selectedClub.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 rounded-md text-indigo-300 border border-white/5 flex items-center gap-1.5"
                    >
                      <Linkedin size={12} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedClub(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
              {selectedClub.members?.some(
                (m) => m.user?._id === user?._id || m.user === user?._id
              ) ? (
                <button
                  onClick={() => handleLeave(selectedClub._id)}
                  className="px-4 py-2 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-600/30 cursor-pointer"
                >
                  Leave Club
                </button>
              ) : (
                <button
                  onClick={() => handleJoin(selectedClub._id)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm cursor-pointer"
                >
                  Join Club
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 5. CHARTER CLUB MODAL ───────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="glass max-w-lg w-full rounded-xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-1 font-['Outfit']">Charter a New Club</h2>
            <p className="text-xs text-slate-400 mb-6">
              Establish a new official campus community.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Club Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Developer Student Club"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Motto / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Innovate, Collaborate, Build"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Mission & Description *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe your club mission, regular activities, and member goals..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  Charter Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clubs;
