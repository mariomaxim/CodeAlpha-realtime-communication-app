require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const { router: authRouter, authMiddleware } = require("./auth");

const app = express();
const server = http.createServer(app);

// Environment variables with defaults
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/realtime_communication_app";
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? 
  process.env.ALLOWED_ORIGINS.split(',') : 
  ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5000'];

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// CORS configuration
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);

// Database connection with better error handling
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ 
    message: "Protected content", 
    userId: req.user.id,
    timestamp: new Date().toISOString()
  });
});

// Logout route
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Catch-all route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.IO connection handling
const rooms = new Map();

io.on("connection", (socket) => {
  console.log("👤 User connected:", socket.id);

  // Room management
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);
    
    console.log(`🏠 User ${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(socket.id);
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
      }
    }
    
    console.log(`🚪 User ${socket.id} left room ${roomId}`);
    socket.to(roomId).emit("user-left", socket.id);
  });

  // WebRTC signaling
  socket.on("offer", (data) => {
    socket.to(data.roomId || socket.rooms).emit("offer", {
      ...data,
      from: socket.id
    });
  });

  socket.on("answer", (data) => {
    socket.to(data.roomId || socket.rooms).emit("answer", {
      ...data,
      from: socket.id
    });
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId || socket.rooms).emit("ice-candidate", {
      ...data,
      from: socket.id
    });
  });

  // Whiteboard collaboration
  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("clear-whiteboard", () => {
    socket.broadcast.emit("clear-whiteboard");
  });

  // File sharing
  socket.on("file", (fileData) => {
    try {
      // Add file size limit (10MB)
      if (fileData.buffer && fileData.buffer.byteLength > 10 * 1024 * 1024) {
        socket.emit("file-error", { message: "File too large. Maximum size is 10MB." });
        return;
      }
      
      socket.broadcast.emit("file", {
        ...fileData,
        from: socket.id,
        timestamp: new Date().toISOString()
      });
      
      console.log(`📁 File shared: ${fileData.name} from ${socket.id}`);
    } catch (error) {
      console.error("File sharing error:", error);
      socket.emit("file-error", { message: "Error processing file" });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("👋 User disconnected:", socket.id);
    
    // Clean up rooms
    for (const [roomId, users] of rooms.entries()) {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        socket.to(roomId).emit("user-left", socket.id);
        
        if (users.size === 0) {
          rooms.delete(roomId);
        }
      }
    }
  });

  // Error handling
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 Access at: http://localhost:${PORT}`);
});
