const Message = require('../models/Message');
const { getRandomQuote } = require('../utils/zenQuotesClient');
const { broadcastNewMessage, broadcastMessageUpdated } = require('../socket');

// GET messages by chat
async function getMessages(req, res) {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

// POST user message
async function sendMessage(req, res) {
  try {
    const { chatId } = req.params;
    const { text } = req.body;

    const userMsg = await Message.create({
      chatId,
      text,
      sender: 'user',
      createdAt: new Date(),
    });

    broadcastNewMessage(userMsg);
    res.json(userMsg);

    setTimeout(async () => {
      try {
        const quote = await getRandomQuote();
        const botMsg = await Message.create({
          chatId,
          text: quote,
          sender: 'bot',
          createdAt: new Date(),
        });
        broadcastNewMessage(botMsg);
      } catch (botErr) {
        console.error('Auto-response error:', botErr.message);
      }
    }, 3000);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

// PATCH update own message
async function updateMessage(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const updated = await Message.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Message not found' });

    // повідомляємо клієнтів про оновлення
    broadcastMessageUpdated(updated);

    res.json(updated);
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ error: 'Failed to update message' });
  }
}

module.exports = { getMessages, sendMessage, updateMessage };
