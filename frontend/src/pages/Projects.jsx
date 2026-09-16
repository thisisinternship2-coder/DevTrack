import React, { useEffect, useState } from 'react';
import { Plus, X, Loader2, FolderKanban } from 'lucide-react';
import Card from '../components/common/Card/Card';
import Button from '../components/common/Button/Button';
import { api } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', status: 'planning' });
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.get('/projects');
      setProjects(data.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = await api.post('/projects', form);
      setProjects([data.project, ...projects]);
      setForm({ name: '', description: '', status: 'planning' });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-description">Manage your projects</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> New Project</>}
        </Button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {showForm && (
        <Card className="create-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Marketing Website"
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
                placeholder="What's this project about?"
                className="form-input"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? <><Loader2 size={16} className="spin" /> Creating...</> : 'Create Project'}
            </Button>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="center"><Loader2 size={32} className="spin" /></div>
      ) : projects.length === 0 ? (
        <Card>
          <div className="empty-state">
            <FolderKanban size={48} strokeWidth={1.5} />
            <p>No projects yet</p>
            <span>Click "New Project" to create your first one.</span>
          </div>
        </Card>
      ) : (
        <div className="projects-grid">
          {projects.map((p) => (
            <Card key={p.id} className="project-card">
              <div className="project-header">
                <h3>{p.name}</h3>
                <span className={`status-badge status-${p.status}`}>{p.status}</span>
              </div>
              <p className="project-desc">{p.description || 'No description'}</p>
              <div className="project-footer">
                <span className="project-date">
                  {new Date(p.created_at).toLocaleDateString()}
                </span>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>
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
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .project-card { padding: 20px; }
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .project-header h3 {
          font-size: 17px;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
        }
        .status-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .status-planning { background: #fef3c7; color: #92400e; }
        .status-active { background: #d1fae5; color: #065f46; }
        .status-completed { background: #dbeafe; color: #1e40af; }
        .status-archived { background: #e5e7eb; color: #4b5563; }
        .project-desc {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 16px;
          min-height: 40px;
        }
        .project-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }
        .project-date { font-size: 12px; color: #94a3b8; }
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

export default Projects;