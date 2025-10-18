import React from "react";
import s from "./Header.module.css";

export default function Header({ user, onLogout }) {
  return (
    <header className={s.header}>
      <div className={s.userInfo}>
        {user.photo ? (
          <img src={user.photo} alt="Avatar" className={s.avatar} />
        ) : (
          <div className={s.placeholder}>👤</div>
        )}
        <div className={s.name}>
          Hello, <span>{user.firstName}</span> 👋
        </div>
      </div>
      <button className={s.logoutBtn} onClick={onLogout}>
        Logout
      </button>
    </header>
  );
}
