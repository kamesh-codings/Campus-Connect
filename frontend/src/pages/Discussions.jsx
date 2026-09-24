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
      toast.success('Reply added!');
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
      toast.error(err.response?.data?.message || 'Failed to create discussion');
    }
  };

  const filteredDiscussions = discussions.filter((d) => {
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.body.toLowerCase().includes(search.toLowerCase()) ||
      d.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-['Outfit']">
            Student Discussions & Q&A
          </h1>
          <p className="text-text-secondary mt-1">
            Exchange project ideas, ask study queries, find teammates, and engage with peers.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={18} />
          Start Discussion
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass p-4 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search topics, questions, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="text-xs text-text-muted font-medium">
            {filteredDiscussions.length} conversations active
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

      {/* Discussions Feed */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredDiscussions.length === 0 ? (
        <div className="glass p-12 text-center rounded-2xl">
          <MessageCircle size={48} className="mx-auto text-text-muted mb-3 opacity-40" />
          <h3 className="text-lg font-semibold text-text-primary">No discussions yet</h3>
          <p className="text-text-secondary text-sm mt-1">Be the first to start a conversation on campus!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDiscussions.map((d) => {
            const hasUpvoted = d.upvotes?.includes(user?._id);
            const isExpanded = expandedId === d._id;

            return (
              <div key={d._id} className="card transition-all duration-200">
                {/* Header: Author & Category */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center font-bold text-white shadow-sm text-sm">
                      {d.author?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {d.author?.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <span>{d.author?.department || 'Student'}</span>
                        <span>•</span>
                        <span>{new Date(d.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <span className="badge-primary text-xs font-semibold">
                    {d.category}
                  </span>
                </div>

                {/* Title & Body */}
                <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                  {d.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {d.body}
                </p>

                {/* Tags */}
                {d.tags && d.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {d.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md bg-surface-light text-secondary font-medium"
                      >
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center gap-4 border-t border-glass-border pt-3">
                  <button
                    onClick={() => handleUpvote(d._id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      hasUpvoted
                        ? 'bg-primary/20 text-primary-light border border-primary/40'
                        : 'bg-surface-light text-text-secondary hover:text-white hover:bg-surface-lighter'
                    }`}
                  >
                    <ThumbsUp size={14} className={hasUpvoted ? 'fill-primary-light' : ''} />
                    <span>{d.upvotes?.length || 0} Upvotes</span>
                  </button>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : d._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-light text-text-secondary hover:text-white hover:bg-surface-lighter transition-all"
                  >
                    <MessageSquare size={14} />
                    <span>{d.replies?.length || 0} Replies</span>
                  </button>
                </div>

                {/* Expanded Replies Thread */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-glass-border space-y-4 animate-fadeIn">
                    <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Replies ({d.replies?.length || 0})
                    </h5>

                    {/* Replies list */}
                    {d.replies?.length === 0 ? (
                      <p className="text-xs text-text-muted italic py-2">
                        No replies yet. Share your thoughts below!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {d.replies.map((reply, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl bg-surface-light/50 border ${
                              reply.isFacultyEndorsed
                                ? 'border-accent/40 bg-accent/5'
                                : 'border-glass-border'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white text-[10px] font-bold">
                                  {reply.author?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="text-xs font-semibold text-white">
                                  {reply.author?.name || 'Member'}
                                </span>
                                <span className="text-[10px] text-text-muted">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              {reply.isFacultyEndorsed && (
                                <span className="badge-warning text-[10px] inline-flex items-center gap-1">
                                  <Award size={10} /> Faculty Endorsed
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-secondary leading-relaxed pl-8">
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply input box */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Write a constructive response..."
                        value={replyText[d._id] || ''}
                        onChange={(e) =>
                          setReplyText({ ...replyText, [d._id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleReplySubmit(d._id);
                        }}
                        className="input-field text-xs flex-1"
                      />
                      <button
                        onClick={() => handleReplySubmit(d._id)}
                        className="btn-primary text-xs px-3.5 inline-flex items-center gap-1"
                      >
                        <Send size={13} />
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Discussion Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass max-w-lg w-full rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-1 font-['Outfit']">New Discussion</h2>
            <p className="text-xs text-text-secondary mb-6">
              Ask a question or spark an academic/community dialogue.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best resources for Machine Learning hackathons?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, AI, Projects, FirstYear"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Discussion Content *
                </label>
                <textarea
                  rows="5"
                  required
                  placeholder="Explain your context, question, or thought in detail..."
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
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
                  Post Discussion
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
