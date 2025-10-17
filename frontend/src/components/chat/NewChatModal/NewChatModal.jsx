import React, { useState } from "react";
import Modal from "@/components/ui/Modal/Modal.jsx";
import Input from "@/components/ui/Input/Input.jsx";
import s from "./NewChatModal.module.css";

export default function NewChatModal({ onClose, onCreate }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Both fields are required");
      return;
    }

    onCreate({ firstName: firstName.trim(), lastName: lastName.trim() });
    onClose();
  };

  return (
    <Modal
      title="Create new chat"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText="Create"
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
