import React from "react";
import s from "./Modal.module.css";

export default function Modal({ title, children, onClose }) {
  return (
    <div className={s.backdrop} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          {title && <h3>{title}</h3>}
          <button className={s.close} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={s.body}>{children}</div>
      </div>
    </div>
  );
}
