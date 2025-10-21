const router = require("express").Router();
const passport = require("passport");
const { getCurrentUser, logoutUser } = require("../controllers/authController");

// Початок авторизації через Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback після авторизації Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: true,
  }),
  (req, res) => {
    console.log("Google auth success for:", req.user?.email);
    res.redirect(process.env.FRONTEND_URL);
  }
);


// Отримати поточного користувача
router.get("/current", getCurrentUser);

// Logout
router.get("/logout", logoutUser);

module.exports = router;
