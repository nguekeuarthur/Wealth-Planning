import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FiUpload, FiX, FiSearch, FiUser } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const brandPalette = {
  primary: "#1e4029",
  secondary: "#2d5f3f",
  accent: "#5a8f6f",
  soft: "#f4f7f4",
  border: "#dfe8e1",
  muted: "#7a8b7f",
};

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
    endDate: "",
    category: "",
  });
  
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);

  const statusOptions = [
    { value: "in progress", label: "En cours" },
    { value: "in review", label: "En révision" },
    { value: "done", label: "Terminé" },
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
    if (!formData.name || !formData.status || !formData.client || !formData.category || !formData.startDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error("La date de fin doit être postérieure à la date de début");
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

      toast.success("Projet créé avec succès !");
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Nouveau projet">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project name */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Nom du projet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nom du projet"
            className="w-full px-3 py-2.5 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all appearance-none cursor-pointer text-sm text-[#1e4029]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237a8b7f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Statut <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all appearance-none cursor-pointer text-sm text-[#1e4029]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237a8b7f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
            required
          >
            <option value="">Sélectionner un statut</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Client */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Client <span className="text-red-500">*</span>
          </label>
          <select
            name="client"
            value={formData.client}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all appearance-none cursor-pointer text-sm text-[#1e4029]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237a8b7f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
            required
          >
            <option value="">Sélectionner un client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.fullName || client.email}
              </option>
            ))}
          </select>
        </div>

        {/* Client contacts (read-only display) */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Contacts client <span className="text-red-500">*</span>
          </label>
          <div className="w-full px-3 py-2.5 bg-[#f4f7f4] border border-[#dfe8e1] rounded-xl min-h-[42px] flex items-center cursor-not-allowed">
            {formData.client ? (
              <span className="text-sm text-[#2d5f3f]">
                {clients.find(c => c._id === formData.client)?.email || "Aucun contact"}
              </span>
            ) : (
              <span className="text-sm text-[#7a8b7f]">Sélectionnez d'abord un client</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description du projet"
            rows={3}
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all resize-none text-sm text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Project lead */}
        <div className="relative">
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Chef de projet <span className="text-red-500">*</span>
          </label>

          {/* Selected lead display */}
          {formData.projectLead ? (
            <div className="flex items-center justify-between p-3 bg-[#f4f7f4] border border-[#dfe8e1] rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#5a8f6f] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {users.find(u => u._id === formData.projectLead)?.fullName?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
                <span className="text-sm text-[#2d5f3f] font-medium">
                  {users.find(u => u._id === formData.projectLead)?.fullName || users.find(u => u._id === formData.projectLead)?.email}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, projectLead: "" }))}
                className="text-[#7a8b7f] hover:text-red-500 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <>
              {/* Search input for lead */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un chef de projet..."
                  value={leadSearch}
                  onChange={(e) => {
                    setLeadSearch(e.target.value);
                    setShowLeadDropdown(true);
                  }}
                  onFocus={() => setShowLeadDropdown(true)}
                  className="w-full px-3 py-2.5 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
                />
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7a8b7f] w-4 h-4" />
              </div>

              {/* Lead dropdown */}
              {showLeadDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-[#dfe8e1] rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {users
                    .filter(u => u.role === 'admin')
                    .filter(u =>
                      u.fullName?.toLowerCase().includes(leadSearch.toLowerCase()) ||
                      u.email?.toLowerCase().includes(leadSearch.toLowerCase())
                    )
                    .map((user) => (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, projectLead: user._id }));
                          setLeadSearch("");
                          setShowLeadDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f4f7f4] transition-colors text-left"
                      >
                        <div className="w-8 h-8 bg-[#5a8f6f] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#1e4029]">{user.fullName || "Sans nom"}</div>
                          <div className="text-xs text-[#7a8b7f]">{user.email}</div>
                        </div>
                      </button>
                    ))}
                  {users.filter(u => u.role === 'admin').filter(u =>
                    u.fullName?.toLowerCase().includes(leadSearch.toLowerCase()) ||
                    u.email?.toLowerCase().includes(leadSearch.toLowerCase())
                  ).length === 0 && (
                    <div className="px-4 py-3 text-sm text-[#7a8b7f] text-center">
                      Aucun chef de projet trouvé
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Click outside to close dropdown */}
          {showLeadDropdown && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowLeadDropdown(false)}
            />
          )}
        </div>

        {/* Project members */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Membres du projet <span className="text-red-500">*</span>
          </label>

          {/* Search input for members */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Rechercher un membre..."
              value={memberSearch}
              onChange={(e) => {
                setMemberSearch(e.target.value);
                setShowMemberDropdown(true);
              }}
              onFocus={() => setShowMemberDropdown(true)}
              className="w-full px-3 py-2.5 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7a8b7f] w-4 h-4" />
          </div>

          {/* Member dropdown */}
          {showMemberDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-[#dfe8e1] rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {users
                .filter(u => !formData.assignedUsers.includes(u._id))
                .filter(u =>
                  u.fullName?.toLowerCase().includes(memberSearch.toLowerCase()) ||
                  u.email?.toLowerCase().includes(memberSearch.toLowerCase())
                )
                .map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        assignedUsers: [...prev.assignedUsers, user._id]
                      }));
                      setMemberSearch("");
                      setShowMemberDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f4f7f4] transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-[#5a8f6f] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#1e4029]">{user.fullName || "Sans nom"}</div>
                      <div className="text-xs text-[#7a8b7f]">{user.email}</div>
                    </div>
                    <FiUser className="ml-auto text-[#7a8b7f] w-4 h-4" />
                  </button>
                ))}
              {users
                .filter(u => !formData.assignedUsers.includes(u._id))
                .filter(u =>
                  u.fullName?.toLowerCase().includes(memberSearch.toLowerCase()) ||
                  u.email?.toLowerCase().includes(memberSearch.toLowerCase())
                ).length === 0 && (
                <div className="px-4 py-3 text-sm text-[#7a8b7f] text-center">
                  Aucun membre trouvé ou déjà ajouté
                </div>
              )}
            </div>
          )}

          {/* Selected members */}
          {formData.assignedUsers.length > 0 && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-[#7a8b7f] mb-2">
                Membres ajoutés ({formData.assignedUsers.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.assignedUsers.map((userId) => {
                  const user = users.find((u) => u._id === userId);
                  return (
                    <div
                      key={userId}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-[#f4f7f4] border border-[#dfe8e1] rounded-xl text-sm"
                    >
                      <div className="w-6 h-6 bg-[#5a8f6f] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {user?.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[#2d5f3f] font-medium">{user?.fullName || user?.email}</span>
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
                        className="text-[#7a8b7f] hover:text-red-500 transition-colors ml-1"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Click outside to close dropdown */}
          {showMemberDropdown && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMemberDropdown(false)}
            />
          )}
        </div>

        {/* Start date */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Date de début <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-sm text-[#1e4029]"
              placeholder="Date de début"
            />
          </div>
        </div>

        {/* End date */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Date de fin
          </label>
          <div className="relative">
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-sm text-[#1e4029]"
              placeholder="Date de fin"
            />
          </div>
        </div>

        {/* Cover image */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Image de couverture <span className="text-red-500">*</span>
          </label>
          <div className="w-full">
            {coverImagePreview ? (
              <div className="relative group">
                <img
                  src={coverImagePreview}
                  alt="Aperçu de l'image"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-[#f4f7f4] transition-all"
                >
                  <FiX size={16} className="text-[#2d5f3f]" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 border border-[#dfe8e1] rounded-xl cursor-pointer bg-white hover:bg-[#f4f7f4] transition-all">
                <div className="flex flex-col items-center justify-center">
                  <FiUpload className="w-6 h-6 mb-1.5 text-[#7a8b7f]" />
                  <p className="text-xs text-[#7a8b7f]">Image de couverture</p>
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
        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-sm text-[#7a8b7f] bg-[#f4f7f4] rounded-xl hover:bg-[#e6f0ea] transition-all font-medium border border-[#dfe8e1]"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? "Création..." : "Ajouter"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
