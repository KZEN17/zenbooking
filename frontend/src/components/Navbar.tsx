import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Apartment Manager
        </Link>

        {isAuthenticated ? (
          <div className="navbar-menu">
            <span className="text-gray">Welcome, {user?.email}</span>
            <Link to="/" className="navbar-link">
              Dashboard
            </Link>
            <Link to="/apartments" className="navbar-link">
              Apartments
            </Link>
            <Link to="/income" className="navbar-link">
              Income
            </Link>
            <Link to="/expenses" className="navbar-link">
              Expenses
            </Link>
            <Link to="/summary" className="navbar-link">
              Summary
            </Link>
            <button onClick={logout} className="btn btn-secondary btn-small">
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-menu">
            <Link to="/login" className="btn btn-primary btn-small">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
