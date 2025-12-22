const Task = require("../models/Task");

// @desc    Get all tasks (Admin: all, User: only assigned tasks, Client: all tasks of their projects in read-only)
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

    let countFilter = { ...filter };

    if (req.user.role === "admin") {
      // Admin sees everything
    } else if (req.user.role === "collaborator") {
      const Project = require("../models/Project");
      const userProjects = await Project.find({ assignedUsers: req.user._id }).select("_id");
      const projectIds = userProjects.map(p => p._id);
      // Pour les collaborateurs, si un projet spécifique est demandé, on le respecte
      // Sinon on montre tous les projets auxquels ils ont accès
      if (project) {
        countFilter.project = project; // Respecte le projet demandé
      } else {
        countFilter.project = { $in: projectIds };
      }
    } else if (req.user.role === "client") {
      const Project = require("../models/Project");
      const userProjects = await Project.find({ client: req.user._id }).select("_id");
      const projectIds = userProjects.map(p => p._id);
      // Pour les clients, si un projet spécifique est demandé, on le respecte
      if (project) {
        countFilter.project = project; // Respecte le projet demandé
      } else {
        countFilter.project = { $in: projectIds };
      }
    } else if (req.user.role === "partner") {
      const Project = require("../models/Project");
      const userProjects = await Project.find({ assignedUsers: req.user._id }).select("_id");
      const projectIds = userProjects.map(p => p._id);
      // Pour les partenaires, si un projet spécifique est demandé, on le respecte
      if (project) {
        countFilter.project = project; // Respecte le projet demandé
      } else {
        countFilter.project = { $in: projectIds };
      }
    } else {
      // Pour les membres, on combine le filtre projet avec assignedTo
      countFilter.assignedTo = req.user._id;
      // Le filtre project est déjà dans countFilter via filter
    }

    // 1. Fetching tasks
    let tasksQuery = Task.find(countFilter)
      .populate("assignedTo", "name email profileImageUrl role")
      .populate("project", "name");

    tasks = await tasksQuery;

    // Filter assignedTo for privacy based on roles
    tasks = tasks.map(task => {
      const taskObj = task.toObject();
      if (taskObj.assignedTo && Array.isArray(taskObj.assignedTo)) {
        if (req.user.role === 'collaborator' || req.user.role === 'client') {
          taskObj.assignedTo = taskObj.assignedTo.filter(user => user.role !== 'partner');
        } else if (req.user.role === 'partner') {
          taskObj.assignedTo = taskObj.assignedTo.filter(user => user.role !== 'client');
        }
      }
      return taskObj;
    });

    // Add completed todoChecklist count
    tasks = tasks.map(task => {
      const completedCount = (task.todoChecklist || []).filter(item => item.completed).length;
      return { ...task, completedTodoCount: completedCount };
    });

    // 2. Status counts
    const allTasksCount = await Task.countDocuments(countFilter);
    const pendingTasks = await Task.countDocuments({ ...countFilter, status: "Pending" });
    const inProgressTasks = await Task.countDocuments({ ...countFilter, status: "In Progress" });
    const completedTasks = await Task.countDocuments({ ...countFilter, status: "Completed" });

    res.json({
      tasks,
      statusSummary: {
        all: allTasksCount,
        pendingTasks,
        inProgressTasks,
        completedTasks
      }
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
    let task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email profileImageUrl role")
      .populate("project", "name client");

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Vérifier les permissions pour les clients
    if (req.user.role === "client") {
      const Project = require("../models/Project");
      const project = await Project.findById(task.project._id);

      if (!project || project.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Accès refusé" });
      }

      // Filtrer les assignedTo pour ne pas montrer les partenaires aux clients
      const taskObj = task.toObject();
      if (taskObj.assignedTo && Array.isArray(taskObj.assignedTo)) {
        taskObj.assignedTo = taskObj.assignedTo.filter(user => user.role !== 'partner');
      }
      return res.json(taskObj);
    } else if (req.user.role === "partner") {
      const Project = require("../models/Project");
      const project = await Project.findById(task.project._id);

      // Vérifier que le partenaire est assigné au projet
      if (!project || !project.assignedUsers.some(userId => userId.toString() === req.user._id.toString())) {
        return res.status(403).json({ message: "Accès refusé" });
      }

      // Filtrer les assignedTo pour ne pas montrer les clients aux partenaires
      const taskObj = task.toObject();
      if (taskObj.assignedTo && Array.isArray(taskObj.assignedTo)) {
        taskObj.assignedTo = taskObj.assignedTo.filter(user => user.role !== 'client');
      }
      return res.json(taskObj);
    }

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

    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email profileImageUrl');

    if (global.io) {
      global.io.emit('taskCreated', populatedTask);
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

    const populatedTask = await Task.findById(updatedTask._id).populate('assignedTo', 'name email profileImageUrl');

    if (global.io) {
      global.io.emit('taskUpdated', populatedTask);
    }

    res.json({ message: "Task updated successfully", task: populatedTask });
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

    if (global.io) {
      global.io.emit('taskDeleted', task._id);
    }

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
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Vérifier les autorisations
    let isAuthorized = false;

    if (req.user.role === "admin" || req.user.role === "collaborator") {
      isAuthorized = true;
    } else if (req.user.role === "client") {
      // Les clients peuvent mettre à jour les tâches de leurs projets
      const Project = require('../models/Project');
      const project = await Project.findById(task.project._id || task.project);

      if (project && (
        project.client?.toString() === req.user._id.toString() ||
        project.assignedUsers?.some(userId => userId.toString() === req.user._id.toString())
      )) {
        isAuthorized = true;
      }
    } else if (req.user.role === "partner") {
      // Les partenaires peuvent mettre à jour UNIQUEMENT les tâches qui leur sont assignées personnellement
      const Project = require('../models/Project');
      const project = await Project.findById(task.project._id || task.project);

      // Le partenaire doit être assigné au projet ET à la tâche spécifique
      const isAssignedToProject = project && project.assignedUsers?.some(userId => userId.toString() === req.user._id.toString());
      const isAssignedToTask = task.assignedTo?.some(userId => userId.toString() === req.user._id.toString());

      if (isAssignedToProject && isAssignedToTask) {
        isAuthorized = true;
      }
    } else {
      // Pour les autres rôles, vérifier s'ils sont assignés à la tâche
      isAuthorized = task.assignedTo.some(
        (userId) => userId.toString() === req.user._id.toString()
      );
    }

    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized to update this task" });
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

    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email profileImageUrl');

    if (global.io) {
      global.io.emit('taskUpdated', populatedTask);
    }

    res.json({ message: "Task status updated", task: populatedTask });
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

    if (global.io) {
      global.io.emit('taskUpdated', updatedTask);
    }

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
