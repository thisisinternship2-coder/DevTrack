import React, { useEffect, useState } from 'react';
import { Loader2, Users, Mail, Shield } from 'lucide-react';
import Card from '../components/common/Card/Card';
import { api } from '../services/api';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        // Use /auth/me first to get current user, then mock team as just the user
        // (We don't have a team endpoint yet — this will show your own profile for now)
        const me = await api.get('/auth/me');
        setMembers([me.user]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
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
      <div className="page-header">
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-description">People working with you on DevTrack</p>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="team-grid">
        {members.map((m) => (
          <Card key={m.id} className="member-card">
            <div className="member-avatar">
              {m.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <h3 className="member-name">{m.name}</h3>
            <div className="member-info">
              <Mail size={14} />
              <span>{m.email}</span>
            </div>
            <div className="member-role">
              <Shield size={14} />
              <span style={{ textTransform: 'capitalize' }}>{m.role || 'user'}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="invite-card">
        <div className="invite-state">
          <Users size={36} strokeWidth={1.5} />
          <p>Team collaboration coming soon</p>
          <span>Project sharing and invitations are on the roadmap.</span>
        </div>
      </Card>

      <style>{`
        .page-container { max-width: 1000px; margin: 0 auto; }
        .page-header { margin-bottom: 24px; }
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
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .member-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 20px;
          text-align: center;
        }
        .member-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .member-name {
          font-size: 17px;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 10px;
        }
        .member-info, .member-role {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 4px;
        }
        .invite-card { margin-top: 24px; }
        .invite-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 30px 20px;
          color: #94a3b8;
          text-align: center;
        }
        .invite-state p {
          font-size: 15px;
          font-weight: 600;
          color: #475569;
          margin: 0;
        }
        .invite-state span { font-size: 13px; }
        .center { display: flex; justify-content: center; padding: 60px; color: #667eea; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Team;