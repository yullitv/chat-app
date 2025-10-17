import React, { useState, useMemo, useRef, useEffect } from "react";
import s from "./ChatWindow.module.css";
import Input from "@/components/ui/Input/Input.jsx";
import Button from "@/components/ui/Button/Button.jsx";

function Bubble({ m, onEdit }) {
  const side = m.sender === "user" ? s.right : s.left;
  return (
    <div className={`${s.row} ${side}`}>
      <div className={`${s.bubble} ${side}`}>
        <div className={s.text}>
          {m.text}
          {m.sender === "user" && (
            <button className={s.edit} onClick={() => onEdit(m)}>
              Edit
            </button>
          )}
        </div>
        <div className={s.time}>{new Date(m.createdAt).toLocaleString()}</div>
      </div>
    </div>
  );
}

export default function ChatWindow({ chat, messages, onSend, onEditMessage }) {
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");

  const messagesEndRef = useRef(null);

  // Автоскрол вниз при кожній зміні повідомлень
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Фільтрація повідомлень
  const filteredMessages = useMemo(() => {
    if (!search.trim()) return messages;
    const q = search.toLowerCase();
    return messages.filter((m) => m.text.toLowerCase().includes(q));
  }, [messages, search]);

  if (!chat) return <div className={s.empty}>Select a chat</div>;

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const saveEdit = () => {
    if (!editing || !editText.trim()) return;
    onEditMessage(editing._id, editText.trim());
    setEditing(null);
    setEditText("");
  };

  return (
    <section className="chat">
      {/* Заголовок */}
      <div className={s.header}>
        <div>
          {chat.firstName} {chat.lastName}
        </div>
      </div>

      {/* Пошук у чаті */}
      <div className={s.searchBar}>
        <Input
          placeholder="Search in chat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <Button size="sm" onClick={() => setSearch("")}>
            ✕
          </Button>
        )}
      </div>

      {/* Повідомлення */}
      <div className={s.body}>
        {filteredMessages.length > 0 ? (
          filteredMessages.map((m) => (
            <Bubble
              key={m._id}
              m={m}
              onEdit={(mm) => {
                setEditing(mm);
                setEditText(mm.text);
              }}
            />
          ))
        ) : (
          <div className={s.noResults}>No messages found</div>
        )}
        {/* Якір для автоскролу */}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле введення */}
      <div
        className={s.inputRow}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            editing ? saveEdit() : send();
          }
        }}
      >
        {editing ? (
          <>
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <Button
              onClick={() => {
                setEditing(null);
                setEditText("");
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={saveEdit}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Input
              placeholder="Type your message"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button variant="primary" onClick={send}>
              &#10148;
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
