import React from "react";
import s from "./Header.module.css";

export default function Header({ user, onLogin, onLogout }) {
  return (
    <header className={s.header}>
      {user ? (
        <div className={s.loggedIn}>
          <span className={s.greeting}>
            Hi, <strong>{user.firstName || "User"}</strong>!
          </span>
          <button className={s.logoutBtn} onClick={onLogout}>
            Logout
          </button>
        </div>
      ) : (
        <button className={s.loginBtn} onClick={onLogin}>
          Sign in with Google
        </button>
      )}
    </header>
  );
}
