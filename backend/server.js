require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const { setupSocket } = require('./src/socket');

const app = express();
const server = http.createServer(app);

// --- Middleware ---
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// --- Сесії для Passport ---
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// --- Підключаємо Passport стратегію ---
require('./src/config/passport');

// --- Роутери ---
app.use('/api/chats', require('./src/routes/chats'));
app.use('/api/messages', require('./src/routes/messages'));
app.use('/api/auth', require('./src/routes/auth'));

// --- Порт ---
const PORT = process.env.PORT || 4000;

// --- Підключення до MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => console.log('Server listening on port', PORT));
    setupSocket(server);
  })
  .catch(err => console.error(err));
