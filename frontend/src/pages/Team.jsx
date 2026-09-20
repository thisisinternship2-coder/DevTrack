import React, { useEffect, useState } from 'react';
import {
  Loader2,
  Users,
  Crown,
  UserPlus,
  Trash2,
  Building2,
  Mail,
  Shield,
} from 'lucide-react';
import Card from '../components/common/Card/Card';
import Button from '../components/common/Button/Button';
import { api } from '../services/api';

const Team = () => {
  const [company, setCompany] = useState(null);
  const [members, setMembers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create company form
  const [companyName, setCompanyName] = useState('');
  const [creating, setCreating] = useState(false);

  // Invite form
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const meData = await api.get('/auth/me');
      setUser(meData.user);

      const companyData = await api.get('/companies/my');
      setCompany(companyData.company);
      setMembers(companyData.members);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const flashSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      await api.post('/companies', { name: companyName });
      flashSuccess('Company created');
      setCompanyName('');
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    setError('');
    try {
      const data = await api.post('/companies/invite', { email: inviteEmail });
      flashSuccess(data.message);
      setInviteEmail('');
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId) => {
    if (!window.confirm('Remove this member from your company?')) return;
    try {
      await api.delete(`/companies/members/${memberId}`);
      flashSuccess('Member removed');
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="center">
        <Loader2 size={32} className="spin" />
      </div>
    );
  }

  const isLead = user?.role === 'lead';

  // Case 1: Lead with no company yet
  if (isLead && !company) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Team</h1>
            <p className="page-description">Set up your company to invite members</p>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <Card title="Create Company">
          <form className="create-form" onSubmit={handleCreateCompany}>
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="form-input"
                required
              />
            </div>
            <Button type="submit" variant="primary" disabled={creating}>
              {creating ? <><Loader2 size={16} className="spin" /> Creating...</> : <><Building2 size={16} /> Create Company</>}
            </Button>
          </form>
        </Card>

        <style>{`
          .page-container { max-width: 700px; margin: 0 auto; }
          .page-header { margin-bottom: 24px; }
          .page-title { font-size: 28px; font-weight: 700; color: #1a202c; margin-bottom: 4px; }
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
          .create-form { display: flex; flex-direction: column; gap: 14px; }
          .form-group { display: flex; flex-direction: column; gap: 6px; }
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
          .center { display: flex; justify-content: center; padding: 60px; color: #667eea; }
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Case 2: Member with no company yet
  if (!isLead && !company) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Team</h1>
            <p className="page-description">You're not part of a company yet</p>
          </div>
        </div>

        <Card>
          <div className="empty-state">
            <Users size={48} strokeWidth={1.5} />
            <p>Waiting for an invite</p>
            <span>Ask your Team Lead to add you using your email: <strong>{user?.email}</strong></span>
          </div>
        </Card>

        <style>{`
          .page-container { max-width: 700px; margin: 0 auto; }
          .page-header { margin-bottom: 24px; }
          .page-title { font-size: 28px; font-weight: 700; color: #1a202c; margin-bottom: 4px; }
          .page-description { font-size: 15px; color: #64748b; }
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 50px 20px;
            color: #94a3b8;
            text-align: center;
          }
          .empty-state p { font-size: 16px; font-weight: 600; color: #475569; margin: 0; }
          .empty-state span { font-size: 14px; }
          .empty-state strong { color: #667eea; }
        `}</style>
      </div>
    );
  }

  // Case 3: Has company (lead or member)
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{company.name}</h1>
          <p className="page-description">
            {members.length} {members.length === 1 ? 'member' : 'members'} in this company
          </p>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}

      {isLead && (
        <Card title="Invite Member" className="mb-20">
          <form className="invite-form" onSubmit={handleInvite}>
            <div className="invite-row">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="member@example.com"
                className="form-input"
                required
              />
              <Button type="submit" variant="primary" disabled={inviting}>
                {inviting ? <Loader2 size={16} className="spin" /> : <><UserPlus size={16} /> Invite</>}
              </Button>
            </div>
            <p className="invite-hint">
              The user must already have a DevTrack account (signed up as Team Member).
            </p>
          </form>
        </Card>
      )}

      <Card title="Members">
        <div className="members-list">
          {members.map((m) => (
            <div key={m.id} className="member-row">
              <div className="member-avatar">
                {m.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="member-info">
                <div className="member-name-row">
                  <span className="member-name">{m.name}</span>
                  {m.role === 'lead' && (
                    <span className="lead-badge">
                      <Crown size={12} /> Lead
                    </span>
                  )}
                </div>
                <div className="member-email">
                  <Mail size={12} />
                  {m.email}
                </div>
              </div>
              {isLead && m.role !== 'lead' && (
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(m.id)}
                  title="Remove from company"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <style>{`
        .page-container { max-width: 800px; margin: 0 auto; }
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 28px; font-weight: 700; color: #1a202c; margin-bottom: 4px; }
        .page-description { font-size: 15px; color: #64748b; }
        .mb-20 { margin-bottom: 20px; }
        .form-error {
          color: #dc3545;
          font-size: 14px;
          padding: 10px 14px;
          background: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        .form-success {
          color: #059669;
          font-size: 14px;
          padding: 10px 14px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        .invite-form { display: flex; flex-direction: column; gap: 8px; }
        .invite-row { display: flex; gap: 10px; }
        .form-input {
          flex: 1;
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
        .invite-hint { font-size: 12px; color: #94a3b8; margin: 4px 0 0; }
        .members-list { display: flex; flex-direction: column; gap: 4px; }
        .member-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .member-row:last-child { border-bottom: none; }
        .member-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }
        .member-info { flex: 1; }
        .member-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 3px;
        }
        .member-name { font-size: 14px; font-weight: 600; color: #1a202c; }
        .lead-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: #fef3c7;
          color: #92400e;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .member-email {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #64748b;
        }
        .remove-btn {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
        }
        .remove-btn:hover { background: #fee; }
        .center { display: flex; justify-content: center; padding: 60px; color: #667eea; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Team;