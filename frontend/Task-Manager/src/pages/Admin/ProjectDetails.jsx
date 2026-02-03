import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import { getSession } from "../../utils/authStorage";
import {
  FiArrowLeft,
  FiCalendar,
  FiUser,
  FiUsers,
  FiFolder,
  FiMessageSquare,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFile,
  FiTrendingUp,
  FiActivity,
  FiAlertTriangle,
  FiPlus,
  FiShield,
  FiEdit,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiFlag
} from "react-icons/fi";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import ManageProjectTeamsModal from "../../components/ManageProjectTeamsModal";
import ManageProjectUsersModal from "../../components/ManageProjectUsersModal";
import CreateProjectTaskModal from "../../components/CreateProjectTaskModal";
import CreateProjectDocumentModal from "../../components/CreateProjectDocumentModal";
import CreateInvoiceModal from "../../components/CreateInvoiceModal";
import CreateProjectUpdateModal from "../../components/CreateProjectUpdateModal";
import AddWeeklyUpdateModal from "../../components/AddWeeklyUpdateModal";
import WeeklyUpdatesTimeline from "../../components/WeeklyUpdatesTimeline";
import AddMilestoneModal from "../../components/AddMilestoneModal";
import MilestonesList from "../../components/MilestonesList";
import TaskDetailsModal from "../../components/TaskDetailsModal";

const allTabs = [
  { id: "overview", label: "Vue d'ensemble", icon: FiFolder, roles: ["admin", "partner", "collaborator", "client"] },
  { id: "tasks", label: "Tâches", icon: FiCheckCircle, roles: ["admin", "partner", "collaborator", "client"] },
  { id: "milestones", label: "Jalons", icon: FiFlag, roles: ["admin", "partner", "collaborator", "client"] },
  { id: "documents", label: "Documents", icon: FiFileText, roles: ["admin", "partner", "collaborator", "client"] },
  { id: "invoices", label: "Finances", icon: FiDollarSign, roles: ["admin", "partner", "collaborator", "client"] }
];

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "in progress":
      return "bg-[#fff6ea] text-[#b76a28]";
    case "in review":
      return "bg-[#e8f0ff] text-[#2a4fa2]";
    case "done":
      return "bg-[#dff5e7] text-[#1e4029]";
    default:
      return "bg-[#f4f7f4] text-[#7a8b7f]";
  }
};

const getRoleLabel = (role) => {
  switch (role) {
    case 'admin': return 'Administrateur';
    case 'collaborator': return 'Collaborateur';
    case 'partner': return 'Partenaire';
    case 'member': return 'Membre';
    case 'client': return 'Client';
    case 'finance': return 'Finance';
    default: return role || '';
  }
};

