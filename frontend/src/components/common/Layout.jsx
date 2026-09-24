import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Megaphone,
  MessageCircle,
} from 'lucide-react';

const Layout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();

  // Global Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const mobileNavItems = [
    { path: '/', icon: LayoutDashboard, label: 'Feed' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/clubs', icon: Users, label: 'Clubs' },
    { path: '/announcements', icon: Megaphone, label: 'Alerts' },
    { path: '/discussions', icon: MessageCircle, label: 'Discuss' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* 1. Top Navbar (Fixed full-width header) */}
      <Navbar
        onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        sidebarOpen={mobileSidebarOpen}
      />

      {/* 2. Main Shell (Starts below 64px header, full height) */}
      <div className="flex-1 flex pt-16 min-h-screen">
        {/* Desktop Sidebar (Permanent, in-flow column: NO overlapping) */}
        <div className="hidden lg:block w-64 shrink-0 border-r border-white/10 bg-slate-900/60 backdrop-blur-xl">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <Sidebar isOpen={true} onClose={() => {}} isDesktop={true} />
          </div>
        </div>

        {/* Mobile / Tablet Drawer Sidebar (Overlay) */}
        <div className="lg:hidden">
          <Sidebar
            isOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
            isDesktop={false}
          />
        </div>

        {/* Main Content Area (Takes remaining width naturally, centered, with generous breathing room) */}
        <main className="flex-1 min-w-0 w-full overflow-x-hidden px-4 sm:px-6 lg:px-10 py-8 pb-28 sm:pb-16">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Command Palette Modal (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* 3. Mobile Bottom Navigation Bar (< 640px) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium transition-all duration-200 ${
                isActive
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-500/20 text-indigo-400' : ''
                }`}
              >
                <Icon size={18} />
              </div>
              <span className="mt-0.5">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
