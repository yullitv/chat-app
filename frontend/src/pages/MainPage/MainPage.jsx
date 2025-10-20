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
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header/Header.jsx";

export default function MainPage() {
  const { user, loading } = useAuth();
  const toast = useToast();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [editChat, setEditChat] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [liveEnabled, setLiveEnabled] = useState(false);

  // refs
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

  // sockets
  useChatSocket({
    setMessages,
    setChats,
    setLiveEnabled,
    activeChatIdRef,
    chatsRef,
    toastRef,
    liveRef,
  });

  // CRUD actions
  const {
    handleNewChat,
    handleEditChat,
    handleDeleteChat,
    handleSendMessage,
    handleEditMessage,
  } = useChatActions({ setChats, setActiveChat, toast });

  // load chats (with search)
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

  // join rooms once
  useJoinChatRooms({ chats, joinedChatsRef });

  // load messages for active chat
  useEffect(() => {
    if (!activeChat) return;
    activeChatIdRef.current = activeChat._id;
    getMessages(activeChat._id)
      .then((res) => setMessages(res.data))
      .catch(() => toast.push("Failed to load messages"));
  }, [activeChat, toast]);

  // ensure join for active
  useEffect(() => {
    if (activeChat) socket.emit("joinChat", activeChat._id);
  }, [activeChat]);

  // select chat
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

  // live toggle
  const handleToggleLive = (e) => {
    const enabled = e.target.checked;
    setLiveEnabled(enabled);
    socket.emit("toggleLive", { enabled });
    setTimeout(
      () => toast.push(`Live mode ${enabled ? "is on" : "is off"}`),
      100
    );
  };

  // auth
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });

    window.location.reload();
  };

  if (loading) return <div className={s.loading}>Loading...</div>;

  return (
    <div className={s.wrapper}>
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />

      {user ? (
        <div className={s.main}>
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
      ) : (
        <div className={s.noAccess}>Please sign in to access chats.</div>
      )}
    </div>
  );
}
