const express = require('express');
const router = express.Router();
const {
  getMessages,
  sendMessage,
  updateMessage,
} = require('../controllers/messagesController');

router.get('/:chatId', getMessages);
router.post('/:chatId', sendMessage);
router.patch('/:id', updateMessage);

module.exports = router;