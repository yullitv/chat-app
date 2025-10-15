const Message = require('../models/Message');
const { getRandomQuote } = require('../utils/quotableClient');
const { broadcastNewMessage } = require('../socket');

// GET messages by chat
async function getMessages(req, res) {
  try {
    const { chatId } = req.params;
    const msgs = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

// POST user message
async function sendMessage(req, res) {
  try {
    const { chatId } = req.params;
    const { text } = req.body;

    const userMsg = new Message({ chatId, text, sender: 'user' });
    await userMsg.save();
    broadcastNewMessage(userMsg);

    // bot reply after 3s
    setTimeout(async () => {
      const quote = await getRandomQuote();
      const botMsg = new Message({ chatId, text: quote, sender: 'bot' });
      await botMsg.save();
      broadcastNewMessage(botMsg);
    }, 3000);

    res.json(userMsg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
}

// PATCH update own message
async function updateMessage(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const msg = await Message.findByIdAndUpdate(id, { text }, { new: true });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message' });
  }
}

module.exports = { getMessages, sendMessage, updateMessage };
