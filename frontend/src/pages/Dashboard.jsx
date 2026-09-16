import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, CheckSquare, Users, ArrowRight, Loader2 } from 'lucide-react';
import Card from '../components/common/Card/Card';
import { api } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    tasksByStatus: { todo: 0, 'in-progress': 0, review: 0, done: 0 },
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsData, tasksData] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks'),
        ]);

        const tasks = tasksData.tasks;
        const tasksByStatus = {
          todo: tasks.filter((t) => t.status === 'todo').length,
          'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
          review: tasks.filter((t) => t.status === 'review').length,
          done: tasks.filter((t) => t.status === 'done').length,
        };

        setStats({
          projects: projectsData.projects.length,
          tasks: tasks.length,
          tasksByStatus,
        });
        setRecentTasks(tasks.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="center">
        <Loader2 size={32} className="spin" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="dash-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">Welcome back to DevTrack</p>
        </div>
      </div>

      <div className="stats-grid">
        <button className="stat-card" onClick={() => navigate('/projects')}>
          <div className="stat-icon stat-icon-blue">
            <FolderKanban size={22} strokeWidth={2} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Projects</span>
            <span className="stat-value">{stats.projects}</span>
          </div>
          <ArrowRight size={16} className="stat-arrow" />
        </button>

        <button className="stat-card" onClick={() => navigate('/tasks')}>
          <div className="stat-icon stat-icon-purple">
            <CheckSquare size={22} strokeWidth={2} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Tasks</span>
            <span className="stat-value">{stats.tasks}</span>
          </div>
          <ArrowRight size={16} className="stat-arrow" />
        </button>

        <button className="stat-card" onClick={() => navigate('/team')}>
          <div className="stat-icon stat-icon-green">
            <Users size={22} strokeWidth={2} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Team</span>
            <span className="stat-value">1</span>
          </div>
          <ArrowRight size={16} className="stat-arrow" />
        </button>
      </div>

      <div className="dash-grid">
        <Card title="Tasks by Status">
          <div className="status-list">
            {Object.entries(stats.tasksByStatus).map(([status, count]) => (
              <div key={status} className="status-row">
                <span className={`status-dot status-dot-${status.replace('-', '')}`} />
                <span className="status-name">
                  {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <span className="status-count">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Tasks">
          {recentTasks.length === 0 ? (
            <p className="empty-text">No tasks yet</p>
          ) : (
            <div className="recent-list">
              {recentTasks.map((t) => (
                <div key={t.id} className="recent-row">
                  <div className="recent-dot" />
                  <span className="recent-title">{t.title}</span>
                  <span className={`priority-badge priority-${t.priority}`}>
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <style>{`
        .page-container { max-width: 1200px; margin: 0 auto; }
        .dash-header { margin-bottom: 24px; }
        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 4px;
        }
        .page-description { font-size: 15px; color: #64748b; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
          font-family: inherit;
        }
        .stat-card:hover {
          border-color: #c7d2fe;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.08);
          transform: translateY(-1px);
        }
        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-icon-blue { background: #eef2ff; color: #4f46e5; }
        .stat-icon-purple { background: #f3e8ff; color: #9333ea; }
        .stat-icon-green { background: #d1fae5; color: #059669; }
        .stat-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .stat-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1a202c;
          line-height: 1.2;
        }
        .stat-arrow {
          color: #cbd5e1;
          transition: transform 0.15s;
        }
        .stat-card:hover .stat-arrow {
          color: #667eea;
          transform: translateX(3px);
        }

        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .dash-grid { grid-template-columns: 1fr; }
        }

        .status-list { display: flex; flex-direction: column; gap: 12px; }
        .status-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .status-dot-todo { background: #94a3b8; }
        .status-dot-inprogress { background: #f59e0b; }
        .status-dot-review { background: #3b82f6; }
        .status-dot-done { background: #10b981; }
        .status-name { flex: 1; color: #475569; }
        .status-count {
          font-weight: 700;
          color: #1a202c;
          background: #f1f5f9;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 13px;
        }

        .recent-list { display: flex; flex-direction: column; gap: 10px; }
        .recent-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
        }
        .recent-dot {
          width: 6px;
          height: 6px;
          background: #667eea;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .recent-title {
          flex: 1;
          font-size: 14px;
          color: #1a202c;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .priority-badge {
          font-size: 10px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .priority-low { background: #e5e7eb; color: #4b5563; }
        .priority-medium { background: #dbeafe; color: #1e40af; }
        .priority-high { background: #fed7aa; color: #9a3412; }
        .priority-urgent { background: #fecaca; color: #991b1b; }

        .empty-text {
          color: #94a3b8;
          font-size: 14px;
          text-align: center;
          padding: 20px;
          margin: 0;
        }
        .center {
          display: flex;
          justify-content: center;
          padding: 60px;
          color: #667eea;
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Dashboard;