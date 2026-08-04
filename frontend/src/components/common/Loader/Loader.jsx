import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', color = '#667eea' }) => {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader" style={{ borderColor: `${color} transparent transparent transparent` }}></div>
    </div>
  );
};

export default Loader;