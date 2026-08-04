import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;