import api from './index.js';

export const getChats = () => api.get('/chats');
export const getChatById = (id) => api.get(`/chats/${id}`);
export const createChat = (data) => api.post('/chats', data);
export const updateChat = (id, data) => api.put(`/chats/${id}`, data);
export const deleteChat = (id) => api.delete(`/chats/${id}`);
