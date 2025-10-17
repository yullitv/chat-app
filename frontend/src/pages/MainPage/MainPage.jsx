import React, { useState, useEffect, useRef } from "react";
import s from "./MainPage.module.css";
import ChatList from "@/components/chat/ChatList/ChatList.jsx";
import ChatWindow from "@/components/chat/ChatWindow/ChatWindow.jsx";
import NewChatModal from "@/components/chat/NewChatModal/NewChatModal.jsx";
import EditChatModal from "@/components/chat/EditChatModal/EditChatModal.jsx";
import ConfirmDialog from "@/components/chat/ConfirmDialog/ConfirmDialog.jsx";
import { getChats, getMessages } from "@/services";
import socket from "@/services/socket";
import { useToast } from "@/contexts/Toast/ToastContext";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useChatActions } from "@/hooks/useChatActions";
import { useJoinChatRooms } from "@/hooks/useJoinChatRooms";
import { normalizeId } from "@/utils/ids";

export default function MainPage() {
  const toast = useToast();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [editChat, setEditChat] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [liveEnabled, setLiveEnabled] = useState(false);

  // refs для актуальних значень у сокет-обробниках
  const activeChatIdRef = useRef(null);
  const chatsRef = useRef([]);
  const toastRef = useRef(toast);
  const liveRef = useRef(liveEnabled);
  const joinedChatsRef = useRef(new Set());

  useEffect(() => {
    chatsRef.current = chats;
    toastRef.current = toast;
  }, [chats, toast]);

  useEffect(() => {
    liveRef.current = liveEnabled;
  }, [liveEnabled]);

  // підключення socket-подій
  useChatSocket({
    setMessages,
    setChats,
    setLiveEnabled,
    activeChatIdRef,
    chatsRef,
    toastRef,
    liveRef,
  });

  // CRUD-екшени
  const {
    handleNewChat,
    handleEditChat,
    handleDeleteChat,
    handleSendMessage,
    handleEditMessage,
  } = useChatActions({ setChats, setActiveChat, toast });

  // завантаження чатів із пошуком
  useEffect(() => {
    const t = setTimeout(() => {
      getChats(searchTerm)
        .then((res) =>
          setChats((prev) =>
            res.data.map((newChat) => {
              const old = prev.find((p) => p._id === newChat._id);
              return old
                ? {
                    ...newChat,
                    unreadCount: old.unreadCount || 0,
                    lastMessage: old.lastMessage,
                  }
                : newChat;
            })
          )
        )
        .catch(() => toast.push("Failed to load chats"));
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm, toast]);

  // приєднуємося до кімнат один раз
  useJoinChatRooms({ chats, joinedChatsRef });

  // завантаження повідомлень для активного чату
  useEffect(() => {
    if (!activeChat) return;
    activeChatIdRef.current = activeChat._id;
    getMessages(activeChat._id)
      .then((res) => setMessages(res.data))
      .catch(() => toast.push("Failed to load message"));
  }, [activeChat, toast]);

  // дублюємо join для активного (на випадок, якщо його не було в списку на момент mount)
  useEffect(() => {
    if (activeChat) socket.emit("joinChat", activeChat._id);
  }, [activeChat]);

  // вибір чату
  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setChats((prev) =>
      prev.map((c) =>
        normalizeId(c._id) === normalizeId(chat._id)
          ? { ...c, unreadCount: 0, lastMessage: null }
          : c
      )
    );
  };

  // Live тумблер
  const handleToggleLive = (e) => {
    const enabled = e.target.checked;
    setLiveEnabled(enabled);
    socket.emit("toggleLive", { enabled });
    setTimeout(() => {
      toast.push(`Live mode ${enabled ? "is on" : "is off"}`);
    }, 100);
  };

  return (
    <div className={s.wrapper}>
      <aside className={s.sidebar}>
        <ChatList
          chats={chats}
          activeId={activeChat?._id}
          onSelect={handleSelectChat}
          onNew={() => setIsNewChatModalOpen(true)}
          onEdit={(chat) => setEditChat(chat)}
          onDelete={(chat) => setConfirmDelete(chat)}
          onSearch={setSearchTerm}
          liveEnabled={liveEnabled}
          onToggleLive={handleToggleLive}
        />
      </aside>

      <section className={s.chatArea}>
        <ChatWindow
          chat={activeChat}
          messages={messages}
          onSend={(text) => handleSendMessage(activeChat, text)}
          onEditMessage={handleEditMessage}
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
