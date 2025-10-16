import React, { useState, useEffect, useRef } from "react";
import s from "./MainPage.module.css";
import ChatList from "@/components/chat/ChatList/ChatList.jsx";
import ChatWindow from "@/components/chat/ChatWindow/ChatWindow.jsx";
import NewChatModal from "@/components/chat/NewChatModal/NewChatModal.jsx";
import ConfirmDialog from "@/components/chat/ConfirmDialog/ConfirmDialog.jsx";
import {
  getChats,
  createChat,
  deleteChat,
  getMessages,
  sendMessage,
} from "@/services";
import socket from "@/services/socket";

export default function MainPage() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const activeChatIdRef = useRef(null);

  // --- Завантаження чатів ---
  useEffect(() => {
    getChats()
      .then((res) => setChats(res.data))
      .catch(console.error);
  }, []);

  // --- Завантаження повідомлень вибраного чату ---
  useEffect(() => {
    if (!activeChat) return;
    activeChatIdRef.current = activeChat._id;
    getMessages(activeChat._id)
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, [activeChat]);

  // --- Ініціалізація сокета ---
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleNewMessage = (msg) => {
      const currentId = activeChatIdRef.current;
      console.log("Received newMessage:", msg, "Current chat:", currentId);

      if (String(msg.chatId) === String(currentId)) {
        setMessages((prev) => [...prev, msg]);
      }

      // оновлюємо прев'ю останнього повідомлення у списку чатів
      setChats((prevChats) =>
        prevChats.map((chat) =>
          String(chat._id) === String(msg.chatId)
            ? { ...chat, lastMessage: { text: msg.text } }
            : chat
        )
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  // --- Приєднання до активного чату ---
  useEffect(() => {
    if (activeChat) {
      activeChatIdRef.current = activeChat._id;
      socket.emit("joinChat", activeChat._id);
      console.log("Joined chat:", activeChat._id);
    } else {
      activeChatIdRef.current = null;
    }
  }, [activeChat]);

  // --- Створення нового чату ---
  const handleNewChat = async (chat) => {
    try {
      const res = await createChat(chat);
      setChats((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Видалення чату ---
  const handleDeleteChat = async (chat) => {
    try {
      await deleteChat(chat._id);
      setChats((prev) => prev.filter((c) => c._id !== chat._id));
      if (activeChat?._id === chat._id) setActiveChat(null);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Надсилання повідомлення ---
  const handleSendMessage = async (text) => {
    if (!activeChat) return;
    try {
      await sendMessage(activeChat._id, { text });
      // не додаємо вручну — повідомлення прийде через сокет
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={s.wrapper}>
      <aside className={s.sidebar}>
        <ChatList
          chats={chats}
          activeId={activeChat?._id}
          onSelect={setActiveChat}
          onNew={() => setIsNewChatModalOpen(true)}
          onDelete={(chat) => setConfirmDelete(chat)}
        />
      </aside>

      <section className={s.chatArea}>
        <ChatWindow
          chat={activeChat}
          messages={messages}
          onSend={handleSendMessage}
          onEditMessage={() => {}}
        />
      </section>

      {isNewChatModalOpen && (
        <NewChatModal
          onClose={() => setIsNewChatModalOpen(false)}
          onCreate={handleNewChat}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`Delete chat with ${confirmDelete.firstName}?`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => {
            handleDeleteChat(confirmDelete);
            setConfirmDelete(null);
          }}
        />
      )}
    </div>
  );
}
