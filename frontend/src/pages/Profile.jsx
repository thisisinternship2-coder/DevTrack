import React, { useEffect, useState } from 'react';
import { Loader2, Save, User, Mail, Shield, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card/Card';
import Button from '../components/common/Button/Button';
import { api } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Change password form
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.get('/auth/me');
        setUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handlePwdChange = (e) => {
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
    setPwdError('');
    setPwdSuccess('');
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdError('New passwords do not match');
      return;
    }

    if (pwdForm.newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters');
      return;
    }

    setPwdLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      setPwdSuccess('Password changed successfully');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwdError(err.message);
    } finally {
      setPwdLoading(false);
    }
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
        <h1 className="page-title">Profile</h1>
        <p className="page-description">Your account information</p>
      </div>

      <Card title="Account Details" className="mb-20">
        <div className="info-row">
          <div className="info-icon"><User size={18} /></div>
          <div>
            <div className="info-label">Full Name</div>
            <div className="info-value">{user?.name || '—'}</div>
          </div>
        </div>
        <div className="info-row">
          <div className="info-icon"><Mail size={18} /></div>
          <div>
            <div className="info-label">Email Address</div>
            <div className="info-value">{user?.email || '—'}</div>
          </div>
        </div>
        <div className="info-row">
          <div className="info-icon"><Shield size={18} /></div>
          <div>
            <div className="info-label">Role</div>
            <div className="info-value" style={{ textTransform: 'capitalize' }}>{user?.role || 'user'}</div>
          </div>
        </div>
      </Card>

      <Card title="Change Password">
        <form className="pwd-form" onSubmit={handlePwdSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={pwdForm.currentPassword}
              onChange={handlePwdChange}
              className="form-input"
              placeholder="Enter current password"
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={pwdForm.newPassword}
              onChange={handlePwdChange}
              className="form-input"
              placeholder="At least 6 characters"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={pwdForm.confirmPassword}
              onChange={handlePwdChange}
              className="form-input"
              placeholder="Repeat new password"
              required
            />
          </div>

          {pwdError && (
            <p className="form-error">
              <AlertCircle size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              {pwdError}
            </p>
          )}
          {pwdSuccess && (
            <p className="form-success">
              <CheckCircle size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              {pwdSuccess}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={pwdLoading}>
            {pwdLoading ? <><Loader2 size={16} className="spin" /> Updating...</> : <><KeyRound size={16} /> Change Password</>}
          </Button>
        </form>
      </Card>

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
        .mb-20 { margin-bottom: 20px; }
        .info-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .info-row:last-child { border-bottom: none; }
        .info-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .info-label { font-size: 13px; color: #64748b; margin-bottom: 2px; }
        .info-value { font-size: 15px; font-weight: 600; color: #1a202c; }
        .pwd-form { display: flex; flex-direction: column; gap: 14px; }
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
        .form-error, .form-success {
          font-size: 14px;
          padding: 10px 14px;
          border-radius: 6px;
          margin: 0;
          display: flex;
          align-items: center;
        }
        .form-error { color: #dc3545; background: #fff5f5; border: 1px solid #fed7d7; }
        .form-success { color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; }
        .center { display: flex; justify-content: center; padding: 60px; color: #667eea; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Profile;