import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/projects', icon: '📁', label: 'Projects' },
    { path: '/tasks', icon: '✅', label: 'Tasks' },
    { path: '/kanban', icon: '📋', label: 'Kanban' },
    { path: '/ai-assistant', icon: '🤖', label: 'AI Assistant' },
    { path: '/team', icon: '👥', label: 'Team' },
    { path: '/notifications', icon: '🔔', label: 'Notifications' },
    { path: '/profile', icon: '👤', label: 'Profile' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;