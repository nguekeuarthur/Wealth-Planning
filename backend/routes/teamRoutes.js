const express = require("express");
const {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember
} = require("../controllers/teamController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes for teams
router.route("/")
  .get(getTeams)      // GET /api/teams - Get all teams
  .post(createTeam);  // POST /api/teams - Create a new team

router.route("/:id")
  .get(getTeamById)   // GET /api/teams/:id - Get team by ID
  .put(updateTeam)    // PUT /api/teams/:id - Update team
  .delete(deleteTeam); // DELETE /api/teams/:id - Delete team

// Routes for team members
router.route("/:id/members")
  .post(addMember);   // POST /api/teams/:id/members - Add member to team

router.route("/:id/members/:userId")
  .delete(removeMember); // DELETE /api/teams/:id/members/:userId - Remove member from team

module.exports = router;