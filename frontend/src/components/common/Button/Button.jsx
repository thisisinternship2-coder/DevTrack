import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props 
}) => {
  const classes = `btn btn-${variant} btn-${size} ${className}`;
  
  return (
    <button
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;