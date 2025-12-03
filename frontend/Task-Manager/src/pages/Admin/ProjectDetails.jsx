import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
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
  FiEdit,
  FiTrash2,
  FiSearch,
  FiPlus,
  FiMapPin
} from "react-icons/fi";
import toast from "react-hot-toast";
import TaskCard from "../../components/Cards/TaskCard";
import CreateProjectModal from "../../components/CreateProjectModal";
import ProjectCalendar from "../../components/ProjectCalendar";
import AddWeeklyUpdateModal from "../../components/AddWeeklyUpdateModal";
import WeeklyUpdatesTimeline from "../../components/WeeklyUpdatesTimeline";
import AddMilestoneModal from "../../components/AddMilestoneModal";
import MilestonesList from "../../components/MilestonesList";
import AddFileModal from "../../components/AddFileModal";
import FilesList from "../../components/FilesList";
import EditFileModal from "../../components/EditFileModal";
import CreateInvoiceModal from "../../components/CreateInvoiceModal";
import InvoicesTable from "../../components/InvoicesTable";
import AddInvoiceModal from "../../components/AddInvoiceModal";
import CommentsSection from "../../components/CommentsSection";
import AddTaskModal from "../../components/AddTaskModal";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("members");
  const [taskFilter, setTaskFilter] = useState("TO DO");
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [weeklyUpdates, setWeeklyUpdates] = useState([]);
  const [isAddUpdateModalOpen, setIsAddUpdateModalOpen] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
    fetchProjectTasks();
    fetchWeeklyUpdates();
    fetchMilestones();
    fetchDocuments();
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchProjectTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskFilter]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.PROJECTS.GET_PROJECT_DETAILS.replace(":id", id)
      );
      setProject(response.data?.project || null);
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("Impossible de charger les détails du projet");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectTasks = async () => {
    try {
      console.log("Fetching tasks for project:", id);
      
      // First, get all tasks for the project (without status filter)
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          project: id, // Filter by project ID only
        },
      });
      
      console.log("API Response:", response.data);
      
      // Handle different response formats
      const allTasks = response.data?.tasks || response.data || [];
      console.log("All tasks received:", allTasks.length, allTasks);
      
      // Filter tasks by project ID (frontend filtering as backup)
      let projectTasks = allTasks.filter(task => {
        const taskProjectId = task.project?._id || task.project || task.projectId;
        const matches = taskProjectId === id || taskProjectId?.toString() === id?.toString();
        if (!matches && task.project) {
          console.log("Task filtered out:", {
            taskId: task._id,
            taskTitle: task.title,
            taskProject: taskProjectId,
            taskProjectObj: task.project,
            expectedProject: id
          });
        }
        return matches;
      });
      
      console.log("Project tasks after filtering:", projectTasks.length);
      
      // Now filter by status on the frontend
      let statusParam = "";
      if (taskFilter === "TO DO") {
        statusParam = "Pending";
      } else if (taskFilter === "IN PROGRESS") {
        statusParam = "In Progress";
      } else if (taskFilter === "IN REVIEW") {
        // Note: "In Review" doesn't exist in backend yet, filtering by "In Progress" for now
        statusParam = "In Progress";
      } else if (taskFilter === "DONE") {
        statusParam = "Completed";
      }
      
      if (statusParam) {
        projectTasks = projectTasks.filter(task => task.status === statusParam);
        console.log("Tasks after status filter:", projectTasks.length, "status:", statusParam);
      }
      
      setTasks(projectTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Erreur lors du chargement des tâches");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "in progress":
        return "bg-green-100 text-green-700";
      case "in review":
        return "bg-blue-100 text-blue-700";
      case "done":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "in progress":
        return "En cours";
      case "in review":
        return "En révision";
      case "done":
        return "Terminé";
      default:
        return status || "Non défini";
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ? Cette action est irréversible.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await axiosInstance.delete(API_PATHS.PROJECTS.DELETE_PROJECT(id));
      toast.success("Projet supprimé avec succès");
      navigate("/admin/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la suppression du projet");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleProjectUpdated = async (updatedProject) => {
    setIsEditModalOpen(false);
    // Refresh project details from server to get populated fields
    await fetchProjectDetails();
    toast.success("Projet mis à jour avec succès");
  };

  const fetchWeeklyUpdates = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.WEEKLY_UPDATES.GET_PROJECT_UPDATES(id)
      );
      setWeeklyUpdates(response.data?.updates || []);
    } catch (error) {
      console.error("Error fetching weekly updates:", error);
    }
  };

  const handleUpdateCreated = (newUpdate) => {
    setWeeklyUpdates((prev) => [newUpdate, ...prev]);
    setIsAddUpdateModalOpen(false);
  };

  const fetchMilestones = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.MILESTONES.GET_PROJECT_MILESTONES(id)
      );
      setMilestones(response.data?.milestones || []);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  const handleMilestoneCreated = (newMilestone) => {
    setMilestones((prev) => [newMilestone, ...prev]);
    setIsAddMilestoneModalOpen(false);
  };

  const fetchDocuments = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_ALL_DOCUMENTS, {
        params: { project: id },
      });
      setDocuments(response.data?.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleFileCreated = (newFile) => {
    setDocuments((prev) => [newFile, ...prev]);
    setIsAddFileModalOpen(false);
  };

  const handleFileDeleted = (fileId) => {
    setDocuments((prev) => prev.filter((file) => file._id !== fileId));
  };

  const handleFileUpdated = (updatedFile) => {
    setDocuments((prev) =>
      prev.map((file) => (file._id === updatedFile._id ? updatedFile : file))
    );
    setEditingFile(null);
  };

  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INVOICES.GET_ALL_INVOICES, {
        params: { project: id },
      });
      setInvoices(response.data?.invoices || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleInvoiceCreated = () => {
    fetchInvoices();
    setIsAddInvoiceModalOpen(false);
  };

  const handleInvoiceDeleted = () => {
    fetchInvoices();
  };

  const handleInvoiceUpdated = () => {
    fetchInvoices();
  };

  const handleTaskCreated = async () => {
    setIsAddTaskModalOpen(false);
    // Wait a bit for the backend to process
    await new Promise(resolve => setTimeout(resolve, 500));
    await fetchProjectTasks();
    toast.success("Tâche créée et ajoutée au projet");
  };

  const tabs = [
    { id: "members", label: "Membres du projet", icon: FiUsers },
    { id: "plan", label: "Plan du projet", icon: FiFolder },
    { id: "updates", label: "Notes hebdomadaires", icon: FiClock },
    { id: "milestones", label: "Jalons", icon: FiMapPin },
    { id: "files", label: "Fichiers", icon: FiFile },
    { id: "invoices", label: "Factures", icon: FiDollarSign },
    { id: "comments", label: "Commentaires", icon: FiMessageSquare },
  ];

  const taskFilters = ["TO DO", "IN PROGRESS", "IN REVIEW", "DONE"];
  const taskFilterLabels = {
    "TO DO": "À FAIRE",
    "IN PROGRESS": "EN COURS",
    "IN REVIEW": "EN REVUE",
    "DONE": "TERMINÉES",
  };

  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title?.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <DashboardLayout activeMenu="Projets">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du projet...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout activeMenu="Projets">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Projet introuvable
          </h3>
          <button
            onClick={() => navigate("/admin/projects")}
            className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <FiArrowLeft /> Retour aux projets
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Project Details Component (reusable section)
  const ProjectDetailsSection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start gap-4 mb-4">
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
              {getStatusLabel(project.status)}
            </span>
          </div>
          {project.client && (
            <p className="text-gray-600 mb-2">
              {project.client.companyName || project.client.contactName || project.client.fullName || project.client.email}
            </p>
          )}
          {project.description && (
            <p className="text-gray-700 text-sm mb-4">{project.description}</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">DATE DE DÉBUT</p>
              <p className="font-medium text-gray-900">
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString('fr-FR')
                  : "Non défini"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">DATE DE FIN</p>
              <p className="font-medium text-gray-900">
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString('fr-FR')
                  : "Non défini"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">CHEF DE PROJET</p>
              <p className="font-medium text-gray-900">
                {project.projectLead?.name ||
                  project.projectLead?.fullName ||
                  project.projectLead?.email ||
                  "Non assigné"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">CONTACT CLIENT</p>
              <p className="font-medium text-gray-900">
                {project.client?.name ||
                  project.client?.fullName ||
                  project.client?.email ||
                  "Non défini"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleEdit}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <FiEdit size={16} />
            Modifier
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiTrash2 size={16} />
            {isDeleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );

  // Tasks Section Component (reusable section)
  const TasksSection = () => (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Tâches</h3>
      
      {/* Search and Add Task */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <FiPlus size={16} />
          Ajouter une tâche
        </button>
      </div>

      {/* Task Status Filters */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {taskFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setTaskFilter(filter)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              taskFilter === filter
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {taskFilterLabels[filter] || filter}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              status={task.status}
              progress={task.progress}
              createdAt={task.createdAt}
              dueDate={task.dueDate}
              assignedTo={task.assignedTo?.map((item) => item.profileImageUrl) || []}
              attachmentCount={task.attachments?.length || 0}
              completedTodoCount={task.completedTodoCount || 0}
              todoChecklist={task.todoChecklist || []}
              onClick={() => navigate(`/admin/task-details/${task._id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
          <FiCheckCircle className="mx-auto text-gray-300 text-5xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Aucune tâche trouvée
          </h3>
          <p className="text-gray-500">
            {searchQuery ? "Essayez une autre recherche" : "Aucune tâche pour ce statut"}
          </p>
        </div>
      )}
    </div>
  );

  // Tab Content Components
  const renderTabContent = () => {
    switch (activeTab) {
      case "members":
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Membres du projet</h3>
            {project.assignedUsers && project.assignedUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.assignedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.name || user.fullName || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucun membre assigné à ce projet</p>
            )}
          </div>
        );

      case "plan":
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Plan du projet</h3>
            {project.startDate && project.endDate ? (
              <ProjectCalendar 
                startDate={project.startDate} 
                endDate={project.endDate} 
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <p className="text-gray-500">
                  Les dates de début et de fin du projet doivent être définies pour afficher le calendrier.
                </p>
              </div>
            )}
          </div>
        );

      case "updates":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Notes hebdomadaires</h3>
              <button
                onClick={() => setIsAddUpdateModalOpen(true)}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <FiPlus size={16} />
                Ajouter une note
              </button>
            </div>
            <WeeklyUpdatesTimeline updates={weeklyUpdates} />
          </div>
        );

      case "milestones":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Jalons</h3>
              <button
                onClick={() => setIsAddMilestoneModalOpen(true)}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <FiPlus size={16} />
                Ajouter un jalon
              </button>
            </div>
            <MilestonesList milestones={milestones} />
          </div>
        );

      case "files":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Fichiers</h3>
              <button
                onClick={() => setIsAddFileModalOpen(true)}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <FiPlus size={16} />
                Ajouter un fichier
              </button>
            </div>
            <FilesList
              files={documents}
              onFileDeleted={handleFileDeleted}
              onFileUpdated={handleFileUpdated}
              onEditFile={setEditingFile}
              projectId={id}
            />
          </div>
        );

      case "invoices":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Factures</h3>
              <button
                onClick={() => {
                  if (!project?.client && !project?.client?._id) {
                    toast.error("Ce projet n'a pas de client assigné. Veuillez assigner un client au projet d'abord.");
                    return;
                  }
                  setIsAddInvoiceModalOpen(true);
                }}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!project?.client && !project?.client?._id}
              >
                <FiPlus size={16} />
                Ajouter une facture
              </button>
            </div>
            <InvoicesTable
              invoices={invoices}
              onInvoiceDeleted={handleInvoiceDeleted}
              onInvoiceUpdated={handleInvoiceUpdated}
              onEditInvoice={setEditingInvoice}
            />
          </div>
        );

      case "comments":
        return (
          <CommentsSection projectId={id} currentUser={currentUser} />
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout activeMenu="Projets">
      <div className="my-5">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/projects")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <FiArrowLeft /> Retour aux projets
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Détails du projet</h1>
        </div>

        {/* Project Details Section - Always visible at top */}
        <ProjectDetailsSection />

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-gray-900 text-gray-900 font-semibold"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>

        {/* Tasks Section - Always visible at bottom */}
        <TasksSection />
      </div>

      {/* Edit Project Modal */}
      {project && (
        <CreateProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProjectCreated={handleProjectUpdated}
          editProject={project}
        />
      )}

      {/* Add Weekly Update Modal */}
      <AddWeeklyUpdateModal
        isOpen={isAddUpdateModalOpen}
        onClose={() => setIsAddUpdateModalOpen(false)}
        onUpdateCreated={handleUpdateCreated}
        projectId={id}
      />

      {/* Add Milestone Modal */}
      <AddMilestoneModal
        isOpen={isAddMilestoneModalOpen}
        onClose={() => setIsAddMilestoneModalOpen(false)}
        onMilestoneCreated={handleMilestoneCreated}
        projectId={id}
      />

      {/* Add File Modal */}
      <AddFileModal
        isOpen={isAddFileModalOpen}
        onClose={() => setIsAddFileModalOpen(false)}
        onFileCreated={handleFileCreated}
        projectId={id}
      />

      {/* Edit File Modal */}
      {editingFile && (
        <EditFileModal
          isOpen={!!editingFile}
          onClose={() => setEditingFile(null)}
          onFileUpdated={handleFileUpdated}
          file={editingFile}
        />
      )}

      {/* Add Invoice Modal */}
      {project && (
        <AddInvoiceModal
          isOpen={isAddInvoiceModalOpen}
          onClose={() => setIsAddInvoiceModalOpen(false)}
          onInvoiceCreated={handleInvoiceCreated}
          projectId={id}
          clientId={
            project.client?._id || 
            project.client || 
            (typeof project.client === 'string' ? project.client : null)
          }
        />
      )}

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <CreateInvoiceModal
          isOpen={!!editingInvoice}
          onClose={() => setEditingInvoice(null)}
          onInvoiceCreated={handleInvoiceCreated}
          editInvoice={editingInvoice}
        />
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        projectId={id}
      />
    </DashboardLayout>
  );
};

export default ProjectDetails;
