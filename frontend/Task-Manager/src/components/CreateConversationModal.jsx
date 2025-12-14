import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaUserPlus, FaUsers } from 'react-icons/fa';
import axios from '../utils/axiosInstance';
import { useUser } from '../context/userContext';
import { useLanguage } from '../context/languageContext';
import { API_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';

const CreateConversationModal = ({ isOpen, onClose, onConversationCreated }) => {
  const { user } = useUser();
  const { lang } = useLanguage();
  const isDev = import.meta.env.DEV;
  const [conversationType, setConversationType] = useState('private');
  const [conversationName, setConversationName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const content = {
    FR: {
      title: 'Nouvelle conversation',
      private: 'Conversation privée',
      group: 'Groupe',
      project: 'Projet',
      namePlaceholder: 'Nom de la conversation (optionnel pour privé)',
      searchPlaceholder: 'Rechercher des utilisateurs...',
      create: 'Créer',
      cancel: 'Annuler',
      selectUsers: 'Sélectionner des utilisateurs',
      noUsersFound: 'Aucun utilisateur trouvé',
      selectAtLeastOne: 'Sélectionnez au moins un utilisateur',
      nameRequired: 'Le nom est requis pour les groupes'
    },
    EN: {
      title: 'New conversation',
      private: 'Private conversation',
      group: 'Group',
      project: 'Project',
      namePlaceholder: 'Conversation name (optional for private)',
      searchPlaceholder: 'Search users...',
      create: 'Create',
      cancel: 'Cancel',
      selectUsers: 'Select users',
      noUsersFound: 'No users found',
      selectAtLeastOne: 'Select at least one user',
      nameRequired: 'Name is required for groups'
    },
    DE: {
      title: 'Neue Unterhaltung',
      private: 'Private Unterhaltung',
      group: 'Gruppe',
      project: 'Projekt',
      namePlaceholder: 'Unterhaltungsname (optional für privat)',
      searchPlaceholder: 'Benutzer suchen...',
      create: 'Erstellen',
      cancel: 'Abbrechen',
      selectUsers: 'Benutzer auswählen',
      noUsersFound: 'Keine Benutzer gefunden',
      selectAtLeastOne: 'Wählen Sie mindestens einen Benutzer aus',
      nameRequired: 'Name ist für Gruppen erforderlich'
    },
    IT: {
      title: 'Nuova conversazione',
      private: 'Conversazione privata',
      group: 'Gruppo',
      project: 'Progetto',
      namePlaceholder: 'Nome conversazione (opzionale per privato)',
      searchPlaceholder: 'Cerca utenti...',
      create: 'Crea',
      cancel: 'Annulla',
      selectUsers: 'Seleziona utenti',
      noUsersFound: 'Nessun utente trovato',
      selectAtLeastOne: 'Seleziona almeno un utente',
      nameRequired: 'Il nome è richiesto per i gruppi'
    }
  };

  const copy = content[lang] || content.FR;

  // Recherche d'utilisateurs
  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const searchUsers = async () => {
    setIsSearching(true);
    try {
      if (isDev) {
        console.log('🔍 Searching for users with term:', searchTerm);
        console.log('👤 Current user:', user);
        console.log('🌐 Making request to:', `${API_PATHS.USERS.SEARCH_USERS}?q=${searchTerm}&limit=10`);
      }

      const response = await axios.get(`${API_PATHS.USERS.SEARCH_USERS}?q=${searchTerm}&limit=10`);

      if (isDev) {
        console.log('✅ Search response received:', response);
        console.log('📊 Response data:', response.data);
        console.log('👥 Raw users from response:', response.data.users);
      }

      // Filtrer l'utilisateur actuel
      const filteredUsers = response.data.users.filter(u => u._id !== user?._id);
      if (isDev) console.log('🎯 Filtered users (excluding current user):', filteredUsers);

      setSearchResults(filteredUsers);
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      toast.error("Erreur lors de la recherche d'utilisateurs");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserSelect = (user) => {
    if (!selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== userId));
  };

  const handleCreateConversation = async () => {
    // Validation
    if (conversationType === 'group' && !conversationName.trim()) {
      toast.error(copy.nameRequired);
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error(copy.selectAtLeastOne);
      return;
    }

    setIsLoading(true);
    try {
      // Si on est en privé et qu'on sélectionne plusieurs personnes,
      // on crée 1 conversation privée par personne.
      if (conversationType === 'private' && selectedUsers.length > 1) {
        let createdCount = 0;

        for (const targetUser of selectedUsers) {
          const payload = {
            name: `${user?.name} - ${targetUser.name}`,
            type: 'private',
            participants: [targetUser._id]
          };

          if (isDev) {
            console.log('🚀 Creating conversation with payload:', payload);
            console.log('🌐 API endpoint:', API_PATHS.CHAT.CREATE_CONVERSATION);
          }

          const response = await axios.post(API_PATHS.CHAT.CREATE_CONVERSATION, payload);
          createdCount += 1;
          onConversationCreated(response.data.conversation);
        }

        toast.success(`${createdCount} conversation${createdCount > 1 ? 's' : ''} créée${createdCount > 1 ? 's' : ''} avec succès`);
        onClose();
      } else {
        const payload = {
          name: conversationType === 'private' && selectedUsers.length === 1
            ? `${user?.name} - ${selectedUsers[0].name}`
            : conversationName,
          type: conversationType,
          participants: selectedUsers.map(u => u._id)
        };

        if (isDev) {
          console.log('🚀 Creating conversation with payload:', payload);
          console.log('🌐 API endpoint:', API_PATHS.CHAT.CREATE_CONVERSATION);
        }

        const response = await axios.post(API_PATHS.CHAT.CREATE_CONVERSATION, payload);

        toast.success('Conversation créée avec succès');
        onConversationCreated(response.data.conversation);
        onClose();
      }

      // Reset form
      setConversationType('private');
      setConversationName('');
      setSelectedUsers([]);
      setSearchTerm('');

    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      console.error('🚨 Error response:', error.response);
      console.error('🚨 Error status:', error.response?.status);
      console.error('🚨 Error data:', error.response?.data);
      toast.error('Erreur lors de la création de la conversation');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">{copy.title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Type de conversation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de conversation
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConversationType('private')}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${conversationType === 'private'
                  ? 'border-[#2d5f3f] bg-[#2d5f3f]/10'
                  : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${conversationType === 'private' ? 'bg-[#2d5f3f] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <FaUserPlus size={16} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">{copy.private}</div>
                  <div className="text-xs text-gray-500">1 à 1</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setConversationType('group')}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${conversationType === 'group'
                  ? 'border-[#2d5f3f] bg-[#2d5f3f]/10'
                  : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${conversationType === 'group' ? 'bg-[#2d5f3f] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <FaUsers size={16} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">{copy.group}</div>
                  <div className="text-xs text-gray-500">Plusieurs participants</div>
                </div>
              </button>
            </div>
          </div>

          {/* Nom de la conversation */}
          {conversationType === 'group' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={conversationName}
                onChange={(e) => setConversationName(e.target.value)}
                placeholder={copy.namePlaceholder}
                className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#2d5f3f] focus:ring-4 focus:ring-[#2d5f3f]/10"
              />
            </div>
          )}

          {/* Recherche d'utilisateurs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {copy.selectUsers}
            </label>

            {/* Search input */}
            <div className="relative mb-2">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={copy.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-100 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#2d5f3f] focus:ring-4 focus:ring-[#2d5f3f]/10"
              />
            </div>

            {/* Search results */}
            {isSearching && (
              <div className="text-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2d5f3f] mx-auto"></div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="border border-gray-200 rounded-xl max-h-56 overflow-y-auto bg-white">
                {searchResults.map((resultUser) => (
                  <div
                    key={resultUser._id}
                    onClick={() => handleUserSelect(resultUser)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative w-9 h-9 bg-[#2d5f3f] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <span className="text-white text-xs font-semibold">{resultUser.name.charAt(0).toUpperCase()}</span>
                        {(resultUser.profileImageUrl || resultUser.profileImage || resultUser.avatar || resultUser.photoUrl || resultUser.imageUrl) && (
                          <img
                            src={resultUser.profileImageUrl || resultUser.profileImage || resultUser.avatar || resultUser.photoUrl || resultUser.imageUrl}
                            alt={resultUser.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.remove();
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {resultUser.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {resultUser.email}
                        </p>
                      </div>
                      <div className="text-gray-300">
                        <FaUserPlus size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchTerm.length >= 2 && !isSearching && searchResults.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                {copy.noUsersFound}
              </p>
            )}
          </div>

          {/* Utilisateurs sélectionnés */}
          {selectedUsers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Utilisateurs sélectionnés ({selectedUsers.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((selectedUser) => (
                  <div
                    key={selectedUser._id}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full"
                  >
                    <div className="relative w-6 h-6 bg-[#2d5f3f] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <span className="text-white text-[10px] font-semibold">{selectedUser.name.charAt(0).toUpperCase()}</span>
                      {(selectedUser.profileImageUrl || selectedUser.profileImage || selectedUser.avatar || selectedUser.photoUrl || selectedUser.imageUrl) && (
                        <img
                          src={selectedUser.profileImageUrl || selectedUser.profileImage || selectedUser.avatar || selectedUser.photoUrl || selectedUser.imageUrl}
                          alt={selectedUser.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.remove();
                          }}
                        />
                      )}
                    </div>
                    <span className="text-sm text-gray-900 max-w-[140px] truncate">{selectedUser.name}</span>
                    <button
                      onClick={() => handleUserRemove(selectedUser._id)}
                      className="ml-1 w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-white transition-colors"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            {copy.cancel}
          </button>
          <button
            onClick={handleCreateConversation}
            disabled={isLoading || selectedUsers.length === 0}
            className="px-5 py-2.5 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg shadow-[#2d5f3f]/10"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{copy.create}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateConversationModal;
