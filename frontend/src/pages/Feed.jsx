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
} from 'lucide-react';

const Feed = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('for-you'); // 'for-you' or 'all'
  const [feedItems, setFeedItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({ events: 0, clubs: 0, announcements: 0, discussions: 0 });
  const [loading, setLoading] = useState(true);

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
      gradient: 'from-indigo-500 to-purple-600',
      iconBg: 'bg-indigo-500/20 text-indigo-400',
      link: '/events',
    },
    {
      label: 'Active Clubs',
      value: stats.clubs,
      icon: Users,
      gradient: 'from-cyan-500 to-blue-600',
      iconBg: 'bg-cyan-500/20 text-cyan-400',
      link: '/clubs',
    },
    {
      label: 'Announcements',
      value: stats.announcements,
      icon: Megaphone,
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/20 text-amber-400',
      link: '/announcements',
    },
    {
      label: 'Discussions',
      value: stats.discussions,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      link: '/discussions',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-28 bg-slate-900/60 rounded-3xl border border-white/5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-900/60 rounded-2xl border border-white/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-slate-900/60 rounded-3xl border border-white/5" />
          <div className="h-96 bg-slate-900/60 rounded-3xl border border-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* ── Welcome Banner ─────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles size={14} className="text-indigo-400" />
            Tamil Nadu Campus Activity Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Here's what is happening across academic departments, student clubs, hackathons, and cultural fests today.
          </p>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── Stat Counters Grid ─────────────────────── */}
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
                <p className="text-2xl sm:text-3xl font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                <Icon size={24} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Feed Stream Tab Toggle ────────────────── */}
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
          {activeTab === 'for-you' ? `Personalized for ${user?.department} student` : 'Chronological stream'}
        </span>
      </div>

      {/* ── Main Two-Column Content ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Upcoming Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
                <Calendar size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Upcoming Events & Fests</h2>
                <p className="text-xs text-slate-400">Hackathons, cultural fests & workshops</p>
              </div>
            </div>
            <Link
              to="/events"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 text-center text-slate-400 text-xs">
                No events scheduled.
              </div>
            ) : (
              events.map((event) => {
                const eventDate = new Date(event.startDate);
                return (
                  <Link
                    key={event._id}
                    to="/events"
                    className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 transition-all flex items-start gap-4 hover:-translate-y-0.5 group shadow-md"
                  >
                    {/* Date Box */}
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex flex-col items-center justify-center shrink-0 text-indigo-300">
                      <span className="text-sm font-extrabold leading-none">{eventDate.getDate()}</span>
                      <span className="text-[9px] font-bold uppercase mt-0.5">
                        {eventDate.toLocaleDateString('en', { month: 'short' })}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin size={12} className="text-indigo-400 shrink-0" />
                          {event.venue}
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Clock size={12} className="text-slate-400 shrink-0" />
                          {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-indigo-500/20 shrink-0">
                      {event.category}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Campus Announcements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <Megaphone size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Campus Announcements</h2>
                <p className="text-xs text-slate-400">Exam notices, placement drives & alerts</p>
              </div>
            </div>
            <Link
              to="/announcements"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {announcements.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 text-center text-slate-400 text-xs">
                No announcements published.
              </div>
            ) : (
              announcements.map((ann) => {
                const PriorityIcon = priorityIcon[ann.priority] || Megaphone;
                const badgeClass = priorityStyles[ann.priority] || priorityStyles.normal;

                return (
                  <div
                    key={ann._id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all flex items-start gap-3.5 shadow-md"
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${badgeClass}`}>
                      <PriorityIcon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-white truncate">{ann.title}</h3>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {ann.content}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                          {ann.category}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          Priority: {ann.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
