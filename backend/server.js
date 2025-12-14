const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

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
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Stocker io globalement pour l'utiliser dans les contrôleurs
global.io = io;

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 8000;

async function start() {
  // Connect Database
  await connectDB();

  // Initialiser les conversations par défaut
  await initializeDefaultConversations();
  console.log("Conversations par défaut initialisées");

  // Start Server (only after DB is ready)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server ready for chat connections`);
    console.log(`API available at: http://localhost:${PORT}/api`);
    console.log(`Socket.io available at: http://localhost:${PORT}/socket.io`);
  });
}

// Middleware
app.use(express.json());

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

// Configuration Socket.io pour le chat
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

    // Stocker la connexion utilisateur
    connectedUsers.set(decoded.id, socket.id);

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

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
    // Nettoyer les connexions si nécessaire
  });
});

start().catch((err) => {
  console.error("[startup] Failed to start server:", err);
  process.exit(1);
});
