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
  BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Social & Outreach', 'Academic'];

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
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-['Outfit']">
            College Clubs & Communities
          </h1>
          <p className="text-text-secondary mt-1">
            Connect with student organizations, collaborate on projects, and participate in club activities.
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus size={18} />
            Start a Club
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="glass p-4 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search by club name, keywords, domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="text-xs text-text-muted font-medium">
            Showing {filteredClubs.length} active communities
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary/20 text-primary-light border border-primary/40'
                  : 'bg-surface-light text-text-secondary hover:bg-surface-lighter hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredClubs.length === 0 ? (
        <div className="glass p-12 text-center rounded-2xl">
          <Users size={48} className="mx-auto text-text-muted mb-3 opacity-40" />
          <h3 className="text-lg font-semibold text-text-primary">No clubs found</h3>
          <p className="text-text-secondary text-sm mt-1">Try another category or search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => {
            const isMember = club.members?.some(
              (m) => m.user?._id === user?._id || m.user === user?._id
            );

            return (
              <div
                key={club._id}
                className="card group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center font-bold text-lg text-white shadow-lg">
                      {club.name.charAt(0)}
                    </div>
                    <span className="badge-primary text-xs font-semibold">
                      {club.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-primary-light transition-colors line-clamp-1 mb-1">
                    {club.name}
                  </h3>

                  {club.tagline && (
                    <p className="text-xs text-secondary font-medium mb-3 italic">
                      "{club.tagline}"
                    </p>
                  )}

                  <p className="text-text-secondary text-xs line-clamp-3 mb-4 leading-relaxed">
                    {club.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-text-muted border-t border-glass-border pt-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-primary-light" />
                      <span>{club.members?.length || 0} Members</span>
                    </div>
                    {club.facultyAdvisor && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Award size={14} className="text-accent" />
                        <span className="truncate">Advisor Guided</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-glass-border flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedClub(club)}
                    className="text-xs font-semibold text-text-secondary hover:text-white transition-colors"
                  >
                    View Details
                  </button>

                  {isMember ? (
                    <button
                      onClick={() => handleLeave(club._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light hover:bg-danger/20 hover:text-danger text-text-secondary text-xs font-semibold transition-colors"
                    >
                      <UserCheck size={14} className="text-success" />
                      Joined
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(club._id)}
                      className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
                    >
                      <UserPlus size={14} />
                      Join Club
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Club Details Modal */}
      {selectedClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass max-w-lg w-full rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedClub(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center font-bold text-lg text-white">
                {selectedClub.name.charAt(0)}
              </div>
              <div>
                <span className="badge-primary text-xs font-semibold">
                  {selectedClub.category}
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">{selectedClub.name}</h2>
              </div>
            </div>

            {selectedClub.tagline && (
              <p className="text-xs text-secondary font-medium italic mb-4">
                "{selectedClub.tagline}"
              </p>
            )}

            <div className="bg-surface-light/40 p-4 rounded-xl text-xs space-y-2 mb-4">
              <p className="text-text-secondary">
                <strong className="text-white">Active Members:</strong> {selectedClub.members?.length || 0} students
              </p>
              {selectedClub.facultyAdvisor && (
                <p className="text-text-secondary">
                  <strong className="text-white">Faculty Advisor:</strong>{' '}
                  {selectedClub.facultyAdvisor?.name || 'Assigned Faculty'}
                </p>
              )}
            </div>

            <h4 className="text-sm font-semibold text-white mb-1">About the Club</h4>
            <p className="text-text-secondary text-xs leading-relaxed mb-6 whitespace-pre-line">
              {selectedClub.description}
            </p>

            {/* Social Links if present */}
            {selectedClub.socialLinks && Object.values(selectedClub.socialLinks).some(Boolean) && (
              <div className="mb-6 border-t border-glass-border pt-4">
                <h5 className="text-xs font-semibold text-text-primary mb-2">Connect with Us</h5>
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedClub.socialLinks.website && (
                    <a
                      href={selectedClub.socialLinks.website}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-surface-light hover:bg-surface-lighter rounded-lg text-primary-light flex items-center gap-1"
                    >
                      <ExternalLink size={12} /> Website
                    </a>
                  )}
                  {selectedClub.socialLinks.github && (
                    <a
                      href={selectedClub.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-surface-light hover:bg-surface-lighter rounded-lg text-primary-light flex items-center gap-1"
                    >
                      <ExternalLink size={12} /> GitHub
                    </a>
                  )}
                  {selectedClub.socialLinks.linkedin && (
                    <a
                      href={selectedClub.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-surface-light hover:bg-surface-lighter rounded-lg text-primary-light flex items-center gap-1"
                    >
                      <ExternalLink size={12} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedClub(null)}
                className="btn-outline text-xs"
              >
                Close
              </button>
              {selectedClub.members?.some(
                (m) => m.user?._id === user?._id || m.user === user?._id
              ) ? (
                <button
                  onClick={() => handleLeave(selectedClub._id)}
                  className="btn-danger text-xs"
                >
                  Leave Club
                </button>
              ) : (
                <button
                  onClick={() => handleJoin(selectedClub._id)}
                  className="btn-primary text-xs"
                >
                  Join Club
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Club Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass max-w-lg w-full rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-1 font-['Outfit']">Charter a New Club</h2>
            <p className="text-xs text-text-secondary mb-6">
              Establish a new official campus community.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Club Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Developer Student Club"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat} className="bg-surface">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Motto / Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Innovate, Collaborate, Build"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Mission & Description *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe your club's goals, regular meetups, and member benefits..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs text-text-muted mb-1">GitHub / Code Link</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.socialLinks.github}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, github: e.target.value },
                      })
                    }
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">LinkedIn Page</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.socialLinks.linkedin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                      })
                    }
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-glass-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-outline text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Create Club
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
