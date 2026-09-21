import React from 'react';
import { Rocket } from 'lucide-react';
import './LoadingOverlay.css';

const LoadingOverlay = ({ show, message = 'Loading...' }) => {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-logo">
          <Rocket size={36} strokeWidth={2.5} />
        </div>
        <div className="loading-brand">DevTrack</div>
        <div className="loading-spinner"></div>
        <div className="loading-message">{message}</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;