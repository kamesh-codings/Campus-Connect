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
  FileText,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isDesktop = false }) => {
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
      path: '/resources',
      icon: FileText,
      label: 'Files & Resources',
      roles: ['student', 'club_admin', 'faculty', 'admin'],
      badge: 'Hub',
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
    student: 'from-indigo-500 to-cyan-500',
  };

  const currentGradient = roleGradients[user?.role] || roleGradients.student;

  const content = (
    <div className="flex flex-col h-full py-4 px-3.5 space-y-4 font-sans">
      {/* Campus / Dept Tag */}
      <div className="px-3.5 py-2.5 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles size={14} className="text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-200 truncate">
            {user?.department || 'Campus'} Dept
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono shrink-0 ml-1">
          {user?.yearOfStudy ? `Yr ${user.yearOfStudy}` : 'Staff'}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (!isDesktop) onClose();
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 group
                ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  size={16}
                  className={`shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded-md shrink-0 ml-1 ${
                    typeof item.badge === 'number'
                      ? 'bg-rose-500 text-white'
                      : isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Muthamil Mandram Spotlight Card */}
      <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
            🏛️ Muthamil Mandram
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-snug">
          Pongal Thiruvizha & Tamil Debate 2026 is live on campus!
        </p>
        <NavLink
          to="/events"
          onClick={() => {
            if (!isDesktop) onClose();
          }}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View Events <ChevronRight size={13} />
        </NavLink>
      </div>

      {/* User Info Bar at Bottom */}
      <div className="pt-3 border-t border-white/10">
        <NavLink
          to="/profile"
          onClick={() => {
            if (!isDesktop) onClose();
          }}
          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors group"
        >
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${currentGradient} flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0`}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-100 truncate group-hover:text-indigo-400 transition-colors">
              {user?.name}
            </p>
            <p className="text-xs text-slate-400 truncate capitalize">
              {user?.role?.replace('_', ' ')} • {user?.department}
            </p>
          </div>
        </NavLink>
      </div>
    </div>
  );

  // Desktop inline rendering
  if (isDesktop) {
    return <div className="h-full">{content}</div>;
  }

  // Mobile Drawer rendering
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#080B12] border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {content}
      </aside>
    </>
  );
};

export default Sidebar;
