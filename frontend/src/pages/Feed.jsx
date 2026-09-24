import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Users,
  Megaphone,
  TrendingUp,
  ArrowRight,
  Clock,
  MapPin,
  AlertTriangle,
  Zap,
  Sparkles,
  Award,
  Compass,
  MessageSquare,
  QrCode,
  CheckCircle2,
  ChevronRight,
  Flame,
} from 'lucide-react';

const Feed = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('for-you'); // 'for-you' or 'all'
  const [feedItems, setFeedItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [stats, setStats] = useState({ events: 0, clubs: 0, announcements: 0, discussions: 0 });
  const [loading, setLoading] = useState(true);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setLoading(true);
        const [evRes, anRes, clRes, dsRes, feedRes] = await Promise.all([
          API.get('/events'),
          API.get('/announcements'),
          API.get('/clubs'),
          API.get('/discussions'),
          API.get(`/feed?tab=${activeTab}`),
        ]);

        const allEvents = Array.isArray(evRes.data) ? evRes.data : [];
        const allAnnouncements = Array.isArray(anRes.data) ? anRes.data : [];
        const allClubs = Array.isArray(clRes.data) ? clRes.data : [];
        const allDiscussions = Array.isArray(dsRes.data) ? dsRes.data : [];

        setFeedItems(Array.isArray(feedRes.data) ? feedRes.data : []);
        setEvents(allEvents.slice(0, 4));
        setAnnouncements(allAnnouncements.slice(0, 5));
        setDiscussions(allDiscussions.slice(0, 4));
        setStats({
          events: allEvents.length,
          clubs: allClubs.length,
          announcements: allAnnouncements.length,
          discussions: allDiscussions.length,
        });
      } catch (err) {
        console.error('Feed error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedData();
  }, [activeTab]);

  const priorityIcon = { critical: AlertTriangle, urgent: Zap, normal: Megaphone };
  const priorityStyles = {
    critical: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    urgent: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    normal: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
  };

  const statCards = [
    {
      label: 'Campus Events',
      value: stats.events,
      icon: Calendar,
      change: '+4 this week',
      iconBg: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20',
      link: '/events',
    },
    {
      label: 'Student Clubs',
      value: stats.clubs,
      icon: Users,
      change: 'Active Communities',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
      link: '/clubs',
    },
    {
      label: 'Broadcasts',
      value: stats.announcements,
      icon: Megaphone,
      change: 'Official Circulars',
      iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
      link: '/announcements',
    },
    {
      label: 'Active Discussions',
      value: stats.discussions,
      icon: MessageSquare,
      change: 'Peer Q&A threads',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
      link: '/discussions',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-36 bg-slate-900/60 rounded-3xl border border-white/5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-900/60 rounded-2xl border border-white/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-96 bg-slate-900/60 rounded-3xl border border-white/5" />
          <div className="lg:col-span-4 h-96 bg-slate-900/60 rounded-3xl border border-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 animate-fade-in-up">
      {/* ── 1. DASHBOARD HERO BANNER ─────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles size={13} className="text-indigo-400" />
              {currentDateFormatted}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 size={13} /> {user?.role === 'club_admin' ? 'Club Lead' : user?.role} Mode Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
            Here is your live campus feed. Discover upcoming hackathons, participate in department discussions, and access verified digital QR passes.
          </p>

          {/* Quick Action Chips */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
            >
              <Calendar size={14} /> Explore Events
            </Link>
            <Link
              to="/clubs"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all"
            >
              <Users size={14} /> Join a Club
            </Link>
            <Link
              to="/discussions"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all"
            >
              <MessageSquare size={14} /> Ask Community
            </Link>
            <Link
              to="/announcements"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all"
            >
              <Megaphone size={14} /> Campus Circulars
            </Link>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── 2. STAT COUNTERS GRID ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/10 flex items-center justify-between group"
            >
              <div>
                <p className="text-xs font-semibold text-slate-400">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                  {stat.value}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                <Icon size={22} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── 3. FEED STREAM TAB TOGGLE ────────────────── */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('for-you')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'for-you'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Sparkles size={14} className={activeTab === 'for-you' ? 'text-amber-300' : ''} />
            For You (Ranked Stream)
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Compass size={14} />
            All Campus Activities
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          {activeTab === 'for-you' ? `Personalized for ${user?.department || 'all'} students` : 'Chronological stream'}
        </span>
      </div>

      {/* ── 4. MAIN LAYOUT: RANKED STREAM & RIGHT CONTEXT PANEL ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT / CENTER (8 COLS): RANKED FEED STREAM */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Flame size={18} className="text-amber-400" />
              {activeTab === 'for-you' ? 'Personalized Campus Stream' : 'Live Campus Activities'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {feedItems.length} items ranked
            </span>
          </div>

          {feedItems.length === 0 ? (
            <div className="glass p-12 text-center rounded-3xl border border-white/10">
              <Sparkles size={40} className="mx-auto text-slate-500 mb-3" />
              <h3 className="text-base font-bold text-white">No stream items right now</h3>
              <p className="text-xs text-slate-400 mt-1">Check back soon for new club events and campus notices.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedItems.map((item) => {
                const isEvent = item.type === 'event';
                const isAnnouncement = item.type === 'announcement';
                const isDiscussion = item.type === 'discussion';

                return (
                  <div
                    key={item._id || item.id}
                    className="glass p-5 rounded-2xl border border-white/10 hover:border-indigo-500/40 transition-all shadow-md group"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isEvent
                              ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                              : isAnnouncement
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {item.type}
                        </span>

                        {item.matchReasons && item.matchReasons.length > 0 && (
                          <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 truncate max-w-[200px]">
                            ⚡ {item.matchReasons[0]}
                          </span>
                        )}
                      </div>

                      {item.score && (
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          Match score: {item.score}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.content || item.description || item.body}
                    </p>

                    {/* Metadata & Actions */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        {isEvent && item.venue && (
                          <span className="flex items-center gap-1 text-[11px]">
                            <MapPin size={12} className="text-indigo-400" /> {item.venue}
                          </span>
                        )}
                        {item.author && (
                          <span className="text-[11px]">
                            By {item.author.name || item.author}
                          </span>
                        )}
                        {item.club && (
                          <span className="text-[11px] text-cyan-400">
                            {item.club.name || 'Club'}
                          </span>
                        )}
                      </div>

                      <Link
                        to={
                          isEvent
                            ? '/events'
                            : isAnnouncement
                            ? '/announcements'
                            : '/discussions'
                        }
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                      >
                        {isEvent ? 'View & RSVP' : 'Open Thread'} <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT (4 COLS): UPCOMING EVENTS & QUICK NOTICES */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Events Box */}
          <div className="glass p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Upcoming Events</h3>
              </div>
              <Link to="/events" className="text-[11px] text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {events.slice(0, 3).map((ev) => {
                const date = new Date(ev.startDate);
                return (
                  <Link
                    key={ev._id}
                    to="/events"
                    className="p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-indigo-500/30 flex items-center gap-3 transition-all block group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold leading-none">{date.getDate()}</span>
                      <span className="text-[8px] uppercase">{date.toLocaleDateString('en', { month: 'short' })}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300">{ev.title}</p>
                      <p className="text-[10px] text-slate-400 truncate">{ev.venue}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Critical Announcements Box */}
          <div className="glass p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone size={16} className="text-amber-400" />
                <h3 className="text-sm font-bold text-white">Latest Circulars</h3>
              </div>
              <Link to="/announcements" className="text-[11px] text-amber-400 hover:underline">
                All
              </Link>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div key={ann._id} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-semibold text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10">
                      {ann.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{ann.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Feed;
