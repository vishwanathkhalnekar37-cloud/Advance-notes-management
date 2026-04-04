import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">📝</span>
          <span className="logo-text">Notes</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="icon">📊</span>
          <span>Dashboard</span>
        </button>
        
        <button
          className={`nav-item ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <span className="icon">📋</span>
          <span>My Notes</span>
        </button>
        
        <button
          className={`nav-item ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <span className="icon">✨</span>
          <span>Create</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
