import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FiUpload, FiCalendar, FiClock, FiChevronDown } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";

const fullImageUrl = (url) => {
  if (!url) return null;
  // Aggressive cleanup of historical localhost URLs
  let cleaned = url.replace(/^https?:\/\/localhost:8000/, '');
  if (cleaned.startsWith('http')) return cleaned;
  const baseUrlClean = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const pathClean = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
  return `${baseUrlClean}${pathClean}`;
};

const AddTaskModal = ({ isOpen, onClose, onTaskCreated, projectId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: [],
    dueDate: "",
    dueTime: "",
    attachments: [],
  });
  const [users, setUsers] = useState([]);
  const [showAssigneesDropdown, setShowAssigneesDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      resetForm();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      // Handle both response formats: { users: [...] } or [...]
      const usersData = response.data?.users || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      assignedTo: [],
      dueDate: "",
      dueTime: "",
      attachments: [],
    });
    setSelectedFiles([]);
    setShowAssigneesDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssigneeToggle = (userId) => {
    setFormData((prev) => {
      const isSelected = prev.assignedTo.includes(userId);
      return {
        ...prev,
        assignedTo: isSelected
          ? prev.assignedTo.filter((id) => id !== userId)
          : [...prev.assignedTo, userId],
      };
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleFileRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Le nom de la tâche est requis");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("La description de la tâche est requise");
      return;
    }
    if (formData.assignedTo.length === 0) {
      toast.error("Veuillez assigner la tâche à au moins un utilisateur");
      return;
    }

    setLoading(true);
    try {
      // Combine date and time if both are provided
      let dueDateISO = null;
      if (formData.dueDate) {
        if (formData.dueTime) {
          const [hours, minutes] = formData.dueTime.split(":");
          const dateTime = moment(`${formData.dueDate} ${hours}:${minutes}`, "YYYY-MM-DD HH:mm");
          dueDateISO = dateTime.toISOString();
        } else {
          dueDateISO = moment(formData.dueDate).endOf("day").toISOString();
        }
      }

      // If no due date provided, set it to 7 days from now
      if (!dueDateISO) {
        dueDateISO = moment().add(7, 'days').endOf('day').toISOString();
      }

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        assignedTo: formData.assignedTo,
        project: projectId,
        priority: "Medium",
        status: "Pending",
        dueDate: dueDateISO,
      };

      console.log("Creating task with data:", taskData);
      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, taskData);
      console.log("Task created:", response.data);

      // Handle file uploads if any
      if (selectedFiles.length > 0) {
        // TODO: Upload files and attach to task
        // For now, we'll just create the task
      }

      toast.success("Tâche créée avec succès");
      onTaskCreated();
      handleClose();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la création de la tâche");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getSelectedUsersNames = () => {
    if (formData.assignedTo.length === 0) return "Sélectionner des utilisateurs";
    const selected = users.filter((user) => formData.assignedTo.includes(user._id));
    if (selected.length === 1) return selected[0].fullName || selected[0].email;
    return `${selected.length} utilisateurs sélectionnés`;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add new task">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Task name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task name"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            required
          />
        </div>

        {/* Task description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Task description"
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Assignees */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignees <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowAssigneesDropdown(!showAssigneesDropdown)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent flex items-center justify-between"
          >
            <span className={formData.assignedTo.length === 0 ? "text-gray-400" : "text-gray-900"}>
              {getSelectedUsersNames()}
            </span>
            <FiChevronDown className="text-gray-400" />
          </button>
          {showAssigneesDropdown && (
            <>
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {users.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">Aucun utilisateur disponible</div>
                ) : (
                  users.map((user) => (
                    <label
                      key={user._id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.assignedTo.includes(user._id)}
                        onChange={() => handleAssigneeToggle(user._id)}
                        className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                      />
                      {user.profileImageUrl ? (
                        <img
                          src={fullImageUrl(user.profileImageUrl)}
                          alt={user.name || user.fullName || "Avatar"}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {(user.name || user.fullName || user.email)?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm text-gray-900">
                        {user.name || user.fullName || user.email}
                      </span>
                    </label>
                  ))
                )}
              </div>
              <div
                className="fixed inset-0 z-0"
                onClick={() => setShowAssigneesDropdown(false)}
              />
            </>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="time"
                name="dueTime"
                value={formData.dueTime}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Attachment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
              <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Glissez-déposez des fichiers ou cliquez pour sélectionner</span>
            </label>
          </div>
          {selectedFiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded text-sm">
                  <span className="text-gray-700 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleFileRemove(index)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={loading}
          >
            {loading ? "Création..." : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTaskModal;

