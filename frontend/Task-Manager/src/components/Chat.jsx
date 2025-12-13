import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPaperPlane, FaSmile, FaPaperclip, FaUsers, FaPlus, FaSearch } from 'react-icons/fa';
import { io } from 'socket.io-client';
import axios from '../utils/axiosInstance';
import { useUser } from '../context/userContext';
import { useLanguage } from '../context/languageContext';
import { API_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';
import CreateConversationModal from './CreateConversationModal';

const Chat = () => {
  const { user } = useUser();
  const { lang } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const content = {
    FR: {
      placeholder: "Tapez votre message...",
      send: "Envoyer",
      search: "Rechercher des conversations...",
      newConversation: "Nouvelle conversation",
      online: "En ligne",
      typing: "est en train d'écrire...",
      noConversations: "Aucune conversation",
      startConversation: "Commencez une nouvelle conversation"
    },
    EN: {
      placeholder: "Type your message...",
      send: "Send",
      search: "Search conversations...",
      newConversation: "New conversation",
      online: "Online",
      typing: "is typing...",
      noConversations: "No conversations",
      startConversation: "Start a new conversation"
    },
    DE: {
      placeholder: "Nachricht eingeben...",
      send: "Senden",
      search: "Unterhaltungen suchen...",
      newConversation: "Neue Unterhaltung",
      online: "Online",
      typing: "tippt...",
      noConversations: "Keine Unterhaltungen",
      startConversation: "Neue Unterhaltung starten"
    },
    IT: {
      placeholder: "Scrivi il tuo messaggio...",
      send: "Invia",
      search: "Cerca conversazioni...",
      newConversation: "Nuova conversazione",
      online: "Online",
      typing: "sta scrivendo...",
      noConversations: "Nessuna conversazione",
      startConversation: "Inizia una nuova conversazione"
    }
  };

  const copy = content[lang] || content.FR;

  // Charger les conversations
  const loadConversations = async () => {
    try {
      console.log('🔄 Loading conversations...');
      const response = await axios.get(API_PATHS.CHAT.GET_CONVERSATIONS);
      console.log('📋 Conversations loaded:', response.data.conversations.length, 'conversations');
      console.log('📝 Conversation details:', response.data.conversations.map(c => ({ name: c.name, id: c._id })));
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des conversations:', error);
      console.error('🚨 Error details:', error.response?.data);
    }
  };

  // Charger les messages d'une conversation
  const loadMessages = useCallback(async (conversationId) => {
    try {
      const response = await axios.get(API_PATHS.CHAT.GET_CONVERSATION_MESSAGES(conversationId));
      setMessages(response.data.messages);
      scrollToBottom();

      // Rejoindre la conversation via Socket.io
      socketRef.current?.emit('joinConversation', conversationId);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  }, []);

  // Initialiser Socket.io
  useEffect(() => {
    socketRef.current = io('http://localhost:8000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to chat server');
    });

    // Écouter les nouveaux messages en temps réel
    socketRef.current.on('newMessage', (message) => {
      console.log('📨 New message received via Socket.io:', message);

      // Si c'est la conversation active, ajouter le message immédiatement
      if (message.conversation === activeConversation?._id) {
        console.log('✅ Message for active conversation, adding to UI');
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      } else {
        console.log('⏭️ Message for different conversation, updating conversation list');
      }

      // Mettre à jour la liste des conversations localement au lieu de tout recharger
      setConversations(prevConversations => {
        const conversationIndex = prevConversations.findIndex(c => c._id === message.conversation);
        // Si la conversation existe, la remonter en haut de la liste
        if (conversationIndex > -1) {
          const updatedConversation = prevConversations[conversationIndex];
          const otherConversations = prevConversations.filter(c => c._id !== message.conversation);
          return [updatedConversation, ...otherConversations];
        }
        // Si la conversation n'est pas dans la liste, recharger la liste complète.
        // Cela peut arriver si une nouvelle conversation est créée par quelqu'un d'autre.
        console.log('🤔 Conversation not found in local list. Reloading all conversations.');
        loadConversations();
        return prevConversations; // Retourne l'état actuel en attendant le rechargement
      });
    });

    socketRef.current.on('userTyping', (data) => {
      if (data.conversationId === activeConversation?._id) {
        setIsTyping(true);
      }
    });

    socketRef.current.on('userStopTyping', (data) => {
      if (data.conversationId === activeConversation?._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [activeConversation, loadMessages]);

  // Sélectionner une conversation
  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
    loadMessages(conversation._id);
  };

  // Envoyer un message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    console.log('📤 Sending message:', newMessage, 'to conversation:', activeConversation._id);

    try {
      const response = await axios.post(API_PATHS.CHAT.SEND_MESSAGE, {
        conversationId: activeConversation._id,
        content: newMessage,
        type: 'text'
      });

      console.log('✅ Message sent successfully:', response.data.data);
      // Ne pas ajouter localement - Socket.io va recevoir et ajouter le message
      setNewMessage('');
      scrollToBottom();

      // Le message sera automatiquement émis via Socket.io par le backend
      // Plus besoin d'émettre manuellement

    } catch (error) {
      console.error('❌ Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  // Gérer le typing
  const handleTyping = () => {
    if (activeConversation) {
      socketRef.current?.emit('typing', {
        conversationId: activeConversation._id,
        userName: user?.name || 'Utilisateur'
      });

      // Arrêter le typing après 2 secondes
      setTimeout(() => {
        socketRef.current?.emit('stopTyping', {
          conversationId: activeConversation._id
        });
      }, 2000);
    }
  };

  // Scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Charger les conversations au montage
  useEffect(() => {
    loadConversations();
  }, []);

  // Filtrer les conversations
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer la création d'une nouvelle conversation
  const handleConversationCreated = (newConversation) => {
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation);
    loadMessages(newConversation._id);
    setShowCreateModal(false);
  };

  return (
    <div className="h-screen flex bg-gray-50 pl-64">
      {/* Sidebar - Liste des conversations */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Header de la sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2 bg-[#2d5f3f] text-white rounded-lg hover:bg-[#1e4029] transition-colors"
              title={copy.newConversation}
            >
              <FaPlus size={14} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder={copy.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#2d5f3f] focus:ring-1 focus:ring-[#2d5f3f]/20 transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaUsers className="text-gray-400" size={20} />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">{copy.noConversations}</p>
              <p className="text-xs text-gray-500">{copy.startConversation}</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => selectConversation(conversation)}
                  className={`px-4 py-3 cursor-pointer transition-all ${
                    activeConversation?._id === conversation._id
                      ? 'bg-[#2d5f3f] text-white border-l-4 border-l-[#1e4029]'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activeConversation?._id === conversation._id
                        ? 'bg-white/20'
                        : 'bg-[#2d5f3f]'
                    }`}>
                      <FaUsers className="text-white" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        activeConversation?._id === conversation._id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {conversation.name}
                      </p>
                      <p className={`text-xs truncate ${
                        activeConversation?._id === conversation._id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {conversation.participants.length} participant{conversation.participants.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#2d5f3f] rounded-full flex items-center justify-center">
                    <FaUsers className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{activeConversation.name}</h3>
                    <p className="text-xs text-gray-500">
                      {activeConversation.participants.length} participant{activeConversation.participants.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">En ligne</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-end space-x-2 max-w-lg">
                      {message.sender._id !== user?._id && (
                        <div className="w-8 h-8 bg-[#2d5f3f] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            {message.sender.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            message.sender._id === user?._id
                              ? 'bg-[#2d5f3f] text-white rounded-br-none'
                              : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className={`text-xs mt-1 ${
                          message.sender._id === user?._id ? 'text-right text-gray-500' : 'text-gray-500'
                        }`}>
                          {new Date(message.createdAt).toLocaleTimeString(lang === 'FR' ? 'fr-FR' : 'en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {message.sender._id === user?._id && (
                        <div className="w-8 h-8 bg-[#2d5f3f] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            {user?.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-end space-x-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">...</span>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={sendMessage} className="flex items-center space-x-3">
                <button
                  type="button"
                  className="text-gray-400 hover:text-[#2d5f3f] transition-colors p-2"
                  title="Joindre un fichier"
                >
                  <FaPaperclip size={18} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder={copy.placeholder}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2d5f3f] focus:ring-1 focus:ring-[#2d5f3f]/20"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-[#2d5f3f] text-white rounded-lg hover:bg-[#1e4029] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <FaPaperPlane size={14} />
                  <span className="text-sm">{copy.send}</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {copy.noConversations}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {copy.startConversation}
              </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-[#2d5f3f] text-white rounded-lg hover:bg-[#1e4029] transition-colors"
                >
                  {copy.newConversation}
                </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de création de conversation */}
      <CreateConversationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
};

export default Chat;
