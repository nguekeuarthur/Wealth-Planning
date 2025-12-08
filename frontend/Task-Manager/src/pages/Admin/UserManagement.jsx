import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  FiSearch, FiMail, FiPhone, FiUser, FiPlus,
  FiEdit3, FiTrash2, FiExternalLink, FiFlag, FiCalendar, FiUsers, FiX, FiBriefcase, FiMapPin, FiGlobe, FiStar
} from "react-icons/fi";
import toast from "react-hot-toast";
import CreateTeamMemberModal from "../../components/CreateTeamMemberModal";

const UserManagement = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const roles = [
    { value: "all", label: "Tous les rôles" },
    { value: "admin", label: "Administrateur" },
    { value: "member", label: "Membre" },
    { value: "client", label: "Client" },
    { value: "partner", label: "Partenaire" },
    { value: "collaborator", label: "Collaborateur" }
  ];

  // Fonction helper pour convertir les rôles en labels français
  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'member':
        return 'Membre';
      case 'client':
        return 'Client';
      case 'partner':
        return 'Partenaire';
      case 'collaborator':
        return 'Collaborateur';
      default:
        return 'Utilisateur';
    }
  };


  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      const users = response.data?.users || [];
      setAllUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      toast.error("Échec du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    let filtered = allUsers;

    // Filtre par recherche
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phoneNumber?.toLowerCase().includes(query) ||
        user.company?.toLowerCase().includes(query)
      );
    }

    // Filtre par rôle
    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, selectedRole, allUsers]);

  // Statistiques des utilisateurs
  const userStats = {
    total: allUsers.length,
    admins: allUsers.filter(u => u.role === 'admin').length,
    members: allUsers.filter(u => u.role === 'member').length,
    active: allUsers.filter(u => u.status !== 'inactive').length,
    inactive: allUsers.filter(u => u.status === 'inactive').length
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      nationality: user.nationality || '',
      birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
      role: user.role || 'member',
      company: user.company || '',
      address: user.address || '',
      website: user.website || '',
      companyEmail: user.companyEmail || '',
      companyPhone: user.companyPhone || '',
      organizationName: user.organizationName || '',
      position: user.position || '',
      professionalPhone: user.professionalPhone || '',
      professionalEmail: user.professionalEmail || '',
      professionalAddress: user.professionalAddress || '',
      specialization: user.specialization || '',
      experience: user.experience || '',
      notes: user.notes || ''
    });
    setIsDetailsModalOpen(false); // Fermer d'abord le modal de détails
    setTimeout(() => {
      setIsEditMode(true);
      setIsDetailsModalOpen(true); // Ouvrir en mode édition
    }, 100);
  };

  const handleUserCreated = (newUser) => {
    if (editingUser) {
      setAllUsers(allUsers.map(u => u._id === newUser._id ? newUser : u));
      setFilteredUsers(filteredUsers.map(u => u._id === newUser._id ? newUser : u));
    } else {
      setAllUsers([newUser, ...allUsers]);
      setFilteredUsers([newUser, ...filteredUsers]);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rapport Utilisateur.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading details:", error);
      toast.error("Failed to download details. Please try again.");
    }
  };

  const handleSaveUserEdit = async () => {
    try {
      await axiosInstance.put(API_PATHS.USERS.UPDATE_USER(selectedUser._id), editFormData);

      // Mettre à jour la liste des utilisateurs localement
      const updatedUsers = allUsers.map(user =>
        user._id === selectedUser._id ? { ...user, ...editFormData } : user
      );
      setAllUsers(updatedUsers);

      // Re-filtrer les utilisateurs
      let filtered = updatedUsers;
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.phoneNumber?.toLowerCase().includes(query) ||
          user.company?.toLowerCase().includes(query)
        );
      }
      if (selectedRole !== "all") {
        filtered = filtered.filter((user) => user.role === selectedRole);
      }
      setFilteredUsers(filtered);

      setIsEditMode(false);
      toast.success("Utilisateur modifié avec succès");
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la modification");
    }
  };

  const handleReactivateUser = async (userId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir réactiver cet utilisateur ?")) return;
    try {
      setDeletingUser(userId);
      await axiosInstance.put(API_PATHS.USERS.UPDATE_USER(userId), {
        status: "active"
      });

      // Mettre à jour la liste des utilisateurs localement
      const updatedUsers = allUsers.map(user =>
        user._id === userId ? { ...user, status: "active" } : user
      );
      setAllUsers(updatedUsers);

      // Re-filtrer les utilisateurs
      let filtered = updatedUsers;
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.phoneNumber?.toLowerCase().includes(query) ||
          user.company?.toLowerCase().includes(query)
        );
      }
      if (selectedRole !== "all") {
        filtered = filtered.filter((user) => user.role === selectedRole);
      }
      setFilteredUsers(filtered);

      toast.success("Utilisateur réactivé avec succès");
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la réactivation");
    } finally {
      setDeletingUser(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    const reason = window.prompt("Raison de la suppression (optionnel) :", "Supprimé par l'administrateur");
    if (reason === null) return; // Annulé par l'utilisateur

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ? Cette action ne peut pas être annulée.")) return;

    try {
      setDeletingUser(userId);
      // D'abord marquer comme inactif
      await axiosInstance.put(API_PATHS.USERS.UPDATE_USER(userId), {
        status: "inactive"
      });

      // Créer une trace de désactivation
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(userId), {
        data: { reason: reason || "Désactivé par l'administrateur" }
      });

      // Mettre à jour la liste des utilisateurs localement
      const updatedUsers = allUsers.map(user =>
        user._id === userId ? { ...user, status: "inactive" } : user
      );
      setAllUsers(updatedUsers);

      // Re-filtrer les utilisateurs
      let filtered = updatedUsers;
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.phoneNumber?.toLowerCase().includes(query) ||
          user.company?.toLowerCase().includes(query)
        );
      }
      if (selectedRole !== "all") {
        filtered = filtered.filter((user) => user.role === selectedRole);
      }
      setFilteredUsers(filtered);

      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la désactivation");
    } finally {
      setDeletingUser(null);
    }
  };


  if (loading) {
    return (
      <DashboardLayout activeMenu="Team">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a8f6f]"></div>
          <p className="mt-4 text-[#2d5f3f] font-medium">Chargement de l'équipe...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Team">
      {/* Header Section with Enhanced Design */}
      <div className="relative bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] rounded-2xl shadow-xl p-8 my-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Title Section */}
          <div className="flex-1">
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
              Gestion des Utilisateurs
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Utilisateurs de la plateforme
            </h1>
            <p className="text-white/80 mt-2">
              Gérez et suivez tous les utilisateurs de votre plateforme
            </p>
            <p className="text-white/60 mt-1 text-sm">
              {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} sur {userStats.total} total
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-[#5a8f6f] text-white rounded-xl hover:bg-[#4a7f5f] transition-colors shadow-lg hover:shadow-xl"
            >
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M8 13h2"></path>
                <path d="M14 13h2"></path>
                <path d="M8 17h2"></path>
                <path d="M14 17h2"></path>
              </svg>
              Télécharger le rapport
            </button>
            <button
              onClick={() => navigate('/admin/deleted-users')}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors shadow-md hover:shadow-lg"
            >
              <FiTrash2 size={16} />
              Utilisateurs supprimés
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7a8b7f]" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] cursor-pointer transition-colors"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Recently Deactivated Users */}
        {allUsers.some(user => user.status === 'inactive') && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiTrash2 className="text-red-600" size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-red-800">
                    {allUsers.filter(user => user.status === 'inactive').length} utilisateur(s) désactivé(s)
                  </h3>
                  <p className="text-xs text-red-600">Cliquez pour réactiver</p>
                </div>
              </div>
              <div className="flex gap-2">
                {allUsers.filter(user => user.status === 'inactive').slice(0, 3).map((user) => (
                  <button
                    key={user._id}
                    onClick={() => handleReactivateUser(user._id)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm"
                    title={`Réactiver ${user.name}`}
                  >
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold text-xs">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-red-800 font-medium">{user.name?.split(' ')[0] || 'Utilisateur'}</span>
                  </button>
                ))}
                {allUsers.filter(user => user.status === 'inactive').length > 3 && (
                  <div className="px-3 py-2 bg-red-200 text-red-800 rounded-lg text-sm font-medium">
                    +{allUsers.filter(user => user.status === 'inactive').length - 3} autres
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[#dfe8e1] p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-[#1e4029]">{userStats.total}</div>
            <div className="text-xs text-[#7a8b7f] font-medium">Total</div>
          </div>
          <div className="bg-white rounded-xl border border-[#dfe8e1] p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-red-600">{userStats.admins}</div>
            <div className="text-xs text-[#7a8b7f] font-medium">Administrateurs</div>
          </div>
          <div className="bg-white rounded-xl border border-[#dfe8e1] p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-[#5a8f6f]">{userStats.members}</div>
            <div className="text-xs text-[#7a8b7f] font-medium">Membres</div>
          </div>
          <div className="bg-white rounded-xl border border-[#dfe8e1] p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
            <div className="text-xs text-[#7a8b7f] font-medium">Actifs</div>
          </div>
          <div className="bg-white rounded-xl border border-[#dfe8e1] p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-gray-500">{userStats.inactive}</div>
            <div className="text-xs text-[#7a8b7f] font-medium">Désactivés</div>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => {
              const isActive = user.lastLoginAt && new Date(user.lastLoginAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 jours

              return (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user)}
                  className="group bg-white rounded-2xl border border-[#dfe8e1] hover:border-[#5a8f6f] hover:shadow-xl hover:shadow-[#5a8f6f]/5 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Header with role color */}
                  <div
                    className={`h-6 ${
                      user.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      'bg-gradient-to-r from-[#5a8f6f] to-[#4a7f5f]'
                    }`}
                  ></div>

                  {/* Avatar */}
                  <div className="flex justify-center -mt-6">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                      {user.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div className={`w-full h-full rounded-full bg-gradient-to-br from-[#5a8f6f] to-[#2d5f3f] flex items-center justify-center ${user.profileImageUrl ? 'hidden' : 'flex'}`}>
                        <span className="text-white font-bold">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-6 pb-6">
                    <div className="text-center mb-4">
                      <h3 className="font-bold text-[#1e4029] text-lg leading-tight group-hover:text-[#2d5f3f] transition-colors line-clamp-1">
                        {user.name || "Utilisateur sans nom"}
                      </h3>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <FiMail className="text-[#7a8b7f] flex-shrink-0" size={14} />
                        <span className="text-sm text-[#7a8b7f] truncate">{user.email}</span>
                      </div>

                      {user.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <FiPhone className="text-[#7a8b7f] flex-shrink-0" size={14} />
                          <span className="text-sm text-[#7a8b7f]">{user.phoneNumber}</span>
                        </div>
                      )}

                      {user.company && (
                        <div className="flex items-center gap-2">
                          <FiUser className="text-[#7a8b7f] flex-shrink-0" size={14} />
                          <span className="text-sm text-[#7a8b7f] truncate">{user.company}</span>
                        </div>
                      )}
                    </div>

                    {/* Last Login */}
                    <div className="mb-4 p-2 bg-[#f4f7f4] rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FiCalendar className="text-[#5a8f6f]" size={12} />
                        <span className="text-xs text-[#7a8b7f] font-medium">Dernière connexion</span>
                      </div>
                      <span className="text-xs text-[#1e4029]">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Jamais connecté'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditUser(user);
                          }}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                        >
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                          Modifier
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(user._id);
                          }}
                          disabled={deletingUser === user._id}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          <FiTrash2 size={12} />
                          Supprimer
                        </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white border border-[#dfe8e1] rounded-2xl">
            <div className="p-6 bg-[#f4f7f4] rounded-2xl mb-6 w-fit mx-auto">
              <FiUser className="text-[#5a8f6f] text-6xl" />
            </div>
            <h3 className="text-xl font-medium text-[#1e4029] mb-2">
              {searchQuery
                ? selectedRole !== "all"
                  ? `Aucun ${getRoleLabel(selectedRole).toLowerCase()} trouvé`
                  : "Aucun utilisateur trouvé"
                : selectedRole !== "all"
                  ? `Aucun ${getRoleLabel(selectedRole).toLowerCase()} sur la plateforme`
                  : "Aucun utilisateur sur la plateforme"}
            </h3>
            <p className="text-[#7a8b7f] mb-6">
              {searchQuery
                ? "Essayez d'ajuster votre recherche"
                : selectedRole !== "all"
                  ? `Il n'y a actuellement aucun utilisateur avec le rôle "${getRoleLabel(selectedRole).toLowerCase()}"`
                  : "La plateforme ne contient actuellement aucun utilisateur"}
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {isDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#dfe8e1]">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    selectedUser.role === 'admin' ? 'bg-red-100' : 'bg-[#f4f7f4]'
                  }`}
                >
                  <FiUser
                    className={`text-xl ${
                      selectedUser.role === 'admin' ? 'text-red-600' : 'text-[#5a8f6f]'
                    }`}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1e4029]">
                    {selectedUser.name || "Utilisateur sans nom"}
                  </h2>
                  <p className="text-[#7a8b7f] text-sm">
                    {getRoleLabel(selectedUser.role)}
                  </p>
                </div>
              </div>
              {isEditMode ? (
                <button
                  onClick={() => setIsEditMode(false)}
                  className="p-2 hover:bg-[#f4f7f4] rounded-lg transition-colors"
                >
                  <FiX className="text-[#7a8b7f] text-xl" />
                </button>
              ) : (
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-2 hover:bg-[#f4f7f4] rounded-lg transition-colors"
                >
                  <FiX className="text-[#7a8b7f] text-xl" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#f4f7f4] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMail className="text-[#5a8f6f]" />
                      <span className="text-sm font-semibold text-[#1e4029]">Email</span>
                    </div>
                    {isEditMode ? (
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors text-[#1e4029]"
                      />
                    ) : (
                      <p className="text-[#7a8b7f]">{selectedUser.email}</p>
                    )}
                  </div>

                  <div className="bg-[#f4f7f4] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiUser className="text-[#5a8f6f]" />
                      <span className="text-sm font-semibold text-[#1e4029]">Rôle</span>
                    </div>
                    {isEditMode ? (
                      <select
                        value={editFormData.role}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors text-[#1e4029]"
                      >
                        <option value="admin">Administrateur</option>
                        <option value="member">Membre</option>
                        <option value="client">Client</option>
                        <option value="partner">Partenaire</option>
                        <option value="collaborator">Collaborateur</option>
                      </select>
                    ) : (
                      <p className="text-[#7a8b7f]">
                        {getRoleLabel(selectedUser.role)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#f4f7f4] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiPhone className="text-[#5a8f6f]" />
                      <span className="text-sm font-semibold text-[#1e4029]">Téléphone</span>
                    </div>
                    {isEditMode ? (
                      <input
                        type="tel"
                        value={editFormData.phoneNumber}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="Ex: +33 6 12 34 56 78"
                        className="w-full px-3 py-2 bg-white border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors text-[#1e4029]"
                      />
                    ) : (
                      <p className="text-[#7a8b7f]">
                        {selectedUser.phoneNumber || 'Non renseigné'}
                      </p>
                    )}
                  </div>

                  <div className="bg-[#f4f7f4] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiFlag className="text-[#5a8f6f]" />
                      <span className="text-sm font-semibold text-[#1e4029]">Nationalité</span>
                    </div>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editFormData.nationality}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, nationality: e.target.value }))}
                        placeholder="Ex: Française"
                        className="w-full px-3 py-2 bg-white border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors text-[#1e4029]"
                      />
                    ) : (
                      <p className="text-[#7a8b7f]">
                        {selectedUser.nationality || 'Non renseignée'}
                      </p>
                    )}
                  </div>

                  <div className="bg-[#f4f7f4] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCalendar className="text-[#5a8f6f]" />
                      <span className="text-sm font-semibold text-[#1e4029]">Date d'anniversaire</span>
                    </div>
                    {isEditMode ? (
                      <input
                        type="date"
                        value={editFormData.birthDate}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors text-[#1e4029]"
                      />
                    ) : (
                      <p className="text-[#7a8b7f]">
                        {selectedUser.birthDate
                          ? new Date(selectedUser.birthDate).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })
                          : 'Non renseignée'
                        }
                      </p>
                    )}
                  </div>

                  {/* Informations spécifiques selon le rôle */}
                  {(selectedUser.role === 'client' || selectedUser.role === 'collaborator') && selectedUser.company && (
                    <div className="bg-[#f4f7f4] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiBriefcase className="text-[#5a8f6f]" />
                        <span className="text-sm font-semibold text-[#1e4029]">Entreprise</span>
                      </div>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editFormData.company}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full px-3 py-2 bg-white border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors text-[#1e4029]"
                        />
                      ) : (
                        <p className="text-[#7a8b7f]">{selectedUser.company}</p>
                      )}
                    </div>
                  )}

                  {selectedUser.role === 'partner' && selectedUser.organizationName && (
                    <div className="bg-[#f4f7f4] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiBriefcase className="text-[#5a8f6f]" />
                        <span className="text-sm font-semibold text-[#1e4029]">Organisation</span>
                      </div>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editFormData.organizationName}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                          className="w-full px-3 py-2 bg-white border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors text-[#1e4029]"
                        />
                      ) : (
                        <p className="text-[#7a8b7f]">{selectedUser.organizationName}</p>
                      )}
                    </div>
                  )}

                  {selectedUser.role === 'partner' && selectedUser.position && (
                    <div className="bg-[#f4f7f4] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiUser className="text-[#5a8f6f]" />
                        <span className="text-sm font-semibold text-[#1e4029]">Poste</span>
                      </div>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editFormData.position}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, position: e.target.value }))}
                          className="w-full px-3 py-2 bg-white border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors text-[#1e4029]"
                        />
                      ) : (
                        <p className="text-[#7a8b7f]">{selectedUser.position}</p>
                      )}
                    </div>
                  )}

                  {selectedUser.role === 'partner' && selectedUser.specialization && (
                    <div className="bg-[#f4f7f4] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiStar className="text-[#5a8f6f]" />
                        <span className="text-sm font-semibold text-[#1e4029]">Domaine d'expertise</span>
                      </div>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editFormData.specialization}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, specialization: e.target.value }))}
                          className="w-full px-3 py-2 bg-white border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors text-[#1e4029]"
                        />
                      ) : (
                        <p className="text-[#7a8b7f]">{selectedUser.specialization}</p>
                      )}
                    </div>
                  )}

                  {/* Adresses professionnelles */}
                  {((selectedUser.role === 'client' || selectedUser.role === 'collaborator') && selectedUser.address) ||
                   (selectedUser.role === 'partner' && selectedUser.professionalAddress) ? (
                    <div className="bg-[#f4f7f4] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiMapPin className="text-[#5a8f6f]" />
                        <span className="text-sm font-semibold text-[#1e4029]">Adresse professionnelle</span>
                      </div>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={selectedUser.role === 'partner' ? editFormData.professionalAddress : editFormData.address}
                          onChange={(e) => setEditFormData(prev => ({
                            ...prev,
                            [selectedUser.role === 'partner' ? 'professionalAddress' : 'address']: e.target.value
                          }))}
                          className="w-full px-3 py-2 bg-white border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors text-[#1e4029]"
                        />
                      ) : (
                        <p className="text-[#7a8b7f]">
                          {selectedUser.role === 'partner' ? selectedUser.professionalAddress : selectedUser.address}
                        </p>
                      )}
                    </div>
                  ) : null}

                  {/* Emails professionnels */}
                  {((selectedUser.role === 'client' || selectedUser.role === 'collaborator') && selectedUser.companyEmail) ||
                   (selectedUser.role === 'partner' && selectedUser.professionalEmail) ? (
                    <div className="bg-[#f4f7f4] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiMail className="text-[#5a8f6f]" />
                        <span className="text-sm font-semibold text-[#1e4029]">Email professionnel</span>
                      </div>
                      {isEditMode ? (
                        <input
                          type="email"
                          value={selectedUser.role === 'partner' ? editFormData.professionalEmail : editFormData.companyEmail}
                          onChange={(e) => setEditFormData(prev => ({
                            ...prev,
                            [selectedUser.role === 'partner' ? 'professionalEmail' : 'companyEmail']: e.target.value
                          }))}
                          className="w-full px-3 py-2 bg-white border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors text-[#1e4029]"
                        />
                      ) : (
                        <p className="text-[#7a8b7f]">
                          {selectedUser.role === 'partner' ? selectedUser.professionalEmail : selectedUser.companyEmail}
                        </p>
                      )}
                    </div>
                  ) : null}

                  {/* Téléphones professionnels */}
                  {((selectedUser.role === 'client' || selectedUser.role === 'collaborator') && selectedUser.companyPhone) ||
                   (selectedUser.role === 'partner' && selectedUser.professionalPhone) ? (
                    <div className="bg-[#f4f7f4] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiPhone className="text-[#5a8f6f]" />
                        <span className="text-sm font-semibold text-[#1e4029]">Téléphone professionnel</span>
                      </div>
                      {isEditMode ? (
                        <input
                          type="tel"
                          value={selectedUser.role === 'partner' ? editFormData.professionalPhone : editFormData.companyPhone}
                          onChange={(e) => setEditFormData(prev => ({
                            ...prev,
                            [selectedUser.role === 'partner' ? 'professionalPhone' : 'companyPhone']: e.target.value
                          }))}
                          className="w-full px-3 py-2 bg-white border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors text-[#1e4029]"
                        />
                      ) : (
                        <p className="text-[#7a8b7f]">
                          {selectedUser.role === 'partner' ? selectedUser.professionalPhone : selectedUser.companyPhone}
                        </p>
                      )}
                    </div>
                  ) : null}

                  {/* Sites web */}
                  {selectedUser.website && (
                    <div className="bg-[#f4f7f4] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiGlobe className="text-[#5a8f6f]" />
                        <span className="text-sm font-semibold text-[#1e4029]">Site web</span>
                      </div>
                      {isEditMode ? (
                        <input
                          type="url"
                          value={editFormData.website}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, website: e.target.value }))}
                          className="w-full px-3 py-2 bg-white border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors text-[#1e4029]"
                        />
                      ) : (
                        <p className="text-[#7a8b7f]">{selectedUser.website}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Account Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#f4f7f4] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCalendar className="text-[#5a8f6f]" />
                      <span className="text-sm font-semibold text-[#1e4029]">Inscription</span>
                    </div>
                    <p className="text-[#7a8b7f]">
                      {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="bg-[#f4f7f4] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCalendar className="text-[#5a8f6f]" />
                      <span className="text-sm font-semibold text-[#1e4029]">Dernière connexion</span>
                    </div>
                    <p className="text-[#7a8b7f]">
                      {selectedUser.lastLoginAt
                        ? new Date(selectedUser.lastLoginAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'Jamais connecté'
                      }
                    </p>
                  </div>
                </div>

                {/* Team & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Teams Info */}
                  <div className="bg-[#f4f7f4] rounded-xl p-4 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FiUsers className="text-[#5a8f6f]" />
                        <span className="text-sm font-semibold text-[#1e4029]">Équipes</span>
                      </div>
                      {selectedUser.teams && selectedUser.teams.length > 0 ? (
                        <div className="space-y-2">
                          {selectedUser.teams.map((team, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-[#5a8f6f] rounded-full flex items-center justify-center">
                                <FiUsers size={12} className="text-white" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm text-[#1e4029] font-medium">
                                  {team?.name || 'Équipe assignée'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#7a8b7f] italic">Aucune équipe assignée</p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-white border border-[#dfe8e1] rounded-xl p-4 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedUser.lastLoginAt && new Date(selectedUser.lastLoginAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                          ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-sm font-semibold text-[#1e4029]">Statut du compte</span>
                    </div>
                    <p className={`text-sm ${
                      selectedUser.lastLoginAt && new Date(selectedUser.lastLoginAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {selectedUser.lastLoginAt && new Date(selectedUser.lastLoginAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        ? 'Actif (connecté récemment)' : 'Inactif (pas de connexion récente)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 p-6 border-t border-[#dfe8e1] flex-shrink-0">
              {isEditMode ? (
                <>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="px-4 py-2 text-[#7a8b7f] bg-white border border-[#dfe8e1] rounded-xl hover:bg-[#f4f7f4] transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveUserEdit}
                    className="px-4 py-2 bg-[#5a8f6f] text-white rounded-xl hover:bg-[#4a7f5f] transition-colors font-medium"
                  >
                    Sauvegarder
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-4 py-2 text-[#7a8b7f] bg-white border border-[#dfe8e1] rounded-xl hover:bg-[#f4f7f4] transition-colors font-medium"
                >
                  Fermer
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <CreateTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onClientCreated={handleUserCreated}
        editClient={editingUser}
      />
    </DashboardLayout>
  );
};

export default UserManagement;
