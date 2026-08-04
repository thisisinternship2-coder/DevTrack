import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button/Button';
import Card from '../components/common/Card/Card';

const Signup = () => {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1>🚀 DevTrack AI</h1>
          <p>Create your account</p>
        </div>
        <Card className="signup-card">
          <form className="signup-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                className="form-input"
              />
            </div>
            <Button type="submit" variant="primary" size="large" className="signup-btn">
              Create Account
            </Button>
            <p className="login-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </Card>
      </div>

      <style>{`
        .signup-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .signup-container {
          width: 100%;
          max-width: 400px;
        }

        .signup-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .signup-header h1 {
          font-size: 32px;
          color: white;
          margin-bottom: 8px;
        }

        .signup-header p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
        }

        .signup-card {
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .signup-card .card-body {
          padding: 32px;
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #24292e;
        }

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

        .signup-btn {
          width: 100%;
          margin-top: 8px;
        }

        .login-link {
          text-align: center;
          font-size: 14px;
          color: #586069;
        }

        .login-link a {
          color: #667eea;
          font-weight: 500;
        }

        .login-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Signup;