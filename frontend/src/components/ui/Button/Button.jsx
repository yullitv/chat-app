import React from 'react';
import s from './Button.module.css';

export default function Button({
  children,
  variant = 'default',
  size = 'md',
  disabled,
  onClick,
  className = '',
}) {
  const classes = `${s.btn} ${s[variant]} ${s[size]} ${className}`;
  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
