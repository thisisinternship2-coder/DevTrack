import React, { useEffect, useState } from 'react';
import { Plus, X, Loader2, CheckSquare, Crown, UserCircle } from 'lucide-react';
import Card from '../components/common/Card/Card';
import Button from '../components/common/Button/Button';
import { api } from '../services/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    project_id: '',
    assigned_to: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksData, projectsData, meData] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
        api.get('/auth/me'),
      ]);
      setTasks(tasksData.tasks);
      setProjects(projectsData.projects);
      setUser(meData.user);

      if (projectsData.projects.length > 0 && !form.project_id) {
        setForm((f) => ({ ...f, project_id: projectsData.projects[0].id }));
      }

      // Fetch company members for assignee dropdown
      try {
        const companyData = await api.get('/companies/my');
        setMembers(companyData.members || []);
      } catch {
        setMembers([]);
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
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        project_id: parseInt(form.project_id, 10),
      };
      if (form.assigned_to) {
        payload.assigned_to = parseInt(form.assigned_to, 10);
      }
      const data = await api.post('/tasks', payload);
      setTasks([data.task, ...tasks]);
      setForm({ ...form, title: '', description: '', assigned_to: '' });
      setShowForm(false);
      await fetchData();
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

  const isLead = user?.role === 'lead';

  // A member can only change status of tasks assigned to them
  const canChangeStatus = (task) => {
    if (isLead) return true;
    return task.assigned_to === user?.id;
  };

  if (loading) {
    return (
      <div className="center">
        <Loader2 size={32} className="spin" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-description">
            {isLead ? 'Create and assign tasks to your team' : 'Tasks assigned to you and your team'}
          </p>
        </div>
        {isLead && (
          <Button
            variant="primary"
            onClick={() => setShowForm(!showForm)}
            disabled={projects.length === 0}
          >
            {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> New Task</>}
          </Button>
        )}
      </div>

      {!isLead && (
        <div className="role-notice">
          <Crown size={14} />
          Only Team Leads can create tasks
        </div>
      )}

      {projects.length === 0 && !loading && isLead && (
        <Card>
          <div className="empty-state">
            <p>You need a project first</p>
            <span>Create a project before adding tasks.</span>
          </div>
        </Card>
      )}

      {error && <p className="form-error">{error}</p>}

      {showForm && isLead && projects.length > 0 && (
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
                <label>Assign To</label>
                <select
                  name="assigned_to"
                  value={form.assigned_to}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.role === 'lead' ? '(Lead)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
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

      {tasks.length === 0 && (projects.length > 0 || !isLead) ? (
        <Card>
          <div className="empty-state">
            <CheckSquare size={48} strokeWidth={1.5} />
            <p>No tasks yet</p>
            <span>
              {isLead
                ? 'Click "New Task" to add your first one.'
                : 'No tasks have been assigned yet.'}
            </span>
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
                    disabled={!canChangeStatus(t)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              {t.description && <p className="task-desc">{t.description}</p>}
              <div className="task-meta">
                {t.assignee_name ? (
                  <span className="assignee-chip">
                    <UserCircle size={14} />
                    {t.assignee_name}
                  </span>
                ) : (
                  <span className="assignee-chip unassigned">Unassigned</span>
                )}
                {t.project_name && (
                  <span className="project-chip">{t.project_name}</span>
                )}
              </div>
              <div className="task-footer">
                <span className="task-date">
                  {new Date(t.created_at).toLocaleDateString()}
                </span>
                {isLead && (
                  <button className="delete-btn" onClick={() => handleDelete(t.id)}>
                    Delete
                  </button>
                )}
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
        .page-title { font-size: 28px; font-weight: 700; color: #1a202c; margin-bottom: 4px; }
        .page-description { font-size: 15px; color: #64748b; }
        .role-notice {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #92400e;
          background: #fef3c7;
          padding: 8px 14px;
          border-radius: 6px;
          margin-bottom: 16px;
        }
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
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
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
          background: white;
        }
        .status-select:disabled {
          cursor: not-allowed;
          opacity: 0.6;
          background: #f8fafc;
        }
        .task-desc { font-size: 14px; color: #64748b; margin-bottom: 12px; }
        .task-meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .assignee-chip, .project-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .assignee-chip { background: #eef2ff; color: #4f46e5; }
        .assignee-chip.unassigned { background: #f1f5f9; color: #94a3b8; }
        .project-chip { background: #f1f5f9; color: #475569; }
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
        .empty-state p { font-size: 16px; font-weight: 600; color: #475569; margin: 0; }
        .empty-state span { font-size: 14px; text-align: center; }
        .center { display: flex; justify-content: center; padding: 60px; color: #667eea; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Tasks;