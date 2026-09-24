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
  Sparkles,
  Zap,
  Tag,
  Share2,
  Bookmark,
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
      toast.success('Announcement broadcasted across campus!');
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
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* ── 1. HEADER ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles size={13} className="text-amber-400" />
            <span>Campus Circulars & Broadcasts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-['Outfit']">
            Announcements & Alerts
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Official circulars, placement notifications, academic schedules, and emergency notices.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-600/25 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} /> Broadcast Notice
          </button>
        )}
      </div>

      {/* ── 2. SEARCH & FILTER CONTROLS ──────────────────── */}
      <div className="glass p-4 sm:p-5 rounded-2xl space-y-4 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search circulars, department notices, keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#080B12] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl w-full md:w-auto border border-white/5">
            {priorities.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all flex-1 md:flex-initial cursor-pointer ${
                  selectedPriority === p
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. ANNOUNCEMENTS LIST ────────────────────────── */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border border-white/10">
          <Megaphone size={48} className="mx-auto text-slate-600 mb-3 opacity-50" />
          <h3 className="text-lg font-bold text-white">No announcements found</h3>
          <p className="text-slate-400 text-xs mt-1">Try adjusting your category or priority filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((ann) => {
            const isCritical = ann.priority === 'critical';
            const isUrgent = ann.priority === 'urgent';

            return (
              <div
                key={ann._id}
                className={`glass p-6 rounded-3xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg relative overflow-hidden ${
                  isCritical
                    ? 'border-rose-500/40 bg-rose-950/15'
                    : isUrgent
                    ? 'border-amber-500/40 bg-amber-950/15'
                    : 'border-white/10 hover:border-amber-500/30'
                }`}
              >
                {/* Critical Top Pulse Indicator */}
                {isCritical && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-rose-500" />
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : isUrgent
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25'
                      }`}
                    >
                      {ann.priority} priority
                    </span>

                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                      {ann.category}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(ann.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                  {ann.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-4">
                  {ann.content}
                </p>

                {/* Footer / Author info */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-white">
                      {ann.author?.name?.charAt(0) || 'A'}
                    </div>
                    <span className="text-slate-300 font-medium">
                      {ann.author?.name || 'Campus Administration'}
                    </span>
                    {ann.author?.department && (
                      <span className="text-slate-400 text-[11px]">
                        • {ann.author.department}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied to clipboard');
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Share2 size={13} /> Share
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 4. BROADCAST MODAL ───────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="glass max-w-lg w-full rounded-3xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-black text-white mb-1 font-['Outfit']">Broadcast Campus Circular</h2>
            <p className="text-xs text-slate-400 mb-6">
              Publish official announcements to student departments or campus-wide.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End Semester Exam Timetable Released"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Priority Level *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="normal" className="bg-slate-900 text-white">Normal</option>
                    <option value="urgent" className="bg-slate-900 text-white">Urgent</option>
                    <option value="critical" className="bg-slate-900 text-white">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Circular Body & Details *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide complete notice details, dates, relevant links, and instructions..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
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
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/25 cursor-pointer"
                >
                  Publish Notice
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
