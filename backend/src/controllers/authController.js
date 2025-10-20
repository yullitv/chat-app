const User = require("../models/User");

// Поточний користувач
exports.getCurrentUser = (req, res) => {
  console.log("🔍 Checking current user...");
  console.log("Session ID:", req.sessionID);
  console.log("User object:", req.user);

  if (!req.user) {
    console.log("❌ No user found in session");
    return res.json({ user: null });
  }

  console.log("✅ Authenticated user:", req.user.firstName, req.user.lastName);
  res.json({ user: req.user });
};

// Логаут
exports.logoutUser = (req, res) => {
  req.logout(() => {
    console.log("👋 User logged out");
    res.json({ message: "Logged out successfully" });
  });
};
