import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { 
  FiSearch, FiMail, FiPhone, FiUser, FiPlus, 
  FiEdit3, FiTrash2, FiExternalLink, FiFlag, FiCalendar
} from "react-icons/fi";
import toast from "react-hot-toast";
import DeleteUserModal from "../../components/DeleteUserModal";
import CreateTeamMemberModal from "../../components/CreateTeamMemberModal";

const UserManagement = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const roles = [
    { value: "all", label: "Tous les rôles" },
    { value: "admin", label: "Administrateur" },
    { value: "member", label: "Utilisateur" }
  ];

  const statuses = [
    { value: "all", label: "Tous les statuts" },
    { value: "active", label: "Actif" },
    { value: "inactive", label: "Inactif" }
  ];

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

    // Filtre par statut (actif/inactif basé sur la dernière connexion)
    if (selectedStatus !== "all") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (selectedStatus === "active") {
        filtered = filtered.filter((user) =>
          user.lastLoginAt && new Date(user.lastLoginAt) > thirtyDaysAgo
        );
      } else if (selectedStatus === "inactive") {
        filtered = filtered.filter((user) =>
          !user.lastLoginAt || new Date(user.lastLoginAt) <= thirtyDaysAgo
        );
      }
    }

    setFilteredUsers(filtered);
  }, [searchQuery, selectedRole, selectedStatus, allUsers]);

  // placeholder for compatibility (no grouped clients used here)
  const groupedClients = {};

  // Statistiques des utilisateurs
  const userStats = {
    total: allUsers.length,
    admins: allUsers.filter(u => u.role === 'admin').length,
    members: allUsers.filter(u => u.role === 'member').length,
    active: allUsers.filter(u => u.lastLoginAt && new Date(u.lastLoginAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    inactive: allUsers.filter(u => !u.lastLoginAt || new Date(u.lastLoginAt) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
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

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async (userId, reason) => {
    try {
      setDeletingUser(userId);
      // call delete endpoint (server may expect data payload)
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(userId), { data: { reason: reason || "Supprimé par l'administrateur" } });
      await getAllUsers();
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la suppression");
    } finally {
      setDeletingUser(null);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Équipe">
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-64 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-8 -translate-x-24"></div>
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

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <button
              onClick={handleAddUser}
              className="group bg-[#5a8f6f]/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-300 text-sm font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl hover:bg-[#5a8f6f] hover:scale-105 border border-white/10"
            >
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <FiPlus className="text-lg" />
              </div>
              Nouvel utilisateur
          </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] cursor-pointer transition-colors"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[#dfe8e1] p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-[#1e4029]">{userStats.total}</div>
            <div className="text-xs text-[#7a8b7f] font-medium">Total</div>
          </div>
          <div className="bg-white rounded-xl border border-[#dfe8e1] p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-red-600">{userStats.admins}</div>
            <div className="text-xs text-[#7a8b7f] font-medium">Admins</div>
          </div>
          <div className="bg-white rounded-xl border border-[#dfe8e1] p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-[#5a8f6f]">{userStats.members}</div>
            <div className="text-xs text-[#7a8b7f] font-medium">Utilisateurs</div>
          </div>
          <div className="bg-white rounded-xl border border-[#dfe8e1] p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
            <div className="text-xs text-[#7a8b7f] font-medium">Actifs</div>
          </div>
          <div className="bg-white rounded-xl border border-[#dfe8e1] p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-gray-500">{userStats.inactive}</div>
            <div className="text-xs text-[#7a8b7f] font-medium">Inactifs</div>
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
                  className="group bg-white rounded-2xl border border-[#dfe8e1] hover:border-[#5a8f6f] hover:shadow-xl hover:shadow-[#5a8f6f]/5 transition-all duration-300 overflow-hidden"
                    >
                  {/* Header with role color */}
                  <div
                    className={`h-12 flex items-center justify-center ${
                      user.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      'bg-gradient-to-r from-[#5a8f6f] to-[#4a7f5f]'
                    }`}
                  >
                    <span className="text-white text-xs font-semibold uppercase tracking-wider">
                      {user.role === 'admin' ? 'Administrateur' :
                       user.role === 'member' ? 'Membre' :
                       user.role === 'client' ? 'Client' :
                       user.role === 'partner' ? 'Partenaire' :
                       user.role === 'collaborator' ? 'Collaborateur' :
                       'Utilisateur'}
                    </span>
                  </div>
                      
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
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        {isActive ? 'Actif' : 'Inactif'}
                          </div>
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
                            
                    {/* Actions */}
                            <div className="flex gap-2">
                                <button
                        onClick={(e) => { e.stopPropagation(); handleEditUser(user); }}
                        className="flex-1 p-2 rounded-lg text-[#2d5f3f] bg-[#e6f0ea] hover:bg-[#e6f0ea]/80 transition-colors text-xs font-medium"
                        title="Modifier"
                                >
                        <FiEdit3 size={14} className="mx-auto" />
                                </button>
                                <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteUser(user); }}
                        disabled={deletingUser === user._id}
                        className="flex-1 p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-xs font-medium disabled:opacity-50"
                        title="Supprimer"
                      >
                        {deletingUser === user._id ? (
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border border-red-600 border-t-transparent mx-auto"></div>
                        ) : (
                          <FiTrash2 size={14} className="mx-auto" />
                        )}
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
              {searchQuery ? "Aucun utilisateur trouvé" : "Aucun utilisateur sur la plateforme"}
            </h3>
            <p className="text-[#7a8b7f] mb-6">
              {searchQuery
                ? "Essayez d'ajuster votre recherche"
                : "Commencez par ajouter votre premier utilisateur"}
            </p>
            {!searchQuery && (
              <button 
                onClick={handleAddUser}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-colors font-medium"
              >
                <FiPlus className="w-5 h-5" />
                Ajouter un utilisateur
              </button>
            )}
          </div>
        )}
      </div>

      <CreateTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onClientCreated={handleUserCreated}
        editClient={editingUser}
      />
      {isDeleteModalOpen && userToDelete && (
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          user={userToDelete}
          onConfirm={confirmDeleteUser}
        />
      )}
    </DashboardLayout>
  );
};

export default UserManagement;