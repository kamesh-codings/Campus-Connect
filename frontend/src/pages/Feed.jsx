import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar, Users, Megaphone, TrendingUp, ArrowRight, Clock, MapPin, AlertTriangle, Zap,
  Sparkles
} from 'lucide-react';

const Feed = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({ events: 0, clubs: 0, announcements: 0, discussions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const [evRes, anRes, clRes, dsRes] = await Promise.all([
          API.get('/events?type=upcoming'),
          API.get('/announcements'),
          API.get('/clubs'),
          API.get('/discussions'),
        ]);
        setEvents(evRes.data.slice(0, 4));
        setAnnouncements(anRes.data.slice(0, 5));
        setStats({
          events: evRes.data.length,
          clubs: clRes.data.length,
          announcements: anRes.data.length,
          discussions: dsRes.data.length,
        });
      } catch (err) {
        console.error('Feed error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedData();
  }, []);

  const priorityIcon = { critical: AlertTriangle, urgent: Zap, normal: Megaphone };
  const priorityColor = { critical: 'text-rose-400', urgent: 'text-amber-400', normal: 'text-indigo-400' };

  if (loading) {
    return (
      <div className="space-y-10 animate-fade-in-up">
        {/* Skeleton Header */}
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-800/60 rounded-xl animate-pulse" />
          <div className="h-5 w-80 bg-slate-800/40 rounded-lg animate-pulse" />
        </div>

        {/* Skeleton Stat Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-neu-card p-7 h-40 animate-pulse bg-slate-900/40" />
          ))}
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-40 bg-slate-800/60 rounded-xl animate-pulse" />
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-neu-card h-28 animate-pulse bg-slate-900/40" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-8 w-40 bg-slate-800/60 rounded-xl animate-pulse" />
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-neu-card h-32 animate-pulse bg-slate-900/40" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Upcoming Events', value: stats.events, icon: Calendar, color: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/20' },
    { label: 'Active Campus Clubs', value: stats.clubs, icon: Users, color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20' },
    { label: 'Live Announcements', value: stats.announcements, icon: Megaphone, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
    { label: 'Community Discussions', value: stats.discussions, icon: TrendingUp, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
  ];

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-primary-light uppercase tracking-wider mb-2">
            <Sparkles size={13} className="text-accent" /> Campus Activity Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm sm:text-base text-text-secondary font-normal mt-1.5">
            Here is a summary of activities, events, and announcements happening today.
          </p>
        </div>
      </div>

      {/* Stats Cards: Increased Spacing, Size, and Typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className="glass-neu-card p-6 sm:p-7 flex items-center gap-5 group cursor-default hover:-translate-y-1 transition-all duration-300"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg ${stat.shadow} neu-button shrink-0 group-hover:scale-105 transition-transform`}>
              <stat.icon size={26} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight leading-none mb-1">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-medium text-text-secondary truncate">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Sections: Generous Gutter & Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
        
        {/* Left Column: Upcoming Events */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Calendar size={22} className="text-primary-light" /> Upcoming Events
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">Campus schedules and hackathons</p>
            </div>
            <Link 
              to="/events" 
              className="text-xs sm:text-sm font-semibold text-primary-light hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-5">
            {events.length === 0 ? (
              <div className="glass-neu-card p-10 text-center">
                <Calendar size={48} className="text-text-muted mx-auto mb-3 opacity-50" />
                <p className="text-base text-text-secondary font-medium">No upcoming events scheduled.</p>
                <p className="text-xs text-text-muted mt-1">Check back later for new event announcements.</p>
              </div>
            ) : (
              events.map((event, i) => (
                <Link
                  key={event._id}
                  to={`/events`}
                  className="glass-neu-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:-translate-y-1 transition-all duration-300 group"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    {/* Date Pill */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center text-white font-bold shrink-0 neu-button shadow-md shadow-indigo-900/30">
                      <span className="text-xl leading-none font-['Outfit'] font-black">{new Date(event.startDate).getDate()}</span>
                      <span className="text-[11px] uppercase tracking-wider mt-0.5 text-indigo-100 font-semibold">{new Date(event.startDate).toLocaleDateString('en', { month: 'short' })}</span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-primary-light transition-colors truncate">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-text-muted mt-1.5">
                        <span className="flex items-center gap-1.5 text-text-secondary">
                          <MapPin size={14} className="text-primary-light" /> {event.venue}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-text-muted" /> {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
                    <span className="badge badge-info text-xs px-3 py-1 font-semibold">
                      {event.category}
                    </span>
                    <span className="text-xs font-mono font-medium text-text-muted bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                      {event.registeredUsers?.length || 0}/{event.maxCapacity} seats
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Announcements Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Megaphone size={22} className="text-amber-400" /> Announcements
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">Campus alerts & bulletins</p>
            </div>
            <Link 
              to="/announcements" 
              className="text-xs sm:text-sm font-semibold text-primary-light hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-5">
            {announcements.length === 0 ? (
              <div className="glass-neu-card p-10 text-center">
                <Megaphone size={48} className="text-text-muted mx-auto mb-3 opacity-50" />
                <p className="text-base text-text-secondary font-medium">No announcements published.</p>
              </div>
            ) : (
              announcements.map((ann, i) => {
                const PriorityIcon = priorityIcon[ann.priority] || Megaphone;
                return (
                  <div
                    key={ann._id}
                    className={`glass-neu-card p-5 sm:p-6 priority-${ann.priority} hover:-translate-y-1 transition-all duration-300`}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                        <PriorityIcon
                          size={18}
                          className={priorityColor[ann.priority]}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                          {ann.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed line-clamp-3">
                          {ann.content}
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5">
                          <span className={`badge badge-${ann.priority === 'critical' ? 'danger' : ann.priority === 'urgent' ? 'warning' : 'info'} text-[11px] px-2.5 py-0.5 font-semibold`}>
                            {ann.category}
                          </span>
                          <span className="text-[11px] text-text-muted font-mono">
                            {new Date(ann.createdAt).toLocaleDateString()}
                          </span>
                        </div>
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
