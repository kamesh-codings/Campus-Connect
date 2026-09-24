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
  Sparkles,
  ChevronDown,
  ChevronUp,
  Building,
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
    <div className="space-y-6 animate-fade-in-up pb-12 font-sans">
      {/* ── 1. HEADER ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles size={12} className="text-emerald-400" />
            <span>Campus Knowledge Base & Peer Forum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Community Discussions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Ask academic questions, collaborate on projects, and receive verified faculty advice.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-md shadow-indigo-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={14} /> Start Discussion
        </button>
      </div>

      {/* ── 2. SEARCH & CATEGORY FILTERS ─────────────────── */}
      <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search topics, questions, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#080B12] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
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
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. DISCUSSIONS LIST ──────────────────────────── */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : filteredDiscussions.length === 0 ? (
        <div className="p-10 text-center rounded-xl bg-[#0D111A] border border-white/10">
          <MessageCircle size={40} className="mx-auto text-slate-600 mb-2.5 opacity-50" />
          <h3 className="text-base font-bold text-white">No discussions found</h3>
          <p className="text-slate-400 text-xs mt-1">Be the first to start a conversation on this topic.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredDiscussions.map((disc) => {
            const isExpanded = expandedId === disc._id;
            const replyCount = disc.replies?.length || 0;

            return (
              <div
                key={disc._id}
                className="p-5 rounded-xl bg-[#0D111A] border border-white/10 hover:border-indigo-500/30 transition-all duration-200 shadow-md"
              >
                {/* Top: Author & Category */}
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0">
                      {disc.author?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block leading-tight">
                        {disc.author?.name || 'Campus Student'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {disc.author?.department ? `${disc.author.department} Dept • ` : ''}
                        {new Date(disc.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-900 text-indigo-300 border border-indigo-500/20">
                    {disc.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                  {disc.title}
                </h3>

                {/* Body */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3 whitespace-pre-line">
                  {disc.body}
                </p>

                {/* Tags */}
                {disc.tags && disc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {disc.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-white/5"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions Row */}
                <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleUpvote(disc._id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 border border-white/10 transition-colors cursor-pointer text-xs"
                    >
                      <ThumbsUp size={13} className="text-indigo-400" />
                      <span className="font-semibold">{disc.upvotes || 0}</span>
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : disc._id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors cursor-pointer text-xs"
                    >
                      <MessageCircle size={13} className="text-cyan-400" />
                      <span>{replyCount} Replies</span>
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    Thread #{disc._id?.slice(-6)}
                  </span>
                </div>

                {/* Threaded Replies Section */}
                {isExpanded && (
                  <div className="mt-3.5 pt-3.5 border-t border-white/10 space-y-2.5 animate-fade-in-up">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Thread Replies ({replyCount})
                    </h4>

                    {/* Replies List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {replyCount === 0 ? (
                        <p className="text-xs text-slate-500 py-1.5">No replies yet. Be the first to help out!</p>
                      ) : (
                        disc.replies.map((rep) => (
                          <div
                            key={rep._id || Math.random()}
                            className="p-3 rounded-lg bg-slate-900/90 border border-white/5 space-y-1 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-200">
                                {rep.author?.name || 'Campus Student'}
                              </span>
                              <span className="text-xs text-slate-400">
                                {new Date(rep.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{rep.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Reply Input Box */}
                    <div className="flex gap-2 pt-1.5">
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
                        className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleReplySubmit(disc._id)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Send size={12} /> Reply
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
          <div className="bg-[#0D111A] max-w-lg w-full rounded-xl p-6 relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl font-sans">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Start Community Thread</h2>
            <p className="text-xs text-slate-400 mb-5">
              Ask a question, share a project, or start a campus discussion.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Topic / Question Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best resources for learning Next.js and Cloud Native?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Discussion Content *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide background details, code snippets, or what you've tried..."
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="react, webdev, placements, ai"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 cursor-pointer"
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
