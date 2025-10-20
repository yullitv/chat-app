require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const { setupSocket } = require("./src/socket");
const Chat = require("./src/models/Chat");

const app = express();
const server = http.createServer(app);

// ===== Render HTTPS fix =====
app.set("trust proxy", 1);

// ===== CORS =====
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://chat-app-1-ikae.onrender.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// ===== Session (Google Auth) =====
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true, // Render HTTPS
      sameSite: "none", // дозволяє міждоменний доступ
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 днів
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ===== Passport Config =====
require("./src/config/passport");

// ===== Routes =====
app.use("/api/chats", require("./src/routes/chats"));
app.use("/api/messages", require("./src/routes/messages"));
app.use("/api/auth", require("./src/routes/auth"));

// ===== Seed Initial Chats =====
async function seedChats() {
  const count = await Chat.countDocuments();
  if (count >= 3) {
    console.log(`Already have ${count} chats in DB`);
    return;
  }

  const predefinedChats = [
    { firstName: "Alice", lastName: "Johnson" },
    { firstName: "Peter", lastName: "Parker" },
    { firstName: "Josefina", lastName: "Martinez" },
  ];

  await Chat.insertMany(predefinedChats);
  console.log("Predefined chats have been added to the database");
}

// ===== Connect to MongoDB =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    await seedChats();

    setupSocket(server, allowedOrigins);

    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
