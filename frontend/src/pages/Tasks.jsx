import React, { useEffect, useState } from 'react';
import { Plus, X, Loader2, CheckSquare } from 'lucide-react';
import Card from '../components/common/Card/Card';
import Button from '../components/common/Button/Button';
import { api } from '../services/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    project_id: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksData, projectsData] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
      ]);
      setTasks(tasksData.tasks);
      setProjects(projectsData.projects);
      if (projectsData.projects.length > 0 && !form.project_id) {
        setForm((f) => ({ ...f, project_id: projectsData.projects[0].id }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = await api.post('/tasks', {
        ...form,
        project_id: parseInt(form.project_id, 10),
      });
      setTasks([data.task, ...tasks]);
      setForm({ ...form, title: '', description: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const data = await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map((t) => (t.id === id ? data.task : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-description">View and manage your tasks</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          disabled={projects.length === 0}
        >
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> New Task</>}
        </Button>
      </div>

      {projects.length === 0 && !loading && (
        <Card>
          <div className="empty-state">
            <p>You need a project first</p>
            <span>Create a project before adding tasks.</span>
          </div>
        </Card>
      )}

      {error && <p className="form-error">{error}</p>}

      {showForm && projects.length > 0 && (
        <Card className="create-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Task Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Design homepage hero"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional details..."
                className="form-input"
                rows={2}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Project</label>
                <select
                  name="project_id"
                  value={form.project_id}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? <><Loader2 size={16} className="spin" /> Creating...</> : 'Create Task'}
            </Button>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="center"><Loader2 size={32} className="spin" /></div>
      ) : tasks.length === 0 && projects.length > 0 ? (
        <Card>
          <div className="empty-state">
            <CheckSquare size={48} strokeWidth={1.5} />
            <p>No tasks yet</p>
            <span>Click "New Task" to add your first one.</span>
          </div>
        </Card>
      ) : (
        <div className="tasks-list">
          {tasks.map((t) => (
            <Card key={t.id} className="task-card">
              <div className="task-header">
                <h3>{t.title}</h3>
                <div className="task-badges">
                  <span className={`priority-badge priority-${t.priority}`}>
                    {t.priority}
                  </span>
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    className={`status-select status-${t.status.replace('-', '')}`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              {t.description && <p className="task-desc">{t.description}</p>}
              <div className="task-footer">
                <span className="task-date">
                  {new Date(t.created_at).toLocaleDateString()}
                </span>
                <button className="delete-btn" onClick={() => handleDelete(t.id)}>
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <style>{`
        .page-container { max-width: 1200px; margin: 0 auto; }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 4px;
        }
        .page-description { font-size: 15px; color: #64748b; }
        .form-error {
          color: #dc3545;
          font-size: 14px;
          padding: 10px 14px;
          background: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        .create-form { margin-bottom: 24px; }
        .create-form form { display: flex; flex-direction: column; gap: 14px; }
        .form-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 14px;
        }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 14px; font-weight: 500; color: #24292e; }
        .form-input {
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .tasks-list { display: flex; flex-direction: column; gap: 14px; }
        .task-card { padding: 18px 20px; }
        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          gap: 12px;
        }
        .task-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
          flex: 1;
        }
        .task-badges { display: flex; gap: 8px; align-items: center; }
        .priority-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .priority-low { background: #e5e7eb; color: #4b5563; }
        .priority-medium { background: #dbeafe; color: #1e40af; }
        .priority-high { background: #fed7aa; color: #9a3412; }
        .priority-urgent { background: #fecaca; color: #991b1b; }
        .status-select {
          font-size: 12px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 6px;
          border: 1px solid #e1e4e8;
          cursor: pointer;
          font-family: inherit;
        }
        .task-desc {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 12px;
        }
        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid #f1f5f9;
        }
        .task-date { font-size: 12px; color: #94a3b8; }
        .delete-btn {
          background: none;
          border: none;
          color: #dc3545;
          font-size: 13px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .delete-btn:hover { background: #fee; }
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

export default Tasks;