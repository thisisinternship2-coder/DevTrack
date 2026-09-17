import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Loader2 } from 'lucide-react';
import Button from '../components/common/Button/Button';
import Card from '../components/common/Card/Card';
import { api } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post('/auth/login', form);
      api.saveToken(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>
            <Rocket size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            DevTrack
          </h1>
          <p>Sign in to your account</p>
        </div>
        <Card className="login-card">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="form-input"
                required
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <p className="signup-link">
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </p>
            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </Card>
      </div>

      <style>{`
        .login-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .login-container { width: 100%; max-width: 400px; }
        .login-header { text-align: center; margin-bottom: 32px; }
        .login-header h1 {
          font-size: 32px;
          color: white;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-header p { color: rgba(255, 255, 255, 0.9); font-size: 16px; }
        .login-card { border-radius: 12px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); }
        .login-card .card-body { padding: 32px; }
        .login-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 14px; font-weight: 500; color: #24292e; }
        .form-input {
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .form-error {
          color: #dc3545;
          font-size: 14px;
          margin: 0;
          padding: 8px 12px;
          background: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 6px;
        }
        .login-btn { width: 100%; margin-top: 8px; }
        .signup-link { text-align: center; font-size: 14px; color: #586069; margin: 0; }
        .signup-link a { color: #667eea; font-weight: 500; }
        .signup-link a:hover { text-decoration: underline; }
        .forgot-link { color: #64748b; font-weight: 500; }
        .forgot-link:hover { color: #667eea; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;