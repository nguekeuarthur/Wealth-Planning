const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, createUser, updateUser, deleteUser, getDeletedUsers, getCompanyNames, cleanupDeletedUsers } = require("../controllers/userController");

const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get all users (Admin only)
router.get("/companies", protect, getCompanyNames); // Get company names for autocomplete (Authenticated users)
router.get("/deleted", protect, adminOnly, getDeletedUsers); // Get deleted users (Admin only)
router.get("/:id", protect, getUserById); // Get a specific user
router.post("/", protect, adminOnly, createUser); // Create a new user (Admin only)
router.put("/:id", protect, adminOnly, updateUser); // Update user (Admin only)
router.delete("/:id", protect, adminOnly, deleteUser); // Delete user (Admin only)
router.post("/cleanup-deleted", protect, adminOnly, cleanupDeletedUsers); // Clean up orphaned deleted users (Admin only)

module.exports = router;
