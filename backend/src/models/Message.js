const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
text: { type: String, required: true },
sender: { type: String, enum: ['user','bot'], default: 'user' },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Message', MessageSchema);