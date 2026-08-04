import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">DevTrack AI</span>
        </div>
      </div>
      <div className="navbar-right">
        <div className="nav-search">
          <input type="text" placeholder="Search..." />
        </div>
        <div className="nav-actions">
          <button className="nav-icon-btn" aria-label="Notifications">
            🔔
          </button>
          <button className="nav-icon-btn" aria-label="Profile">
            👤
          </button>
          <button className="nav-icon-btn" aria-label="Logout">
            🚪
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;