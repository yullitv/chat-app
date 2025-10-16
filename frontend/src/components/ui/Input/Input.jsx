import React from 'react';
import s from './Input.module.css';

export default function Input({ value, onChange, placeholder, ...props }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={s.input}
      {...props}
    />
  );
}
