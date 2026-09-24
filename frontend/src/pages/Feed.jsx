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

  /* ── Loading Skeleton ─────────────────────────── */
  if (loading) {
    return (
      <div className="feed-container">
        {/* Skeleton Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ height: 18, width: 200, margin: '0 auto 12px', background: 'rgba(30,41,59,0.7)', borderRadius: 10 }} className="animate-pulse" />
          <div style={{ height: 40, width: 340, margin: '0 auto 10px', background: 'rgba(30,41,59,0.5)', borderRadius: 12 }} className="animate-pulse" />
          <div style={{ height: 16, width: 420, margin: '0 auto', background: 'rgba(30,41,59,0.35)', borderRadius: 8 }} className="animate-pulse" />
        </div>

        {/* Skeleton Stat Boxes */}
        <div className="feed-stats-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-neu-card" style={{ padding: '2rem', height: 130 }}>
              <div className="animate-pulse" style={{ height: '100%', background: 'rgba(30,41,59,0.4)', borderRadius: 12 }} />
            </div>
          ))}
        </div>

        {/* Skeleton Content */}
        <div className="feed-content-grid">
          <div>
            <div style={{ height: 28, width: 200, background: 'rgba(30,41,59,0.5)', borderRadius: 10 }} className="animate-pulse" />
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-neu-card" style={{ height: 100, marginTop: 20 }}>
                <div className="animate-pulse" style={{ height: '100%', background: 'rgba(30,41,59,0.3)', borderRadius: 12 }} />
              </div>
            ))}
          </div>
          <div>
            <div style={{ height: 28, width: 200, background: 'rgba(30,41,59,0.5)', borderRadius: 10 }} className="animate-pulse" />
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-neu-card" style={{ height: 120, marginTop: 20 }}>
                <div className="animate-pulse" style={{ height: '100%', background: 'rgba(30,41,59,0.3)', borderRadius: 12 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Upcoming Events', value: stats.events, icon: Calendar, color: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/20', gradient: 'linear-gradient(135deg, #6366f1, #9333ea)' },
    { label: 'Active Clubs', value: stats.clubs, icon: Users, color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20', gradient: 'linear-gradient(135deg, #06b6d4, #2563eb)' },
    { label: 'Announcements', value: stats.announcements, icon: Megaphone, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20', gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)' },
    { label: 'Discussions', value: stats.discussions, icon: TrendingUp, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20', gradient: 'linear-gradient(135deg, #10b981, #0d9488)' },
  ];

  return (
    <div className="feed-container">
      {/* ── Welcome Header ─────────────────────────── */}
      <header className="feed-header animate-fade-in-up">
        <div className="feed-header-badge">
          <Sparkles size={13} /> Campus Activity Portal
        </div>
        <h1 className="feed-header-title">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="feed-header-subtitle">
          Here's a summary of activities, events, and announcements happening on campus today.
        </p>
      </header>

      {/* ── Stats Cards ────────────────────────────── */}
      <div className="feed-stats-grid">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className="feed-stat-card animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div
              className="feed-stat-icon"
              style={{ background: stat.gradient }}
            >
              <stat.icon size={26} color="#fff" />
            </div>
            <div className="feed-stat-info">
              <span className="feed-stat-value">{stat.value}</span>
              <span className="feed-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content: Events & Announcements ──── */}
      <div className="feed-content-grid">

        {/* Left Column: Upcoming Events */}
        <section className="feed-section animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <div className="feed-section-header">
            <div>
              <h2 className="feed-section-title">
                <Calendar size={22} style={{ color: '#818cf8' }} /> Upcoming Events
              </h2>
              <p className="feed-section-subtitle">Campus schedules and hackathons</p>
            </div>
            <Link to="/events" className="feed-section-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="feed-cards-stack">
            {events.length === 0 ? (
              <div className="glass-neu-card feed-empty-state">
                <Calendar size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>No upcoming events scheduled.</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>Check back later for new event announcements.</p>
              </div>
            ) : (
              events.map((event, i) => (
                <Link
                  key={event._id}
                  to="/events"
                  className="feed-event-card glass-neu-card animate-fade-in-up"
                  style={{ animationDelay: `${0.3 + i * 0.08}s`, textDecoration: 'none' }}
                >
                  {/* Date Pill */}
                  <div className="feed-event-date">
                    <span className="feed-event-date-day">{new Date(event.startDate).getDate()}</span>
                    <span className="feed-event-date-month">{new Date(event.startDate).toLocaleDateString('en', { month: 'short' }).toUpperCase()}</span>
                  </div>

                  {/* Details */}
                  <div className="feed-event-details">
                    <h3 className="feed-event-title">{event.title}</h3>
                    <div className="feed-event-meta">
                      <span className="feed-event-meta-item">
                        <MapPin size={14} style={{ color: '#818cf8' }} /> {event.venue}
                      </span>
                      <span className="feed-event-meta-item">
                        <Clock size={14} style={{ color: '#64748b' }} /> {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="feed-event-tags">
                    <span className="badge badge-info">{event.category}</span>
                    <span className="feed-event-seats">
                      {event.registeredUsers?.length || 0}/{event.maxCapacity} seats
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Right Column: Announcements */}
        <section className="feed-section animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          <div className="feed-section-header">
            <div>
              <h2 className="feed-section-title">
                <Megaphone size={22} style={{ color: '#fbbf24' }} /> Announcements
              </h2>
              <p className="feed-section-subtitle">Campus alerts & bulletins</p>
            </div>
            <Link to="/announcements" className="feed-section-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="feed-cards-stack">
            {announcements.length === 0 ? (
              <div className="glass-neu-card feed-empty-state">
                <Megaphone size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>No announcements published.</p>
              </div>
            ) : (
              announcements.map((ann, i) => {
                const PriorityIcon = priorityIcon[ann.priority] || Megaphone;
                return (
                  <div
                    key={ann._id}
                    className={`feed-announce-card glass-neu-card priority-${ann.priority} animate-fade-in-up`}
                    style={{ animationDelay: `${0.4 + i * 0.08}s` }}
                  >
                    <div className="feed-announce-icon-wrap">
                      <PriorityIcon
                        size={18}
                        className={priorityColor[ann.priority]}
                      />
                    </div>
                    <div className="feed-announce-body">
                      <h3 className="feed-announce-title">{ann.title}</h3>
                      <p className="feed-announce-content">{ann.content}</p>
                      <div className="feed-announce-footer">
                        <span className={`badge badge-${ann.priority === 'critical' ? 'danger' : ann.priority === 'urgent' ? 'warning' : 'info'}`}>
                          {ann.category}
                        </span>
                        <span className="feed-announce-date">
                          {new Date(ann.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Feed;
