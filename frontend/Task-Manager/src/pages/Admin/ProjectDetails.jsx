import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
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
  FiFile
} from "react-icons/fi";
import toast from "react-hot-toast";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.PROJECTS.GET_PROJECT_DETAILS.replace(":id", id)
      );
      setProject(response.data?.project || null);
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "in progress":
        return "bg-orange-100 text-orange-600";
      case "in review":
        return "bg-blue-100 text-blue-600";
      case "done":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "in progress":
        return "In Progress";
      case "in review":
        return "In Review";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiFolder },
    { id: "tasks", label: "Tasks", icon: FiCheckCircle },
    { id: "documents", label: "Documents", icon: FiFileText },
    { id: "invoices", label: "Invoices", icon: FiDollarSign },
    { id: "discussions", label: "Discussions", icon: FiMessageSquare },
  ];

  if (loading) {
    return (
      <DashboardLayout activeMenu="Projects">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading project...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout activeMenu="Projects">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Project not found
          </h3>
          <button
            onClick={() => navigate("/admin/projects")}
            className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <FiArrowLeft /> Back to Projects
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Projects">
      <div className="my-5">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/projects")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <FiArrowLeft /> Back to Projects
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {project.name}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
              </div>
              {project.category && (
                <p className="text-gray-600">{project.category}</p>
              )}
            </div>
          </div>
        </div>

        {/* Project Cover Image */}
        {project.imageUrl && (
          <div className="mb-6 rounded-lg overflow-hidden shadow-sm">
            <img
              src={project.imageUrl}
              alt={project.name}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
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
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Tasks Count */}
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FiCheckCircle className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {project.tasks?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">Tasks</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents Count */}
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FiFileText className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {project.documents?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">Documents</p>
                      </div>
                    </div>
                  </div>

                  {/* Invoices Count */}
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FiDollarSign className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {project.invoices?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">Invoices</p>
                      </div>
                    </div>
                  </div>

                  {/* Team Size */}
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <FiUsers className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {project.assignedUsers?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">Team</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {project.description || "No description provided."}
                  </p>
                </div>

                {/* Progress */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Progress</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overall Completion</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {project.completion || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${project.completion || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FiCalendar className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {project.startDate
                            ? new Date(project.startDate).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FiClock className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {project.endDate
                            ? new Date(project.endDate).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Client Info */}
                {project.client && (
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FiUser className="text-gray-600" />
                      Client
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-sm font-medium text-gray-900">
                          {project.client.fullName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">
                          {project.client.email || "N/A"}
                        </p>
                      </div>
                      {project.client.phoneNumber && (
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-900">
                            {project.client.phoneNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Project Lead */}
                {project.projectLead && (
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FiUser className="text-gray-600" />
                      Project Lead
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {project.projectLead.fullName?.charAt(0).toUpperCase() || "P"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {project.projectLead.fullName || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {project.projectLead.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Members */}
                {project.assignedUsers && project.assignedUsers.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FiUsers className="text-gray-600" />
                      Team Members ({project.assignedUsers.length})
                    </h3>
                    <div className="space-y-3">
                      {project.assignedUsers.map((user) => (
                        <div key={user._id} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {user.fullName?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {user.fullName || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="space-y-4">
              {/* Tasks Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Project Tasks {project.tasks && `(${project.tasks.length})`}
                </h3>
                <button
                  onClick={() => navigate(`/admin/create-task?project=${id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Create Task
                </button>
              </div>

              {/* Tasks List */}
              {project.tasks && project.tasks.length > 0 ? (
                <div className="grid gap-4">
                  {project.tasks.map((task) => (
                    <div
                      key={task._id}
                      className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {task.title || task.name || "Untitled Task"}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <FiCalendar size={12} />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            {task.assignedTo && (
                              <span className="flex items-center gap-1">
                                <FiUser size={12} />
                                {task.assignedTo.fullName || task.assignedTo.email}
                              </span>
                            )}
                          </div>
                        </div>
                        {task.status && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            task.status === 'done' ? 'bg-green-100 text-green-600' :
                            task.status === 'in progress' ? 'bg-orange-100 text-orange-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {task.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
                  <FiCheckCircle className="mx-auto text-gray-300 text-5xl mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No tasks yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Create your first task for this project
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-4">
              {/* Documents Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Documents & Contracts {project.documents && `(${project.documents.length})`}
                </h3>
              </div>

              {/* Documents List */}
              {project.documents && project.documents.length > 0 ? (
                <div className="grid gap-4">
                  {project.documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <FiFile className="text-blue-600 text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {doc.title || doc.name || "Document"}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            {doc.type && (
                              <span className="px-2 py-0.5 bg-gray-100 rounded">
                                {doc.type === 'contract' ? '📄 Contract' :
                                 doc.type === 'livrable' ? '📦 Deliverable' :
                                 doc.type === 'personal_data' ? '🔒 Personal Data' :
                                 '📎 Document'}
                              </span>
                            )}
                            {doc.uploadedAt && (
                              <span>
                                {new Date(doc.uploadedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
                  <FiFileText className="mx-auto text-gray-300 text-5xl mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No documents yet
                  </h3>
                  <p className="text-gray-500">
                    Documents and contracts will appear here
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "invoices" && (
            <div className="space-y-4">
              {/* Invoices Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Invoices {project.invoices && `(${project.invoices.length})`}
                </h3>
              </div>

              {/* Invoices List */}
              {project.invoices && project.invoices.length > 0 ? (
                <div className="grid gap-4">
                  {project.invoices.map((invoice) => (
                    <div
                      key={invoice._id}
                      className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <FiDollarSign className="text-green-600 text-xl" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {invoice.invoiceNumber || `Invoice #${invoice._id.slice(-6)}`}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              {invoice.amount && (
                                <span className="font-semibold text-gray-900">
                                  ${invoice.amount.toLocaleString()}
                                </span>
                              )}
                              {invoice.dueDate && (
                                <span>
                                  Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {invoice.status && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-600' :
                            invoice.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {invoice.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
                  <FiDollarSign className="mx-auto text-gray-300 text-5xl mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No invoices yet
                  </h3>
                  <p className="text-gray-500">
                    Invoices related to this project will appear here
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "discussions" && (
            <div className="space-y-4">
              {/* Discussions Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Discussions {project.messages && `(${project.messages.length})`}
                </h3>
              </div>

              {/* Messages List */}
              {project.messages && project.messages.length > 0 ? (
                <div className="space-y-4">
                  {project.messages.map((message) => (
                    <div
                      key={message._id}
                      className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-blue-600">
                            {message.sender?.fullName?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {message.sender?.fullName || "Unknown User"}
                            </span>
                            {message.createdAt && (
                              <span className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">
                            {message.content || message.text || "No content"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
                  <FiMessageSquare className="mx-auto text-gray-300 text-5xl mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No discussions yet
                  </h3>
                  <p className="text-gray-500">
                    Team discussions and comments will appear here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
