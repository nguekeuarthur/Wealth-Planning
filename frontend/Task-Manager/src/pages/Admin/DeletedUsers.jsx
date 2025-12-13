import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  FiSearch, FiMail, FiPhone, FiUser, FiCalendar, FiX,
  FiTrash2, FiArrowLeft, FiClock
} from "react-icons/fi";
import toast from "react-hot-toast";

const DeletedUsers = () => {
  const navigate = useNavigate();
  const [allDeletedUsers, setAllDeletedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const getDeletedUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.USERS.GET_DELETED_USERS);
      const users = response.data?.users || [];
      setAllDeletedUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs supprimés :", error);
      toast.error("Échec du chargement des utilisateurs supprimés");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDeletedUsers();
  }, []);

  useEffect(() => {
    let filtered = allDeletedUsers;

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

    setFilteredUsers(filtered);
  }, [searchQuery, allDeletedUsers]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'member': return 'Membre';
      case 'client': return 'Client';
      case 'partner': return 'Partenaire';
      case 'collaborator': return 'Collaborateur';
      default: return 'Utilisateur';
    }
  };

  return (
    <DashboardLayout activeMenu="Utilisateurs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/team')}
              className="flex items-center gap-2 px-4 py-2 text-[#7a8b7f] bg-white border border-[#dfe8e1] rounded-xl hover:bg-[#f4f7f4] transition-colors"
            >
              <FiArrowLeft size={16} />
              Retour
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#1e4029]">Utilisateurs supprimés</h1>
              <p className="text-[#7a8b7f]">Historique des utilisateurs supprimés récemment</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-lg">
            <FiTrash2 size={14} />
            <span className="text-sm font-medium">{allDeletedUsers.length} supprimés</span>
          </div>
        </div>

        {/* Search */}
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

        {/* Users Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a8f6f]"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user)}
                className="group bg-white rounded-2xl border border-[#dfe8e1] hover:border-[#5a8f6f] hover:shadow-xl hover:shadow-[#5a8f6f]/5 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Header with role color - Red for deleted */}
                <div className="h-6 bg-gradient-to-r from-red-500 to-red-600"></div>

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
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
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
                    <p className="text-red-600 text-xs font-medium mt-1">
                      {getRoleLabel(user.role)}
                    </p>
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
                  <div className="mb-4 p-2 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FiClock className="text-red-600" size={12} />
                      <span className="text-xs text-red-700 font-medium">Supprimé le</span>
                    </div>
                    <span className="text-xs text-red-800">
                      {user.deletedAt ? formatDate(user.deletedAt) : 'Date inconnue'}
                    </span>
                  </div>

                  {/* Reason */}
                  {user.deletionReason && (
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FiTrash2 className="text-gray-600" size={12} />
                        <span className="text-xs text-gray-700 font-medium">Raison</span>
                      </div>
                      <span className="text-xs text-gray-800">{user.deletionReason}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white border border-[#dfe8e1] rounded-2xl">
            <div className="p-6 bg-[#f4f7f4] rounded-2xl mb-6 w-fit mx-auto">
              <FiTrash2 className="text-[#7a8b7f] text-6xl" />
            </div>
            <h3 className="text-xl font-medium text-[#1e4029] mb-2">
              {searchQuery ? "Aucun utilisateur supprimé trouvé" : "Aucun utilisateur supprimé"}
            </h3>
            <p className="text-[#7a8b7f] mb-6">
              {searchQuery
                ? "Essayez d'ajuster votre recherche"
                : "Les utilisateurs supprimés apparaîtront ici"}
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {isDetailsModalOpen && selectedUser && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setIsDetailsModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#dfe8e1] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <FiTrash2 className="text-red-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1e4029]">
                    {selectedUser.name}
                  </h2>
                  <p className="text-red-600 text-sm">
                    Utilisateur supprimé - {getRoleLabel(selectedUser.role)}
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
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#f4f7f4] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMail className="text-[#5a8f6f]" />
                      <span className="text-sm font-semibold text-[#1e4029]">Email</span>
                    </div>
                    <p className="text-[#7a8b7f]">{selectedUser.email}</p>
                  </div>

                  <div className="bg-[#f4f7f4] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiUser className="text-[#5a8f6f]" />
                      <span className="text-sm font-semibold text-[#1e4029]">Rôle</span>
                    </div>
                    <p className="text-[#7a8b7f]">
                      {getRoleLabel(selectedUser.role)}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedUser.phoneNumber && (
                    <div className="bg-[#f4f7f4] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiPhone className="text-[#5a8f6f]" />
                        <span className="text-sm font-semibold text-[#1e4029]">Téléphone</span>
                      </div>
                      <p className="text-[#7a8b7f]">{selectedUser.phoneNumber}</p>
                    </div>
                  )}

                  {selectedUser.company && (
                    <div className="bg-[#f4f7f4] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiUser className="text-[#5a8f6f]" />
                        <span className="text-sm font-semibold text-[#1e4029]">Entreprise</span>
                      </div>
                      <p className="text-[#7a8b7f]">{selectedUser.company}</p>
                    </div>
                  )}

                  <div className="bg-[#f4f7f4] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCalendar className="text-[#5a8f6f]" />
                      <span className="text-sm font-semibold text-[#1e4029]">Date d'inscription</span>
                    </div>
                    <p className="text-[#7a8b7f]">
                      {selectedUser.createdAt ? formatDate(selectedUser.createdAt) : 'Non spécifiée'}
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FiClock className="text-red-600" />
                      <span className="text-sm font-semibold text-red-800">Date de suppression</span>
                    </div>
                    <p className="text-red-700">
                      {selectedUser.deletedAt ? formatDate(selectedUser.deletedAt) : 'Non spécifiée'}
                    </p>
                  </div>
                </div>

                {/* Deletion Reason */}
                {selectedUser.deletionReason && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FiTrash2 className="text-red-600" />
                      <span className="text-sm font-semibold text-red-800">Raison de suppression</span>
                    </div>
                    <p className="text-red-700">{selectedUser.deletionReason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 p-6 border-t border-[#dfe8e1] flex-shrink-0">
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
    </DashboardLayout>
  );
};

export default DeletedUsers;
