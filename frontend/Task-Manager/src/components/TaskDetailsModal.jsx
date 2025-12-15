import React, { useState } from "react";
import Modal from "./Modal";
import { 
  FiCalendar, 
  FiUser, 
  FiClock, 
  FiEdit, 
  FiTrash2, 
  FiAlertCircle,
  FiFileText,
  FiUsers,
  FiShield,
  FiPaperclip,
  FiDownload
} from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import EditTaskModal from "./EditTaskModal";

const TaskDetailsModal = ({ isOpen, onClose, task, onTaskUpdated, onTaskDeleted, readOnly = false }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!task) return null;

  const assignedUsers = Array.isArray(task.assignedTo)
    ? task.assignedTo
    : task.assignedTo
    ? [task.assignedTo]
    : [];

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== "Completed";

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "Urgent":
        return { label: "Urgente", color: "bg-red-100 text-red-700", icon: "🔴" };
      case "High":
        return { label: "Haute", color: "bg-orange-100 text-orange-700", icon: "🟠" };
      case "Medium":
        return { label: "Moyenne", color: "bg-yellow-100 text-yellow-700", icon: "🟡" };
      default:
        return { label: "Basse", color: "bg-blue-100 text-blue-700", icon: "🔵" };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "In Progress":
        return { label: "En cours", color: "bg-[#fff6ea] text-[#b76a28]" };
      case "Completed":
        return { label: "Terminée", color: "bg-[#dff5e7] text-[#1e4029]" };
      default:
        return { label: "En attente", color: "bg-[#f4f7f4] text-[#7a8b7f]" };
    }
  };

  const getRoleConfig = (role) => {
    switch (role) {
      case "admin":
        return { label: "Administrateur", color: "bg-purple-100 text-purple-700" };
      case "partner":
        return { label: "Partenaire", color: "bg-blue-100 text-blue-700" };
      case "collaborator":
        return { label: "Collaborateur", color: "bg-green-100 text-green-700" };
      case "client":
        return { label: "Client", color: "bg-orange-100 text-orange-700" };
      default:
        return { label: role, color: "bg-gray-100 text-gray-700" };
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(task._id));
      toast.success("Tâche supprimée avec succès !");
      onTaskDeleted?.(task._id);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la suppression de la tâche");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Détails de la tâche">
        <div className="space-y-6">
          {/* En-tête avec titre et badges */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#1e4029] flex-1">
                {task.title || "Tâche sans titre"}
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig.color}`}>
                {priorityConfig.icon} {priorityConfig.label}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
              {isOverdue && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1">
                  <FiAlertCircle size={12} /> En retard
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="bg-[#f4f7f4] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiFileText className="text-[#2d5f3f]" />
                <h3 className="font-semibold text-[#1e4029]">Description</h3>
              </div>
              <p className="text-[#4a5c52] whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          {/* Informations clés */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date d'échéance */}
            <div className="border border-[#dfe8e1] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiCalendar className={isOverdue ? "text-red-600" : "text-[#2d5f3f]"} />
                <h3 className="font-semibold text-[#1e4029] text-sm">Date d'échéance</h3>
              </div>
              <p className={`text-sm ${isOverdue ? "text-red-600 font-semibold" : "text-[#4a5c52]"}`}>
                {dueDate ? dueDate.toLocaleDateString("fr-FR", { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                }) : "Non définie"}
              </p>
            </div>

            {/* Date de création */}
            {task.createdAt && (
              <div className="border border-[#dfe8e1] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiClock className="text-[#2d5f3f]" />
                  <h3 className="font-semibold text-[#1e4029] text-sm">Créée le</h3>
                </div>
                <p className="text-sm text-[#4a5c52]">
                  {new Date(task.createdAt).toLocaleDateString("fr-FR", { 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Rôles assignés */}
          {task.assignedRoles && task.assignedRoles.length > 0 && (
            <div className="border border-[#dfe8e1] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FiShield className="text-[#2d5f3f]" />
                <h3 className="font-semibold text-[#1e4029]">Rôles assignés</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.assignedRoles.map((role, index) => {
                  const roleConfig = getRoleConfig(role);
                  return (
                    <span 
                      key={index}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${roleConfig.color}`}
                    >
                      {roleConfig.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Utilisateurs assignés */}
          {!readOnly && assignedUsers.length > 0 && (
            <div className="border border-[#dfe8e1] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FiUsers className="text-[#2d5f3f]" />
                <h3 className="font-semibold text-[#1e4029]">
                  Assigné à ({assignedUsers.length})
                </h3>
              </div>
              <div className="space-y-2">
                {assignedUsers.map((user, index) => (
                  <div key={user._id || index} className="flex items-center gap-3 p-2 bg-[#f4f7f4] rounded-lg">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.name || "Avatar"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-[#1e4029]">{user.name || "Sans nom"}</p>
                      <p className="text-xs text-[#7a8b7f]">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pièces jointes */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="border border-[#dfe8e1] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FiPaperclip className="text-[#2d5f3f]" />
                <h3 className="font-semibold text-[#1e4029]">
                  Pièces jointes ({task.attachments.length})
                </h3>
              </div>
              <div className="space-y-2">
                {task.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#f4f7f4] rounded-lg hover:bg-[#e6f0ea] transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FiFileText className="text-[#2d5f3f] flex-shrink-0" />
                      <p className="text-sm text-[#1e4029] truncate">
                        {attachment.split('/').pop()}
                      </p>
                    </div>
                    <a
                      href={`${axiosInstance.defaults.baseURL}${attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="ml-2 p-2 text-[#2d5f3f] hover:text-white hover:bg-[#2d5f3f] rounded-lg transition-colors"
                      title="Télécharger"
                    >
                      <FiDownload size={18} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          {!readOnly && (
            <div className="flex gap-3 pt-4 border-t border-[#dfe8e1]">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2d5f3f] text-white px-4 py-3 rounded-xl hover:bg-[#1e4029] transition-colors font-medium"
              >
                <FiEdit size={18} />
                Modifier
              </button>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl hover:bg-red-100 transition-colors font-medium"
                >
                  <FiTrash2 size={18} />
                  Supprimer
                </button>
              ) : (
                <div className="flex-1 flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 bg-red-600 text-white px-3 py-3 rounded-xl hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50"
                  >
                    {deleting ? "Suppression..." : "Confirmer"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de modification */}
      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={task}
        onTaskUpdated={(updatedTask) => {
          setShowEditModal(false);
          onTaskUpdated?.(updatedTask);
        }}
      />
    </>
  );
};

export default TaskDetailsModal;
