const { Server } = require("socket.io");

let io;

function setupSocket(server, allowedOrigins) {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PATCH"], // додано PATCH
    },
    transports: ["websocket", "polling"], // fallback
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
    });
  });
}

// --- трансляція нового повідомлення ---
function broadcastNewMessage(msg) {
  if (!io) return;

  const payload = {
    ...(msg.toObject?.() || msg),
    chatId: String(msg.chatId),
    _id: String(msg._id),
  };

  io.to(payload.chatId).emit("newMessage", payload);
  io.emit("notification", {
    type: "new_message",
    chatId: payload.chatId,
    text: payload.text,
  });

  console.log("[SOCKET] broadcast newMessage ->", payload.chatId);
}

// --- трансляція оновленого повідомлення ---
function broadcastMessageUpdated(msg) {
  if (!io) return;

  const payload = {
    ...(msg.toObject?.() || msg),
    chatId: String(msg.chatId),
    _id: String(msg._id),
  };

  io.to(payload.chatId).emit("messageUpdated", payload);
  io.emit("notification", {
    type: "message_updated",
    chatId: payload.chatId,
    text: payload.text,
  });

  console.log("[SOCKET] broadcast messageUpdated ->", payload.chatId);
}

module.exports = { setupSocket, broadcastNewMessage, broadcastMessageUpdated };
