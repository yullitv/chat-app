let io;
function setupSocket(server){
const { Server } = require('socket.io');
io = new Server(server, { cors: { origin: process.env.FRONTEND_URL, methods: ['GET','POST'] }});
io.on('connection', socket => {
console.log('socket connected', socket.id);
socket.on('joinChat', (chatId) => socket.join(chatId));
});
}


function broadcastNewMessage(msg){
if(!io) return;
io.to(msg.chatId.toString()).emit('newMessage', msg);
// also emit global notification
io.emit('notification', { type: 'new_message', chatId: msg.chatId, text: msg.text });
}


module.exports = { setupSocket, broadcastNewMessage };