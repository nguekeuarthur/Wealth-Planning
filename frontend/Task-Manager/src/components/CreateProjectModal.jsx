import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FiUpload, FiX } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated, preSelectedClient = null, preSelectedClientId = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    client: "",
    clientContacts: [],
    description: "",
    projectLead: "",
    assignedUsers: [],
    startDate: "",
    category: "",
  });
  
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: "in progress", label: "In Progress" },
    { value: "in review", label: "In Review" },
    { value: "done", label: "Done" },
  ];

  const categoryOptions = [
    "Création entreprise onshore",
    "Création entreprise offshore",
    "Ouverture compte bancaire onshore",
    "Ouverture compte bancaire offshore",
    "Domiciliation",
    "Réception courrier",
    "Proposition structuration patrimoniale",
    "Proposition structuration patrimoniale:Reviewed",
    "Exécution structuration patrimoniale",
    "Proposition stratégie fiscale",
    "Proposition stratégie fiscale:Reviewed",
  ];

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchClients();
      // Set pre-selected client if provided (from Team member or Client)
      if (preSelectedClient) {
        setFormData(prev => ({
          ...prev,
          client: preSelectedClient._id
        }));
      } else if (preSelectedClientId) {
        setFormData(prev => ({
          ...prev,
          client: preSelectedClientId
        }));
      }
    }
  }, [isOpen, preSelectedClient, preSelectedClientId]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      const allUsers = response.data?.users || [];
      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.CLIENTS.GET_ALL_CLIENTS);
      const allClients = response.data?.clients || [];
      setClients(allClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => {
      const currentValues = prev[name] || [];
      if (currentValues.includes(value)) {
        return { ...prev, [name]: currentValues.filter((v) => v !== value) };
      } else {
        return { ...prev, [name]: [...currentValues, value] };
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.status || !formData.client || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Upload image if exists
      let imageUrl = "";
      if (coverImage) {
        const imageFormData = new FormData();
        imageFormData.append("image", coverImage);
        
        const uploadResponse = await axiosInstance.post(
          API_PATHS.IMAGE.UPLOAD_IMAGE,
          imageFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        imageUrl = uploadResponse.data?.imageUrl || "";
      }

      // Create project
      const projectData = {
        ...formData,
        imageUrl,
        endDate: formData.endDate || undefined,
      };

      const response = await axiosInstance.post(
        API_PATHS.PROJECTS.CREATE_PROJECT,
        projectData
      );

      toast.success("Project created successfully!");
      onProjectCreated(response.data.project);
      handleClose();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      status: "",
      client: "",
      clientContacts: [],
      description: "",
      projectLead: "",
      assignedUsers: [],
      startDate: "",
      category: "",
    });
    setCoverImage(null);
    setCoverImagePreview(null);
    onClose();
  };

  const getSelectedClientContacts = () => {
    const selectedClient = clients.find(c => c._id === formData.client);
    return selectedClient ? [selectedClient] : [];
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New project">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project name */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Project name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Project name"
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900 placeholder:text-gray-400"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all appearance-none cursor-pointer text-sm text-gray-900"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
            required
          >
            <option value="">Select category</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all appearance-none cursor-pointer text-sm text-gray-900"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
            required
          >
            <option value="">Status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Client */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Client <span className="text-red-500">*</span>
          </label>
          <select
            name="client"
            value={formData.client}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all appearance-none cursor-pointer text-sm text-gray-900"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
            required
          >
            <option value="">Client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.fullName || client.email}
              </option>
            ))}
          </select>
        </div>

        {/* Client contacts (read-only display) */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Client contacts <span className="text-red-500">*</span>
          </label>
          <div className="w-full px-3 py-2.5 bg-white border-0 rounded-md min-h-[42px] flex items-center cursor-not-allowed">
            {formData.client ? (
              <span className="text-sm text-gray-500">
                {clients.find(c => c._id === formData.client)?.email || "No contact"}
              </span>
            ) : (
              <span className="text-sm text-gray-400">Select a client first</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            rows={3}
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all resize-none text-sm text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Project lead */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Project lead <span className="text-red-500">*</span>
          </label>
          <select
            name="projectLead"
            value={formData.projectLead}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all appearance-none cursor-pointer text-sm text-gray-900"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
          >
            <option value="">Project lead</option>
            {users.filter(u => u.role === 'admin').map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullName || user.email}
              </option>
            ))}
          </select>
        </div>

        {/* Project members */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Project members <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              multiple
              className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all min-h-[100px] cursor-pointer text-sm text-gray-900"
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions).map(
                  (option) => option.value
                );
                setFormData((prev) => ({ ...prev, assignedUsers: selectedOptions }));
              }}
              value={formData.assignedUsers}
            >
              {users.map((user) => (
                <option key={user._id} value={user._id} className="py-1.5 px-2">
                  {user.fullName || user.email}
                </option>
              ))}
            </select>
            {formData.assignedUsers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {formData.assignedUsers.map((userId) => {
                  const user = users.find((u) => u._id === userId);
                  return (
                    <span
                      key={userId}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                    >
                      {user?.fullName || user?.email}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            assignedUsers: prev.assignedUsers.filter(
                              (id) => id !== userId
                            ),
                          }))
                        }
                        className="hover:text-gray-900 transition-colors"
                      >
                        <FiX size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Start date */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Start date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900"
              placeholder="Start date"
            />
          </div>
        </div>

        {/* Cover image */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Cover image <span className="text-red-500">*</span>
          </label>
          <div className="w-full">
            {coverImagePreview ? (
              <div className="relative group">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
                >
                  <FiX size={16} className="text-gray-700" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 border-0 rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-all">
                <div className="flex flex-col items-center justify-center">
                  <FiUpload className="w-6 h-6 mb-1.5 text-gray-400" />
                  <p className="text-xs text-gray-500">Cover image</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-all font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={loading}
          >
            {loading ? "Creating..." : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
