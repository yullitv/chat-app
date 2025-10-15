const Chat = require('../models/Chat');

// GET all chats
async function getAllChats(req, res) {
  try {
    const q = req.query.q;
    const filter = q
      ? {
          $or: [
            { firstName: new RegExp(q, 'i') },
            { lastName: new RegExp(q, 'i') },
          ],
        }
      : {};
    const chats = await Chat.find(filter).sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
}

// POST create chat
async function createChat(req, res) {
  try {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName)
      return res.status(400).json({ error: 'Both required' });
    const chat = new Chat({ firstName, lastName });
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create chat' });
  }
}

// PATCH update chat
async function updateChat(req, res) {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    const chat = await Chat.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { new: true }
    );
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update chat' });
  }
}

// DELETE chat
async function deleteChat(req, res) {
  try {
    const { id } = req.params;
    await Chat.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete chat' });
  }
}

module.exports = { getAllChats, createChat, updateChat, deleteChat };
