import React from "react";
import s from "./MessageBubble.module.css";

export default function MessageBubble({ message, onEdit }) {
  const side = message.sender === "user" ? s.right : s.left;

  return (
    <div className={`${s.row} ${side}`}>
      <div className={`${s.bubble} ${side}`}>
        <div className={s.text}>
          {message.text}
          {message.sender === "user" && (
            <button className={s.edit} onClick={() => onEdit(message)}>
              Edit
            </button>
          )}
        </div>
        <div className={s.time}>
          {new Date(message.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
