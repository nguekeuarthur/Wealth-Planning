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

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create new user
    const user = await User.create({
      name,
      email: normalizedEmail,
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
    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use by another account" });
      }
      user.email = normalizedEmail;
    }
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

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    console.log('🔍 Search users called with query:', q, 'by user:', req.user?._id);
    console.log('👤 User details:', req.user);

    if (!q || q.length < 2) {
      console.log('❌ Query too short, returning empty array');
      return res.json({ users: [] });
    }

    const searchRegex = new RegExp(q, 'i');
    console.log('🔎 Search regex:', searchRegex);

    // D'abord, compter tous les utilisateurs actifs (pour debug)
    const totalUsers = await User.countDocuments({});
    const allUsers = await User.find({}).select('name email');
    console.log('📊 Total users in database:', totalUsers);
    console.log('👥 All users in DB:', allUsers.map(u => ({ name: u.name, email: u.email })));

    // Essayer une recherche plus simple d'abord
    console.log('🔍 Testing simple name search...');
    const nameMatches = await User.find({
      name: searchRegex
    }).select('name email profileImageUrl role');

    console.log('📝 Name matches:', nameMatches.length, nameMatches.map(u => u.name));

    console.log('🔍 Testing email search...');
    const emailMatches = await User.find({
      email: searchRegex
    }).select('name email profileImageUrl role');

    console.log('📧 Email matches:', emailMatches.length, emailMatches.map(u => u.email));

    // Recherche complète
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // Exclure l'utilisateur actuel
        {
          $or: [
            { name: searchRegex },
            { email: searchRegex }
          ]
        }
      ]
    })
      .select('name email profileImageUrl role')
      .limit(parseInt(limit))
      .sort({ name: 1 });

    console.log('✅ Found users matching query:', users.length);
    console.log('👤 Matching users:', users.map(u => ({ name: u.name, email: u.email })));

    res.json({ users });
  } catch (error) {
    console.error("❌ Error searching users:", error);
    console.error("🚨 Error details:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Debug: Get all users (without admin restriction)
// @route   GET /api/users/debug
// @access  Private
const getAllUsersDebug = async (req, res) => {
  try {
    // Obtenir tous les utilisateurs sans aucun filtre
    const allUsers = await User.find({})
      .select('name email role deleted')
      .sort({ name: 1 });

    // Utilisateurs actifs (par défaut tous ceux qui sont en base, ou filtrer par status si nécessaire)
    const activeUsers = await User.find({ status: { $ne: 'inactive' } })
      .select('name email role deleted')
      .sort({ name: 1 });

    console.log('🔍 DEBUG: All users in database:', allUsers.length);
    console.log('📊 DEBUG: Active users:', activeUsers.length);

    res.json({
      totalUsersInDB: allUsers.length,
      activeUsers: activeUsers.length,
      currentUser: req.user,
      allUsers: allUsers,
      activeUsersList: activeUsers
    });
  } catch (error) {
    console.error("Error in debug:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Seed test users
// @route   POST /api/users/seed
// @access  Private (Admin only)
const seedUsers = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');

    const testUsers = [
      {
        name: 'Alice Dupont',
        email: 'alice@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'client'
      },
      {
        name: 'Bob Martin',
        email: 'bob@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'collaborator'
      },
      {
        name: 'Claire Bernard',
        email: 'claire@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'partner'
      },
      {
        name: 'David Petit',
        email: 'david@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'client'
      }
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = await User.create(userData);
        createdUsers.push({ name: user.name, email: user.email, role: user.role });
      }
    }

    res.json({
      message: `${createdUsers.length} test users created`,
      users: createdUsers
    });
  } catch (error) {
    console.error("Error seeding users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, getDeletedUsers, getCompanyNames, cleanupDeletedUsers, searchUsers, getAllUsersDebug, seedUsers };
