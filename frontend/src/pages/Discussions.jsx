import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MessageCircle,
  ThumbsUp,
  Search,
  Plus,
  X,
  Send,
  CheckCircle2,
  Tag,
  Clock,
  MessageSquare,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Flame,
} from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['All', 'General', 'Academics', 'Projects', 'Career', 'Hackathons', 'Clubs'];

const Discussions = () => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [replyText, setReplyText] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'General',
    tags: '',
  });

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const res = await API.get('/discussions');
      setDiscussions(res.data);
    } catch (err) {
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const res = await API.post(`/discussions/${id}/upvote`);
      setDiscussions((prev) =>
        prev.map((d) => (d._id === id ? { ...d, upvotes: res.data.upvotes } : d))
      );
    } catch (err) {
      toast.error('Failed to update vote');
    }
  };

  const handleReplySubmit = async (discussionId) => {
    const text = replyText[discussionId]?.trim();
    if (!text) return;

    try {
      const res = await API.post(`/discussions/${discussionId}/reply`, {
        content: text,
      });
      setDiscussions((prev) =>
        prev.map((d) => (d._id === discussionId ? res.data : d))
      );
      setReplyText((prev) => ({ ...prev, [discussionId]: '' }));
      toast.success('Reply posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit reply');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await API.post('/discussions', {
        ...formData,
        tags: tagsArray,
      });

      toast.success('Discussion thread created!');
      setShowCreateModal(false);
      setFormData({ title: '', body: '', category: 'General', tags: '' });
      fetchDiscussions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create thread');
    }
  };

  const filteredDiscussions = discussions.filter((d) => {
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.body?.toLowerCase().includes(search.toLowerCase()) ||
      d.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* ── 1. HEADER ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles size={13} className="text-emerald-400" />
            <span>Campus Knowledge Base & Peer Forum</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-['Outfit']">
            Community Discussions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ask academic questions, collaborate on projects, and receive verified faculty advice.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} /> Start Discussion
        </button>
      </div>

      {/* ── 2. SEARCH & CATEGORY FILTERS ─────────────────── */}
      <div className="glass p-4 sm:p-5 rounded-2xl space-y-4 border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search topics, questions, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#080B12] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {filteredDiscussions.length} active threads
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
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. DISCUSSIONS LIST ──────────────────────────── */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : filteredDiscussions.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border border-white/10">
          <MessageCircle size={48} className="mx-auto text-slate-600 mb-3 opacity-50" />
          <h3 className="text-lg font-bold text-white">No discussions found</h3>
          <p className="text-slate-400 text-xs mt-1">Be the first to start a conversation on this topic.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDiscussions.map((disc) => {
            const isExpanded = expandedId === disc._id;
            const replyCount = disc.replies?.length || 0;

            return (
              <div
                key={disc._id}
                className="glass p-6 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300 shadow-lg"
              >
                {/* Top: Author & Category */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                      {disc.author?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block leading-tight">
                        {disc.author?.name || 'Campus Student'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {disc.author?.department ? `${disc.author.department} Dept • ` : ''}
                        {new Date(disc.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-indigo-500/20">
                    {disc.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                  {disc.title}
                </h3>

                {/* Body */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 whitespace-pre-line">
                  {disc.body}
                </p>

                {/* Tags */}
                {disc.tags && disc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {disc.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-white/5"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions Row */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpvote(disc._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 border border-white/5 transition-colors cursor-pointer"
                    >
                      <ThumbsUp size={13} className="text-indigo-400" />
                      <span className="font-bold">{disc.upvotes || 0}</span>
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : disc._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5 transition-colors cursor-pointer"
                    >
                      <MessageSquare size={13} className="text-cyan-400" />
                      <span>{replyCount} Replies</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    Thread ID: #{disc._id?.slice(-6)}
                  </span>
                </div>

                {/* Threaded Replies Section */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-fade-in-up">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Thread Replies ({replyCount})
                    </h4>

                    {/* Replies List */}
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {replyCount === 0 ? (
                        <p className="text-xs text-slate-500 py-2">No replies yet. Be the first to help out!</p>
                      ) : (
                        disc.replies.map((rep) => (
                          <div
                            key={rep._id || Math.random()}
                            className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 space-y-1 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-200">
                                {rep.author?.name || 'Campus Student'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(rep.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{rep.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Reply Input Box */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Write a helpful response..."
                        value={replyText[disc._id] || ''}
                        onChange={(e) =>
                          setReplyText({ ...replyText, [disc._id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleReplySubmit(disc._id);
                        }}
                        className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleReplySubmit(disc._id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1 cursor-pointer"
                      >
                        <Send size={13} /> Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── 4. CREATE DISCUSSION MODAL ───────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="glass max-w-lg w-full rounded-3xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-black text-white mb-1 font-['Outfit']">Start Community Thread</h2>
            <p className="text-xs text-slate-400 mb-6">
              Ask a question, share a project, or start a campus discussion.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Topic / Question Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best resources for learning Next.js and Cloud Native?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Discussion Content *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide background details, code snippets, or what you've tried..."
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="react, webdev, placements, ai"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
                  Publish Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussions;
