import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("[SOCKET] connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("[SOCKET] disconnected:", reason);
});

export default socket;
