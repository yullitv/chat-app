import React, { useCallback, useState } from "react";
import { ToastContext } from "./ToastContext";
import "@/styles/toast.css"; // стилі беремо з /styles/toast.css

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((text) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, text }]);
    // автоматичне видалення через 4 секунди
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
