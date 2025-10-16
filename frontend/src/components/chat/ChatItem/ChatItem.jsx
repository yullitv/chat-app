import React from "react";
import s from "./ChatItem.module.css";
import Button from "@/components/ui/Button/Button.jsx";

export default function ChatItem({ chat, active, onSelect, onEdit, onDelete }) {
  return (
    <div
      className={`${s.item} ${active ? s.active : ""}`}
      onClick={() => onSelect(chat)}
    >
      <div className={s.avatar}></div>
      <div className={s.info}>
        <div className={s.name}>
          {chat.firstName} {chat.lastName}
        </div>
        <div className={s.preview}>{chat.lastMessage?.text || "—"}</div>
      </div>
      <div className={s.actions} onClick={(e) => e.stopPropagation()}>
        <Button onClick={() => onEdit(chat)} size="sm">
          Edit
        </Button>
        <Button onClick={() => onDelete(chat)} variant="danger" size="sm">
          Del
        </Button>
      </div>
    </div>
  );
}
