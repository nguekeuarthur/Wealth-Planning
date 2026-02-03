const path = require("path");

// Load environment variables. Prefer a local backend `.env` file, but fall back to repo-root `.env`.
// (Your previous path only loaded `../.env`, which can silently ignore `backend/.env`.)
const dotenv = require("dotenv");

const envCandidates = [
  path.join(__dirname, ".env"),
  path.join(__dirname, "..", ".env"),
];

dotenv.config({ path: envCandidates.find((p) => require("fs").existsSync(p)) });

const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const teamRoutes = require("./routes/teamRoutes")
const clientRoutes = require("./routes/clientRoutes")
const taskRoutes = require("./routes/taskRoutes")
const reportRoutes = require("./routes/reportRoutes")
const projectRoutes = require("./routes/projectRoutes")
const documentRoutes = require("./routes/documentRoutes")
const invoiceRoutes = require("./routes/invoiceRoutes")
const messageRoutes = require("./routes/messageRoutes")
const appointmentRoutes = require("./routes/appointmentRoutes")
const weeklyUpdateRoutes = require("./routes/weeklyUpdateRoutes")
const milestoneRoutes = require("./routes/milestoneRoutes")
const formRoutes = require("./routes/formRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const chatRoutes = require("./routes/chatRoutes")
const { initializeDefaultConversations } = require("./controllers/chatController")

const app = express();
const server = http.createServer(app);

// Configuration Socket.io
// Build allowed CORS origins from env: supports CLIENT_URLS (comma-separated), CLIENT_URL, FRONTEND_URL
const rawOrigins = process.env.CLIENT_URLS || process.env.CLIENT_URL || process.env.FRONTEND_URL || "*";
const allowedOrigins = rawOrigins.includes(',') ? rawOrigins.split(',').map(o => o.trim()) : rawOrigins;

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Stocker io globalement pour l'utiliser dans les contrôleurs
global.io = io;

// Middleware to handle CORS
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Explicitly handle CORS preflight requests
app.options('*', cors({ origin: allowedOrigins }));

const PORT = process.env.PORT || 8000;

// Global DB status
let dbConnected = false;

async function start() {
  // Connect Database
  try {
    await connectDB();
    dbConnected = true;

    // Initialiser les conversations par défaut
    await initializeDefaultConversations();
    console.log("Conversations par défaut initialisées");
  } catch (err) {
    console.error("________________________________________________________________");
    console.error("CRITICAL: Database connection failed. Server will start anyway.");
    console.error("Error details:", err.message);
    console.error("Hint: Check your MongoDB Atlas whitelist (Network Access).");
    console.error("________________________________________________________________");
    dbConnected = false;
  }

  // Start Server (even if DB failed, so we can see the error page)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server ready for chat connections`);
    console.log(`API available at: http://localhost:${PORT}/api`);
    console.log(`Socket.io available at: http://localhost:${PORT}/socket.io`);
  });
}

// Middleware
app.use(express.json());

// Health check and root route
// Health check and root route
app.get("/", (req, res) => {
  res.json({
    message: "Wealth Planning API is running",
    status: dbConnected ? "active" : "db_connection_error",
    dbStatus: dbConnected ? "Connected" : "Disconnected",
    environment: process.env.NODE_ENV || "production",
    documentation: "Please use /api endpoints",
    tip: !dbConnected ? "Check server logs for MongoDB connection error. Only whitelisted IPs can connect." : undefined
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/weekly-updates", weeklyUpdateRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Configuration Socket.io pour le chat
// userId -> Set(socketId)
const connectedUsers = new Map();
const jwt = require('jsonwebtoken');

// Middleware d'authentification Socket.io
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    // Vérifier le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.user = decoded;

    // Stocker la connexion utilisateur (multi-onglets)
    const set = connectedUsers.get(decoded.id) || new Set();
    set.add(socket.id);
    connectedUsers.set(decoded.id, set);

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication failed'));
  }
});

function broadcastOnlineUsers() {
  try {
    io.emit('onlineUsers', Array.from(connectedUsers.keys()).map(String));
  } catch (e) {
    console.error('Error broadcasting online users:', e);
  }
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  broadcastOnlineUsers();

  // Joindre une conversation
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  // Quitter une conversation
  socket.on('leaveConversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`User ${socket.id} left conversation ${conversationId}`);
  });

  // Les messages sont gérés via l'API REST (pas besoin d'événement Socket.io séparé)
  // L'émission se fait directement dans le controller sendMessage

  // Typing indicator
  socket.on('typing', (data) => {
    const { conversationId, userName } = data;
    socket.to(conversationId).emit('userTyping', {
      userName,
      conversationId
    });
  });

  socket.on('stopTyping', (data) => {
    const { conversationId } = data;
    socket.to(conversationId).emit('userStopTyping', { conversationId });
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Nettoyer les connexions
    const userId = socket.userId;
    if (userId && connectedUsers.has(userId)) {
      const set = connectedUsers.get(userId);
      if (set && typeof set.delete === 'function') {
        set.delete(socket.id);
        if (set.size === 0) connectedUsers.delete(userId);
        else connectedUsers.set(userId, set);
      }
    }
    broadcastOnlineUsers();
  });
});

// Global Error Handler to prevent process crashes from unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception thrown:', err);
  // Optional: Graceful shutdown if needed, but for SMTP we might want to stay alive
});

start().catch((err) => {
  console.error("[startup] Failed to start server:", err);
  process.exit(1);
});
