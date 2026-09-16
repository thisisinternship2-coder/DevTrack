import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, Rocket } from 'lucide-react';
import { api } from '../../services/api';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.get('/auth/me');
        setUser(data.user);
      } catch (err) {
        // token invalid — force logout
        api.clearToken();
        navigate('/login');
      }
    };
    if (api.isLoggedIn()) fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    api.clearToken();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={() => navigate('/dashboard')}>
          <Rocket className="logo-icon" size={22} strokeWidth={2.5} />
          <span className="logo-text">DevTrack</span>
        </div>
      </div>
      <div className="navbar-right">
        <div className="nav-search">
          <Search className="search-icon" size={16} />
          <input type="text" placeholder="Search..." />
        </div>
        <div className="nav-actions">
          <button className="nav-icon-btn" aria-label="Notifications">
            <Bell size={20} />
          </button>
          <button
            className="nav-icon-btn"
            aria-label="Profile"
            onClick={() => navigate('/profile')}
            title={user?.name || 'Profile'}
          >
            <User size={20} />
          </button>
          <button
            className="nav-icon-btn"
            aria-label="Logout"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;