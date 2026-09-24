import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar, Users, Megaphone, TrendingUp, ArrowRight, Clock, MapPin, AlertTriangle, Zap,
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
  const priorityColor = { critical: 'text-danger', urgent: 'text-accent', normal: 'text-primary-light' };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Welcome Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="section-title">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="section-subtitle">Here's what's happening on campus today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Upcoming Events', value: stats.events, icon: Calendar, color: 'from-indigo-500 to-purple-600' },
          { label: 'Active Clubs', value: stats.clubs, icon: Users, color: 'from-cyan-500 to-blue-600' },
          { label: 'Announcements', value: stats.announcements, icon: Megaphone, color: 'from-amber-500 to-orange-600' },
          { label: 'Discussions', value: stats.discussions, icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="glass-card p-5 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">Upcoming Events</h2>
            <Link to="/events" className="text-sm text-primary-light hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Calendar size={40} className="text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary">No upcoming events. Check back later!</p>
              </div>
            ) : (
              events.map((event, i) => (
                <Link
                  key={event._id}
                  to={`/events`}
                  className="glass-card p-4 flex items-start gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center text-white text-xs font-bold shrink-0">
                    <span className="text-lg leading-none">{new Date(event.startDate).getDate()}</span>
                    <span className="text-[10px] uppercase">{new Date(event.startDate).toLocaleDateString('en', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary text-sm truncate">{event.title}</h3>
                    <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                      <MapPin size={12} /> {event.venue}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="badge badge-info text-[10px]">{event.category}</span>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Clock size={11} /> {new Date(event.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-text-muted">
                    {event.registeredUsers?.length || 0}/{event.maxCapacity}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Announcements Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">Announcements</h2>
            <Link to="/announcements" className="text-sm text-primary-light hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Megaphone size={40} className="text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary">No announcements yet.</p>
              </div>
            ) : (
              announcements.map((ann, i) => {
                const PriorityIcon = priorityIcon[ann.priority] || Megaphone;
                return (
                  <div
                    key={ann._id}
                    className={`glass-card p-4 priority-${ann.priority} animate-fade-in-up`}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <PriorityIcon
                        size={16}
                        className={`${priorityColor[ann.priority]} shrink-0 mt-0.5`}
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-text-primary truncate">{ann.title}</h3>
                        <p className="text-xs text-text-muted mt-1 line-clamp-2">{ann.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`badge badge-${ann.priority === 'critical' ? 'danger' : ann.priority === 'urgent' ? 'warning' : 'info'} text-[10px]`}>
                            {ann.category}
                          </span>
                          <span className="text-[10px] text-text-muted">
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
