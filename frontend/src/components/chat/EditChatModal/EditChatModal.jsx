import React, { useState } from "react";
import s from "./EditChatModal.module.css";
import Input from "@/components/ui/Input/Input.jsx";
import Modal from "@/components/ui/Modal/Modal.jsx";

export default function EditChatModal({ chat, onClose, onSave }) {
  const [firstName, setFirstName] = useState(chat.firstName);
  const [lastName, setLastName] = useState(chat.lastName);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Both fields are required");
      return;
    }

    onSave({ firstName, lastName });
  };

  return (
    <Modal
      title="Edit chat"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText="Save"
    >
      <div className={s.modalBody}>
        <Input
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        {error && <p className={s.error}>{error}</p>}
      </div>
    </Modal>
  );
}
