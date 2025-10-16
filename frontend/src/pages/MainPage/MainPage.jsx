import React, { useState } from "react";
import s from "./MainPage.module.css";
import ChatList from "@/components/chat/ChatList/ChatList.jsx";
import ChatWindow from "@/components/chat/ChatWindow/ChatWindow.jsx";
import NewChatModal from "@/components/chat/NewChatModal/NewChatModal.jsx";

export default function MainPage() {
  const [chats, setChats] = useState([
    {
      _id: 1,
      firstName: "Alice",
      lastName: "Freeman",
      lastMessage: { text: "How was your meeting?" },
    },
    {
      _id: 2,
      firstName: "Josefina",
      lastName: "Doe",
      lastMessage: { text: "I'm going for a walk" },
    },
    {
      _id: 3,
      firstName: "Velazquez",
      lastName: "Smith",
      lastMessage: { text: "Tell me a joke please" },
    },
  ]);

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // створення нового чату
  const handleNewChat = (chat) => {
    const newChat = {
      ...chat,
      _id: Date.now(),
      lastMessage: { text: "" },
    };
    setChats((prev) => [...prev, newChat]);
  };

  // видалення
  const handleDeleteChat = (chat) => {
    setChats((prev) => prev.filter((c) => c._id !== chat._id));
    if (activeChat?._id === chat._id) {
      setActiveChat(null);
      setMessages([]);
    }
  };

  // надсилання повідомлення
  const handleSendMessage = (text) => {
    if (!activeChat) return;

    const newMessage = {
      _id: Date.now(),
      sender: "user",
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // оновлюємо превʼю останнього повідомлення
    setChats((prev) =>
      prev.map((c) =>
        c._id === activeChat._id
          ? { ...c, lastMessage: { text } }
          : c
      )
    );

    // авто-відповідь через 3 сек
    setTimeout(() => {
      const autoReply = {
        _id: Date.now() + 1,
        sender: "bot",
        text: "🤖 Here's a random quote (mock)",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, autoReply]);

      setChats((prev) =>
        prev.map((c) =>
          c._id === activeChat._id
            ? { ...c, lastMessage: { text: autoReply.text } }
            : c
        )
      );
    }, 3000);
  };

  // редагування власного повідомлення
  const handleEditMessage = (id, newText) => {
    setMessages((prev) =>
      prev.map((m) =>
        m._id === id ? { ...m, text: newText } : m
      )
    );
  };

  return (
    <div className={s.wrapper}>
      <aside className={s.sidebar}>
        <ChatList
          chats={chats}
          activeId={activeChat?._id}
          onSelect={(chat) => {
            setActiveChat(chat);
            setMessages([]); // очищуємо при зміні чату (поки без БД)
          }}
          onNew={() => setIsNewChatModalOpen(true)}
          onDelete={handleDeleteChat}
        />
      </aside>

      <section className={s.chatArea}>
        <ChatWindow
          chat={activeChat}
          messages={messages}
          onSend={handleSendMessage}
          onEditMessage={handleEditMessage}
        />
      </section>

      {isNewChatModalOpen && (
        <NewChatModal
          onClose={() => setIsNewChatModalOpen(false)}
          onCreate={handleNewChat}
        />
      )}
    </div>
  );
}
