import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import {
  FiX, FiUsers, FiUser, FiBriefcase, FiSearch,
  FiPlus, FiMinus, FiStar, FiUserCheck, FiUserPlus
} from "react-icons/fi";

const CreateTeamModal = ({ isOpen, onClose, onTeamCreated, editTeam }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leader: "",
    members: [],
    company: "",
    color: "#5a8f6f"
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [leaderSearch, setLeaderSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [showLeaderDropdown, setShowLeaderDropdown] = useState(false);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const teamColors = [
    "#5a8f6f", // Primary green
    "#2d5f3f", // Dark green
    "#7a8b7f", // Sage green
    "#4a90e2", // Blue
    "#9b59b6", // Purple
    "#e74c3c", // Red
    "#f39c12", // Orange
    "#27ae60", // Emerald
    "#8e44ad", // Dark purple
    "#d35400"  // Dark orange
  ];

  useEffect(() => {
    if (isOpen) {
      getAvailableUsers();
      if (editTeam) {
        setFormData({
          name: editTeam.name || "",
          description: editTeam.description || "",
          leader: editTeam.leader?._id || "",
          members: editTeam.members?.map(m => m._id) || [],
          company: editTeam.company || "",
          color: editTeam.color || "#5a8f6f"
        });
      } else {
        setFormData({
          name: "",
          description: "",
          leader: "",
          members: [],
          company: "",
          color: "#5a8f6f"
        });
      }
      setLeaderSearch("");
      setMemberSearch("");
      setCompanySearch("");

      // Charger les entreprises si la modal est ouverte
      if (isOpen) {
        loadCompanies();
      }
    }
  }, [isOpen, editTeam]);

  const loadCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const response = await axiosInstance.get(API_PATHS.USERS.GET_COMPANIES);
      const companies = response.data?.companies || [];
      setCompanies(companies);
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises:', error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.company-dropdown-container')) {
        setShowCompanyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAvailableUsers = async () => {
    try {
      const response = await axiosInstance.get("/api/users?role=member");
      setAvailableUsers(response.data?.users || []);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      toast.error("Échec du chargement des utilisateurs");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Gestionnaire spécial pour le champ entreprise
  const handleCompanyChange = (value) => {
    setCompanySearch(value);
    setFormData(prev => ({ ...prev, company: value }));
    setShowCompanyDropdown(value.length > 0);
  };

  // Sélection d'une entreprise depuis les suggestions
  const selectCompany = (company) => {
    setCompanySearch(company.name);
    setFormData(prev => ({ ...prev, company: company.name }));
    setShowCompanyDropdown(false);
  };

  const handleLeaderSelect = (user) => {
    setFormData(prev => ({ ...prev, leader: user._id }));
    setLeaderSearch(user.name);
    setShowLeaderDropdown(false);
  };

  const handleAddMember = (user) => {
    if (!formData.members.includes(user._id)) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, user._id]
      }));
    }
    setMemberSearch("");
    setShowMemberDropdown(false);
  };

  const handleRemoveMember = (userId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(id => id !== userId)
    }));
  };

  const getSelectedLeader = () => {
    return availableUsers.find(u => u._id === formData.leader);
  };

  const getSelectedMembers = () => {
    return availableUsers.filter(u => formData.members.includes(u._id));
  };

  const getFilteredUsers = (searchTerm, excludeIds = []) => {
    return availableUsers.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(user => !excludeIds.includes(user._id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Le nom de l'équipe est requis");
      return;
    }

    if (!formData.leader) {
      toast.error("Un chef d'équipe doit être sélectionné");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        members: formData.members.filter(id => id !== formData.leader) // Remove leader from members if present
      };

      let response;
      if (editTeam) {
        response = await axiosInstance.put(API_PATHS.TEAMS.UPDATE_TEAM(editTeam._id), submitData);
      } else {
        response = await axiosInstance.post(API_PATHS.TEAMS.CREATE_TEAM, submitData);
      }

      toast.success(editTeam ? "Équipe mise à jour avec succès" : "Équipe créée avec succès");
      onTeamCreated(response.data.team);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error(error.response?.data?.message || "Échec de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#dfe8e1]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f4f7f4] rounded-lg">
              <FiUsers className="text-[#5a8f6f] text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1e4029]">
                {editTeam ? "Modifier l'équipe" : "Créer une nouvelle équipe"}
              </h2>
              <p className="text-[#7a8b7f] text-sm">
                {editTeam ? "Mettez à jour les informations de l'équipe" : "Définissez les membres et les rôles"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f4f7f4] rounded-lg transition-colors"
          >
            <FiX className="text-[#7a8b7f] text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                  Nom de l'équipe *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors"
                  placeholder="Ex: Équipe Développement"
                  required
                />
              </div>

            <div className="company-dropdown-container">
              <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                Entreprise
              </label>
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a8b7f]" />
                <input
                  type="text"
                  value={companySearch}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  onFocus={() => companySearch && setShowCompanyDropdown(true)}
                  className="w-full pl-10 pr-4 py-3 border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors"
                  placeholder="Nom de l'entreprise"
                />

                {/* Dropdown des suggestions d'entreprises */}
                {showCompanyDropdown && (companySearch || companies.length > 0) && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-[#dfe8e1] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {loadingCompanies ? (
                      <div className="px-4 py-3 text-sm text-[#7a8b7f]">Chargement...</div>
                    ) : (
                      <>
                        {/* Suggestions filtrées */}
                        {companies
                          .filter(company =>
                            company.name.toLowerCase().includes(companySearch.toLowerCase())
                          )
                          .map((company) => (
                            <div
                              key={company.name}
                              className="px-4 py-3 hover:bg-[#f4f7f4] cursor-pointer border-b border-[#f4f7f4] last:border-b-0"
                              onClick={() => selectCompany(company)}
                            >
                              <div className="font-medium text-[#1e4029]">{company.name}</div>
                              <div className="text-xs text-[#7a8b7f]">
                                {company.employeeCount} employé{company.employeeCount > 1 ? 's' : ''}
                                {company.industry && ` • ${company.industry}`}
                              </div>
                            </div>
                          ))}

                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full px-4 py-3 border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors resize-none"
                rows="3"
                placeholder="Décrivez l'objectif de cette équipe..."
              />
            </div>

            {/* Team Color */}
            <div>
              <div>
                <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                  Couleur de l'équipe
                </label>
                <div className="flex gap-2 flex-wrap">
                  {teamColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleInputChange("color", color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === color ? 'border-[#1e4029] scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={`Couleur ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Team Leader */}
            <div>
              <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                Chef d'équipe *
              </label>
              <div className="relative">
                <div className="relative">
                  <FiStar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a8b7f]" />
                  <input
                    type="text"
                    value={leaderSearch}
                    onChange={(e) => {
                      setLeaderSearch(e.target.value);
                      setShowLeaderDropdown(true);
                    }}
                    onFocus={() => setShowLeaderDropdown(true)}
                    className="w-full pl-10 pr-4 py-3 border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors"
                    placeholder="Rechercher un utilisateur..."
                  />
                </div>

                {showLeaderDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#dfe8e1] rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {getFilteredUsers(leaderSearch, formData.members).map(user => (
                      <div
                        key={user._id}
                        onClick={() => handleLeaderSelect(user)}
                        className="flex items-center gap-3 p-3 hover:bg-[#f4f7f4] cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-[#5a8f6f] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[#1e4029]">{user.name}</p>
                          <p className="text-sm text-[#7a8b7f]">{user.email}</p>
                        </div>
                      </div>
                    ))}
                    {getFilteredUsers(leaderSearch, formData.members).length === 0 && (
                      <div className="p-3 text-[#7a8b7f] text-sm">
                        Aucun utilisateur trouvé
                      </div>
                    )}
                  </div>
                )}

                {getSelectedLeader() && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-[#f4f7f4] rounded-lg">
                    <FiStar className="text-[#5a8f6f]" />
                    <span className="font-medium text-[#1e4029]">
                      {getSelectedLeader().name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Team Members */}
            <div>
              <label className="block text-sm font-semibold text-[#1e4029] mb-2">
                Membres de l'équipe
              </label>
              <div className="relative">
                <div className="relative">
                  <FiUserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a8b7f]" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => {
                      setMemberSearch(e.target.value);
                      setShowMemberDropdown(true);
                    }}
                    onFocus={() => setShowMemberDropdown(true)}
                    className="w-full pl-10 pr-4 py-3 border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors"
                    placeholder="Ajouter un membre..."
                  />
                </div>

                {showMemberDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#dfe8e1] rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {getFilteredUsers(memberSearch, [formData.leader, ...formData.members]).map(user => (
                      <div
                        key={user._id}
                        onClick={() => handleAddMember(user)}
                        className="flex items-center gap-3 p-3 hover:bg-[#f4f7f4] cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-[#7a8b7f] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[#1e4029]">{user.name}</p>
                          <p className="text-sm text-[#7a8b7f]">{user.email}</p>
                        </div>
                        <FiPlus className="text-[#5a8f6f] ml-auto" />
                      </div>
                    ))}
                    {getFilteredUsers(memberSearch, [formData.leader, ...formData.members]).length === 0 && (
                      <div className="p-3 text-[#7a8b7f] text-sm">
                        Aucun utilisateur disponible
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Members */}
              {getSelectedMembers().length > 0 && (
                <div className="mt-3 space-y-2">
                  {getSelectedMembers().map(member => (
                    <div key={member._id} className="flex items-center justify-between p-2 bg-[#f4f7f4] rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#7a8b7f] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {member.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-[#1e4029]">
                          {member.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FiMinus />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#dfe8e1] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-[#7a8b7f] bg-white border border-[#dfe8e1] rounded-xl hover:bg-[#f4f7f4] transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {editTeam ? "Mettre à jour" : "Créer l'équipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
