const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc    Get all users (Admin only)
// @route   GET /api/users/
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .populate('teams', 'name color department');
    
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

    // Créer une trace de l'utilisateur supprimé
    const DeletedUser = require("../models/DeletedUser");
    const deletedUserTrace = new DeletedUser({
      originalUserId: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      phoneNumber: user.phoneNumber,
      birthDate: user.birthDate,
      nationality: user.nationality,
      nationality2: user.nationality2,
      gender: user.gender,
      role: user.role,
      company: user.company,
      address: user.address,
      website: user.website,
      companySize: user.companySize,
      industry: user.industry,
      contactName: user.contactName,
      companyEmail: user.companyEmail,
      companyPhone: user.companyPhone,
      status: user.status,
      notes: user.notes,
      organizationName: user.organizationName,
      position: user.position,
      professionalPhone: user.professionalPhone,
      professionalEmail: user.professionalEmail,
      professionalAddress: user.professionalAddress,
      specialization: user.specialization,
      experience: user.experience,
      deletedBy: req.user.id, // ID de l'admin qui supprime
      deletionReason: req.body.reason || "Supprimé par l'administrateur"
    });

    await deletedUserTrace.save();

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully",
      traceCreated: true
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get deleted users (Admin only)
// @route   GET /api/users/deleted
// @access  Private (Admin)
const getDeletedUsers = async (req, res) => {
  try {
    const DeletedUser = require("../models/DeletedUser");
    const deletedUsers = await DeletedUser.find({})
      .sort({ deletedAt: -1 }) // Plus récent en premier
      .limit(50); // Limiter aux 50 plus récents

    res.json({ users: deletedUsers });
  } catch (error) {
    console.error("Error fetching deleted users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get distinct company names for autocomplete
// @route   GET /api/users/companies
// @access  Private (Authenticated users)
const getCompanyNames = async (req, res) => {
  try {
    // Récupérer les détails complets des entreprises
    const companyDetails = await User.aggregate([
      {
        $match: {
          company: { $exists: true, $ne: null, $ne: '' },
          role: 'client'
        }
      },
      {
        $group: {
          _id: { $toLower: '$company' }, // Grouper par nom en minuscules pour éviter les doublons
          name: { $first: '$company' },
          industry: { $first: '$industry' },
          address: { $first: '$address' },
          website: { $first: '$website' },
          companyEmail: { $first: '$companyEmail' },
          companyPhone: { $first: '$companyPhone' },
          companySize: { $first: '$companySize' },
          notes: { $first: '$notes' },
          employeeCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          industry: 1,
          address: 1,
          website: 1,
          companyEmail: 1,
          companyPhone: 1,
          companySize: 1,
          notes: 1,
          employeeCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      companies: companyDetails
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des entreprises:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// @desc    Clean up orphaned deleted users (for fixing database inconsistencies)
// @route   POST /api/users/cleanup-deleted
// @access  Private (Admin only)
const cleanupDeletedUsers = async (req, res) => {
  try {
    const { dryRun = true } = req.body; // Par défaut, mode simulation

    const DeletedUser = require("../models/DeletedUser");
    const deletedUsers = await DeletedUser.find({});
    let cleaned = 0;
    let errors = [];

    for (const deletedUser of deletedUsers) {
      try {
        // Vérifier si l'utilisateur original existe encore
        const originalUser = await User.findById(deletedUser.originalUserId);

        if (originalUser) {
          // L'utilisateur existe encore, il n'a pas été supprimé correctement
          if (!dryRun) {
            await User.findByIdAndDelete(deletedUser.originalUserId);
            console.log(`[CLEANUP] Deleted orphaned user: ${originalUser.email}`);
            cleaned++;
          } else {
            console.log(`[CLEANUP][DRY-RUN] Would delete orphaned user: ${originalUser.email}`);
            cleaned++;
          }
        }
      } catch (error) {
        errors.push(`Error processing ${deletedUser.email}: ${error.message}`);
      }
    }

    res.json({
      message: dryRun ? "Simulation terminée" : "Nettoyage terminé",
      cleaned,
      errors,
      dryRun
    });
  } catch (error) {
    console.error("Error during cleanup:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, getDeletedUsers, getCompanyNames, cleanupDeletedUsers };
