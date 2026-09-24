import { Link, useLocation, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { unreadCount, clearUnread } = useSocket();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadge = {
    admin: { label: 'Admin', color: 'badge-danger' },
    faculty: { label: 'Faculty', color: 'badge-warning' },
    club_admin: { label: 'Club Lead', color: 'badge-primary' },
    student: { label: 'Student', color: 'badge-success' },
  };

  const badge = roleBadge[user?.role] || roleBadge.student;

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Left: Logo & Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="text-text-secondary hover:text-white hover:bg-white/5 transition-all p-2 rounded-xl flex items-center justify-center neu-button"
          title="Toggle Navigation Sidebar"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <X size={22} className="text-primary-light" /> : <Menu size={22} />}
        </button>

        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <GraduationCap size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent font-['Outfit'] hidden sm:block tracking-tight">
            CampusConnect
          </span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search events, clubs, discussions..."
            className="input-field pl-10 py-2 text-sm"
          />
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotif(!showNotif);
              setShowProfile(false);
              if (showNotif) clearUnread();
            }}
            className="relative p-2 rounded-xl hover:bg-surface-light transition-colors"
          >
            <Bell size={20} className="text-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-danger text-white text-xs flex items-center justify-center font-bold animate-pulse-glow">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotif(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-surface-light transition-colors"
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-text-primary leading-tight">
                {user?.name || 'User'}
              </p>
              <span className={`badge ${badge.color} text-[10px] py-0 px-1.5`}>
                {badge.label}
              </span>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl p-2 shadow-2xl z-50">
              <Link
                to="/profile"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-surface-lighter transition-colors text-sm text-text-secondary hover:text-text-primary"
              >
                <User size={16} /> My Profile
              </Link>
              <hr className="border-glass-border my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-surface-lighter transition-colors text-sm text-danger w-full text-left"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
