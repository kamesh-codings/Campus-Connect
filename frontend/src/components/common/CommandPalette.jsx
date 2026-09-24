import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  Users,
  Megaphone,
  MessageCircle,
  BarChart3,
  Shield,
  User,
  ArrowRight,
  Sparkles,
  X,
  Compass,
} from 'lucide-react';
import API from '../../services/api';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const quickNav = [
    { label: 'Campus Feed', path: '/', icon: Compass, category: 'Navigation' },
    { label: 'Upcoming Events & Hackathons', path: '/events', icon: Calendar, category: 'Navigation' },
    { label: 'Clubs & Mandrams', path: '/clubs', icon: Users, category: 'Navigation' },
    { label: 'Campus Announcements & Notices', path: '/announcements', icon: Megaphone, category: 'Navigation' },
    { label: 'Discussions & Help Forum', path: '/discussions', icon: MessageCircle, category: 'Navigation' },
    { label: 'My Student Profile & Badges', path: '/profile', icon: User, category: 'Navigation' },
    { label: 'Campus Analytics Dashboard', path: '/analytics', icon: BarChart3, category: 'Admin & Analytics' },
    { label: 'Admin Management Hub', path: '/admin', icon: Shield, category: 'Admin & Analytics' },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const q = query.toLowerCase();
        const [evRes, clRes, anRes, dsRes] = await Promise.all([
          API.get('/events'),
          API.get('/clubs'),
          API.get('/announcements'),
          API.get('/discussions'),
        ]);

        const events = (evRes.data || [])
          .filter((e) => e.title?.toLowerCase().includes(q) || e.venue?.toLowerCase().includes(q))
          .map((e) => ({ ...e, type: 'Event', icon: Calendar, path: '/events' }));

        const clubs = (clRes.data || [])
          .filter((c) => c.name?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q))
          .map((c) => ({ ...c, type: 'Club', icon: Users, path: '/clubs' }));

        const announcements = (anRes.data || [])
          .filter((a) => a.title?.toLowerCase().includes(q))
          .map((a) => ({ ...a, type: 'Announcement', icon: Megaphone, path: '/announcements' }));

        const discussions = (dsRes.data || [])
          .filter((d) => d.title?.toLowerCase().includes(q) || d.tags?.some((t) => t.toLowerCase().includes(q)))
          .map((d) => ({ ...d, type: 'Discussion', icon: MessageCircle, path: '/discussions' }));

        setResults([...events, ...clubs, ...announcements, ...discussions]);
      } catch (err) {
        console.error('Command palette search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-950/60">
          <Search size={18} className="text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, event, club name, or search keyword..."
            className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          )}
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Search / Suggestions Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {query ? (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Search Results ({results.length})
              </p>
              {loading ? (
                <div className="py-8 text-center text-xs text-slate-400">Searching campus ecosystem...</div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No matching campus records found.</div>
              ) : (
                <div className="space-y-1">
                  {results.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item._id || item.title || item.name}
                        onClick={() => handleSelect(item.path)}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-indigo-600/15 hover:border hover:border-indigo-500/30 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-xl bg-slate-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300">
                              {item.title || item.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {item.type} {item.venue ? `• ${item.venue}` : ''} {item.category ? `• ${item.category}` : ''}
                            </p>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-400 group-hover:text-white shrink-0 ml-2" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <Sparkles size={12} className="text-indigo-400" /> Quick Navigation & Actions
              </p>
              <div className="space-y-1">
                {quickNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      onClick={() => handleSelect(item.path)}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{item.category}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Shortcut hints */}
        <div className="px-5 py-2.5 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with click or arrow keys</span>
          <span className="flex items-center gap-1">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[10px]">Ctrl+K</kbd> to toggle anytime
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
