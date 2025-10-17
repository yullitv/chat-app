import React, { useState, useEffect, useRef } from "react";
import s from "./MainPage.module.css";
import ChatList from "@/components/chat/ChatList/ChatList.jsx";
import ChatWindow from "@/components/chat/ChatWindow/ChatWindow.jsx";
import NewChatModal from "@/components/chat/NewChatModal/NewChatModal.jsx";
import EditChatModal from "@/components/chat/EditChatModal/EditChatModal.jsx";
import ConfirmDialog from "@/components/chat/ConfirmDialog/ConfirmDialog.jsx";
import {
  getChats,
  createChat,
  updateChat,
  deleteChat,
  getMessages,
  sendMessage,
} from "@/services";
import socket from "@/services/socket";
import { useToast } from "@/contexts/Toast/ToastContext";

export default function MainPage() {
  const toast = useToast();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [editChat, setEditChat] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const activeChatIdRef = useRef(null);

  // --- Завантаження чатів ---
  useEffect(() => {
    getChats()
      .then((res) => {
        setChats(res.data);
        toast.push("Чати завантажено");
      })
      .catch((err) => {
        console.error(err);
        toast.push("Не вдалося завантажити чати");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Завантаження повідомлень вибраного чату ---
  useEffect(() => {
    if (!activeChat) return;
    activeChatIdRef.current = activeChat._id;
    getMessages(activeChat._id)
      .then((res) => setMessages(res.data))
      .catch((err) => {
        console.error(err);
        toast.push("Не вдалося завантажити повідомлення");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat]);

  // --- Ініціалізація сокета ---
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleNewMessage = (msg) => {
      const currentId = activeChatIdRef.current;

      if (String(msg.chatId) === String(currentId)) {
        setMessages((prev) => [...prev, msg]);
      } else {
        toast.push("Нове повідомлення в іншому чаті");
      }

      setChats((prevChats) =>
        prevChats.map((chat) =>
          String(chat._id) === String(msg.chatId)
            ? { ...chat, lastMessage: { text: msg.text } }
            : chat
        )
      );
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [toast]);

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
      toast.push("Чат створено");
    } catch (err) {
      console.error(err);
      toast.push("Не вдалося створити чат");
    }
  };

  // --- Редагування чату ---
  const handleEditChat = async (chatId, updatedData) => {
    try {
      const res = await updateChat(chatId, updatedData);
      setChats((prev) =>
        prev.map((chat) => (chat._id === chatId ? res.data : chat))
      );
      toast.push("Чат оновлено");
    } catch (err) {
      console.error(err);
      toast.push("Не вдалося оновити чат");
    }
  };

  // --- Видалення чату ---
  const handleDeleteChat = async (chat) => {
    try {
      await deleteChat(chat._id);
      setChats((prev) => prev.filter((c) => c._id !== chat._id));
      if (activeChat?._id === chat._id) setActiveChat(null);
      toast.push("Чат видалено");
    } catch (err) {
      console.error(err);
      toast.push("Не вдалося видалити чат");
    }
  };

  // --- Надсилання повідомлення ---
  const handleSendMessage = async (text) => {
    if (!activeChat) return;
    try {
      await sendMessage(activeChat._id, { text });
      toast.push("Повідомлення надіслано");
    } catch (err) {
      console.error(err);
      toast.push("Не вдалося надіслати повідомлення");
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
          onEdit={(chat) => setEditChat(chat)}
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

      {editChat && (
        <EditChatModal
          chat={editChat}
          onClose={() => setEditChat(null)}
          onSave={(data) => {
            handleEditChat(editChat._id, data);
            setEditChat(null);
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`Видалити чат з ${confirmDelete.firstName}?`}
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
