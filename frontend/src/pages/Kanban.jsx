import React, { useEffect, useState } from 'react';
import { Loader2, Plus, X, ArrowRight, ArrowLeft, CheckSquare } from 'lucide-react';
import Card from '../components/common/Card/Card';
import Button from '../components/common/Button/Button';
import { api } from '../services/api';

const COLUMNS = [
  { key: 'todo', label: 'To Do', color: '#94a3b8' },
  { key: 'in-progress', label: 'In Progress', color: '#f59e0b' },
  { key: 'review', label: 'Review', color: '#3b82f6' },
  { key: 'done', label: 'Done', color: '#10b981' },
];

const Kanban = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    project_id: '',
    priority: 'medium',
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
      if (projectsData.projects.length > 0) {
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

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = await api.post('/tasks', {
        ...form,
        project_id: parseInt(form.project_id, 10),
        status: 'todo',
      });
      setTasks([data.task, ...tasks]);
      setForm({ ...form, title: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const moveTask = async (task, direction) => {
    const currentIdx = COLUMNS.findIndex((c) => c.key === task.status);
    const nextIdx = currentIdx + direction;
    if (nextIdx < 0 || nextIdx >= COLUMNS.length) return;

    const newStatus = COLUMNS[nextIdx].key;
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));

    try {
      await api.put(`/tasks/${task.id}`, { status: newStatus });
    } catch (err) {
      setTasks(tasks);
      setError(err.message);
    }
  };

  const tasksByStatus = (status) => tasks.filter((t) => t.status === status);

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
          <h1 className="page-title">Kanban Board</h1>
          <p className="page-description">Visualize your workflow — click arrows to move tasks</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          disabled={projects.length === 0}
        >
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> New Task</>}
        </Button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {projects.length === 0 && (
        <Card>
          <div className="empty-state">
            <p>You need a project first</p>
            <span>Create a project before adding tasks.</span>
          </div>
        </Card>
      )}

      {showForm && projects.length > 0 && (
        <Card className="create-form">
          <form onSubmit={handleCreate}>
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label>Task Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Design homepage"
                  className="form-input"
                  required
                />
              </div>
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
            </div>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? <><Loader2 size={16} className="spin" /> Creating...</> : 'Create Task'}
            </Button>
          </form>
        </Card>
      )}

      {tasks.length === 0 && projects.length > 0 ? (
        <Card>
          <div className="empty-state">
            <CheckSquare size={48} strokeWidth={1.5} />
            <p>No tasks yet</p>
            <span>Click "New Task" to add your first one.</span>
          </div>
        </Card>
      ) : (
        <div className="kanban-board">
          {COLUMNS.map((col) => (
            <div key={col.key} className="kanban-column">
              <div className="column-header">
                <span className="column-dot" style={{ background: col.color }} />
                <span className="column-title">{col.label}</span>
                <span className="column-count">{tasksByStatus(col.key).length}</span>
              </div>

              <div className="column-body">
                {tasksByStatus(col.key).length === 0 ? (
                  <div className="column-empty">No tasks</div>
                ) : (
                  tasksByStatus(col.key).map((task) => (
                    <div key={task.id} className="kanban-card">
                      <div className="kanban-card-title">{task.title}</div>
                      {task.description && (
                        <div className="kanban-card-desc">{task.description}</div>
                      )}
                      <div className="kanban-card-footer">
                        <span className={`priority-badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                        <div className="kanban-card-actions">
                          {col.key !== 'todo' && (
                            <button
                              className="arrow-btn"
                              onClick={() => moveTask(task, -1)}
                              title="Move left"
                            >
                              <ArrowLeft size={14} />
                            </button>
                          )}
                          {col.key !== 'done' && (
                            <button
                              className="arrow-btn"
                              onClick={() => moveTask(task, 1)}
                              title="Move right"
                            >
                              <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .page-container { max-width: 1400px; margin: 0 auto; }
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
        .form-row { display: flex; gap: 14px; flex-wrap: wrap; }
        .form-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 160px; }
        .form-group label { font-size: 14px; font-weight: 500; color: #24292e; }
        .form-input {
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
        }
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .kanban-board {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .kanban-board { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .kanban-board { grid-template-columns: 1fr; }
        }

        .kanban-column {
          background: #f8fafc;
          border-radius: 10px;
          padding: 12px;
          min-height: 400px;
          display: flex;
          flex-direction: column;
        }
        .column-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 6px 14px;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 12px;
        }
        .column-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .column-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a202c;
          flex: 1;
        }
        .column-count {
          font-size: 12px;
          font-weight: 700;
          background: #e2e8f0;
          color: #475569;
          padding: 2px 8px;
          border-radius: 10px;
        }
        .column-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .column-empty {
          font-size: 13px;
          color: #94a3b8;
          text-align: center;
          padding: 20px 10px;
          font-style: italic;
        }

        .kanban-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px;
          transition: box-shadow 0.15s;
        }
        .kanban-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }
        .kanban-card-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 6px;
        }
        .kanban-card-desc {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 10px;
          line-height: 1.4;
        }
        .kanban-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
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
        .kanban-card-actions {
          display: flex;
          gap: 4px;
        }
        .arrow-btn {
          background: #f1f5f9;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #475569;
          transition: all 0.15s;
        }
        .arrow-btn:hover {
          background: #667eea;
          color: white;
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

export default Kanban;