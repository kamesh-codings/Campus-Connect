import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import {
  Bell,
  Search,
  LogOut,
  User,
  Menu,
  X,
  GraduationCap,
  Calendar,
  Users,
  Megaphone,
  MessageCircle,
  CheckCheck,
  Sparkles,
  BarChart3,
  Shield,
  ExternalLink,
  UserCheck,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import API from '../../services/api';

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  // Global Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchInputRef = useRef(null);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setShowSearchDropdown(false);
        setShowProfile(false);
        setShowNotif(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const q = searchQuery.toLowerCase();
        const [evRes, clRes, anRes, dsRes, usRes] = await Promise.all([
          API.get('/events'),
          API.get('/clubs'),
          API.get('/announcements'),
          API.get('/discussions'),
          API.get('/users/directory'),
        ]);

        const matchedEvents = (evRes.data || [])
          .filter((e) => e.title?.toLowerCase().includes(q) || e.venue?.toLowerCase().includes(q))
          .slice(0, 3);
        const matchedClubs = (clRes.data || [])
          .filter((c) => c.name?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q))
          .slice(0, 3);
        const matchedAnn = (anRes.data || [])
          .filter((a) => a.title?.toLowerCase().includes(q) || a.content?.toLowerCase().includes(q))
          .slice(0, 3);
        const matchedDisc = (dsRes.data || [])
          .filter((d) => d.title?.toLowerCase().includes(q) || d.tags?.some((t) => t.toLowerCase().includes(q)))
          .slice(0, 3);
        const matchedUsers = (usRes.data || [])
          .filter((u) => u.name?.toLowerCase().includes(q) || u.department?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q))
          .slice(0, 3);

        setSearchResults({
          events: matchedEvents,
          clubs: matchedClubs,
          announcements: matchedAnn,
          discussions: matchedDisc,
          users: matchedUsers,
          total: matchedEvents.length + matchedClubs.length + matchedAnn.length + matchedDisc.length + matchedUsers.length,
        });
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadge = {
    admin: { label: 'Admin', color: 'badge-danger', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    faculty: { label: 'Faculty', color: 'badge-warning', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    club_admin: { label: 'Club Lead', color: 'badge-primary', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
    student: { label: 'Student', color: 'badge-success', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  };

  const badge = roleBadge[user?.role] || roleBadge.student;

  const notifIcons = {
    event_reminder: Calendar,
    event: Calendar,
    announcement: Megaphone,
    club_invite: Users,
    discussion_reply: MessageCircle,
    system_alert: Sparkles,
  };

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Menu Toggle & Logo */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onToggleSidebar}
            className="text-text-secondary hover:text-white hover:bg-white/10 transition-all p-2 rounded-xl flex items-center justify-center neu-button cursor-pointer"
            title={sidebarOpen ? 'Collapse Navigation' : 'Expand Navigation'}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} className="text-primary-light" /> : <Menu size={20} />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25 shrink-0 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent font-['Outfit'] tracking-tight leading-none">
                CampusConnect
              </span>
              <span className="text-[10px] font-medium text-indigo-400/80 tracking-wider uppercase mt-0.5">
                Tamil Nadu Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Interactive Global Search */}
        <div className="relative hidden md:flex flex-1 max-w-lg mx-6" ref={searchRef}>
          <div className="relative w-full">
            <Search
              size={16}
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                isSearching ? 'text-primary-light animate-spin' : 'text-text-muted'
              }`}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults && searchResults.total > 0) setShowSearchDropdown(true);
              }}
              placeholder="Search events, clubs, announcements, discussions... (Press '/' to focus)"
              className="input-field pl-10 pr-9 py-2 text-xs md:text-sm w-full bg-slate-900/60 border-white/10 focus:border-primary focus:bg-slate-900"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults(null);
                  setShowSearchDropdown(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
              >
                <X size={14} />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted border border-white/10 rounded px-1 py-0.5 bg-slate-800">
                /
              </span>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchDropdown && searchResults && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#0D111A] rounded-xl p-3 shadow-2xl z-50 max-h-96 overflow-y-auto border border-white/10 animate-fade-in-up">
              {searchResults.total === 0 ? (
                <div className="py-6 text-center text-text-muted text-xs">
                  No matching events, clubs, or discussions found for "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Events */}
                  {searchResults.events.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-primary-light uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                        <Calendar size={12} /> Events ({searchResults.events.length})
                      </div>
                      {searchResults.events.map((ev) => (
                        <Link
                          key={ev._id}
                          to="/events"
                          onClick={() => setShowSearchDropdown(false)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-white/5 text-xs text-text-primary transition-colors group"
                        >
                          <span className="font-medium truncate group-hover:text-primary-light">{ev.title}</span>
                          <span className="text-xs text-text-muted shrink-0 ml-2">{ev.venue}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Clubs */}
                  {searchResults.clubs.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                        <Users size={12} /> Clubs ({searchResults.clubs.length})
                      </div>
                      {searchResults.clubs.map((cl) => (
                        <Link
                          key={cl._id}
                          to="/clubs"
                          onClick={() => setShowSearchDropdown(false)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-white/5 text-xs text-text-primary transition-colors group"
                        >
                          <span className="font-medium truncate group-hover:text-cyan-400">{cl.name}</span>
                          <span className="text-xs text-text-muted shrink-0 ml-2">{cl.category}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Discussions */}
                  {searchResults.discussions.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                        <MessageCircle size={12} /> Discussions ({searchResults.discussions.length})
                      </div>
                      {searchResults.discussions.map((ds) => (
                        <Link
                          key={ds._id}
                          to="/discussions"
                          onClick={() => setShowSearchDropdown(false)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-white/5 text-xs text-text-primary transition-colors group"
                        >
                          <span className="font-medium truncate group-hover:text-emerald-400">{ds.title}</span>
                          <span className="text-xs text-text-muted shrink-0 ml-2">{ds.category}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Announcements */}
                  {searchResults.announcements.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                        <Megaphone size={12} /> Announcements ({searchResults.announcements.length})
                      </div>
                      {searchResults.announcements.map((an) => (
                        <Link
                          key={an._id}
                          to="/announcements"
                          onClick={() => setShowSearchDropdown(false)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-white/5 text-xs text-text-primary transition-colors group"
                        >
                          <span className="font-medium truncate group-hover:text-amber-400">{an.title}</span>
                          <span className="text-xs text-text-muted shrink-0 ml-2">{an.category}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Students & Faculty Directory */}
                  {searchResults.users && searchResults.users.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                        <UserCheck size={12} /> Students & Faculty ({searchResults.users.length})
                      </div>
                      {searchResults.users.map((u) => (
                        <Link
                          key={u._id}
                          to="/profile"
                          onClick={() => setShowSearchDropdown(false)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-white/5 text-xs text-text-primary transition-colors group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-300 shrink-0">
                              {u.name?.charAt(0)}
                            </span>
                            <span className="font-medium truncate group-hover:text-indigo-300">{u.name}</span>
                          </div>
                          <span className="text-xs text-text-muted shrink-0 ml-2 capitalize">
                            {u.role?.replace('_', ' ')} • {u.department}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-3">
          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotif(!showNotif);
                setShowProfile(false);
              }}
              className={`relative p-2.5 rounded-xl transition-all cursor-pointer ${
                showNotif ? 'bg-primary/20 text-primary-light ring-1 ring-primary/40' : 'hover:bg-white/5 text-text-secondary hover:text-white'
              }`}
              title="Notifications"
              aria-label="View notifications"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold animate-pulse shadow-lg shadow-rose-500/50">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Flyout Panel */}
            {showNotif && (
              <div className="absolute right-0 top-full mt-2.5 w-80 sm:w-96 glass-neu-card rounded-2xl shadow-2xl z-50 border border-white/15 overflow-hidden animate-fade-in-up">
                <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-slate-900/60">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-primary-light" />
                    <span className="text-xs font-bold text-text-primary tracking-wide">Campus Notifications</span>
                    {unreadCount > 0 && (
                      <span className="badge badge-primary text-[10px] py-0.5 px-1.5">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-primary-light hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCheck size={13} /> Mark all read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-text-muted text-xs px-4">
                      <Bell size={24} className="mx-auto mb-2 opacity-30" />
                      No campus notifications yet. You're all caught up!
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const IconComponent = notifIcons[notif.type] || Bell;
                      return (
                        <div
                          key={notif._id || Math.random()}
                          onClick={() => {
                            if (notif._id && !notif.isRead) markAsRead(notif._id);
                            if (notif.actionUrl) {
                              navigate(notif.actionUrl);
                              setShowNotif(false);
                            }
                          }}
                          className={`p-3.5 flex items-start gap-3 hover:bg-white/5 transition-colors cursor-pointer ${
                            !notif.isRead ? 'bg-primary/5 border-l-2 border-primary' : ''
                          }`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                            !notif.isRead ? 'bg-primary/20 text-primary-light' : 'bg-slate-800 text-text-muted'
                          }`}>
                            <IconComponent size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-semibold text-text-primary truncate">{notif.title}</p>
                              <span className="text-[10px] text-text-muted shrink-0">
                                {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recent'}
                              </span>
                            </div>
                            <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar & Menu Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotif(false);
              }}
              className={`flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl transition-all cursor-pointer ${
                showProfile ? 'bg-primary/20 ring-1 ring-primary/40' : 'hover:bg-white/5'
              }`}
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center font-bold text-white text-xs shadow-md shadow-primary/25">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-text-primary leading-tight max-w-[130px] truncate">
                  {user?.name || 'User'}
                </p>
                <span className={`inline-block text-[10px] font-medium px-1.5 py-0.2 rounded border mt-0.5 ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2.5 w-80 bg-slate-950/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/70 z-50 border border-white/15 animate-fade-in-up overflow-hidden">
                {/* User Header Card */}
                <div className="p-4 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-900/90 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center font-bold text-white text-base shadow-lg shadow-primary/25 shrink-0">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white font-['Outfit'] truncate leading-tight">
                        {user?.name}
                      </p>
                      <p className="text-xs text-text-muted truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                      {user?.department}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="p-2 space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold text-text-secondary hover:text-white group"
                  >
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                      <User size={15} />
                    </div>
                    <span>My Profile & Badges</span>
                  </Link>

                  {['admin', 'club_admin', 'faculty'].includes(user?.role) && (
                    <Link
                      to="/analytics"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold text-text-secondary hover:text-white group"
                    >
                      <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                        <BarChart3 size={15} />
                      </div>
                      <span>Campus Analytics</span>
                    </Link>
                  )}

                  {['admin', 'faculty'].includes(user?.role) && (
                    <Link
                      to="/admin"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold text-text-secondary hover:text-white group"
                    >
                      <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors">
                        <Shield size={15} />
                      </div>
                      <span>Faculty & Admin Hub</span>
                    </Link>
                  )}
                </div>

                <div className="border-t border-white/10 mx-2 my-1" />

                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/15 transition-colors text-xs font-semibold text-rose-400 hover:text-rose-300 w-full text-left cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors">
                      <LogOut size={15} />
                    </div>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
