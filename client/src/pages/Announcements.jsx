import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Megaphone,
  AlertTriangle,
  AlertCircle,
  Bell,
  Search,
  Plus,
  X,
  Calendar,
  Building,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['All', 'Academic', 'Emergency', 'General', 'Club Activity', 'Placement & Career'];
const priorities = ['all', 'normal', 'urgent', 'critical'];

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'normal',
    targetAudience: 'all',
    targetDepartment: '',
  });

  const canCreate = ['admin', 'faculty', 'club_admin'].includes(user?.role);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await API.get('/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/announcements', formData);
      toast.success('Announcement broadcasted to campus!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        content: '',
        category: 'General',
        priority: 'normal',
        targetAudience: 'all',
        targetDepartment: '',
      });
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post announcement');
    }
  };

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || a.priority === selectedPriority;
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-['Outfit']">
            Campus Announcements
          </h1>
          <p className="text-text-secondary mt-1">
            Official broadcasts, departmental circulars, placement drives, and emergency notices.
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus size={18} />
            Post Notice
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="glass p-4 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search circulars and notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Priority filter buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-light/60 rounded-xl w-full md:w-auto">
            {priorities.map((pri) => (
              <button
                key={pri}
                onClick={() => setSelectedPriority(pri)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all flex-1 md:flex-initial ${
                  selectedPriority === pri
                    ? pri === 'critical'
                      ? 'bg-danger text-white shadow-md'
                      : pri === 'urgent'
                      ? 'bg-accent text-white shadow-md'
                      : 'bg-primary text-white shadow-md'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {pri}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
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

      {/* Announcements List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="glass p-12 text-center rounded-2xl">
          <Megaphone size={48} className="mx-auto text-text-muted mb-3 opacity-40" />
          <h3 className="text-lg font-semibold text-text-primary">No announcements found</h3>
          <p className="text-text-secondary text-sm mt-1">Check back later or adjust your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((item) => {
            const isCritical = item.priority === 'critical';
            const isUrgent = item.priority === 'urgent';

            return (
              <div
                key={item._id}
                className={`card relative transition-all duration-200 ${
                  isCritical
                    ? 'border-danger/50 bg-danger/5 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                    : isUrgent
                    ? 'border-accent/40 bg-accent/5'
                    : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {isCritical && (
                      <span className="badge-danger inline-flex items-center gap-1 text-xs animate-pulse">
                        <AlertTriangle size={13} />
                        CRITICAL ALERT
                      </span>
                    )}
                    {isUrgent && (
                      <span className="badge-warning inline-flex items-center gap-1 text-xs">
                        <AlertCircle size={13} />
                        Urgent
                      </span>
                    )}
                    <span className="badge-primary text-xs font-semibold">
                      {item.category}
                    </span>
                    {item.targetDepartment && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-light text-text-muted flex items-center gap-1">
                        <Building size={11} /> {item.targetDepartment}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <Calendar size={13} />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-['Outfit']">
                  {item.title}
                </h3>

                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line mb-4">
                  {item.content}
                </p>

                <div className="border-t border-glass-border pt-3 flex items-center justify-between text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-[10px]">
                      {item.author?.name?.charAt(0) || 'A'}
                    </div>
                    <span>
                      Posted by <strong className="text-text-primary">{item.author?.name || 'Administrator'}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 capitalize">
                    <Users size={12} /> Target: {item.targetAudience}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass max-w-xl w-full rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-1 font-['Outfit']">Broadcast Announcement</h2>
            <p className="text-xs text-text-secondary mb-6">
              Publish an official campus circular, event update, or urgent alert.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campus Placement Drive: Microsoft & Amazon"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    Priority Level *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input-field"
                  >
                    <option value="normal" className="bg-surface">Normal</option>
                    <option value="urgent" className="bg-surface">Urgent</option>
                    <option value="critical" className="bg-surface">Critical Emergency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Target Audience
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="input-field"
                  >
                    <option value="all" className="bg-surface">Entire Campus</option>
                    <option value="students" className="bg-surface">Students Only</option>
                    <option value="faculty" className="bg-surface">Faculty Only</option>
                    <option value="specific_dept" className="bg-surface">Specific Department</option>
                  </select>
                </div>

                {formData.targetAudience === 'specific_dept' && (
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science & Engg"
                      value={formData.targetDepartment}
                      onChange={(e) => setFormData({ ...formData, targetDepartment: e.target.value })}
                      className="input-field"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Announcement Details *
                </label>
                <textarea
                  rows="5"
                  required
                  placeholder="Draft your circular content here with instructions, dates, and contacts..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="input-field resize-none"
                />
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
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
