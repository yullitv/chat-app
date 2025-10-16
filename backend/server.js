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

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Сесії для Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: 'none',
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport стратегія
require('./src/config/passport');

// Роутери
app.use('/api/chats', require('./src/routes/chats'));
app.use('/api/messages', require('./src/routes/messages'));
app.use('/api/auth', require('./src/routes/auth'));

// Підключення до MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    setupSocket(server, allowedOrigins);
    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
