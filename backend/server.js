import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import connectDB from './src/config/db.js';
import songRoutes from './src/routes/songRoutes.js';
import playlistRoutes from './src/routes/playlistRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import errorHandler from './src/middleware/errorHandler.js';

import http from 'http';
import { Server } from 'socket.io';
import { handleSocketEvents } from './src/socket/socketHandler.js';

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Configure according to your frontend URL in production
    methods: ["GET", "POST"]
  }
});

// Attach Socket Events
handleSocketEvents(io);

// Middlewares
app.use(cors()); // Allow frontend to call the API
app.use(express.json({ limit: '50mb' })); // Increased limit for profile picture uploads
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev')); // Request logging

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Mount routes
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// Mount Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
