import React from 'react';

const Notifications = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">🔔 Notifications</h1>
      <p className="page-description">Stay updated with your notifications</p>

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
        }
      `}</style>
    </div>
  );
};

export default Notifications;