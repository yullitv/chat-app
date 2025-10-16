const User = require('../models/User');

// Поточний користувач
exports.getCurrentUser = (req, res) => {
  if (!req.user) {
    // тепер просто повертаємо user: null замість 401
    return res.json({ user: null });
  }
  res.json({ user: req.user });
};

// Логаут
exports.logoutUser = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
};
