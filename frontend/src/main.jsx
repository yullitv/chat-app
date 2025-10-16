import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AuthProvider from './contexts/AuthProvider.jsx';
import ToastProvider from './contexts/ToastProvider.jsx';
import './styles.css'; // ми створимо його далі

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);
