import React from "react";
import s from "./Modal.module.css";
import Button from "@/components/ui/Button/Button.jsx";

export default function Modal({
  title,
  children,
  onClose,
  onSubmit,
  submitText = "Save",
}) {
  return (
    <div className={s.backdrop} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          <h3>{title}</h3>
          <button className={s.close} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={s.body}>{children}</div>
        <div className={s.footer}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSubmit}>
            {submitText}
          </Button>
        </div>
      </div>
    </div>
  );
}
