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
  MessageSquare,
  QrCode,
  CheckCircle2,
  ChevronRight,
  Flame,
  UserCheck,
  UserPlus,
  ThumbsUp,
  Tag,
  Shield,
  Layers,
  GraduationCap,
  Building,
  Ticket,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Feed = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [discussions, setDiscussions] = useState([]);
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
    year: 'numeric',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [evRes, anRes, clRes, dsRes] = await Promise.all([
        API.get('/events'),
        API.get('/announcements'),
        API.get('/clubs'),
        API.get('/discussions'),
      ]);

      setEvents(Array.isArray(evRes.data) ? evRes.data : []);
      setAnnouncements(Array.isArray(anRes.data) ? anRes.data : []);
      setClubs(Array.isArray(clRes.data) ? clRes.data : []);
      setDiscussions(Array.isArray(dsRes.data) ? dsRes.data : []);
    } catch (err) {
      console.error('Feed error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      const res = await API.post(`/events/${eventId}/register`);
      toast.success(res.data.message || 'RSVP confirmed! Ticket generated.');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'RSVP failed');
    }
  };

  const handleJoinClub = async (clubId) => {
    try {
      await API.post(`/clubs/${clubId}/join`);
      toast.success('Joined club successfully!');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join');
    }
  };

  const handleLeaveClub = async (clubId) => {
    try {
      await API.post(`/clubs/${clubId}/leave`);
      toast.success('Left club');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to leave');
    }
  };

  const handleUpvote = async (discussionId) => {
    try {
      const res = await API.post(`/discussions/${discussionId}/upvote`);
      setDiscussions((prev) =>
        prev.map((d) => (d._id === discussionId ? { ...d, upvotes: res.data.upvotes } : d))
      );
    } catch (err) {
      toast.error('Failed to upvote');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse pb-12">
        <div className="h-44 bg-slate-900/60 rounded-3xl border border-white/5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-900/60 rounded-2xl border border-white/5" />
          ))}
        </div>
        <div className="h-72 bg-slate-900/60 rounded-3xl border border-white/5" />
        <div className="h-72 bg-slate-900/60 rounded-3xl border border-white/5" />
      </div>
    );
  }

  // Critical announcements first
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.priority === 'critical') return -1;
    if (b.priority === 'critical') return 1;
    if (a.priority === 'urgent') return -1;
    if (b.priority === 'urgent') return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const priorityBadgeStyles = {
    critical: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    urgent: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    normal: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
  };

  return (
    <div className="space-y-10 animate-fade-in-up pb-16">
      
      {/* ══════════════════════════════════════════════════════════════
          1. HERO BANNER: PERSONALIZED STUDENT PULSE
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles size={13} className="text-indigo-400" />
                {currentDateFormatted}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                <Building size={12} /> {user?.department || 'CSE'} Department
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 size={12} /> {user?.role === 'club_admin' ? 'Club Lead' : user?.role || 'Student'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Scholar'} 👋
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your centralized digital campus ecosystem. Access your verified QR passes, explore upcoming hackathons, participate in peer Q&A, and read departmental circulars.
            </p>

            {/* Quick Action Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Link
                to="/events"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                <Calendar size={14} /> Explore Events
              </Link>
              <Link
                to="/clubs"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all"
              >
                <Users size={14} /> Join a Club
              </Link>
              <Link
                to="/discussions"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all"
              >
                <MessageSquare size={14} /> Ask Community
              </Link>
              <Link
                to="/announcements"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all"
              >
                <Megaphone size={14} /> Circulars
              </Link>
            </div>
          </div>

          {/* Right: Quick Student Stats Card */}
          <div className="glass p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3 min-w-[240px] bg-slate-900/90 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Reputation</span>
              <Award size={18} className="text-amber-400" />
            </div>
            <div>
              <span className="text-3xl font-black text-white font-['Outfit']">{user?.points || 75}</span>
              <span className="text-xs text-indigo-300 font-mono ml-1.5">pts</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Tier 2 Campus Contributor</p>
            </div>
            <Link
              to="/profile"
              className="w-full text-center py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-colors"
            >
              View Student Profile & Passes &rarr;
            </Link>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. KEY METRIC STAT CARDS
      ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Events */}
        <Link
          to="/events"
          className="glass p-5 rounded-3xl border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400">Campus Events</span>
            <p className="text-3xl font-extrabold text-white mt-1 font-['Outfit'] group-hover:text-indigo-300 transition-colors">
              {events.length}
            </p>
            <span className="text-[11px] text-indigo-400 font-medium mt-1 inline-block">
              +4 this week &rarr;
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 flex items-center justify-center shrink-0">
            <Calendar size={22} />
          </div>
        </Link>

        {/* Stat 2: Clubs */}
        <Link
          to="/clubs"
          className="glass p-5 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400">Student Clubs</span>
            <p className="text-3xl font-extrabold text-white mt-1 font-['Outfit'] group-hover:text-cyan-300 transition-colors">
              {clubs.length}
            </p>
            <span className="text-[11px] text-cyan-400 font-medium mt-1 inline-block">
              Active communities &rarr;
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
        </Link>

        {/* Stat 3: Announcements */}
        <Link
          to="/announcements"
          className="glass p-5 rounded-3xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400">Official Circulars</span>
            <p className="text-3xl font-extrabold text-white mt-1 font-['Outfit'] group-hover:text-amber-300 transition-colors">
              {announcements.length}
            </p>
            <span className="text-[11px] text-amber-400 font-medium mt-1 inline-block">
              Verified broadcasts &rarr;
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0">
            <Megaphone size={22} />
          </div>
        </Link>

        {/* Stat 4: Discussions */}
        <Link
          to="/discussions"
          className="glass p-5 rounded-3xl border border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400">Forum Discussions</span>
            <p className="text-3xl font-extrabold text-white mt-1 font-['Outfit'] group-hover:text-emerald-300 transition-colors">
              {discussions.length}
            </p>
            <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">
              Peer Q&A threads &rarr;
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0">
            <MessageSquare size={22} />
          </div>
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. SECTION A: IMPORTANT CAMPUS CIRCULARS & ALERTS
      ══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Megaphone size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Campus Circulars & Official Broadcasts
              </h2>
              <p className="text-xs text-slate-400">Exam timetables, placement notifications & urgent alerts</p>
            </div>
          </div>
          <Link
            to="/announcements"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            View All Circulars ({announcements.length}) <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAnnouncements.slice(0, 3).map((ann) => {
            const isCritical = ann.priority === 'critical';
            const isUrgent = ann.priority === 'urgent';

            return (
              <div
                key={ann._id}
                className={`glass p-5 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between relative overflow-hidden ${
                  isCritical
                    ? 'border-rose-500/40 bg-rose-950/15'
                    : isUrgent
                    ? 'border-amber-500/40 bg-amber-950/15'
                    : 'border-white/10 hover:border-amber-500/30'
                }`}
              >
                {isCritical && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-rose-500" />
                )}

                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        priorityBadgeStyles[ann.priority] || priorityBadgeStyles.normal
                      }`}
                    >
                      {ann.priority} priority
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
                      {ann.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 font-['Outfit']">
                    {ann.title}
                  </h3>

                  {/* Body Preview */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {ann.content}
                  </p>
                </div>

                {/* Footer / Author */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate max-w-[160px] text-[11px]">
                    By {ann.author?.name || 'Dean Office'}
                  </span>
                  <span className="text-[10px] font-mono">
                    {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. SECTION B: UPCOMING CAMPUS EVENTS & HACKATHONS
      ══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Calendar size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Upcoming Events & Technical Workshops
              </h2>
              <p className="text-xs text-slate-400">Reserve spot, get 1-tap QR passes & earn reputation points</p>
            </div>
          </div>
          <Link
            to="/events"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            Explore All Events ({events.length}) <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map((ev) => {
            const isRegistered = ev.registeredUsers?.some(
              (r) => r.user?._id === user?._id || r.user === user?._id
            );
            const isFull = (ev.registeredUsers?.length || 0) >= ev.maxCapacity;
            const eventDate = new Date(ev.startDate);

            return (
              <div
                key={ev._id}
                className="glass p-5 rounded-3xl border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between group"
              >
                <div>
                  {/* Category & Club */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                      {ev.category}
                    </span>
                    <span className="text-xs text-slate-400 truncate max-w-[150px]">
                      {ev.club?.name || 'Campus Club'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1.5 font-['Outfit']">
                    {ev.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    {ev.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-2 text-xs text-slate-400 mb-4 border-t border-white/5 pt-3">
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-indigo-400" />
                      <span>{eventDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-cyan-400" />
                      <span className="truncate">{ev.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={13} className="text-emerald-400" />
                      <span>{ev.registeredUsers?.length || 0} / {ev.maxCapacity} seats filled</span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-4 border border-white/5">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          ((ev.registeredUsers?.length || 0) / (ev.maxCapacity || 100)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <Link
                    to="/events"
                    className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    View Details
                  </Link>

                  {isRegistered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                      <CheckCircle2 size={13} /> Pass Ready
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRSVP(ev._id)}
                      disabled={isFull}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isFull
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      {isFull ? 'Full' : '1-Tap RSVP'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          5. SECTION C: TRENDING CLUBS & STUDENT SOCIETIES
      ══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Users size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Featured Clubs & Student Chapters
              </h2>
              <p className="text-xs text-slate-400">Join technical teams, Tamil mandrams, sports squads & cultural clubs</p>
            </div>
          </div>
          <Link
            to="/clubs"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            Browse All Clubs ({clubs.length}) <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.slice(0, 3).map((club) => {
            const isMember = club.members?.some(
              (m) => m.user?._id === user?._id || m.user === user?._id
            );

            return (
              <div
                key={club._id}
                className="glass p-6 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between group"
              >
                <div>
                  {/* Avatar & Category */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-md">
                      {club.name.charAt(0)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-cyan-500/20">
                      {club.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1 font-['Outfit']">
                    {club.name}
                  </h3>

                  {club.tagline && (
                    <p className="text-xs text-cyan-400 font-medium mb-3 italic">
                      "{club.tagline}"
                    </p>
                  )}

                  <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    {club.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-white/5 pt-3 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Users size={13} className="text-cyan-400" />
                      {club.members?.length || 0} Members
                    </span>
                    {club.facultyAdvisor && (
                      <span className="truncate flex items-center gap-1">
                        <Award size={13} className="text-amber-400" /> Faculty Guided
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Join / Leave */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <Link
                    to="/clubs"
                    className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Workspace
                  </Link>

                  {isMember ? (
                    <button
                      onClick={() => handleLeaveClub(club._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-rose-500/20 text-emerald-400 hover:text-rose-300 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <UserCheck size={13} /> Joined
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinClub(club._id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
                    >
                      <UserPlus size={13} /> Join Club
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          6. SECTION D: ACTIVE COMMUNITY DISCUSSIONS & Q&A
      ══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Active Peer Q&A & Discussions
              </h2>
              <p className="text-xs text-slate-400">Ask academic questions, collaborate on projects, and get faculty advice</p>
            </div>
          </div>
          <Link
            to="/discussions"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            Open Forum ({discussions.length}) <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discussions.slice(0, 3).map((disc) => (
            <div
              key={disc._id}
              className="glass p-5 rounded-3xl border border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-white">
                      {disc.author?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs font-bold text-slate-300 truncate max-w-[130px]">
                      {disc.author?.name || 'Student'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 border border-emerald-500/20">
                    {disc.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 font-['Outfit']">
                  {disc.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {disc.body}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleUpvote(disc._id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-white/5 transition-colors cursor-pointer"
                >
                  <ThumbsUp size={12} className="text-emerald-400" />
                  <span className="font-bold">{disc.upvotes || 0}</span>
                </button>

                <Link
                  to="/discussions"
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <MessageSquare size={12} className="text-cyan-400" />
                  {disc.replies?.length || 0} Replies
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          7. SECTION E: QUICK ACCESS COMMAND TILES
      ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <Link
          to="/profile"
          className="glass p-4 rounded-2xl border border-white/10 hover:border-indigo-500/40 flex items-center gap-3 transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 shrink-0">
            <Ticket size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">My Event Passes</h4>
            <p className="text-[11px] text-slate-400">View QR tickets</p>
          </div>
        </Link>

        <Link
          to="/clubs"
          className="glass p-4 rounded-2xl border border-white/10 hover:border-cyan-500/40 flex items-center gap-3 transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shrink-0">
            <Users size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Club Workspaces</h4>
            <p className="text-[11px] text-slate-400">Join communities</p>
          </div>
        </Link>

        <Link
          to="/announcements"
          className="glass p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 flex items-center gap-3 transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 shrink-0">
            <Megaphone size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">Post Notice</h4>
            <p className="text-[11px] text-slate-400">Broadcast circular</p>
          </div>
        </Link>

        <Link
          to="/discussions"
          className="glass p-4 rounded-2xl border border-white/10 hover:border-emerald-500/40 flex items-center gap-3 transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shrink-0">
            <MessageSquare size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Ask Faculty & Peers</h4>
            <p className="text-[11px] text-slate-400">Start new Q&A thread</p>
          </div>
        </Link>
      </div>

    </div>
  );
};

export default Feed;
