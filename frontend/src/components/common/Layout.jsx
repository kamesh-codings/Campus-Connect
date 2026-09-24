import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-text-primary gradient-mesh">
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

      {/* Main Content Area — always centered */}
      <main
        className={`pt-24 pb-12 min-h-screen transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:pl-64' : 'pl-0'
        }`}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1280px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: 'clamp(1.25rem, 4vw, 3rem)',
            paddingRight: 'clamp(1.25rem, 4vw, 3rem)',
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
