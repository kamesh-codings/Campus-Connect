import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Megaphone,
  MessageCircle,
  BarChart3,
  Shield,
  UserCircle,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Campus Feed', roles: ['student', 'club_admin', 'faculty', 'admin'] },
    { path: '/events', icon: Calendar, label: 'Events', roles: ['student', 'club_admin', 'faculty', 'admin'] },
    { path: '/clubs', icon: Users, label: 'Clubs', roles: ['student', 'club_admin', 'faculty', 'admin'] },
    { path: '/announcements', icon: Megaphone, label: 'Announcements', roles: ['student', 'club_admin', 'faculty', 'admin'] },
    { path: '/discussions', icon: MessageCircle, label: 'Discussions', roles: ['student', 'club_admin', 'faculty', 'admin'] },
    { path: '/profile', icon: UserCircle, label: 'My Profile', roles: ['student', 'club_admin', 'faculty', 'admin'] },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['admin', 'club_admin', 'faculty'] },
    { path: '/admin', icon: Shield, label: 'Admin Hub', roles: ['admin'] },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 glass-neu-card rounded-none border-y-0 border-l-0 border-r border-white/10 z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full py-4 px-3">
          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-primary-light border-l-2 border-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                    }`}
                >
                  <Icon size={18} className={isActive ? 'text-primary-light' : ''} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom User Info */}
          <div className="mt-auto pt-4 border-t border-glass-border">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user?.department} {user?.yearOfStudy ? `• Year ${user.yearOfStudy}` : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
