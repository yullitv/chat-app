import { createChat, updateChat, deleteChat, sendMessage, updateMessage } from "@/services";

/**
 * CRUD операції для чатів та повідомлень.
 * Приймає функції встановлення стану (state setters) та toast (спливаючі повідомлення)
 * для уникнення "просочування пропсів" (prop-drilling).
 */

export function useChatActions({ setChats, setActiveChat, toast }) {
  const handleNewChat = async (chat) => {
    try {
      const res = await createChat(chat);
      setChats((prev) => [...prev, res.data]);
      toast.push("Chat created");
    } catch (err) {
      console.error("Failed to create chat:", err);
      toast.push("Failed to create chat");
    }
  };

  const handleEditChat = async (chatId, updatedData) => {
    try {
      const res = await updateChat(chatId, updatedData);
      setChats((prev) =>
        prev.map((chat) => (chat._id === chatId ? res.data : chat))
      );
      toast.push("Chat updated");
    } catch (err) {
      console.error("Failed to update chat:", err);
      toast.push("Failed to update chat");
    }
  };

  const handleDeleteChat = async (chat) => {
    try {
      await deleteChat(chat._id);
      setChats((prev) => prev.filter((c) => c._id !== chat._id));
      setActiveChat((prev) => (prev?._id === chat._id ? null : prev));
      toast.push("Chat deleted");
    } catch (err) {
      console.error("Failed to delete chat:", err);
      toast.push("Failed to delete chat");
    }
  };

  const handleSendMessage = async (activeChat, text) => {
    if (!activeChat) return;
    try {
      await sendMessage(activeChat._id, { text, sender: "user" });
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.push("Failed to send message");
    }
  };

  const handleEditMessage = async (messageId, newText) => {
    try {
      await updateMessage(messageId, { text: newText });
    } catch (err) {
      console.error("Failed to update message:", err);
      toast.push("Failed to update message");
    }
  };

  return {
    handleNewChat,
    handleEditChat,
    handleDeleteChat,
    handleSendMessage,
    handleEditMessage,
  };
}
