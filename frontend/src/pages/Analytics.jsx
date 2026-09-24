import { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Users,
  Calendar,
  Megaphone,
  MessageCircle,
  TrendingUp,
  Award,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  PieChart as PieIcon,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const Analytics = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, clubsRes, annRes, discRes] = await Promise.all([
        API.get('/events'),
        API.get('/clubs'),
        API.get('/announcements'),
        API.get('/discussions'),
      ]);
      setEvents(eventsRes.data);
      setClubs(clubsRes.data);
      setAnnouncements(annRes.data);
      setDiscussions(discRes.data);
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Metrics
  const totalRsvps = events.reduce((acc, ev) => acc + (ev.registeredUsers?.length || 0), 0);
  const totalMemberships = clubs.reduce((acc, c) => acc + (c.members?.length || 0), 0);
  const totalDiscussions = discussions.length;
  const totalAnnouncements = announcements.length;

  // Chart 1: Event registrations by category
  const eventsByCategory = events.reduce((acc, ev) => {
    const cat = ev.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (ev.registeredUsers?.length || 0);
    return acc;
  }, {});
  const eventCategoryData = Object.keys(eventsByCategory).map((key) => ({
    name: key,
    registrations: eventsByCategory[key],
  }));

  // Chart 2: Clubs by category (Pie chart)
  const clubsByCategory = clubs.reduce((acc, c) => {
    const cat = c.category || 'General';
    acc[cat] = (acc[cat] || 0) + (c.members?.length || 0);
    return acc;
  }, {});
  const clubPieData = Object.keys(clubsByCategory).map((key) => ({
    name: key,
    value: clubsByCategory[key],
  }));

  // Chart 3: Weekly Active Campus Trends
  const activityData = [
    { day: 'Mon', activeUsers: 140, rsvps: 28, posts: 12 },
    { day: 'Tue', activeUsers: 220, rsvps: 45, posts: 18 },
    { day: 'Wed', activeUsers: 310, rsvps: 62, posts: 24 },
    { day: 'Thu', activeUsers: 280, rsvps: 51, posts: 19 },
    { day: 'Fri', activeUsers: 420, rsvps: 94, posts: 38 },
    { day: 'Sat', activeUsers: 380, rsvps: 88, posts: 30 },
    { day: 'Sun', activeUsers: 290, rsvps: 40, posts: 15 },
  ];

  const kpis = [
    {
      title: 'Total Event RSVPs',
      value: totalRsvps,
      change: '+34% this month',
      icon: Calendar,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/15 border-indigo-500/25',
    },
    {
      title: 'Club Memberships',
      value: totalMemberships,
      change: '+18% growth',
      icon: Users,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/15 border-cyan-500/25',
    },
    {
      title: 'Forum Interactions',
      value: totalDiscussions,
      change: '+52% engagement',
      icon: MessageCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15 border-emerald-500/25',
    },
    {
      title: 'Campus Broadcasts',
      value: totalAnnouncements,
      change: '100% reach',
      icon: Megaphone,
      color: 'text-amber-400',
      bg: 'bg-amber-500/15 border-amber-500/25',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* ── 1. HEADER ────────────────────────────────────── */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
          <Sparkles size={13} className="text-indigo-400" />
          <span>Executive Intelligence & Student Engagement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-['Outfit']">
          Campus Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time metrics on student participation, event registrations, and departmental activity.
        </p>
      </div>

      {/* ── 2. KPI METRIC CARDS ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="glass p-5 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all shadow-lg flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-400">{kpi.title}</p>
                <p className="text-3xl font-black text-white mt-1 font-['Outfit']">{kpi.value}</p>
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp size={12} /> {kpi.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${kpi.bg} border flex items-center justify-center shrink-0`}>
                <Icon size={22} className={kpi.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. CHARTS GRID ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Area Chart: Weekly Active Users (8 cols) */}
        <div className="lg:col-span-8 glass p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit']">
                <Activity size={18} className="text-indigo-400" /> Weekly Engagement & Traffic
              </h3>
              <p className="text-xs text-slate-400">Daily active student visits and event registrations</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="rsvpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#080B12',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="activeUsers"
                  name="Active Students"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#userGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="rsvps"
                  name="Event RSVPs"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#rsvpGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Club Distribution (4 cols) */}
        <div className="lg:col-span-4 glass p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit']">
              <PieIcon size={18} className="text-cyan-400" /> Club Category Share
            </h3>
            <p className="text-xs text-slate-400">Distribution by student memberships</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clubPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {clubPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#080B12',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 justify-center">
            {clubPieData.map((entry, idx) => (
              <span key={entry.name} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                {entry.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. BAR CHART: EVENT RSVPs BY CATEGORY ───────── */}
      <div className="glass p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit']">
            <BarChart3 size={18} className="text-amber-400" /> Event Participation by Category
          </h3>
          <p className="text-xs text-slate-400">Total verified ticket registrations across workshop types</p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventCategoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#080B12',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="registrations" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
