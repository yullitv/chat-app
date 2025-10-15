const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ChatSchema = new Schema({
firstName: { type: String, required: true },
lastName: { type: String, required: true },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Chat', ChatSchema);