const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get all users (Admin only)
router.get("/:id", protect, getUserById); // Get a specific user
router.post("/", protect, adminOnly, createUser); // Create a new user (Admin only)
router.put("/:id", protect, adminOnly, updateUser); // Update user (Admin only)
router.delete("/:id", protect, adminOnly, deleteUser); // Delete user (Admin only)

module.exports = router;
