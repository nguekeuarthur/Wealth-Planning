const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc    Get all users (Admin only)
// @route   GET /api/users/
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");
    
    console.log(`Found ${users.length} members in database`);

    // Add task counts to each user
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc, // Include all existing user data
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.json({ users: usersWithTaskCounts });
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new user (client)
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phoneNumber,
      company,
      address,
      website,
      logoUrl,
      companySize,
      industry,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "member",
      phoneNumber,
      company,
      address,
      website,
      logoUrl,
      companySize,
      industry,
    });

    // Return user without password
    const userWithoutPassword = await User.findById(user._id).select("-password");
    res.status(201).json({ message: "User created successfully", user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user details
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      company,
      address,
      website,
      logoUrl,
      companySize,
      industry,
    } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (company !== undefined) user.company = company;
    if (address !== undefined) user.address = address;
    if (website !== undefined) user.website = website;
    if (logoUrl !== undefined) user.logoUrl = logoUrl;
    if (companySize !== undefined) user.companySize = companySize;
    if (industry !== undefined) user.industry = industry;

    const updatedUser = await user.save();
    const userWithoutPassword = await User.findById(updatedUser._id).select("-password");
    
    res.json({ message: "User updated successfully", user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
