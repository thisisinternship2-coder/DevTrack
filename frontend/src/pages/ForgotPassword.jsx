import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Loader2, ArrowLeft, Mail } from 'lucide-react';
import Button from '../components/common/Button/Button';
import Card from '../components/common/Card/Card';
import { api } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>
            <Rocket size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            DevTrack
          </h1>
          <p>Reset your password</p>
        </div>

        <Card className="auth-card">
          {sent ? (
            <div className="sent-state">
              <div className="sent-icon">
                <Mail size={40} strokeWidth={1.5} />
              </div>
              <h2>Check your email</h2>
              <p>
                If an account exists for <strong>{email}</strong>, you'll receive a
                password reset link shortly. Check your spam folder if you don't see it.
              </p>
              <Link to="/login" className="back-link">
                <ArrowLeft size={16} /> Back to login
              </Link>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <p className="auth-instruction">
                Enter the email you signed up with. We'll send you a reset link.
              </p>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="form-input"
                  required
                />
              </div>

              {error && <p className="form-error">{error}</p>}

              <Button
                type="submit"
                variant="primary"
                size="large"
                className="auth-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin" /> Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <Link to="/login" className="back-link">
                <ArrowLeft size={16} /> Back to login
              </Link>
            </form>
          )}
        </Card>
      </div>

      <style>{`
        .auth-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .auth-container { width: 100%; max-width: 420px; }
        .auth-header { text-align: center; margin-bottom: 32px; }
        .auth-header h1 {
          font-size: 32px;
          color: white;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-header p { color: rgba(255, 255, 255, 0.9); font-size: 16px; }
        .auth-card { border-radius: 12px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); }
        .auth-card .card-body { padding: 32px; }
        .auth-form { display: flex; flex-direction: column; gap: 18px; }
        .auth-instruction {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 4px;
          text-align: center;
        }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 14px; font-weight: 500; color: #24292e; }
        .form-input {
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .form-error {
          color: #dc3545;
          font-size: 14px;
          padding: 8px 12px;
          background: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 6px;
          margin: 0;
        }
        .auth-btn { width: 100%; margin-top: 8px; }
        .back-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-align: center;
          font-size: 14px;
          color: #667eea;
          font-weight: 500;
          margin-top: 8px;
        }
        .back-link:hover { text-decoration: underline; }
        .sent-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }
        .sent-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
        .sent-state h2 {
          font-size: 20px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
        }
        .sent-state p {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }
        .sent-state strong { color: #1a202c; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ForgotPassword;