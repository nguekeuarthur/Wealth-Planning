const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getDashboardData, getUserDashboardData, getTaskById, getTasks, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require("../controllers/taskController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Task Management Routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks); // Get all tasks (Admin: all, User: assigned)
router.get("/:id", protect, getTaskById); // Get task by ID
router.post("/", protect, adminOnly, upload.array('attachments', 5), createTask); // Create a task with files (Admin only)
router.put("/:id", protect, upload.array('attachments', 5), updateTask); // Update task with files
router.delete("/:id", protect, adminOnly, deleteTask); // Delete a task (Admin only)
router.put("/:id/status", protect, updateTaskStatus); // Update task status
router.put("/:id/todo", protect, updateTaskChecklist); // Update task checklist

module.exports = router;
