
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IconLogout, IconSettings, IconChevronDown, IconUser } from '@tabler/icons-react';
import axios from 'axios';
import './userNav.css';


export default function UserNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const userId = localStorage.getItem('userId');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch user info if not in localStorage
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    async function fetchUserInfo() {
      const token = localStorage.getItem('token');
      if (!userId || !token) return;
      try {
        const res = await axios.get(`${API_BASE}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          setUserName(res.data.name);
          setUserEmail(res.data.email);
          localStorage.setItem('userName', res.data.name);
          localStorage.setItem('userEmail', res.data.email);
        }
      } catch {
        // fallback to localStorage or dummy
        if (!userName) setUserName('User');
        if (!userEmail) setUserEmail('user@actonpov.com');
      }
    }
    if (!userName || !userEmail) {
      fetchUserInfo();
    }
  }, [userId, userName, userEmail]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu') && !event.target.closest('.user-menu-button')) {
        setUserMenuOpen(false);
      }
      if (!event.target.closest('.mobile-drawer') && !event.target.closest('.burger-menu')) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    setUserName('');
    setUserEmail('');
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === 'profile') {
      return location.pathname === `/worker/profile/${userId}`;
    }
    return location.pathname === `/worker/${path}`;
  };

  const navItems = [
    { path: 'beneficiaries', label: 'Beneficiaries', icon: IconUser },
    { path: 'profile', label: 'Profile', icon: IconUser },
    { path: 'referrals', label: 'Referrals', icon: IconUser },
  ];

  const handleNavClick = (path) => {
    if (path === 'profile') {
      navigate(`/worker/profile/${userId}`);
    } else {
      navigate(`/worker/${path}`);
    }
    setDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <>
      <nav className="admin-navbar">
        <div className="navbar-container">
          {/* Logo/Brand */}
          <Link to="/worker/dashboard" className="navbar-brand">
            ActOnPov
          </Link>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <div className="navbar-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path === 'profile' ? `/worker/profile/${userId}` : `/worker/${item.path}`}
                    className={`nav-button ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <Icon size={14} className="nav-icon" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side - User Menu & Mobile Burger */}
          <div className="navbar-right">
            {/* Desktop User Menu */}
            {!isMobile && (
              <div className="user-menu-wrapper">
                <button
                  className="user-menu-button"
                  onClick={toggleUserMenu}
                >
                  <div className="user-avatar">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{userName || 'User'}</div>
                    <div className="user-email">{userEmail || 'user@actonpov.com'}</div>
                  </div>
                  <IconChevronDown size={12} className="chevron-icon" />
                </button>

                {userMenuOpen && (
                  <div className="user-menu">
                    <div className="menu-label">Account</div>
                    
                    <div className="menu-divider"></div>
                    <button
                      className="menu-item logout"
                      onClick={handleLogout}
                    >
                      <IconLogout size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile User Avatar & Burger */}
            {isMobile && (
              <div className="mobile-header">
                <div className="mobile-avatar">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <button
                  className={`burger-menu ${drawerOpen ? 'active' : ''}`}
                  onClick={toggleDrawer}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobile && (
        <>
          {drawerOpen && <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}></div>}
          <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
            <div className="drawer-header">
              <div className="drawer-user-info">
                <div className="drawer-avatar">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="drawer-user-details">
                  <div className="drawer-user-name">{userName}</div>
                  <div className="drawer-user-email">{userEmail}</div>
                </div>
              </div>
            </div>

            <div className="drawer-content">
              {/* Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    className={`drawer-nav-item ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.path)}
                  >
                    <Icon size={20} className="drawer-nav-icon" />
                    <span className="drawer-nav-label">{item.label}</span>
                  </button>
                );
              })}

              <div className="drawer-divider"></div>

              {/* Settings */}
              <button
                className="drawer-nav-item"
                onClick={() => {
                  navigate('/worker/settings');
                  setDrawerOpen(false);
                }}
              >
                <IconSettings size={20} className="drawer-nav-icon" />
                <span className="drawer-nav-label">Settings</span>
              </button>

              {/* Logout */}
              <button
                className="drawer-nav-item logout"
                onClick={() => {
                  handleLogout();
                  setDrawerOpen(false);
                }}
              >
                <IconLogout size={20} className="drawer-nav-icon" />
                <span className="drawer-nav-label">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}