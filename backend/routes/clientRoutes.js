const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { 
  getClients, 
  getClientById, 
  createClient, 
  updateClient, 
  deleteClient 
} = require("../controllers/clientController");

const router = express.Router();

// Client Management Routes
router.get("/", protect, adminOnly, getClients); // Get all clients (Admin only)
router.get("/:id", protect, getClientById); // Get a specific client
router.post("/", protect, adminOnly, createClient); // Create a new client (Admin only)
router.put("/:id", protect, adminOnly, updateClient); // Update client (Admin only)
router.delete("/:id", protect, adminOnly, deleteClient); // Delete client (Admin only)

module.exports = router;
