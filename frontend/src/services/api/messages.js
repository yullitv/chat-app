import api from './index.js';

export const getMessages = (chatId) => api.get(`/messages/${chatId}`);
export const sendMessage = (chatId, data) => api.post(`/messages/${chatId}`, data);
