const User = require('../models/User');

// Контролер для поточного користувача
exports.getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json(req.user);
};

// Контролер для логаута
exports.logoutUser = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
};
