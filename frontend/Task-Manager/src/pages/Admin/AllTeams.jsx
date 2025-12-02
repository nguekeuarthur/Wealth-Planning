import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  FiSearch, FiUsers, FiUserPlus, FiEdit3, FiTrash2,
  FiPlus, FiBriefcase, FiUser, FiFileText, FiStar, FiUserCheck, FiX
} from "react-icons/fi";
import toast from "react-hot-toast";
import CreateTeamModal from "../../components/CreateTeamModal";

const AllTeams = () => {
  const navigate = useNavigate();
  const [allTeams, setAllTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const departments = [
    "All Departments",
    "DEVELOPMENT",
    "DESIGN",
    "MARKETING",
    "SALES",
    "SUPPORT",
    "MANAGEMENT",
    "HR",
    "FINANCE",
    "LEGAL",
    "OTHER"
  ];

  const getAllTeams = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.TEAMS.GET_ALL_TEAMS);
      const teams = response.data?.teams || [];
      setAllTeams(teams);
      setFilteredTeams(teams);
    } catch (error) {
      console.error("Erreur lors de la récupération des équipes :", error);
      toast.error("Échec du chargement des équipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTeams();
  }, []);

  useEffect(() => {
    let filtered = allTeams;

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((team) =>
        team.name?.toLowerCase().includes(query) ||
        team.description?.toLowerCase().includes(query) ||
        team.leader?.name?.toLowerCase().includes(query)
      );
    }

    // Filter by department
    if (selectedDepartment !== "all" && selectedDepartment !== "All Departments") {
      filtered = filtered.filter(
        (team) => team.department?.toUpperCase() === selectedDepartment.toUpperCase()
      );
    }

    setFilteredTeams(filtered);
  }, [searchQuery, selectedDepartment, allTeams]);

  const handleAddTeam = () => {
    setEditingTeam(null);
    setIsModalOpen(true);
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setIsDetailsModalOpen(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleTeamCreated = (newTeam) => {
    if (editingTeam) {
      setAllTeams(allTeams.map(t => t._id === newTeam._id ? newTeam : t));
      setFilteredTeams(filteredTeams.map(t => t._id === newTeam._id ? newTeam : t));
    } else {
      setAllTeams([newTeam, ...allTeams]);
      setFilteredTeams([newTeam, ...filteredTeams]);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm("Êtes-vous sûr ? Cette action ne peut pas être annulée.")) return;
    try {
      await axiosInstance.delete(API_PATHS.TEAMS.DELETE_TEAM(teamId));
      setAllTeams(allTeams.filter(t => t._id !== teamId));
      setFilteredTeams(filteredTeams.filter(t => t._id !== teamId));
      toast.success("Équipe supprimée avec succès");
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la suppression");
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      "DEVELOPMENT": "bg-blue-50 text-blue-700 border-blue-200",
      "DESIGN": "bg-purple-50 text-purple-700 border-purple-200",
      "MARKETING": "bg-green-50 text-green-700 border-green-200",
      "SALES": "bg-yellow-50 text-yellow-700 border-yellow-200",
      "SUPPORT": "bg-red-50 text-red-700 border-red-200",
      "MANAGEMENT": "bg-indigo-50 text-indigo-700 border-indigo-200",
      "HR": "bg-pink-50 text-pink-700 border-pink-200",
      "FINANCE": "bg-emerald-50 text-emerald-700 border-emerald-200",
      "LEGAL": "bg-slate-50 text-slate-700 border-slate-200",
      "OTHER": "bg-gray-50 text-gray-700 border-gray-200"
    };
    return colors[department] || colors["OTHER"];
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Team">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a8f6f]"></div>
          <p className="mt-4 text-[#2d5f3f] font-medium">Chargement des équipes...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Team">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] rounded-2xl shadow-xl p-8 my-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
              Gestion des équipes
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Équipes de travail
            </h1>
            <p className="text-white/80 mt-2">
              Organisez vos équipes et attribuez des rôles spécifiques
            </p>
            <p className="text-white/60 mt-1 text-sm">
              {filteredTeams.length} équipe{filteredTeams.length !== 1 ? 's' : ''} dans l'organisation
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <button
              onClick={handleAddTeam}
              className="group bg-[#5a8f6f]/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-300 text-sm font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl hover:bg-[#5a8f6f] hover:scale-105 border border-white/10"
            >
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <FiPlus className="text-lg" />
              </div>
              Nouvelle équipe
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7a8b7f]" />
              <input
                type="text"
                placeholder="Rechercher par nom d'équipe, description ou chef..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] cursor-pointer transition-colors"
            >
              <option value="all">Tous les départements</option>
              {departments.slice(1).map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team._id}
                onClick={() => handleTeamClick(team)}
                className="group bg-white rounded-2xl border border-[#dfe8e1] hover:border-[#5a8f6f] hover:shadow-xl hover:shadow-[#5a8f6f]/5 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Header with color */}
                <div
                  className="h-16 flex items-center justify-center"
                  style={{ backgroundColor: team.color || '#5a8f6f' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FiUsers className="text-white text-lg" />
                    </div>
                    <div className="text-white">
                      <h3 className="font-semibold text-sm">{team.members?.length || 0} membres</h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-[#1e4029] text-lg leading-tight group-hover:text-[#2d5f3f] transition-colors line-clamp-1">
                      {team.name}
                    </h3>
                    {team.description && (
                      <p className="text-[#7a8b7f] mt-1 text-sm line-clamp-2">
                        {team.description}
                      </p>
                    )}
                  </div>

                  {/* Department Badge */}
                  {team.department && (
                    <div className="mb-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${getDepartmentColor(team.department)}`}>
                        {team.department}
                      </span>
                    </div>
                  )}

                  {/* Leader Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiUser className="text-[#7a8b7f] text-sm" />
                      <span className="text-xs text-[#7a8b7f] font-medium">Chef d'équipe</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#5a8f6f] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {team.leader?.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                      <span className="text-sm text-[#1e4029] font-medium truncate">
                        {team.leader?.name || 'Chef non défini'}
                      </span>
                    </div>
                  </div>

                  {/* Company */}
                  {team.company && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <FiBriefcase className="text-[#7a8b7f] text-sm" />
                        <span className="text-sm text-[#7a8b7f] truncate">
                          {team.company}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEditTeam(team); }}
                        className="p-2 rounded-lg text-[#2d5f3f] bg-[#e6f0ea] hover:bg-[#e6f0ea]/80 transition-colors"
                        title="Modifier"
                      >
                        <FiEdit3 size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team._id); }}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Supprimer"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white border border-[#dfe8e1] rounded-2xl">
            <div className="p-6 bg-[#f4f7f4] rounded-2xl mb-6 w-fit mx-auto">
              <FiUsers className="text-[#5a8f6f] text-6xl" />
            </div>
            <h3 className="text-xl font-medium text-[#1e4029] mb-2">
              {searchQuery ? "Aucune équipe trouvée" : "Aucune équipe créée"}
            </h3>
            <p className="text-[#7a8b7f] mb-6">
              {searchQuery
                ? "Essayez d'ajuster votre recherche"
                : "Commencez par créer votre première équipe"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddTeam}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-colors font-medium"
              >
                <FiPlus className="w-5 h-5" />
                Créer une équipe
              </button>
            )}
          </div>
        )}
      </div>

      {/* Team Details Modal */}
      {isDetailsModalOpen && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#dfe8e1]">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${selectedTeam.color || '#5a8f6f'}20` }}
                >
                  <FiUsers className="text-xl" style={{ color: selectedTeam.color || '#5a8f6f' }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1e4029]">
                    {selectedTeam.name}
                  </h2>
                  <p className="text-[#7a8b7f] text-sm">
                    Détails de l'équipe
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-2 hover:bg-[#f4f7f4] rounded-lg transition-colors"
              >
                <FiX className="text-[#7a8b7f] text-xl" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#f4f7f4] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiBriefcase className="text-[#5a8f6f]" />
                      <span className="text-sm font-semibold text-[#1e4029]">Entreprise</span>
                    </div>
                    <p className="text-[#7a8b7f]">{selectedTeam.company || 'Non spécifiée'}</p>
                  </div>

                  <div className="bg-[#f4f7f4] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiUsers className="text-[#5a8f6f]" />
                      <span className="text-sm font-semibold text-[#1e4029]">Département</span>
                    </div>
                    <p className="text-[#7a8b7f]">{selectedTeam.department || 'Non spécifié'}</p>
                  </div>
                </div>

                {/* Description */}
                {selectedTeam.description && (
                  <div className="bg-[#f4f7f4] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiFileText className="text-[#5a8f6f]" />
                      <span className="text-sm font-semibold text-[#1e4029]">Description</span>
                    </div>
                    <p className="text-[#7a8b7f]">{selectedTeam.description}</p>
                  </div>
                )}

                {/* Team Leader */}
                <div className="bg-[#f4f7f4] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiStar className="text-[#5a8f6f]" />
                    <span className="text-sm font-semibold text-[#1e4029]">Chef d'équipe</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#5a8f6f] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {selectedTeam.leader?.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[#1e4029]">{selectedTeam.leader?.name || 'Non défini'}</p>
                      <p className="text-sm text-[#7a8b7f]">{selectedTeam.leader?.email || ''}</p>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="bg-[#f4f7f4] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiUserCheck className="text-[#5a8f6f]" />
                    <span className="text-sm font-semibold text-[#1e4029]">Membres ({selectedTeam.members?.length || 0})</span>
                  </div>
                  {selectedTeam.members && selectedTeam.members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedTeam.members.map((member) => (
                        <div key={member._id} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                          <div className="w-8 h-8 bg-[#7a8b7f] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {member.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-[#1e4029] text-sm">{member.name}</p>
                            <p className="text-xs text-[#7a8b7f]">{member.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#7a8b7f] text-sm">Aucun membre dans cette équipe</p>
                  )}
                </div>

                {/* Team Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-[#dfe8e1] rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-[#5a8f6f]">{selectedTeam.members?.length || 0}</div>
                    <div className="text-xs text-[#7a8b7f]">Membres</div>
                  </div>
                  <div className="bg-white border border-[#dfe8e1] rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-[#5a8f6f]">1</div>
                    <div className="text-xs text-[#7a8b7f]">Chef</div>
                  </div>
                  <div className="bg-white border border-[#dfe8e1] rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-[#5a8f6f]">{(selectedTeam.members?.length || 0) + 1}</div>
                    <div className="text-xs text-[#7a8b7f]">Total</div>
                  </div>
                  <div className="bg-white border border-[#dfe8e1] rounded-xl p-4 text-center">
                    <div
                      className="w-6 h-6 rounded-full mx-auto mb-1"
                      style={{ backgroundColor: selectedTeam.color || '#5a8f6f' }}
                    ></div>
                    <div className="text-xs text-[#7a8b7f]">Couleur</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 p-6 border-t border-[#dfe8e1]">
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  handleEditTeam(selectedTeam);
                }}
                className="px-4 py-2 bg-[#5a8f6f] text-white rounded-xl hover:bg-[#4a7f5f] transition-colors font-medium"
              >
                Modifier l'équipe
              </button>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 text-[#7a8b7f] bg-white border border-[#dfe8e1] rounded-xl hover:bg-[#f4f7f4] transition-colors font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTeam(null);
        }}
        onTeamCreated={handleTeamCreated}
        editTeam={editingTeam}
      />
    </DashboardLayout>
  );
};

export default AllTeams;
