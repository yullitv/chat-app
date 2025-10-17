import { useEffect } from "react";
import socket from "@/services/socket";

//Приєднуємо клієнт до кімнат чату один раз для кожного чату

export function useJoinChatRooms({ chats, joinedChatsRef }) {
  useEffect(() => {
    if (!socket.connected || !Array.isArray(chats) || chats.length === 0) return;

    chats.forEach((chat) => {
      const id = String(chat._id);
      if (!joinedChatsRef.current.has(id)) {
        socket.emit("joinChat", id);
        joinedChatsRef.current.add(id);
      }
    });
  }, [chats, joinedChatsRef]);
}