const MetricCard = ({ icon, label, value, subtext }) => (
  <div className="bg-white p-4 rounded-2xl border border-[#dfe8e1] shadow-sm">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-[#f4f7f4] text-[#2d5f3f] text-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-[#7a8b7f]">
          {label}
        </p>
        <p className="text-xl font-semibold text-[#1e4029]">{value}</p>
        {subtext && (
          <p className="text-xs text-[#99aca2] mt-0.5">{subtext}</p>
        )}
      </div>
    </div>
  </div>
);

const EmptyState = ({ icon, title, subtitle }) => (
  <div className="bg-white rounded-2xl border border-[#dfe8e1] p-12 text-center text-[#7a8b7f]">
    <div className="text-5xl mb-4 opacity-40">{icon}</div>
    <h3 className="text-lg font-semibold text-[#1e4029] mb-2">{title}</h3>
    <p>{subtitle}</p>
  </div>
);

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showWeeklyUpdateModal, setShowWeeklyUpdateModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [expandedTeams, setExpandedTeams] = useState(new Set());
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [milestones, setMilestones] = useState([]);
  const [loadingMilestones, setLoadingMilestones] = useState(false);
  const [milestonesLoaded, setMilestonesLoaded] = useState(false);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('members'); // 'members' or 'teams' display toggle

  // Socket.io for real-time updates
  useEffect(() => {
    const { token } = getSession();
    const socket = io("http://localhost:8000", {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: {
        token: token
      }
    });

    socket.on("taskUpdated", (updatedTask) => {
      if (project && updatedTask.project.toString() === project._id.toString()) {
        setProject(prev => {
          if (!prev) return prev;

          const taskExists = (prev.tasks || []).some(t => t._id === updatedTask._id);
          let newTasks;
          if (taskExists) {
            newTasks = prev.tasks.map(t => t._id === updatedTask._id ? updatedTask : t);
          } else {
            newTasks = [...(prev.tasks || []), updatedTask];
          }
          return { ...prev, tasks: newTasks };
        });
      } else {
        // Project mismatch ignored
      }
    });

    socket.on("taskCreated", (newTask) => {
      if (project && newTask.project.toString() === project._id.toString()) {
        setProject(prev => {
          if (!prev) return prev;
          if ((prev.tasks || []).some(t => t._id === newTask._id)) return prev;
          return { ...prev, tasks: [...(prev.tasks || []), newTask] };
        });
      }
    });

    socket.on("taskDeleted", (taskId) => {
      if (project) {
        setProject(prev => {
          if (!prev) return prev;
          return { ...prev, tasks: prev.tasks.filter(t => t._id !== taskId) };
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [project?._id]);

  const handleTaskDragStart = (task) => {
    setDraggedTaskId(task._id);
  };

  const handleTaskDragEnd = () => {
    setDraggedTaskId(null);
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleStatusDrop = async (event, newStatus) => {
    event.preventDefault();
    if (!draggedTaskId) return;

    const normalizeTaskStatus = (status) => {
      if (!status) return "Pending";
      const s = String(status).trim().toLowerCase();
      const map = {
        pending: "Pending",
        todo: "Pending",
        "in progress": "In Progress",
        "in-progress": "In Progress",
        inprogress: "In Progress",
        completed: "Completed",
        complete: "Completed",
        done: "Completed",
      };
      return map[s] || status;
    };

    const formattedStatus = normalizeTaskStatus(newStatus);

    try {
      await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK_STATUS(draggedTaskId),
        { status: formattedStatus }
      );
      toast.success("Statut de la tâche mis à jour");

      setProject((prev) => {
        if (!prev) return prev;
        const updatedTasks = (prev.tasks || []).map((t) =>
          t?._id === draggedTaskId ? { ...t, status: formattedStatus } : t
        );
        const total = updatedTasks.length;
        const completed = updatedTasks.filter((t) => t?.status === "Completed").length;
        const completion = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { ...prev, tasks: updatedTasks, completion };
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la tâche:", error);
      toast.error(
        error.response?.data?.message ||
        "Impossible de mettre à jour le statut de la tâche"
      );
    } finally {
      setDraggedTaskId(null);
    }
  };

  // Helper pour rendre une carte de tâche, réutilisée dans les 3 colonnes
  const renderTaskCard = (task, { onDragStart, onDragEnd, isExpanded, onToggleExpand } = {}) => {
    const rawAssignees =
      task?.assignedTo ?? task?.assignedUsers ?? task?.assignees ?? [];
    const assignedUsers = Array.isArray(rawAssignees)
      ? rawAssignees
      : rawAssignees
        ? [rawAssignees]
        : [];

    const usersById = (() => {
      const map = new Map();

      const addUser = (u) => {
        if (!u || typeof u === "string") return;
        if (u._id) map.set(String(u._id), u);
      };

      addUser(project?.projectLead);
      (project?.assignedUsers || []).forEach(addUser);

      (project?.teams || []).forEach((team) => {
        addUser(team?.leader);
        (team?.members || []).forEach(addUser);
      });

      return map;
    })();

    const resolveUser = (u) => {
      if (!u) return null;
      if (typeof u === "string") return usersById.get(String(u)) || null;

      const hasIdentityFields =
        !!(u.name || u.fullName || u.email || u.firstName || u.lastName);

      if (!hasIdentityFields && u._id) {
        return usersById.get(String(u._id)) || u;
      }

      return u;
    };

    const getUserDisplayName = (u) => {
      const resolved = resolveUser(u);
      if (!resolved) return "Utilisateur";
      if (typeof resolved === "string") return "Utilisateur";

      const composedName = [resolved.firstName, resolved.lastName]
        .filter(Boolean)
        .join(" ");
      return (
        resolved.name ||
        resolved.fullName ||
        composedName ||
        resolved.email ||
        "Utilisateur"
      );
    };

    const getUserInitial = (u) => {
      const name = getUserDisplayName(u);
      return name?.trim()?.charAt(0)?.toUpperCase() || "U";
    };

    const assignedLabel =
      assignedUsers.length === 0
        ? "Non assignée"
        : assignedUsers.length === 1
          ? getUserDisplayName(assignedUsers[0])
          : `${assignedUsers
            .slice(0, 2)
            .map(getUserDisplayName)
            .join(", ")}${assignedUsers.length > 2 ? ` +${assignedUsers.length - 2}` : ""}`;

    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const isOverdue =
      dueDate && dueDate < new Date() && task.status !== "Completed";

    const handleTaskClick = (e) => {
      // Ne pas ouvrir le modal si on drag la tâche ou si on clique sur le bouton de détails
      if (e.defaultPrevented || e.target.closest('button')) return;
      setSelectedTask(task);
      setShowTaskDetailsModal(true);
    };

    return (
      <div
        draggable={!!onDragStart}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          onDragStart && onDragStart(task);
        }}
        onDragEnd={() => {
          onDragEnd && onDragEnd();
        }}
        onClick={handleTaskClick}
        className="p-5 border border-[#dfe8e1] rounded-2xl hover:border-[#5a8f6f]/40 hover:shadow-md transition-all bg-white cursor-pointer flex flex-col"
      >
        <div className="flex flex-col gap-3 flex-grow">
          {/* Header: title */}
          <div className="flex-1 min-w-0">
            <h4 className="text-[#1e4029] font-semibold text-base leading-tight line-clamp-2 break-words">
              {task.title || "Tâche sans titre"}
            </h4>
          </div>

        </div>

        {/* Toggle and Expanded content */}
        <div className="mt-4 pt-4 border-t border-dashed border-[#dfe8e1]">
          <button onClick={onToggleExpand} className="flex items-center justify-between w-full text-sm font-medium text-[#2d5f3f]">
            <span>{isExpanded ? "Masquer les détails" : "Voir les détails"}</span>
            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {isExpanded && (
            <div className="mt-3 text-sm text-[#4a5c52] space-y-3">
              {/* Priorité */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#2d5f3f]">Priorité :</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.priority === "Urgent"
                  ? "bg-red-100 text-red-700"
                  : task.priority === "High"
                    ? "bg-orange-100 text-orange-700"
                    : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                  {task.priority === "Urgent"
                    ? "Urgente"
                    : task.priority === "High"
                      ? "Haute"
                      : task.priority === "Medium"
                        ? "Moyenne"
                        : "Basse"}
                </span>
              </div>

              {/* Statut */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#2d5f3f]">Statut :</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${task.status === "Completed"
                  ? "bg-[#dff5e7] text-[#1e4029]"
                  : task.status === "In Progress"
                    ? "bg-[#fff6ea] text-[#b76a28]"
                    : "bg-[#f4f7f4] text-[#7a8b7f]"
                  }`}>
                  {task.status === "Completed"
                    ? "Terminée"
                    : task.status === "In Progress"
                      ? "En cours"
                      : "En attente"}
                </span>
              </div>

              {/* Assignés */}
              <div className="flex items-start gap-2">
                <span className="font-medium text-[#2d5f3f]">Assignés :</span>
                <div className="flex-1">
                  {assignedUsers.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {assignedUsers.map((user, idx) => (
                        <span key={idx} className="text-xs bg-[#e8f2ea] text-[#2d5f3f] px-2 py-1 rounded-md">
                          {getUserDisplayName(user)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-[#7a8b7f]">Non assignée</span>
                  )}
                </div>
              </div>

              {/* Date d’échéance */}
              {dueDate && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#2d5f3f]">Échéance :</span>
                  <span className={`text-xs ${isOverdue ? "text-red-600 font-medium" : "text-[#4a5c52]"}`}>
                    {dueDate.toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {isOverdue && " (en retard)"}
                  </span>
                </div>
              )}

              {/* Description */}
              <div>
                <span className="font-medium text-[#2d5f3f]">Description :</span>
                <p className="mt-1 whitespace-pre-wrap break-words text-[#4a5c52]">
                  {task.description || "Aucune description."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const fetchMilestones = useCallback(async () => {
    if (!id) return;
    try {
      setLoadingMilestones(true);
      const response = await axiosInstance.get(
        API_PATHS.MILESTONES.GET_BY_PROJECT(id)
      );
      setMilestones(response.data?.milestones || []);
      setMilestonesLoaded(true);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      toast.error("Impossible de charger les jalons");
    } finally {
      setLoadingMilestones(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (activeTab === "milestones" && !milestonesLoaded) {
      fetchMilestones();
    }
  }, [activeTab, milestonesLoaded, fetchMilestones]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.PROJECTS.GET_PROJECT_DETAILS.replace(":id", id)
      );
      setProject(response.data?.project || null);
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("Impossible de charger le projet");
    } finally {
      setLoading(false);
    }
  };

  const toggleTeam = (teamId) => {
    setExpandedTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else {
        newSet.add(teamId);
      }
      return newSet;
    });
  };

  const calculateProjectMetrics = (data) => {
    const totalTasks = data?.tasks?.length || 0;
    const completedTasks =
      data?.tasks?.filter((task) => task.status === "Completed").length || 0;
    const overdueTasks =
      data?.tasks?.filter((task) => {
        if (!task.dueDate || task.status === "Completed") return false;
        return new Date(task.dueDate) < new Date();
      }).length || 0;

    const totalTime =
      data?.tasks?.reduce((sum, task) => sum + (task.timeSpent || 0), 0) || 0;

    const budgetUsed =
      data?.invoices?.reduce((sum, invoice) => sum + (invoice.amount || 0), 0) ||
      0;

    const daysRemaining = data?.endDate
      ? Math.ceil((new Date(data.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      totalTime,
      budgetUsed,
      completion: data?.completion || 0,
      daysRemaining
    };
  };

  const metrics = useMemo(
    () => (project ? calculateProjectMetrics(project) : null),
    [project]
  );

  const smartTags = useMemo(() => {
    if (!metrics) return [];
    const tags = [];

    if (metrics.daysRemaining !== null) {
      if (metrics.daysRemaining < 0) {
        tags.push({ label: "En retard", color: "bg-red-100 text-red-600" });
      } else if (metrics.daysRemaining <= 7) {
        tags.push({ label: "Urgent", color: "bg-orange-100 text-orange-600" });
      }
    }

    if (metrics.overdueTasks > 0) {
      tags.push({
        label: `${metrics.overdueTasks} tâche(s) en retard`,
        color: "bg-red-100 text-red-600"
      });
    }

    if (metrics.completedTasks === metrics.totalTasks && metrics.totalTasks > 0) {
      tags.push({ label: "Prêt à livrer", color: "bg-green-100 text-green-600" });
    }

    return tags.slice(0, 3);
  }, [metrics]);

  const can = (permission) => {
    if (!user || !project) return false;
    if (user.role === "admin") return true;

    const isLead = project.projectLead?._id === user._id;
    const isAssigned = project.assignedUsers?.some(
      (member) => member._id === user._id
    );
    const isClient = project.client?._id === user._id;

    switch (permission) {
      case "view":
        return isLead || isAssigned || isClient || user.role === "collaborator";
      case "edit":
        return isLead || (isAssigned && project.status !== "done");
      case "finance":
        // Collaborateur ne peut PAS créer/modifier/supprimer les factures
        return isLead || user.role === "finance";
      case "team":
        return isLead;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Projects">
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5f3f] mx-auto"></div>
            <p className="mt-4 text-[#7a8b7f]">Chargement du projet...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout activeMenu="Projects">
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-[#1e4029] mb-2">
            Projet introuvable
          </h3>
          <button
            onClick={() => navigate("/admin/projects")}
            className="mt-4 flex items-center gap-2 text-[#2d5f3f] hover:text-[#1e4029]"
          >
            <FiArrowLeft /> Retour à la liste
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Projects">
      <div className="my-5 space-y-6">
        <div className="relative bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] rounded-2xl shadow-xl p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-48 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-24"></div>
          </div>

          {/* Badge de statut en haut à droite */}
          <div className="absolute top-6 right-6 z-10">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${getStatusBadgeClass(project.status)}`}>
              {project.status === "in progress"
                ? "En cours"
                : project.status === "in review"
                  ? "En revue"
                  : "Terminé"}
            </span>
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center justify-between">
            <div>
              <button
                onClick={() => navigate("/admin/projects")}
                className="inline-flex items-center gap-2 text-white/70 text-xs uppercase tracking-[0.2em]"
              >
                <FiArrowLeft /> Retour aux projets
              </button>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  {project.name}
                </h1>
                {smartTags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${tag.color}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>

              <p className="text-white/80 mt-2">
                {project.category || "Catégorie non définie"}
              </p>

              {project.description && (
                <p className="text-white/70 mt-4 max-w-2xl">
                  {project.description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-white/80 text-sm">
                <div>
                  <p className="text-white/60 text-xs uppercase">Client</p>
                  <p className="font-semibold">
                    {project.client?.company || project.client?.name || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase">
                    Chef de projet
                  </p>
                  <p className="font-semibold">
                    {project.projectLead?.name || project.projectLead?.email || "—"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {allTabs.filter(tab => tab.roles.includes(user?.role || "client")).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                  ? "bg-[#e6f0ea] text-[#1e4029]"
                  : "bg-white border border-[#dfe8e1] text-[#7a8b7f] hover:text-[#1e4029]"
                  }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid xl:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <MetricCard
                    icon={<FiCheckCircle />}
                    label="Tâches terminées"
                    value={`${metrics?.completedTasks || 0}/${metrics?.totalTasks || 0}`}
                  />
                  <MetricCard
                    icon={<FiClock />}
                    label="Jours restants"
                    value={
                      metrics?.daysRemaining !== null
                        ? metrics.daysRemaining
                        : "—"
                    }
                    subtext={
                      metrics?.daysRemaining !== null
                        ? metrics.daysRemaining < 0
                          ? "En retard"
                          : "Avant échéance"
                        : undefined
                    }
                  />
                  <MetricCard
                    icon={<FiTrendingUp />}
                    label="Progression"
                    value={`${metrics?.completion || 0}%`}
                  />
                  <MetricCard
                    icon={<FiAlertTriangle />}
                    label="Tâches en retard"
                    value={metrics?.overdueTasks || 0}
                  />
                </div>
                {/* Members / Teams panel - moved under metrics */}
                <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#1e4029] flex items-center gap-2">
                      <FiUsers /> {viewMode === 'members' ? `Membres (${(project.assignedUsers || []).length})` : `Équipes (${project.teams?.length || 0} équipe${project.teams?.length > 1 ? 's' : ''})`}
                    </h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setViewMode('members')}
                        className={`text-sm font-medium ${viewMode === 'members' ? 'text-white bg-[#2d5f3f] px-3 py-1 rounded' : 'text-[#2d5f3f] hover:text-[#1e4029]'}`}
                      >
                        Membres
                      </button>
                      <button
                        onClick={() => setViewMode('teams')}
                        className={`text-sm font-medium ${viewMode === 'teams' ? 'text-white bg-[#2d5f3f] px-3 py-1 rounded' : 'text-[#2d5f3f] hover:text-[#1e4029]'}`}
                      >
                        Équipes
                      </button>
                      {can("team") && (
                        <div className="flex gap-2">
                          <button onClick={() => setShowTeamsModal(true)} className="text-sm text-[#2d5f3f] hover:text-[#1e4029] font-medium">Gérer équipes</button>
                          <button onClick={() => setShowUsersModal(true)} className="text-sm text-[#2d5f3f] hover:text-[#1e4029] font-medium">Gérer membres</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {viewMode === 'members' ? (
                      <div>
                        {/* Project lead */}
                        {project.projectLead && (
                          <div className="p-3 border border-[#dfe8e1] rounded-xl flex items-center gap-3 bg-[#f4f7f4]">
                            {project.projectLead.profileImageUrl ? (
                              <img
                                src={project.projectLead.profileImageUrl.startsWith('http') ? project.projectLead.profileImageUrl : `http://localhost:8000${project.projectLead.profileImageUrl}`}
                                alt={project.projectLead.name || "Avatar"}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2d5f3f] font-semibold">{project.projectLead.name?.charAt(0).toUpperCase() || 'P'}</div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-[#1e4029]">{project.projectLead.name || project.projectLead.email || 'Chef de projet'}</p>
                              <p className="text-xs text-[#7a8b7f]">Chef de projet</p>
                            </div>
                          </div>
                        )}

                        {/* Assigned users */}
                        {(project.assignedUsers || []).length > 0 ? (
                          <div className="space-y-2 mt-3">
                            {(project.assignedUsers || []).
                              filter(u => !(project.projectLead && u._id && project.projectLead._id && u._id.toString() === project.projectLead._id.toString())).
                              filter(u => u.role !== 'admin').
                              map(userItem => (
                                <div key={userItem._id} className="flex items-center gap-3 p-3 border border-[#dfe8e1] rounded-lg bg-white">
                                  {userItem.profileImageUrl ? (
                                    <img src={userItem.profileImageUrl} alt={userItem.name} className="w-10 h-10 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#5a8f6f] flex items-center justify-center text-white font-medium">{(userItem.name || userItem.email || '').charAt(0).toUpperCase()}</div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#1e4029] truncate">{userItem.name || userItem.email}</p>
                                    <p className="text-xs text-[#7a8b7f]">{userItem.email} • <span className="font-medium">{getRoleLabel(userItem.role)}</span></p>
                                  </div>
                                  {can('team') && (
                                    <div>
                                      <button onClick={async () => {
                                        if (!window.confirm(`Retirer ${userItem.name || userItem.email} du projet ?`)) return;
                                        try {
                                          await axiosInstance.delete(API_PATHS.PROJECTS.REMOVE_USER_FROM_PROJECT(project._id, userItem._id));
                                          toast.success('Utilisateur retiré');
                                          fetchProjectDetails();
                                        } catch (err) {
                                          console.error(err);
                                          toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
                                        }
                                      }} className="text-xs text-red-600 hover:underline">Retirer</button>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-sm text-[#7a8b7f] text-center py-4">Aucun membre assigné. Cliquez sur "Gérer membres" pour ajouter.</p>
                        )}
                      </div>
                    ) : (
                      // Teams view reuses existing rendering
                      project.teams && project.teams.length > 0 ? (
                        project.teams.map((team) => {
                          const isExpanded = expandedTeams.has(team._id);
                          return (
                            <div key={team._id} className="border border-[#dfe8e1] rounded-xl bg-white overflow-hidden">
                              <button onClick={() => toggleTeam(team._id)} className="w-full p-4 flex items-center justify-between hover:bg-[#f4f7f4] transition-colors">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: team.color || '#5a8f6f' }}><FiUsers /></div>
                                  <div className="flex-1 text-left">
                                    <h4 className="font-semibold text-[#1e4029]">{team.name}</h4>
                                    {team.members && <p className="text-xs text-[#7a8b7f] mt-1">{team.members.filter(m => !(team.leader && m._id && team.leader._id && m._id.toString() === team.leader._id.toString())).length} membre{team.members.filter(m => !(team.leader && m._id && team.leader._id && m._id.toString() === team.leader._id.toString())).length > 1 ? 's' : ''}</p>}
                                  </div>
                                </div>
                                <div className="flex-shrink-0 ml-3">{isExpanded ? <FiChevronUp className="text-[#7a8b7f] w-5 h-5" /> : <FiChevronDown className="text-[#7a8b7f] w-5 h-5" />}</div>
                              </button>
                              {isExpanded && (
                                <div className="px-4 pb-4 pt-2 border-t border-[#dfe8e1] bg-[#fafafa]">
                                  {team.leader && (
                                    <div className="mb-4 p-3 bg-white rounded-lg border border-[#dfe8e1]">
                                      <div className="flex items-center gap-2 mb-2"><FiUser className="text-[#5a8f6f] text-sm" /><span className="text-xs text-[#7a8b7f] font-medium uppercase">Chef d'équipe</span></div>
                                      <div className="flex items-center gap-3">
                                        {team.leader.profileImageUrl ? <img src={team.leader.profileImageUrl} alt={team.leader.name} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white text-sm font-semibold">{team.leader.name?.charAt(0).toUpperCase() || 'L'}</div>}
                                        <div><p className="text-sm font-semibold text-[#1e4029]">{team.leader.name || team.leader.email}</p><p className="text-xs text-[#7a8b7f]">{team.leader.email}</p></div>
                                      </div>
                                    </div>
                                  )}
                                  {team.members && team.members.length > 0 && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-3"><FiUsers className="text-[#5a8f6f] text-sm" /><span className="text-xs text-[#7a8b7f] font-medium uppercase">Membres ({team.members.length})</span></div>
                                      <div className="space-y-2">
                                        {team.members.filter(member => !(team.leader && member._id && team.leader._id && member._id.toString() === team.leader._id.toString())).map((member) => (
                                          <div key={member._id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-[#dfe8e1] hover:border-[#5a8f6f]/30 transition-colors">
                                            {member.profileImageUrl ? <img src={member.profileImageUrl} alt={member.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" /> : <div className="w-8 h-8 bg-[#f4f7f4] rounded-full flex items-center justify-center text-[#2d5f3f] text-xs font-semibold flex-shrink-0">{member.name?.charAt(0).toUpperCase() || 'U'}</div>}
                                            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-[#1e4029] truncate">{member.name || 'Membre'}</p><p className="text-xs text-[#7a8b7f] truncate">{member.email} • <span className="font-medium">{member.role}</span></p></div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-[#7a8b7f] text-center py-4">Aucune équipe assignée. Cliquez sur "Gérer équipes" pour ajouter.</p>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm">
                {/* En-tête en haut, comptage global */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#7a8b7f]">
                      Vue par statut
                    </p>
                    <p className="text-sm text-[#7a8b7f]">
                      {project.tasks?.length || 0} tâches au total
                    </p>
                  </div>
                  {can("edit") && (
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2d5f3f] text-white rounded-xl text-sm font-medium hover:bg-[#1e4029] transition-colors"
                    >
                      <FiPlus /> Nouvelle tâche
                    </button>
                  )}
                </div>

                {project.tasks?.length ? (
                  <>
                    {/* Colonnes par catégorie */}
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {/* En attente */}
                      <div
                        className="bg-[#f9fbf9] rounded-2xl border border-[#e1ebe4] p-4 flex flex-col gap-3 min-h-[160px]"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleStatusDrop(e, "Pending")}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-[#1e4029]">
                            En attente
                          </h3>
                          <span className="text-xs text-[#7a8b7f]">
                            {
                              (project.tasks || []).filter(
                                (task) =>
                                  !task.status ||
                                  task.status === "Pending" ||
                                  task.status === "Todo" ||
                                  (task.status !== "Completed" &&
                                    task.status !== "In Progress")
                              ).length
                            }{" "}
                            tâche(s)
                          </span>
                        </div>
                        <div className="space-y-3">
                          {(project.tasks || [])
                            .filter(
                              (task) =>
                                !task.status ||
                                task.status === "Pending" ||
                                task.status === "Todo" ||
                                (task.status !== "Completed" &&
                                  task.status !== "In Progress")
                            )
                            .map((task) => (
                              <div key={task._id}>
                                {renderTaskCard(task, {
                                  onDragStart: handleTaskDragStart,
                                  onDragEnd: handleTaskDragEnd,
                                  isExpanded: expandedTasks.has(task._id),
                                  onToggleExpand: () => toggleTaskExpansion(task._id),
                                })}
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* En cours */}
                      <div
                        className="bg-[#fffaf2] rounded-2xl border border-[#f3e0c8] p-4 flex flex-col gap-3 min-h-[160px]"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleStatusDrop(e, "In Progress")}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-[#8a5a24]">
                            En cours
                          </h3>
                          <span className="text-xs text-[#b76a28]">
                            {
                              (project.tasks || []).filter(
                                (task) =>
                                  task.status === "In Progress" ||
                                  task.status === "in progress"
                              ).length
                            }{" "}
                            tâche(s)
                          </span>
                        </div>
                        <div className="space-y-3">
                          {(project.tasks || [])
                            .filter(
                              (task) =>
                                task.status === "In Progress" ||
                                task.status === "in progress"
                            )
                            .map((task) => (
                              <div key={task._id}>
                                {renderTaskCard(task, {
                                  onDragStart: handleTaskDragStart,
                                  onDragEnd: handleTaskDragEnd,
                                  isExpanded: expandedTasks.has(task._id),
                                  onToggleExpand: () => toggleTaskExpansion(task._id),
                                })}
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Terminée */}
                      <div
                        className="bg-[#f4faf6] rounded-2xl border border-[#d5ecde] p-4 flex flex-col gap-3 min-h-[160px]"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleStatusDrop(e, "Completed")}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-[#1e4029]">
                            Terminée
                          </h3>
                          <span className="text-xs text-[#4e7c59]">
                            {
                              (project.tasks || []).filter(
                                (task) =>
                                  task.status === "Completed" ||
                                  task.status === "completed"
                              ).length
                            }{" "}
                            tâche(s)
                          </span>
                        </div>
                        <div className="space-y-3">
                          {(project.tasks || [])
                            .filter(
                              (task) =>
                                task.status === "Completed"
                            )
                            .map((task) => (
                              <div key={task._id}>
                                {renderTaskCard(task, {
                                  onDragStart: handleTaskDragStart,
                                  onDragEnd: handleTaskDragEnd,
                                  isExpanded: expandedTasks.has(task._id),
                                  onToggleExpand: () => toggleTaskExpansion(task._id),
                                })}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Titre global en bas comme demandé */}
                    <div className="mt-6 pt-4 border-t border-dashed border-[#dfe8e1]">
                      <h3 className="text-xl font-semibold text-[#1e4029]">
                        Tâches du projet
                      </h3>
                      <p className="text-sm text-[#7a8b7f] mt-1">
                        Regroupez et suivez toutes les tâches par statut :{" "}
                        <span className="font-medium text-[#1e4029]">
                          En attente
                        </span>
                        ,{" "}
                        <span className="font-medium text-[#1e4029]">
                          En cours
                        </span>{" "}
                        et{" "}
                        <span className="font-medium text-[#1e4029]">
                          Terminée
                        </span>
                        .
                      </p>
                    </div>
                  </>
                ) : (
                  <EmptyState
                    icon="✅"
                    title="Aucune tâche"
                    subtitle="Créez votre première tâche pour ce projet."
                  />
                )}
              </div>
            )}

            {activeTab === "weeklyUpdates" && user?.role === "admin" && (
              <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e4029]">
                      Mises à jour hebdomadaires
                    </h3>
                    <p className="text-sm text-[#7a8b7f]">
                      {project.weeklyUpdates?.length || 0} note(s)
                    </p>
                  </div>
                  {can("edit") && (
                    <button
                      onClick={() => setShowWeeklyUpdateModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2d5f3f] text-white rounded-xl text-sm font-medium hover:bg-[#1e4029] transition-colors"
                    >
                      <FiPlus /> Ajouter une note
                    </button>
                  )}
                </div>

                {project.weeklyUpdates?.length ? (
                  <WeeklyUpdatesTimeline updates={project.weeklyUpdates} />
                ) : (
                  <EmptyState
                    icon="🗒️"
                    title="Aucune mise à jour"
                    subtitle="Ajoutez votre première note hebdomadaire pour informer les parties prenantes."
                  />
                )}
              </div>
            )}

            {activeTab === "milestones" && (
              <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e4029]">
                      Jalons du projet
                    </h3>
                    <p className="text-sm text-[#7a8b7f]">
                      {loadingMilestones
                        ? "Chargement..."
                        : `${milestones.length} jalon(s)`}
                    </p>
                  </div>
                  {can("edit") && (
                    <button
                      onClick={() => setShowMilestoneModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2d5f3f] text-white rounded-xl text-sm font-medium hover:bg-[#1e4029] transition-colors"
                    >
                      <FiPlus /> Ajouter un jalon
                    </button>
                  )}
                </div>

                {loadingMilestones ? (
                  <div className="py-12 text-center text-[#7a8b7f]">
                    Chargement des jalons...
                  </div>
                ) : milestones.length ? (
                  <MilestonesList milestones={milestones} />
                ) : (
                  <EmptyState
                    icon="📌"
                    title="Aucun jalon"
                    subtitle="Ajoutez un jalon pour structurer l'avancement du projet."
                  />
                )}
              </div>
            )}

            {activeTab === "documents" && (
              <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e4029]">
                      Documents
                    </h3>
                    <p className="text-sm text-[#7a8b7f]">
                      {project.documents?.length || 0} fichiers
                    </p>
                  </div>
                  {can("edit") && (
                    <button
                      onClick={() => setShowDocumentModal(true)}
                      className="px-4 py-2 text-sm bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-colors font-medium flex items-center gap-2"
                    >
                      <FiPlus /> Ajouter un document
                    </button>
                  )}
                </div>

                {project.documents?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.documents.map((doc) => {
                      const getTypeLabel = (type) => {
                        switch (type) {
                          case "contract": return "Contrat";
                          case "livrable": return "Livrable";
                          case "personal_data": return "Données personnelles";
                          default: return "Autre";
                        }
                      };

                      const getFileIcon = (fileType) => {
                        if (!fileType) return <FiFile />;
                        const ext = fileType.toLowerCase();
                        if (ext.includes('pdf')) return "📄";
                        if (ext.includes('image') || ['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return "🖼️";
                        if (['doc', 'docx'].includes(ext)) return "📝";
                        if (['xls', 'xlsx'].includes(ext)) return "📊";
                        return "📎";
                      };

                      return (
                        <div
                          key={doc._id}
                          className="p-4 border border-[#dfe8e1] rounded-2xl hover:border-[#5a8f6f]/40 transition-colors bg-white"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-[#f4f7f4] rounded-xl text-2xl flex-shrink-0">
                              {getFileIcon(doc.fileType)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-[#1e4029] mb-1 truncate">
                                {doc.name || "Document"}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-[#e6f0ea] text-[#2d5f3f] rounded text-xs font-medium">
                                  {getTypeLabel(doc.type)}
                                </span>
                                {doc.category && (
                                  <span className="text-xs text-[#7a8b7f]">
                                    {doc.category}
                                  </span>
                                )}
                              </div>
                              {doc.description && (
                                <p className="text-sm text-[#7a8b7f] mb-2 line-clamp-2">
                                  {doc.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-xs text-[#7a8b7f]">
                                  {doc.createdAt
                                    ? new Date(doc.createdAt).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })
                                    : "Date inconnue"}
                                </span>
                                {doc.fileUrl && (() => {
                                  const handleDownload = async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    try {
                                      // Utiliser l'endpoint de téléchargement avec authentification
                                      const response = await axiosInstance.get(
                                        `${API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(doc._id)}/download`,
                                        {
                                          responseType: 'blob'
                                        }
                                      );

                                      // Déterminer le type MIME à partir du type de fichier ou du Content-Type de la réponse
                                      const contentType = response.headers['content-type'] || doc.fileType || 'application/octet-stream';

                                      // Créer un blob avec le bon type MIME
                                      const blob = new Blob([response.data], { type: contentType });
                                      const url = window.URL.createObjectURL(blob);

                                      // Préserver l'extension du fichier dans le nom
                                      let fileName = doc.name || 'document';

                                      // S'assurer que le nom a la bonne extension
                                      if (doc.fileType) {
                                        const mimeToExt = {
                                          'application/pdf': '.pdf',
                                          'application/msword': '.doc',
                                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
                                          'application/vnd.ms-excel': '.xls',
                                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
                                          'application/vnd.ms-powerpoint': '.ppt',
                                          'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
                                          'image/jpeg': '.jpg',
                                          'image/png': '.png',
                                          'image/gif': '.gif',
                                          'text/plain': '.txt',
                                          'text/csv': '.csv'
                                        };

                                        // Vérifier si le nom a déjà une extension
                                        const hasExtension = /\.\w+$/.test(fileName);
                                        if (!hasExtension && mimeToExt[doc.fileType]) {
                                          fileName += mimeToExt[doc.fileType];
                                        } else if (!hasExtension) {
                                          // Essayer d'extraire l'extension du type MIME
                                          const extMatch = doc.fileType.match(/\/(\w+)$/);
                                          if (extMatch) {
                                            fileName += '.' + extMatch[1];
                                          }
                                        }
                                      }

                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = fileName;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      window.URL.revokeObjectURL(url);
                                    } catch (error) {
                                      console.error('Erreur lors du téléchargement:', error);
                                      toast.error('Erreur lors du téléchargement du fichier');
                                    }
                                  };

                                  return (
                                    <button
                                      onClick={handleDownload}
                                      className="px-3 py-1.5 bg-[#2d5f3f] text-white rounded-lg text-xs font-medium hover:bg-[#1e4029] transition-colors flex items-center gap-1.5"
                                    >
                                      <FiDownload size={14} /> Télécharger
                                    </button>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon="📄"
                    title="Aucun document"
                    subtitle="Ajoutez des contrats, rapports ou pièces jointes."
                  />
                )}
              </div>
            )}

            {activeTab === "invoices" && (
              <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e4029]">
                      Factures & paiements
                    </h3>
                    <p className="text-sm text-[#7a8b7f]">
                      {project.invoices?.length || 0} factures
                    </p>
                  </div>
                  {can("finance") && (
                    <button
                      onClick={() => {
                        setSelectedInvoice(null);
                        setShowInvoiceModal(true);
                      }}
                      className="px-4 py-2 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-colors font-medium flex items-center gap-2"
                    >
                      <FiPlus /> Créer une facture
                    </button>
                  )}
                </div>

                {project.invoices?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.invoices.map((invoice) => {
                      const getStatusLabel = (status) => {
                        const statusMap = {
                          'payée': 'Payée',
                          'en attente': 'En attente',
                          'à envoyer': 'À envoyer',
                          'partiellement payée': 'Partiellement payée',
                          'paiement reçu': 'Paiement reçu',
                          'non payée': 'Non payée'
                        };
                        return statusMap[status] || status;
                      };

                      const getStatusColor = (status) => {
                        switch (status) {
                          case 'payée':
                          case 'paiement reçu':
                            return 'bg-[#dff5e7] text-[#1e4029]';
                          case 'partiellement payée':
                            return 'bg-[#fff6ea] text-[#b76a28]';
                          case 'non payée':
                            return 'bg-[#ffe5e5] text-[#c34242]';
                          case 'en attente':
                            return 'bg-[#e8f0ff] text-[#2a4fa2]';
                          default:
                            return 'bg-[#f4f7f4] text-[#7a8b7f]';
                        }
                      };

                      return (
                        <div
                          key={invoice._id}
                          className="p-4 border border-[#dfe8e1] rounded-2xl hover:border-[#5a8f6f]/40 transition-colors bg-white"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-[#1e4029] mb-1">
                                {invoice.invoiceNumber || `Facture #${invoice._id.slice(-6)}`}
                              </h4>
                              {invoice.service && (
                                <p className="text-sm text-[#7a8b7f] mb-2">
                                  {invoice.service}
                                </p>
                              )}
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(invoice.status)}`}
                            >
                              {getStatusLabel(invoice.status)}
                            </span>
                          </div>

                          {invoice.description && (
                            <p className="text-sm text-[#7a8b7f] mb-3 line-clamp-2">
                              {invoice.description}
                            </p>
                          )}

                          {invoice.attachment?.path && (
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs text-[#7a8b7f] italic">
                                Pièce jointe disponible
                              </span>
                              <a
                                href={`${BASE_URL}${invoice.attachment.path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 text-xs bg-[#2d5f3f] text-white rounded-lg hover:bg-[#1e4029] transition-colors font-medium flex items-center gap-1.5"
                              >
                                <FiDownload size={14} /> Télécharger
                              </a>
                            </div>
                          )}

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#7a8b7f]">Montant:</span>
                              <span className="font-semibold text-[#1e4029]">
                                {invoice.amount
                                  ? `${invoice.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CHF`
                                  : "—"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#7a8b7f]">Émission:</span>
                              <span className="text-[#1e4029]">
                                {invoice.issueDate
                                  ? new Date(invoice.issueDate).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })
                                  : "—"}
                              </span>
                            </div>
                            {invoice.paidDate && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-[#7a8b7f]">Payée le:</span>
                                <span className="text-[#1e4029]">
                                  {new Date(invoice.paidDate).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            )}
                          </div>

                          {can("finance") && (
                            <div className="flex items-center gap-2 pt-3 border-t border-[#dfe8e1]">
                              <button
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setShowInvoiceModal(true);
                                }}
                                className="flex-1 px-3 py-1.5 text-xs bg-[#f4f7f4] text-[#2d5f3f] rounded-lg hover:bg-[#e6f0ea] transition-colors font-medium"
                              >
                                Modifier
                              </button>
                              <button
                                onClick={async () => {
                                  if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
                                    try {
                                      await axiosInstance.delete(API_PATHS.INVOICES.DELETE_INVOICE(invoice._id));
                                      toast.success('Facture supprimée avec succès');
                                      fetchProjectDetails();
                                    } catch (error) {
                                      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
                                    }
                                  }
                                }}
                                className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                              >
                                Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon="💶"
                    title="Aucune facture"
                    subtitle="Créez votre première facture pour ce projet."
                  />
                )}
              </div>
            )}

            {activeTab === "updates" && (
              <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e4029]">
                      Messages
                    </h3>
                    <p className="text-sm text-[#7a8b7f]">
                      {project.messages?.length || 0} note{project.messages?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {can("edit") && (
                    <button
                      onClick={() => setShowUpdateModal(true)}
                      className="px-4 py-2 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-colors font-medium flex items-center gap-2"
                    >
                      <FiPlus /> Ajouter une note
                    </button>
                  )}
                </div>

                {project.messages?.length ? (
                  <div className="space-y-4">
                    {project.messages.map((message) => {
                      const getTimeAgo = (date) => {
                        const now = new Date();
                        const messageDate = new Date(date);
                        const diffInSeconds = Math.floor((now - messageDate) / 1000);

                        if (diffInSeconds < 60) return "À l'instant";
                        if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
                        if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
                        if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;

                        return messageDate.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                        });
                      };

                      return (
                        <div
                          key={message._id}
                          className="p-4 border border-[#dfe8e1] rounded-2xl hover:border-[#5a8f6f]/40 transition-colors bg-white"
                        >
                          <div className="flex gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              {message.sender?.profileImageUrl ? (
                                <img
                                  src={message.sender.profileImageUrl}
                                  alt={message.sender.name || "Avatar"}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5a8f6f] to-[#2d5f3f] flex items-center justify-center text-white font-semibold">
                                  {(message.sender?.name || message.sender?.fullName || "U")?.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>

                            {/* Contenu */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-[#1e4029]">
                                    {message.sender?.name || message.sender?.fullName || "Utilisateur"}
                                  </p>
                                  {message.sender?.email && (
                                    <span className="text-xs text-[#7a8b7f]">
                                      ({message.sender.email})
                                    </span>
                                  )}
                                </div>
                                {message.createdAt && (
                                  <span className="text-xs text-[#7a8b7f] whitespace-nowrap">
                                    {getTimeAgo(message.createdAt)}
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-[#4a5c52] whitespace-pre-wrap break-words">
                                {message.content || message.text || "—"}
                              </p>

                              {/* Date complète au survol */}
                              {message.createdAt && (
                                <p className="text-xs text-[#7a8b7f] mt-2">
                                  {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon="💬"
                    title="Aucune note"
                    subtitle="Ajoutez des notes pour suivre l'avancement et documenter les décisions du projet."
                  />
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1e4029] flex items-center gap-2 mb-4">
                <FiUser /> Client
              </h3>
              {project.client ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-[#7a8b7f] text-xs uppercase mb-1">Entreprise</p>
                    <p className="font-semibold text-[#1e4029]">{project.client.company || project.client.name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[#7a8b7f] text-xs uppercase mb-1">Adresse</p>
                    <p className="text-[#4a8b7f]">{project.client.address || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[#7a8b7f] text-xs uppercase mb-1">Email</p>
                    <p className="text-[#4a8b7f] break-words">{project.client.email}</p>
                  </div>
                  {project.client.phoneNumber && (
                    <div>
                      <p className="text-[#7a8b7f] text-xs uppercase mb-1">Téléphone</p>
                      <p className="text-[#4a5c52]">{project.client.phoneNumber}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#7a8b7f]">Aucun client assigné.</p>
              )}
            </div>



            {/* Dates clés */}
            <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1e4029] flex items-center gap-2 mb-4">
                <FiCalendar /> Dates clés
              </h3>
              <div className="space-y-3">
                <div className="p-3 border border-[#dfe8e1] rounded-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#f4f7f4]">
                    <FiCalendar className="text-[#2d5f3f]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#7a8b7f] uppercase">Début</p>
                    <p className="text-sm font-semibold text-[#1e4029]">
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
                <div className="p-3 border border-[#dfe8e1] rounded-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#fff6ea]">
                    <FiClock className="text-[#b76a28]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#7a8b7f] uppercase">Fin</p>
                    <p className="text-sm font-semibold text-[#1e4029]">
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Manage Teams Modal */}
      {project && (
        <ManageProjectTeamsModal
          isOpen={showTeamsModal}
          onClose={() => setShowTeamsModal(false)}
          project={project}
          onUpdate={fetchProjectDetails}
        />
      )}

      {project && (
        <ManageProjectUsersModal
          isOpen={showUsersModal}
          onClose={() => setShowUsersModal(false)}
          project={project}
          onUpdate={fetchProjectDetails}
        />
      )}

      {/* Create Task Modal */}
      {project && (
        <CreateProjectTaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          project={project}
          onTaskCreated={(newTask) => {
            fetchProjectDetails(); // Refresh project data
            setActiveTab("tasks"); // Switch to tasks tab
          }}
        />
      )}

      {/* Create Document Modal */}
      {project && (
        <CreateProjectDocumentModal
          isOpen={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
          project={project}
          onDocumentCreated={(newDocument) => {
            fetchProjectDetails(); // Refresh project data
            setActiveTab("documents"); // Switch to documents tab
          }}
        />
      )}

      {/* Add Weekly Update Modal */}
      {/* Add Weekly Update Modal - Admin only */}
      {project && user?.role === "admin" && (
        <AddWeeklyUpdateModal
          isOpen={showWeeklyUpdateModal}
          onClose={() => setShowWeeklyUpdateModal(false)}
          projectId={project._id}
          onUpdateCreated={() => {
            fetchProjectDetails();
            setActiveTab("weeklyUpdates");
          }}
        />
      )}

      {/* Add Milestone Modal */}
      {project && (
        <AddMilestoneModal
          isOpen={showMilestoneModal}
          onClose={() => setShowMilestoneModal(false)}
          projectId={project._id}
          onMilestoneCreated={() => {
            fetchMilestones();
            setActiveTab("milestones");
          }}
        />
      )}

      {/* Create/Edit Invoice Modal */}
      {project && (
        <CreateInvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedInvoice(null);
          }}
          project={project}
          invoice={selectedInvoice}
          onInvoiceCreated={(newInvoice) => {
            fetchProjectDetails(); // Refresh project data
            setActiveTab("invoices"); // Switch to invoices tab
          }}
        />
      )}

      {/* Create Update Modal */}
      {project && (
        <CreateProjectUpdateModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          project={project}
          onUpdateCreated={(newUpdate) => {
            fetchProjectDetails(); // Refresh project data
            setActiveTab("updates"); // Switch to updates tab
          }}
        />
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          isOpen={showTaskDetailsModal}
          onClose={() => {
            setShowTaskDetailsModal(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onTaskUpdated={(updatedTask) => {
            fetchProjectDetails();
            setSelectedTask(updatedTask);
          }}
          onTaskDeleted={() => {
            fetchProjectDetails();
            setShowTaskDetailsModal(false);
            setSelectedTask(null);
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default ProjectDetails;
