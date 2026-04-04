import React from 'react';
import '../styles/Navbar.css';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <span className="logo-icon">📝</span>
          <span className="logo-text">Notes</span>
        </div>

        <nav className="navbar-nav">
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            📋 My Notes
          </button>
          <button
            className={`nav-tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            ✨ Create
          </button>
        </nav>

        <div className="navbar-user">
          <div className="user-avatar-circle">
            {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
          </div>
          <span className="user-name">{user?.username || 'User'}</span>
          <button className="logout-btn" onClick={logout} title="Logout">
            🚪
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
