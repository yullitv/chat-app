import React, { useState } from "react";
import s from "./EditChatModal.module.css";
import Input from "@/components/ui/Input/Input.jsx";
import Button from "@/components/ui/Button/Button.jsx";
import Modal from "@/components/ui/Modal/Modal.jsx";

export default function EditChatModal({ chat, onClose, onSave }) {
  const [firstName, setFirstName] = useState(chat.firstName);
  const [lastName, setLastName] = useState(chat.lastName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    onSave({ firstName, lastName });
  };

  return (
    <Modal onClose={onClose}>
      <div className={s.modal}>
        <h2 className={s.title}>Редагування чату</h2>
        <form onSubmit={handleSubmit} className={s.form}>
          <Input
            placeholder="Ім’я"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            placeholder="Прізвище"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <div className={s.actions}>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
