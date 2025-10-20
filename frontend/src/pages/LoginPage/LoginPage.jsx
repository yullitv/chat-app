import React from "react";
import s from "./LoginPage.module.css";

export default function LoginPage() {
  const API_BASE = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

  const handleLogin = () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  return (
    <div className={s.wrapper}>
      <div className={s.card}>
        <h1 className={s.title}>Welcome to Chat App</h1>
        <p className={s.text}>
          Please log in with your Google account to continue.
        </p>
        <button className={s.googleBtn} onClick={handleLogin}>
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className={s.icon}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
