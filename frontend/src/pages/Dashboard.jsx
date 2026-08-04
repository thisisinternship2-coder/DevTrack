import React from 'react';
import Card from '../components/common/Card/Card';

const Dashboard = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">📊 Dashboard</h1>
      <p className="page-description">Welcome to DevTrack AI Dashboard</p>
      
      <div className="dashboard-grid">
        <Card title="Total Projects">
          <p className="stat-placeholder">Manage your projects</p>
        </Card>
        <Card title="Active Tasks">
          <p className="stat-placeholder">Track your tasks</p>
        </Card>
        <Card title="Team Members">
          <p className="stat-placeholder">Collaborate with team</p>
        </Card>
        <Card title="AI Suggestions">
          <p className="stat-placeholder">Get AI insights</p>
        </Card>
      </div>

      <style>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #24292e;
          margin-bottom: 8px;
        }

        .page-description {
          font-size: 16px;
          color: #586069;
          margin-bottom: 24px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-placeholder {
          font-size: 14px;
          color: #586069;
          margin: 0;
          text-align: center;
          padding: 8px 0;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;