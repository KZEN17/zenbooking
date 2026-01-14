import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  TrendingDown,
  PieChart,
  Users,
  LogOut,
  Moon
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  // Set initial theme on mount
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const isActive = (path: string) => location.pathname === path;

  if (!isAuthenticated) {
    return null;
  }

  const isAdmin = user?.role === 'Admin';

  // Get initials from email
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <Building2 className="brand-icon" size={24} />
          </div>
          <span className="brand-text">ZEN BOOKING</span>
        </div>
      </div>

      <div className="sidebar-user-profile">
        <div className="user-avatar">
          {getInitials(user?.email || '')}
        </div>
        <div className="user-info">
          <div className="user-name">{user?.email?.split('@')[0]}</div>
          <div className="user-role">{isAdmin ? 'Admin' : 'User'}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
        >
          <LayoutDashboard className="nav-icon" size={20} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/apartments"
          className={`sidebar-link ${isActive('/apartments') ? 'active' : ''}`}
        >
          <Building2 className="nav-icon" size={20} />
          <span>Apartments</span>
        </Link>

        <Link
          to="/income"
          className={`sidebar-link ${isActive('/income') ? 'active' : ''}`}
        >
          <TrendingUp className="nav-icon" size={20} />
          <span>Income</span>
        </Link>

        <Link
          to="/expenses"
          className={`sidebar-link ${isActive('/expenses') ? 'active' : ''}`}
        >
          <TrendingDown className="nav-icon" size={20} />
          <span>Expenses</span>
        </Link>

        <Link
          to="/summary"
          className={`sidebar-link ${isActive('/summary') ? 'active' : ''}`}
        >
          <PieChart className="nav-icon" size={20} />
          <span>Summary</span>
        </Link>

        {isAdmin && (
          <Link
            to="/users"
            className={`sidebar-link ${isActive('/users') ? 'active' : ''}`}
          >
            <Users className="nav-icon" size={20} />
            <span>Users</span>
          </Link>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="theme-toggle-wrapper">
          <div className="theme-label">
            <Moon size={18} />
            <span>Dark Mode</span>
          </div>
          <button
            onClick={toggleTheme}
            className={`theme-switch ${isDarkMode ? 'active' : ''}`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div className="switch-thumb"></div>
          </button>
        </div>

        <button onClick={logout} className="btn-logout">
          <LogOut className="nav-icon" size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
