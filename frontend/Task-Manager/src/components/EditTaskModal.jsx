import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FiCalendar, FiUsers, FiPaperclip, FiX, FiFileText, FiDownload } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const EditTaskModal = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Pending",
    dueDate: "",
    assignedRoles: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);

  const roleOptions = [
    { value: "admin", label: "Administrateur", color: "bg-purple-100 text-purple-700" },
    { value: "partner", label: "Partenaire", color: "bg-blue-100 text-blue-700" },
    { value: "collaborator", label: "Collaborateur", color: "bg-green-100 text-green-700" },
    { value: "client", label: "Client", color: "bg-orange-100 text-orange-700" }
  ];

  const priorityOptions = [
    { value: "Low", label: "Basse", color: "bg-blue-100 text-blue-700" },
    { value: "Medium", label: "Moyenne", color: "bg-yellow-100 text-yellow-700" },
    { value: "High", label: "Haute", color: "bg-orange-100 text-orange-700" },
    { value: "Urgent", label: "Urgente", color: "bg-red-100 text-red-700" }
  ];

  const statusOptions = [
    { value: "Pending", label: "En attente" },
    { value: "In Progress", label: "En cours" },
    { value: "Completed", label: "Terminée" }
  ];

  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Low",
        status: task.status || "Pending",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
        assignedRoles: task.assignedRoles || []
      });
      setExistingAttachments(task.attachments || []);
    }
  }, [task, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (role) => {
    setFormData(prev => ({
      ...prev,
      assignedRoles: prev.assignedRoles.includes(role)
        ? prev.assignedRoles.filter(r => r !== role)
        : [...prev.assignedRoles, role]
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return toast.error("Le titre de la tâche est obligatoire");
    }

    if (!formData.dueDate) {
      return toast.error("La date d'échéance est obligatoire");
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('priority', formData.priority);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('dueDate', new Date(formData.dueDate).toISOString());
      formDataToSend.append('assignedRoles', JSON.stringify(formData.assignedRoles));
      
      // Ajouter les nouveaux fichiers
      selectedFiles.forEach(file => {
        formDataToSend.append('attachments', file);
      });

      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(task._id),
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success("Tâche modifiée avec succès !");
      onTaskUpdated?.(response.data.task);
      handleClose();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Low",
      status: "Pending",
      dueDate: "",
      assignedRoles: []
    });
    setSelectedFiles([]);
    setExistingAttachments([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Modifier la tâche">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Titre de la tâche <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Ex: Réviser le contrat client"
            className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Décrivez les détails de la tâche..."
            rows={4}
            className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
          />
        </div>

        {/* Priorité et Statut */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
              Priorité
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029]"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
              Statut
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029]"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date d'échéance */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Date d'échéance <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a8b7f] w-4 h-4" />
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029]"
              required
            />
          </div>
        </div>

        {/* Assignation par rôles */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-2">
            <FiUsers className="inline mr-1" />
            Assigner aux rôles
          </label>
          <div className="flex flex-wrap gap-2">
            {roleOptions.map(role => (
              <button
                key={role.value}
                type="button"
                onClick={() => handleRoleToggle(role.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  formData.assignedRoles.includes(role.value)
                    ? `${role.color} border-transparent shadow-sm`
                    : 'bg-white border-[#dfe8e1] text-[#7a8b7f] hover:border-[#5a8f6f]'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
          {formData.assignedRoles.length === 0 && (
            <p className="text-xs text-[#7a8b7f] mt-2">
              Aucun rôle sélectionné - la tâche sera visible par tous
            </p>
          )}
        </div>

        {/* Fichiers existants */}
        {existingAttachments.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-[#7a8b7f] mb-2">
              <FiFileText className="inline mr-1" />
              Fichiers existants
            </label>
            <div className="space-y-2">
              {existingAttachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-[#f4f7f4] rounded-lg"
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
                    className="ml-2 p-1 text-[#2d5f3f] hover:text-[#1e4029] hover:bg-[#e6f0ea] rounded transition-colors"
                  >
                    <FiDownload size={18} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload de nouveaux fichiers */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-2">
            <FiPaperclip className="inline mr-1" />
            Ajouter de nouveaux fichiers (optionnel)
          </label>
          
          <div className="border-2 border-dashed border-[#dfe8e1] rounded-xl p-4 hover:border-[#5a8f6f] transition-colors">
            <input
              type="file"
              id="edit-task-file-upload"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="edit-task-file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <FiPaperclip className="text-3xl text-[#7a8b7f] mb-2" />
              <span className="text-sm text-[#4a5c52] font-medium">
                Cliquez pour ajouter des fichiers
              </span>
              <span className="text-xs text-[#7a8b7f] mt-1">
                PDF, Word, Excel, Images (Max 10MB par fichier)
              </span>
            </label>
          </div>

          {/* Liste des nouveaux fichiers sélectionnés */}
          {selectedFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-[#e6f0ea] rounded-lg border border-[#5a8f6f]"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FiFileText className="text-[#2d5f3f] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1e4029] truncate">{file.name}</p>
                      <p className="text-xs text-[#7a8b7f]">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-2 p-1 text-[#7a8b7f] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 border border-[#dfe8e1] text-[#2d5f3f] rounded-xl hover:bg-[#f4f7f4] transition-colors font-medium"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-colors font-medium disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Modification..." : "Modifier"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;
