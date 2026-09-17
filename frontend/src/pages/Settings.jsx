import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Bell, Globe, Shield, Check } from 'lucide-react';
import Card from '../components/common/Card/Card';

const Settings = () => {
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    desktopNotifications: false,
    weeklyDigest: true,
    language: 'en',
    theme: 'light',
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setPrefs({ ...prefs, [key]: !prefs[key] });
    flash();
  };

  const handleChange = (e) => {
    setPrefs({ ...prefs, [e.target.name]: e.target.value });
    flash();
  };

  const flash = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-description">Configure your DevTrack preferences</p>
        </div>
        {saved && (
          <div className="saved-toast">
            <Check size={16} /> Saved
          </div>
        )}
      </div>

      <Card title="Notifications" className="mb-20">
        <div className="setting-row">
          <div className="setting-icon"><Bell size={18} /></div>
          <div className="setting-content">
            <div className="setting-label">Email Notifications</div>
            <div className="setting-desc">Receive task updates by email</div>
          </div>
          <Toggle checked={prefs.emailNotifications} onChange={() => handleToggle('emailNotifications')} />
        </div>

        <div className="setting-row">
          <div className="setting-icon"><Bell size={18} /></div>
          <div className="setting-content">
            <div className="setting-label">Desktop Notifications</div>
            <div className="setting-desc">Show browser notifications</div>
          </div>
          <Toggle checked={prefs.desktopNotifications} onChange={() => handleToggle('desktopNotifications')} />
        </div>

        <div className="setting-row">
          <div className="setting-icon"><Bell size={18} /></div>
          <div className="setting-content">
            <div className="setting-label">Weekly Digest</div>
            <div className="setting-desc">Summary email every Monday</div>
          </div>
          <Toggle checked={prefs.weeklyDigest} onChange={() => handleToggle('weeklyDigest')} />
        </div>
      </Card>

      <Card title="Appearance" className="mb-20">
        <div className="setting-row">
          <div className="setting-icon"><Moon size={18} /></div>
          <div className="setting-content">
            <div className="setting-label">Theme</div>
            <div className="setting-desc">Choose your interface theme</div>
          </div>
          <select
            name="theme"
            value={prefs.theme}
            onChange={handleChange}
            className="setting-select"
          >
            <option value="light">Light</option>
            <option value="dark">Dark (coming soon)</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </Card>

      <Card title="Language & Region" className="mb-20">
        <div className="setting-row">
          <div className="setting-icon"><Globe size={18} /></div>
          <div className="setting-content">
            <div className="setting-label">Language</div>
            <div className="setting-desc">Interface display language</div>
          </div>
          <select
            name="language"
            value={prefs.language}
            onChange={handleChange}
            className="setting-select"
          >
            <option value="en">English</option>
            <option value="ml">Malayalam (coming soon)</option>
            <option value="hi">Hindi (coming soon)</option>
          </select>
        </div>
      </Card>

      <Card title="Security">
        <div className="setting-row">
          <div className="setting-icon"><Shield size={18} /></div>
          <div className="setting-content">
            <div className="setting-label">Password</div>
            <div className="setting-desc">Change your password in Profile</div>
          </div>
          <span className="setting-hint">Profile →</span>
        </div>
      </Card>

      <style>{`
        .page-container { max-width: 800px; margin: 0 auto; }
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
        .saved-toast {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #d1fae5;
          color: #059669;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
        }
        .mb-20 { margin-bottom: 20px; }
        .setting-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .setting-row:last-child { border-bottom: none; }
        .setting-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .setting-content { flex: 1; }
        .setting-label {
          font-size: 14px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 2px;
        }
        .setting-desc { font-size: 13px; color: #64748b; }
        .setting-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          font-family: inherit;
          background: white;
          cursor: pointer;
        }
        .setting-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .setting-hint {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

// Reusable toggle component
const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    className={`toggle ${checked ? 'on' : 'off'}`}
    onClick={onChange}
    aria-pressed={checked}
    style={{
      width: '44px',
      height: '24px',
      borderRadius: '12px',
      border: 'none',
      background: checked ? '#667eea' : '#cbd5e1',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background 0.2s',
      padding: 0,
    }}
  >
    <span
      style={{
        position: 'absolute',
        top: '2px',
        left: checked ? '22px' : '2px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        transition: 'left 0.2s',
      }}
    />
  </button>
);

export default Settings;