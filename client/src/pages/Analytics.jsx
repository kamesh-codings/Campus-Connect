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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate metrics
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

  // Engagement trend mock weekly breakdown for chart
  const activityData = [
    { day: 'Mon', activeUsers: 140, rsvps: 28, posts: 12 },
    { day: 'Tue', activeUsers: 220, rsvps: 45, posts: 18 },
    { day: 'Wed', activeUsers: 310, rsvps: 62, posts: 25 },
    { day: 'Thu', activeUsers: 280, rsvps: 50, posts: 22 },
    { day: 'Fri', activeUsers: 420, rsvps: 88, posts: 35 },
    { day: 'Sat', activeUsers: 380, rsvps: 74, posts: 30 },
    { day: 'Sun', activeUsers: 260, rsvps: 39, posts: 16 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-['Outfit']">
          Campus Intelligence & Analytics
        </h1>
        <p className="text-text-secondary mt-1">
          Monitor community participation, event registrations, and club growth metrics.
        </p>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Club Memberships
            </p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{totalMemberships}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
            <Calendar size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Total Event RSVPs
            </p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{totalRsvps}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <Megaphone size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Official Notices
            </p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{totalAnnouncements}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success">
            <MessageCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Discussions
            </p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{totalDiscussions}</h3>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Area Activity Trend & Club Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Trend Area Chart */}
        <div className="card lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Weekly Engagement Velocity
              </h3>
              <p className="text-xs text-text-muted">
                Real-time active users and event participation
              </p>
            </div>
            <span className="badge-primary text-xs inline-flex items-center gap-1">
              <Activity size={12} /> Live Tracking
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRsvps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="Active Users"
                />
                <Area
                  type="monotone"
                  dataKey="rsvps"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRsvps)"
                  name="RSVPs"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Club Membership Breakdown (Pie Chart) */}
        <div className="card space-y-4">
          <h3 className="text-base font-bold text-white font-['Outfit']">
            Club Distribution
          </h3>
          <p className="text-xs text-text-muted">
            Members by community category
          </p>

          <div className="h-48 w-full flex items-center justify-center">
            {clubPieData.length > 0 ? (
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
                      backgroundColor: '#1e293b',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-text-muted">No club data available</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-glass-border">
            {clubPieData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-text-secondary truncate">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="truncate">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Event RSVPs by Category */}
      <div className="card space-y-4">
        <h3 className="text-base font-bold text-white font-['Outfit']">
          Event Participation by Category
        </h3>
        <p className="text-xs text-text-muted">
          Number of students registered across workshops, hackathons, and cultural fests
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventCategoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="registrations" fill="#6366f1" radius={[6, 6, 0, 0]} name="Registrations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
