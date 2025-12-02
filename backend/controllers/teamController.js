const Team = require("../models/Team");
const User = require("../models/User");

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private (Admin)
const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ isActive: true })
      .populate('leader', 'name email profileImageUrl')
      .populate('members', 'name email profileImageUrl role')
      .sort({ createdAt: -1 });

    console.log(`Found ${teams.length} teams in database`);

    res.json({ teams });
  } catch (error) {
    console.error("Error in getTeams:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Private
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'name email profileImageUrl phoneNumber')
      .populate('members', 'name email profileImageUrl role phoneNumber');

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json({ team });
  } catch (error) {
    console.error("Error in getTeamById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private (Admin)
const createTeam = async (req, res) => {
  try {
    const { name, description, leader, members, company, department, color } = req.body;

    // Validate required fields
    if (!name || !leader) {
      return res.status(400).json({ message: "Team name and leader are required" });
    }

    // Check if leader exists
    const leaderUser = await User.findById(leader);
    if (!leaderUser) {
      return res.status(404).json({ message: "Leader not found" });
    }

    // Check if team name already exists
    const existingTeam = await Team.findOne({ name: name.trim() });
    if (existingTeam) {
      return res.status(400).json({ message: "Team name already exists" });
    }

    // Validate members if provided
    if (members && members.length > 0) {
      const memberUsers = await User.find({ _id: { $in: members } });
      if (memberUsers.length !== members.length) {
        return res.status(400).json({ message: "One or more members not found" });
      }
    }

    // Create the team
    const team = new Team({
      name: name.trim(),
      description: description?.trim(),
      leader,
      members: members || [],
      company: company?.trim(),
      department: department || "OTHER",
      color: color || "#5a8f6f"
    });

    await team.save();

    // Synchronize team reference on users (leader + members)
    if (team.members && team.members.length > 0) {
      await User.updateMany(
        { _id: { $in: team.members } },
        { $addToSet: { teams: team._id } }
      );
    }

    // Populate the created team
    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email profileImageUrl')
      .populate('members', 'name email profileImageUrl role');

    console.log(`Team "${team.name}" created successfully`);
    res.status(201).json({
      message: "Team created successfully",
      team: populatedTeam
    });
  } catch (error) {
    console.error("Error in createTeam:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private (Admin)
const updateTeam = async (req, res) => {
  try {
    const { name, description, leader, members, company, department, color, isActive } = req.body;

    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if leader exists if provided
    if (leader) {
      const leaderUser = await User.findById(leader);
      if (!leaderUser) {
        return res.status(404).json({ message: "Leader not found" });
      }
    }

    // Check if team name already exists (excluding current team)
    if (name && name.trim() !== team.name) {
      const existingTeam = await Team.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id }
      });
      if (existingTeam) {
        return res.status(400).json({ message: "Team name already exists" });
      }
    }

    // Validate members if provided
    if (members && members.length > 0) {
      const memberUsers = await User.find({ _id: { $in: members } });
      if (memberUsers.length !== members.length) {
        return res.status(400).json({ message: "One or more members not found" });
      }
    }

    // Update team
    team.name = name?.trim() || team.name;
    team.description = description?.trim() || team.description;
    team.leader = leader || team.leader;
    team.members = members || team.members;
    team.company = company?.trim() || team.company;
    team.department = department || team.department;
    team.color = color || team.color;
    if (typeof isActive === 'boolean') {
      team.isActive = isActive;
    }

    await team.save();

    // Synchronize team reference on users (leader + members)
    // 1) Remove this team from all users who had it
    await User.updateMany(
      { teams: team._id },
      { $pull: { teams: team._id } }
    );

    // 2) Add this team to all current members (including leader)
    if (team.members && team.members.length > 0) {
      await User.updateMany(
        { _id: { $in: team.members } },
        { $addToSet: { teams: team._id } }
      );
    }

    // Populate the updated team
    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email profileImageUrl')
      .populate('members', 'name email profileImageUrl role');

    console.log(`Team "${team.name}" updated successfully`);
    res.json({
      message: "Team updated successfully",
      team: populatedTeam
    });
  } catch (error) {
    console.error("Error in updateTeam:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private (Admin)
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Soft delete - set isActive to false
    team.isActive = false;
    await team.save();

    // Update users to remove team reference from teams array
    await User.updateMany(
      { teams: req.params.id },
      { $pull: { teams: req.params.id } }
    );

    console.log(`Team "${team.name}" deactivated successfully`);
    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTeam:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private (Admin)
const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already in the team
    if (team.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member of this team" });
    }

    // Add member to team
    team.members.push(userId);
    await team.save();

    // Add team to user's teams array
    if (!user.teams.includes(team._id)) {
      user.teams.push(team._id);
      await user.save();
    }

    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email profileImageUrl')
      .populate('members', 'name email profileImageUrl role');

    console.log(`User "${user.name}" added to team "${team.name}"`);
    res.json({
      message: "Member added successfully",
      team: populatedTeam
    });
  } catch (error) {
    console.error("Error in addMember:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private (Admin)
const removeMember = async (req, res) => {
  try {
    const { id: teamId, userId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is the leader
    if (team.leader.toString() === userId) {
      return res.status(400).json({ message: "Cannot remove team leader from team" });
    }

    // Check if user is in the team
    if (!team.members.includes(userId)) {
      return res.status(400).json({ message: "User is not a member of this team" });
    }

    // Remove member from team
    team.members = team.members.filter(member => member.toString() !== userId);
    await team.save();

    // Remove team from user's teams array
    user.teams = user.teams.filter(teamId => teamId.toString() !== team._id.toString());
    await user.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email profileImageUrl')
      .populate('members', 'name email profileImageUrl role');

    console.log(`User "${user.name}" removed from team "${team.name}"`);
    res.json({
      message: "Member removed successfully",
      team: populatedTeam
    });
  } catch (error) {
    console.error("Error in removeMember:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember
};
