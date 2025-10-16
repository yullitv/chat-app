import React from "react";
import s from "./ChatList.module.css";
import Button from "@/components/ui/Button/Button.jsx";
import Input from "@/components/ui/Input/Input.jsx";
import ChatItem from "@/components/chat/ChatItem/ChatItem.jsx";

export default function ChatList({
  user,
  chats,
  activeId,
  onSelect,
  onSearch,
  onNew,
  onEdit,
  onDelete,
  liveEnabled,
  onToggleLive,
  onLogin,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      {/* top bar: avatar + auth */}
      <div className={s.topbar}>
        <div className={s.avatar} />
        <div className={s.right}>
          {user ? (
            <Button onClick={onLogout}>Log out</Button>
          ) : (
            <Button onClick={onLogin}>Log in</Button>
          )}
        </div>
      </div>

      {/* search + live toggle */}
      <div className={s.searchRow}>
        <Input
          placeholder="Search or start new chat"
          onChange={(e) => onSearch(e.target.value)}
        />
        <label className={s.liveToggle}>
          <input
            type="checkbox"
            checked={liveEnabled}
            onChange={onToggleLive}
          />
          <span>Live</span>
        </label>
      </div>

      {/* list */}
      <div className={s.header}>Chats</div>
      <div className={s.list}>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <ChatItem
              key={chat._id}
              chat={chat}
              active={activeId === chat._id}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className={s.empty}>No chats yet</div>
        )}
      </div>

      {/* footer: new chat */}
      <div className={s.footer}>
        <Button variant="primary" onClick={onNew}>
          + New chat
        </Button>
      </div>
    </aside>
  );
}
