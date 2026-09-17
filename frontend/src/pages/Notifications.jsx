import React, { useEffect, useState } from 'react';
import { Loader2, Bell, CheckCircle, Info, AlertTriangle, AlertCircle, Check } from 'lucide-react';
import Card from '../components/common/Card/Card';
import { api } from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Since we don't have a notifications backend endpoint yet,
    // show welcome notification created locally
    const fetch = async () => {
      try {
        // Attempt to fetch — will 404 until backend added
        await api.get('/notifications').catch(() => null);
      } finally {
        // Fallback: show mock notifications
        setNotifications([
          {
            id: 1,
            title: 'Welcome to DevTrack',
            message: 'Your project management journey starts here.',
            type: 'info',
            read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: 'Account created',
            message: 'Your account is verified and ready to use.',
            type: 'success',
            read: true,
            created_at: new Date().toISOString(),
          },
        ]);
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'error': return <AlertCircle size={20} />;
      default: return <Info size={20} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success': return { bg: '#d1fae5', color: '#059669' };
      case 'warning': return { bg: '#fef3c7', color: '#d97706' };
      case 'error': return { bg: '#fecaca', color: '#dc2626' };
      default: return { bg: '#eef2ff', color: '#4f46e5' };
    }
  };

  if (loading) {
    return (
      <div className="center">
        <Loader2 size={32} className="spin" />
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-description">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <div className="empty-state">
            <Bell size={48} strokeWidth={1.5} />
            <p>No notifications</p>
            <span>You're all caught up.</span>
          </div>
        </Card>
      ) : (
        <div className="notif-list">
          {notifications.map((n) => {
            const colors = getColor(n.type);
            return (
              <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'}`}>
                <div
                  className="notif-icon"
                  style={{ background: colors.bg, color: colors.color }}
                >
                  {getIcon(n.type)}
                </div>
                <div className="notif-content">
                  <div className="notif-title-row">
                    <span className="notif-title">{n.title}</span>
                    {!n.read && <span className="notif-dot" />}
                  </div>
                  <p className="notif-message">{n.message}</p>
                  <span className="notif-time">
                    {new Date(n.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .page-container { max-width: 800px; margin: 0 auto; }
        .page-header { margin-bottom: 24px; }
        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 4px;
        }
        .page-description { font-size: 15px; color: #64748b; }
        .notif-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .notif-item {
          display: flex;
          gap: 14px;
          padding: 16px 18px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          transition: all 0.15s;
        }
        .notif-item:hover { border-color: #c7d2fe; }
        .notif-item.unread { background: #fefeff; border-color: #c7d2fe; }
        .notif-item.read { opacity: 0.75; }
        .notif-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .notif-content { flex: 1; }
        .notif-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .notif-title {
          font-size: 15px;
          font-weight: 600;
          color: #1a202c;
        }
        .notif-dot {
          width: 8px;
          height: 8px;
          background: #667eea;
          border-radius: 50%;
        }
        .notif-message {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 6px;
          line-height: 1.5;
        }
        .notif-time {
          font-size: 12px;
          color: #94a3b8;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 40px 20px;
          color: #94a3b8;
        }
        .empty-state p {
          font-size: 16px;
          font-weight: 600;
          color: #475569;
          margin: 0;
        }
        .empty-state span { font-size: 14px; }
        .center { display: flex; justify-content: center; padding: 60px; color: #667eea; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Notifications;