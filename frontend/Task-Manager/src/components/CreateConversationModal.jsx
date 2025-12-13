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
      console.log('🔍 Searching for users with term:', searchTerm);
      console.log('👤 Current user:', user);
      console.log('🌐 Making request to:', `${API_PATHS.USERS.SEARCH_USERS}?q=${searchTerm}&limit=10`);

      const response = await axios.get(`${API_PATHS.USERS.SEARCH_USERS}?q=${searchTerm}&limit=10`);

      console.log('✅ Search response received:', response);
      console.log('📊 Response data:', response.data);
      console.log('👥 Raw users from response:', response.data.users);

      // Filtrer l'utilisateur actuel
      const filteredUsers = response.data.users.filter(u => u._id !== user?._id);
      console.log('🎯 Filtered users (excluding current user):', filteredUsers);

      setSearchResults(filteredUsers);
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      console.error('🚨 Error response:', error.response);
      console.error('🚨 Error status:', error.response?.status);
      console.error('🚨 Error data:', error.response?.data);
      console.error('🚨 Error message:', error.message);

      // Afficher une alerte pour voir l'erreur
      alert(`Erreur de recherche: ${error.message}\nStatus: ${error.response?.status}\nData: ${JSON.stringify(error.response?.data)}`);
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
      const payload = {
        name: conversationType === 'private' && selectedUsers.length === 1
          ? `${user?.name} - ${selectedUsers[0].name}`
          : conversationName,
        type: conversationType,
        participants: selectedUsers.map(u => u._id)
      };

      console.log('🚀 Creating conversation with payload:', payload);
      console.log('🌐 API endpoint:', API_PATHS.CHAT.CREATE_CONVERSATION);

      const response = await axios.post(API_PATHS.CHAT.CREATE_CONVERSATION, payload);

      toast.success('Conversation créée avec succès');
      onConversationCreated(response.data.conversation);
      onClose();

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{copy.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Type de conversation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de conversation
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="private"
                  checked={conversationType === 'private'}
                  onChange={(e) => setConversationType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">{copy.private}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="group"
                  checked={conversationType === 'group'}
                  onChange={(e) => setConversationType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">{copy.group}</span>
              </label>
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2d5f3f] focus:ring-1 focus:ring-[#2d5f3f]/20"
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
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#2d5f3f] focus:ring-1 focus:ring-[#2d5f3f]/20"
              />
            </div>

            {/* Debug buttons */}
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                onClick={async () => {
                  try {
                    console.log('🔍 Testing search with "Wilfried"...');
                    const response = await axios.get(`${API_PATHS.USERS.SEARCH_USERS}?q=Wilfried&limit=10`);
                    console.log('Test search response:', response.data);
                    alert(`Test search "Wilfried": ${response.data.users.length} users found\n${response.data.users.map(u => `${u.name} (${u.email})`).join('\n')}`);
                  } catch (error) {
                    console.error('Test search error:', error);
                    alert('Test search error: ' + error.message);
                  }
                }}
                className="px-2 py-1 bg-green-500 text-white text-xs rounded"
              >
                Test "Wilfried"
              </button>
              <button
                onClick={async () => {
                  try {
                    console.log('🔍 Testing search with "ed"...');
                    const response = await axios.get(`${API_PATHS.USERS.SEARCH_USERS}?q=ed&limit=10`);
                    console.log('Test search response:', response.data);
                    alert(`Test search "ed": ${response.data.users.length} users found\n${response.data.users.map(u => `${u.name} (${u.email})`).join('\n')}`);
                  } catch (error) {
                    console.error('Test search error:', error);
                    alert('Test search error: ' + error.message);
                  }
                }}
                className="px-2 py-1 bg-orange-500 text-white text-xs rounded"
              >
                Test "ed"
              </button>
              <button
                onClick={() => {
                  // Test Socket.io connection
                  const socket = window.socket || null;
                  if (socket && socket.connected) {
                    alert('✅ Socket.io is connected!');
                    console.log('🔌 Socket.io status: Connected');
                  } else {
                    alert('❌ Socket.io is NOT connected!');
                    console.log('🔌 Socket.io status: Disconnected');
                  }
                }}
                className="px-2 py-1 bg-purple-500 text-white text-xs rounded"
              >
                Test Socket
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await axios.get(API_PATHS.USERS.DEBUG_USERS);
                    console.log('Debug response:', response.data);
                    alert(`Total users: ${response.data.totalUsers}\nCurrent user: ${response.data.currentUser?.name}\nUsers: ${JSON.stringify(response.data.users, null, 2)}`);
                  } catch (error) {
                    console.error('Debug error:', error);
                    alert('Error: ' + error.message);
                  }
                }}
                className="px-2 py-1 bg-red-500 text-white text-xs rounded"
              >
                Debug Users
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await axios.post(API_PATHS.USERS.SEED_USERS);
                    console.log('Seed response:', response.data);
                    alert(`Created ${response.data.users.length} users:\n${response.data.users.map(u => u.name).join('\n')}`);
                  } catch (error) {
                    console.error('Seed error:', error);
                    alert('Error: ' + error.message);
                  }
                }}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
              >
                Seed Users
              </button>
            </div>

            {/* Search results */}
            {isSearching && (
              <div className="text-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2d5f3f] mx-auto"></div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                {searchResults.map((resultUser) => (
                  <div
                    key={resultUser._id}
                    onClick={() => handleUserSelect(resultUser)}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#2d5f3f] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">
                          {resultUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {resultUser.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {resultUser.email}
                        </p>
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
              <div className="space-y-2">
                {selectedUsers.map((selectedUser) => (
                  <div
                    key={selectedUser._id}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-[#2d5f3f] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">{selectedUser.name}</span>
                    </div>
                    <button
                      onClick={() => handleUserRemove(selectedUser._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
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
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {copy.cancel}
          </button>
          <button
            onClick={handleCreateConversation}
            disabled={isLoading || selectedUsers.length === 0}
            className="px-4 py-2 bg-[#2d5f3f] text-white rounded-lg hover:bg-[#1e4029] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
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
