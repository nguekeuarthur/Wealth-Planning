import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FiCalendar, FiUser, FiUsers, FiFileText } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const CreateProjectTaskModal = ({ isOpen, onClose, project, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    status: "Pending"
  });
  const [assignmentType, setAssignmentType] = useState("team_leader"); // "team_leader" ou "individual"
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserSearch, setSelectedUserSearch] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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
    if (isOpen) {
      fetchUsers();
      if (project?.teams) {
        setTeams(project.teams);
      }
    }
  }, [isOpen, project]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(userId)
        ? prev.assignedTo.filter(id => id !== userId)
        : [...prev.assignedTo, userId]
    }));
  };

  const handleTeamLeaderToggle = (leaderId) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(leaderId)
        ? prev.assignedTo.filter(id => id !== leaderId)
        : [...prev.assignedTo, leaderId]
    }));
  };

  const handleAssignmentTypeChange = (type) => {
    setAssignmentType(type);
    setFormData(prev => ({ ...prev, assignedTo: [] })); // Reset selection when switching
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
      const taskPayload = {
        title: formData.title,
        description: formData.description || "",
        priority: formData.priority,
        dueDate: new Date(formData.dueDate).toISOString(),
        assignedTo: formData.assignedTo,
        status: formData.status,
        project: project._id
      };

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, taskPayload);

      toast.success("Tâche créée avec succès !");
      onTaskCreated(response.data.task);
      handleClose();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la création de la tâche");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      status: "Pending"
    });
    setAssignmentType("team_leader");
    setSelectedUserSearch("");
    setShowUserDropdown(false);
    onClose();
  };

  // Récupérer les personnes sélectionnées selon le mode
  const getSelectedAssignees = () => {
    if (assignmentType === "team_leader") {
      // Pour les chefs d'équipe, récupérer depuis les teams
      return teams
        .filter(team => team.leader && formData.assignedTo.includes(team.leader._id))
        .map(team => ({
          ...team.leader,
          teamName: team.name,
          isTeamLeader: true
        }));
    } else {
      // Pour les membres individuels, récupérer depuis users
      return formData.assignedTo
        .map(id => users.find(u => u._id === id))
        .filter(Boolean);
    }
  };

  const selectedUsers = getSelectedAssignees();
  const availableUsers = users.filter(u => 
    u.role !== 'admin' &&
    (u.name?.toLowerCase().includes(selectedUserSearch.toLowerCase()) ||
     u.email?.toLowerCase().includes(selectedUserSearch.toLowerCase()))
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ajouter une tâche">
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
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029]"
              required
            />
          </div>
        </div>

        {/* Assignation */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-3">
            Assigner à
          </label>

          {/* Toggle entre Chef d'équipe et Membre individuel */}
          <div className="flex gap-2 mb-4 p-1 bg-[#f4f7f4] rounded-xl">
            <button
              type="button"
              onClick={() => handleAssignmentTypeChange("team_leader")}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                assignmentType === "team_leader"
                  ? "bg-[#5a8f6f] text-white"
                  : "text-[#7a8b7f] hover:text-[#2d5f3f]"
              }`}
            >
              <FiUsers className="inline mr-2" />
              Chef d'équipe
            </button>
            <button
              type="button"
              onClick={() => handleAssignmentTypeChange("individual")}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                assignmentType === "individual"
                  ? "bg-[#5a8f6f] text-white"
                  : "text-[#7a8b7f] hover:text-[#2d5f3f]"
              }`}
            >
              <FiUser className="inline mr-2" />
              Membre individuel
            </button>
          </div>

          {/* Assignation à un chef d'équipe */}
          {assignmentType === "team_leader" && (
            <div className="space-y-3">
              {teams.length > 0 ? (
                teams.map((team) => {
                  if (!team.leader) return null;
                  const isSelected = formData.assignedTo.includes(team.leader._id);
                  return (
                    <button
                      key={team._id}
                      type="button"
                      onClick={() => handleTeamLeaderToggle(team.leader._id)}
                      className={`w-full p-4 border rounded-xl text-left transition-all ${
                        isSelected
                          ? "border-[#5a8f6f] bg-[#f4f7f4]"
                          : "border-[#dfe8e1] hover:border-[#5a8f6f]/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0"
                          style={{ backgroundColor: team.color || "#5a8f6f" }}
                        >
                          <FiUsers />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-[#1e4029]">{team.name}</h4>
                            {isSelected && (
                              <span className="text-[#5a8f6f] text-xs">✓ Sélectionné</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {team.leader.profileImageUrl ? (
                              <img
                                src={team.leader.profileImageUrl}
                                alt={team.leader.name || "Avatar"}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-[#2d5f3f] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {team.leader.name?.charAt(0).toUpperCase() || "L"}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-[#2d5f3f]">
                                {team.leader.name || team.leader.email}
                              </p>
                              <p className="text-xs text-[#7a8b7f]">Chef d'équipe</p>
                            </div>
                          </div>
                          {team.members && team.members.length > 0 && (
                            <p className="text-xs text-[#7a8b7f] mt-2">
                              {team.members.length} membre{team.members.length > 1 ? 's' : ''} dans l'équipe
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-[#7a8b7f] border border-[#dfe8e1] rounded-xl bg-[#fafafa]">
                  <FiUsers className="mx-auto text-3xl mb-2 opacity-30" />
                  <p className="text-sm">Aucune équipe assignée au projet</p>
                  <p className="text-xs mt-1">Gérez les équipes depuis la page du projet</p>
                </div>
              )}
            </div>
          )}

          {/* Assignation à un membre individuel */}
          {assignmentType === "individual" && (
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un membre..."
                  value={selectedUserSearch}
                  onChange={(e) => {
                    setSelectedUserSearch(e.target.value);
                    setShowUserDropdown(true);
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
                />
                <FiUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7a8b7f] w-4 h-4" />
                
                {showUserDropdown && availableUsers.length > 0 && (
                  <>
                    <div className="absolute left-0 right-0 z-40 mt-2 bg-white border border-[#dfe8e1] rounded-xl shadow-xl max-h-56 overflow-y-auto">
                      {availableUsers.map(user => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => {
                            handleUserToggle(user._id);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f4f7f4] text-left ${
                            formData.assignedTo.includes(user._id) ? 'bg-[#f4f7f4]' : ''
                          }`}
                        >
                          {user.profileImageUrl ? (
                            <img
                              src={user.profileImageUrl}
                              alt={user.name || "Avatar"}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#1e4029]">{user.name || "Sans nom"}</p>
                            <p className="text-xs text-[#7a8b7f]">{user.email}</p>
                          </div>
                          {formData.assignedTo.includes(user._id) && (
                            <div className="w-5 h-5 bg-[#5a8f6f] rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="fixed inset-0 z-30" onClick={() => setShowUserDropdown(false)} />
                  </>
                )}
              </div>

              {/* Utilisateurs sélectionnés */}
              {selectedUsers.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedUsers.map(user => (
                    <div
                      key={user._id}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-[#f4f7f4] border border-[#dfe8e1] rounded-xl text-sm"
                    >
                      {user.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt={user.name || "Avatar"}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <span className="text-[#2d5f3f] font-medium">{user.name || user.email}</span>
                      <button
                        type="button"
                        onClick={() => handleUserToggle(user._id)}
                        className="text-[#7a8b7f] hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Affichage des chefs d'équipe sélectionnés */}
          {assignmentType === "team_leader" && selectedUsers.length > 0 && (
            <div className="mt-4 p-3 bg-[#f4f7f4] rounded-xl border border-[#dfe8e1]">
              <p className="text-xs font-medium text-[#7a8b7f] mb-2">Chefs d'équipe sélectionnés :</p>
              <div className="space-y-2">
                {selectedUsers.map((leader) => (
                  <div
                    key={leader._id}
                    className="flex items-center justify-between p-2 bg-white rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      {leader.profileImageUrl ? (
                        <img
                          src={leader.profileImageUrl}
                          alt={leader.name || "Avatar"}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-[#2d5f3f] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {leader.name?.charAt(0).toUpperCase() || "L"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-[#1e4029]">
                          {leader.name || leader.email}
                        </p>
                        {leader.teamName && (
                          <p className="text-xs text-[#7a8b7f]">Équipe: {leader.teamName}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTeamLeaderToggle(leader._id)}
                      className="text-[#7a8b7f] hover:text-red-500 text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#dfe8e1]">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-sm text-[#7a8b7f] bg-[#f4f7f4] rounded-xl hover:bg-[#e6f0ea] border border-[#dfe8e1]"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] font-medium shadow-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Création..." : "Créer la tâche"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectTaskModal;

