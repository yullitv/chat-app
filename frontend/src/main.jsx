import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AuthProvider from "./contexts/Auth/AuthProvider.jsx";
import ToastProvider from "./contexts/Toast/ToastProvider.jsx";
import "./styles/index.css";

console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);
