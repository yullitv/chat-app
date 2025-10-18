import React from "react";
import s from "./Header.module.css";

export default function Header({ user, onLogin, onLogout }) {
  return (
    <header className={s.header}>
      {user ? (
        <button className={s.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      ) : (
        <button className={s.loginBtn} onClick={onLogin}>
          Sign in with Google
        </button>
      )}
    </header>
  );
}
