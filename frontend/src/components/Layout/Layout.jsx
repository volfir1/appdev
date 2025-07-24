import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import AdminNavbar from '../Navbar/admin/adminNav';
import UserNavbar from '../Navbar/user/userNav';
import NgoNavbar from '../Navbar/ngo/ngoNav';

const Layout = () => {
  const location = useLocation();
  // Detect if we're on the geospatial map route
  const isGeoPage = location.pathname.includes('/admin/geo');

  // Determine role from localStorage (or use your auth context if available)
  const role = localStorage.getItem('role'); // 'admin', 'ngo_staff', or 'worker'

  useEffect(() => {
    // Inject CSS styles for hiding scrollbars globally
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      /* Hide scrollbar for Chrome, Safari and Opera */
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      .hide-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }

      /* Custom scrollbar styling (optional - for when you want subtle scrollbars) */
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 2px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.2);
      }

      /* Ensure body and html don't show scrollbars */
      body, html {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      body::-webkit-scrollbar,
      html::-webkit-scrollbar {
        display: none;
      }
    `;
    
    document.head.appendChild(styleElement);

    // Cleanup function to remove the style when component unmounts
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <AppShell
      header={{ height: 48 }}
      style={{
        backgroundColor: 'transparent',
        height: '100vh',
        minHeight: '100vh',
      }}
      className="hide-scrollbar"
    >
      {/* Header */}
      <AppShell.Header style={{ zIndex: 1000 }}>
        {role === 'admin' && <AdminNavbar />}
        {role === 'ngo_staff' && <NgoNavbar />}
        {role === 'worker' && <UserNavbar />}
      </AppShell.Header>

      {/* Main content area */}
      <AppShell.Main
        className="hide-scrollbar"
        style={{
          margin: 0,
          padding: 0,
          paddingTop: isGeoPage ? 0 : 0, // Fixed the paddingTop logic
          overflow: 'auto', // Changed from overflowY to overflow for both axes
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'transparent',
        }}
      >
        <div
          className="hide-scrollbar"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'transparent',
            overflow: 'auto', // Ensure this div can also scroll without showing scrollbars
          }}
        >
          <Outlet />
        </div>
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;