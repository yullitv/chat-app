import React from "react";
import s from "./ConfirmDialog.module.css";

export default function ConfirmDialog({ text, onConfirm, onCancel }) {
  return (
    <div className={s.backdrop}>
      <div className={s.modal}>
        <div className={s.title}>Confirmation</div>
        <div>{text}</div>
        <div className={s.footer}>
          <button className={s.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button className={s.danger} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
