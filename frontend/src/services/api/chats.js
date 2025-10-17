import api from "./index.js";

// Повертаємо всі чати або з пошуком (q)
export const getChats = (q) => {
  if (q && q.trim()) {
    return api.get("/chats", { params: { q: q.trim() } });
  }
  return api.get("/chats");
};

export const getChatById = (id) => api.get(`/chats/${id}`);

// УВАГА: бекенд для оновлення використовує PATCH /chats/:id
export const createChat = (data) => api.post("/chats", data);
export const updateChat = (id, data) => api.patch(`/chats/${id}`, data);
export const deleteChat = (id) => api.delete(`/chats/${id}`);
