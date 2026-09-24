import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Megaphone,
  MessageCircle,
  BarChart3,
  Shield,
  UserCircle,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { unreadCount } = useSocket();
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      icon: LayoutDashboard,
      label: 'Campus Feed',
      roles: ['student', 'club_admin', 'faculty', 'admin'],
      badge: null,
    },
    {
      path: '/events',
      icon: Calendar,
      label: 'Events & Fests',
      roles: ['student', 'club_admin', 'faculty', 'admin'],
      badge: 'Fest',
    },
    {
      path: '/clubs',
      icon: Users,
      label: 'Clubs & Mandrams',
      roles: ['student', 'club_admin', 'faculty', 'admin'],
      badge: null,
    },
    {
      path: '/announcements',
      icon: Megaphone,
      label: 'Announcements',
      roles: ['student', 'club_admin', 'faculty', 'admin'],
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      path: '/discussions',
      icon: MessageCircle,
      label: 'Discussions & Help',
      roles: ['student', 'club_admin', 'faculty', 'admin'],
      badge: null,
    },
    {
      path: '/profile',
      icon: UserCircle,
      label: 'My Profile',
      roles: ['student', 'club_admin', 'faculty', 'admin'],
      badge: null,
    },
    {
      path: '/analytics',
      icon: BarChart3,
      label: 'Analytics & Trends',
      roles: ['admin', 'club_admin', 'faculty'],
      badge: null,
    },
    {
      path: '/admin',
      icon: Shield,
      label: 'Admin Hub',
      roles: ['admin'],
      badge: 'Staff',
    },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(user?.role));

  const roleGradients = {
    admin: 'from-rose-500 to-amber-500',
    faculty: 'from-amber-500 to-orange-500',
    club_admin: 'from-indigo-500 to-purple-500',
    student: 'from-primary to-cyan-500',
  };

  const currentGradient = roleGradients[user?.role] || roleGradients.student;

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-slate-950/90 backdrop-blur-2xl border-r border-white/10 z-40 transition-transform duration-300 ease-in-out flex flex-col justify-between
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full py-4 px-3 overflow-y-auto">
          {/* Tamil Nadu Campus Tagline */}
          <div className="px-3 py-2 mb-2 rounded-xl bg-gradient-to-r from-primary/10 via-cyan-500/10 to-transparent border border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-primary-light animate-pulse" />
              <span className="text-[11px] font-semibold text-primary-light">
                {user?.department} Department
              </span>
            </div>
            <span className="text-[10px] text-text-muted font-mono">
              {user?.yearOfStudy ? `Y${user.yearOfStudy}` : 'Staff'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5 mt-1">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/25 to-primary/5 text-white border-l-3 border-primary shadow-lg shadow-primary/10'
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={`transition-colors duration-200 ${
                        isActive
                          ? 'text-primary-light scale-110'
                          : 'text-text-muted group-hover:text-primary-light'
                      }`}
                    />
                    <span className="tracking-wide">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        typeof item.badge === 'number'
                          ? 'bg-rose-500 text-white'
                          : 'bg-primary/20 text-primary-light border border-primary/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Info Box: Tamil Mandram & Campus Highlights */}
          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-white/10 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/10 rounded-full blur-xl pointer-events-none group-hover:bg-primary/20 transition-all" />
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                🏛️ Muthamil Mandram
              </span>
            </div>
            <p className="text-[11px] text-text-secondary leading-snug">
              Pongal Thiruvizha & Pattimandram 2026 registration is live!
            </p>
            <NavLink
              to="/events"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className="mt-2 text-[10px] font-bold text-primary-light hover:text-white flex items-center gap-1 transition-colors"
            >
              Explore Events <ChevronRight size={12} />
            </NavLink>
          </div>

          {/* Bottom User Card */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <NavLink
              to="/profile"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentGradient} flex items-center justify-center font-bold text-white text-xs shadow-md group-hover:scale-105 transition-transform`}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text-primary truncate group-hover:text-primary-light transition-colors">
                  {user?.name}
                </p>
                <p className="text-[10px] text-text-muted truncate capitalize">
                  {user?.role?.replace('_', ' ')} • {user?.department}
                </p>
              </div>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
