require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const taskRoutes = require("./routes/taskRoutes")
const reportRoutes = require("./routes/reportRoutes")
const projectRoutes = require("./routes/projectRoutes")
const documentRoutes = require("./routes/documentRoutes")
const invoiceRoutes = require("./routes/invoiceRoutes")
const messageRoutes = require("./routes/messageRoutes")
const appointmentRoutes = require("./routes/appointmentRoutes")
const weeklyUpdateRoutes = require("./routes/weeklyUpdateRoutes")
const formRoutes = require("./routes/formRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Request logging middleware (pour debug)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/weekly-updates", weeklyUpdateRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route non trouvée",
    path: req.path 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[ERROR]", {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    body: req.body
  });

  res.status(err.status || 500).json({
    message: err.message || "Une erreur s'est produite",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});