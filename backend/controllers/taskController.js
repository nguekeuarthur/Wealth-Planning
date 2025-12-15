const Task = require("../models/Task");

// @desc    Get all tasks (Admin: all, User: only assigned tasks)
// @route   GET /api/tasks/
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, project } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (project) {
      filter.project = project;
    }

    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter)
        .populate("assignedTo", "name email profileImageUrl")
        .populate("project", "name");
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id })
        .populate("assignedTo", "name email profileImageUrl")
        .populate("project", "name");
    }

    // Add completed todoChecklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    // Status summary counts
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new task (Admin only)
// @route   POST /api/tasks/
// @access  Private (Admin)
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      todoChecklist,
      project,
      status
    } = req.body;

    // Parser assignedTo si c'est une string JSON
    let assignedTo = req.body.assignedTo;
    if (typeof assignedTo === 'string') {
      try {
        assignedTo = JSON.parse(assignedTo);
      } catch (e) {
        assignedTo = [];
      }
    }

    // Parser assignedRoles si c'est une string JSON
    let assignedRoles = req.body.assignedRoles;
    if (typeof assignedRoles === 'string') {
      try {
        assignedRoles = JSON.parse(assignedRoles);
      } catch (e) {
        assignedRoles = [];
      }
    }

    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo must be an array of user IDs" });
    }

    // Gérer les fichiers uploadés
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => `/uploads/${file.filename}`);
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      assignedRoles: assignedRoles || [],
      createdBy: req.user._id,
      todoChecklist,
      attachments,
      project,
      status: status || "Pending"
    });

    // Si la tâche est associée à un projet, l'ajouter au projet
    if (project) {
      const Project = require("../models/Project");
      await Project.findByIdAndUpdate(project, {
        $addToSet: { tasks: task._id }
      });
    }

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.status = req.body.status || task.status;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;

    // Gérer les nouveaux fichiers uploadés
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => `/uploads/${file.filename}`);
      task.attachments = [...task.attachments, ...newAttachments];
    }

    if (req.body.assignedTo) {
      let assignedTo = req.body.assignedTo;
      // Parser si c'est une string JSON
      if (typeof assignedTo === 'string') {
        try {
          assignedTo = JSON.parse(assignedTo);
        } catch (e) {
          assignedTo = [];
        }
      }

      if (!Array.isArray(assignedTo)) {
        return res
          .status(400)
          .json({ message: "assignedTo must be an array of user IDs" });
      }
      task.assignedTo = assignedTo;
    }

    if (req.body.assignedRoles !== undefined) {
      let assignedRoles = req.body.assignedRoles;
      // Parser si c'est une string JSON
      if (typeof assignedRoles === 'string') {
        try {
          assignedRoles = JSON.parse(assignedRoles);
        } catch (e) {
          assignedRoles = [];
        }
      }

      if (!Array.isArray(assignedRoles)) {
        return res
          .status(400)
          .json({ message: "assignedRoles must be an array" });
      }
      task.assignedRoles = assignedRoles;
    }

    const updatedTask = await task.save();
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a task (Admin only)
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if user is assigned to this task or is admin
    const isAssigned = task.assignedTo && (
      (Array.isArray(task.assignedTo) && task.assignedTo.some(
        (userId) => userId.toString() === req.user._id.toString()
      )) ||
      (!Array.isArray(task.assignedTo) && task.assignedTo.toString() === req.user._id.toString())
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const oldStatus = task.status;
    const newStatus = req.body.status;

    if (!newStatus) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Normalize status values coming from different frontends
    const normalizeStatus = (status) => {
      if (!status) return status;
      const raw = String(status).trim();
      const allowed = ["Pending", "In Progress", "Completed"];
      if (allowed.includes(raw)) return raw;

      const lowered = raw.toLowerCase();
      const map = {
        pending: "Pending",
        "in-progress": "In Progress",
        "in progress": "In Progress",
        completed: "Completed",
      };
      return map[lowered] || raw;
    };

    const normalizedStatus = normalizeStatus(newStatus);
    if (!["Pending", "In Progress", "Completed"].includes(normalizedStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    task.status = normalizedStatus;

    if (task.status === "Completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();

    // Mettre à jour automatiquement la progression du projet parent
    if (task.project && (oldStatus !== task.status)) {
      try {
        const Project = require('../models/Project');
        const project = await Project.findById(task.project);

        if (project) {
          // Récupérer toutes les tâches du projet
          const allTasks = await Task.find({ project: task.project });
          const totalTasks = allTasks.length;
          const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
          const calculatedCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          if (project.completion !== calculatedCompletion) {
            project.completion = calculatedCompletion;
            await project.save();
          }
        }
      } catch (projectError) {
        console.error("Error updating project progress:", projectError);
        // Ne pas échouer la mise à jour de la tâche si la mise à jour du projet échoue
      }
    }

    res.json({ message: "Task status updated", task });
  } catch (error) {
    console.error("Error in updateTaskStatus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update task checklist
// @route   PUT /api/tasks/:id/todo
// @access  Private
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update checklist" });
    }

    task.todoChecklist = todoChecklist; // Replace with updated checklist

    // Auto-update progress based on checklist completion
    const completedCount = task.todoChecklist.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoChecklist.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    // Auto-mark task as completed if all items are checked
    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();

    // Mettre à jour automatiquement la progression du projet parent
    if (task.project) {
      const Project = require('../models/Project');
      const project = await Project.findById(task.project).populate('tasks');

      if (project && project.tasks.length > 0) {
        const totalTasks = project.tasks.length;
        const completedTasks = project.tasks.filter(t => t.status === 'Completed').length;
        const calculatedCompletion = Math.round((completedTasks / totalTasks) * 100);

        if (project.completion !== calculatedCompletion) {
          project.completion = calculatedCompletion;
          await project.save();
        }
      }
    }

    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({ message: "Task checklist updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Dashboard Data (Admin only)
// @route   GET /api/tasks/dashboard-data
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    // Fetch statistics
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // Ensure all possible statuses are included
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); // Remove spaces for response keys
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks; // Add total count to taskDistribution

    // Ensure all priority levels are included
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Fetch recent 10 tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Dashboard Data (User-specific)
// @route   GET /api/tasks/user-dashboard-data
// @access  Private
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id; // Only fetch data for the logged-in user

    // Fetch statistics for user-specific tasks
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
    const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });


    // Task distribution by status
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;

    // Task distribution by priority
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Fetch recent 10 tasks for the logged-in user
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
