const router = require('express').Router();
const passport = require('passport');
const { getCurrentUser, logoutUser } = require('../controllers/authController');

// 1. Початок авторизації через Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 2. Callback після авторизації Google
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    // Редіректимо користувача на фронтенд після успішного логіну
    res.redirect(process.env.FRONTEND_URL);
  }
);

// 3. Отримати поточного користувача
router.get('/current', getCurrentUser);

// 4. Logout
router.get('/logout', logoutUser);

module.exports = router;
