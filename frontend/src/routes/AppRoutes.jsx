import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Projects from '../pages/Projects';
import Tasks from '../pages/Tasks';
import Kanban from '../pages/Kanban';
import Team from '../pages/Team';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import { api } from '../services/api';

const ProtectedRoute = ({ children }) => {
  if (!api.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  if (api.isLoggedIn()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="kanban" element={<Kanban />} />
        <Route path="team" element={<Team />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;