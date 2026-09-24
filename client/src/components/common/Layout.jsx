import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />

      {/* Responsive Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="pt-16 lg:pl-64 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
