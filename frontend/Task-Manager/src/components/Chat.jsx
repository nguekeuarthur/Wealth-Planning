import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPaperPlane, FaPaperclip, FaUsers, FaPlus, FaSearch } from 'react-icons/fa';
import { io } from 'socket.io-client';
import axios from '../utils/axiosInstance';
import { useUser } from '../context/userContext';
import { useLanguage } from '../context/languageContext';
import { useUnreadMessages } from '../context/UnreadMessagesContext';
import { API_PATHS } from '../utils/apiPaths';
import { getSession, subscribeSession } from '../utils/authStorage';
import toast from 'react-hot-toast';
import CreateConversationModal from './CreateConversationModal';

const Chat = () => {
  const { user } = useUser();
  const { lang } = useLanguage();
  const { unreadCount, loadUnreadCount, resetUnreadCount } = useUnreadMessages();
  const [sessionToken, setSessionToken] = useState(() => getSession().token);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

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
    // Autres langues...
  };

  const copy = content[lang] || content.FR;

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || '';
    const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] || '') : '';
    const initials = (first + second).toUpperCase();
    return initials || '?';
  };

  const getOtherParticipant = (conv) => {
    const parts = Array.isArray(conv?.participants) ? conv.participants : [];
    return parts
      .map((p) => p?.user)
      .find((u) => u && String(u?._id || u) !== String(user?._id));
  };

  const isUserOnline = (userId) => {
    if (!userId) return false;
    return (Array.isArray(onlineUsers) ? onlineUsers : []).some((id) => String(id) === String(userId));
  };

  const getParticipantIds = (conv) => {
    const parts = Array.isArray(conv?.participants) ? conv.participants : [];
    return parts
      .map((p) => p?.user?._id || p?.user || p)
      .filter(Boolean)
      .map((id) => String(id));
  };

  const dedupeConversations = (list) => {
    const byId = new Map();
    (Array.isArray(list) ? list : []).forEach((c) => {
      const id = c?._id ? String(c._id) : undefined;
      if (!id) return;
      if (!byId.has(id)) byId.set(id, c);
    });

    const byPrivateKey = new Map();
    Array.from(byId.values()).forEach((c) => {
      if (c?.type === 'private') {
        const ids = getParticipantIds(c).sort();
        if (ids.length === 2) {
          const key = `private:${ids[0]}-${ids[1]}`;
          const prev = byPrivateKey.get(key);
          if (!prev) {
            byPrivateKey.set(key, c);
          } else {
            const prevDate = prev?.updatedAt ? new Date(prev.updatedAt).getTime() : 0;
            const curDate = c?.updatedAt ? new Date(c.updatedAt).getTime() : 0;
            byPrivateKey.set(key, curDate >= prevDate ? c : prev);
          }
          return;
        }
      }

      byPrivateKey.set(`id:${String(c._id)}`, c);
    });

    return Array.from(byPrivateKey.values()).sort((a, b) => {
      const aDate = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bDate = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bDate - aDate;
    });
  };

  const loadConversations = async () => {
    try {
      const response = await axios.get(API_PATHS.CHAT.GET_CONVERSATIONS);
      const next = dedupeConversations(response.data.conversations);
      setConversations(next);
      setActiveConversation((prevActive) => {
        if (!prevActive?._id) return prevActive;
        return next.find((c) => String(c._id) === String(prevActive._id)) || prevActive;
      });
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    }
  };

  const loadMessages = useCallback(async (conversationId) => {
    try {
      console.log('Chargement messages pour conversation:', conversationId);
      const response = await axios.get(API_PATHS.CHAT.GET_CONVERSATION_MESSAGES(conversationId));
      setMessages(response.data.messages);
      scrollToBottom(true); // Scroll instantané au chargement initial

      // Rejoindre la room Socket.io pour cette conversation
      if (socketRef.current) {
        console.log('Rejoindre la room Socket.io:', conversationId);
        socketRef.current.emit('joinConversation', conversationId);
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  }, []);

  const handleNewMessage = (message) => {
    console.log('Nouveau message reçu:', message);
    console.log('Conversation active:', activeConversation?._id);
    console.log('Message conversation ID:', message.conversation);

    // Mettre à jour la liste des conversations (lastMessage + compteur + remonter en haut)
    setConversations(prev => {
      const uniquePrev = dedupeConversations(prev);
      const index = uniquePrev.findIndex(c => String(c._id) === String(message.conversation));

      const isFromOtherUser = String(message.sender?._id) !== String(user?._id);
      const isActive = String(message.conversation) === String(activeConversation?._id);

      if (index > -1) {
        const conv = uniquePrev[index];
        const nextConv = {
          ...conv,
          lastMessage: message,
          unreadCount: isFromOtherUser && !isActive ? ((conv.unreadCount || 0) + 1) : (conv.unreadCount || 0)
        };
        return [nextConv, ...uniquePrev.filter((_, i) => i !== index)];
      }

      // Si la conversation n'est pas trouvée localement, on force un refresh des conversations
      loadConversations();
      return uniquePrev;
    });

    // Mettre à jour les messages si la conversation est active
    if (String(message.conversation) === String(activeConversation?._id)) {
      console.log('Message pour conversation active, ajout à la liste');
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    }

    // Mettre à jour le compteur de messages non lus si le message n'est pas de l'utilisateur
    // Le compteur global est géré par UnreadMessagesContext via l'event Socket.io
  };

  const handleUserTyping = (data) => {
    if (String(data?.conversationId) === String(activeConversation?._id)) setIsTyping(true);
  };

  const handleUserStopTyping = (data) => {
    if (String(data?.conversationId) === String(activeConversation?._id)) setIsTyping(false);
  };

  const getConversationTitle = (conv) => {
    if (!conv) return '';
    if (conv.type === 'private') {
      const other = getOtherParticipant(conv);
      return other?.name || conv.name;
    }
    return conv.name;
  };

  useEffect(() => {
    const unsubscribe = subscribeSession((nextSession) => {
      setSessionToken(nextSession?.token || null);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!sessionToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = io('http://localhost:8000', {
      auth: { token: sessionToken }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connecté:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket déconnecté');
    });

    return () => {
      if (socket && socket.disconnect) {
        socket.disconnect();
      }
    };
  }, [sessionToken]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.off('newMessage');
    socket.on('newMessage', handleNewMessage);

    socket.off('userTyping');
    socket.off('userStopTyping');
    socket.off('typing');
    socket.off('stopTyping');

    socket.off('onlineUsers');
    socket.on('onlineUsers', (ids) => {
      setOnlineUsers(Array.isArray(ids) ? ids.map(String) : []);
    });

    socket.on('userTyping', handleUserTyping);
    socket.on('userStopTyping', handleUserStopTyping);
    socket.on('typing', handleUserTyping);
    socket.on('stopTyping', handleUserStopTyping);

    return () => {
      if (!socket) return;
      socket.off('newMessage', handleNewMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStopTyping', handleUserStopTyping);
      socket.off('typing', handleUserTyping);
      socket.off('stopTyping', handleUserStopTyping);
      socket.off('onlineUsers');
    };
  }, [activeConversation, user?._id]);

  const selectConversation = (conversation) => {
    // Mettre à jour la conversation active
    setActiveConversation({
      ...conversation,
      unreadCount: 0
    });

    // Masquer instantanément les indicateurs non lus pour la conversation ouverte
    setConversations((prev) =>
      (Array.isArray(prev) ? prev : []).map((c) => {
        if (String(c?._id) !== String(conversation?._id)) return c;
        return { ...c, unreadCount: 0 };
      })
    );

    loadMessages(conversation._id);
    markAllMessagesAsRead(); // Marquer tous les messages comme lus
  };

  const markAllMessagesAsRead = async () => {
    try {
      await axios.put(API_PATHS.MESSAGES.MARK_ALL_AS_READ);
      resetUnreadCount(); // Mettre à jour le compteur global

      // Masquer instantanément les indicateurs non lus dans la liste
      setConversations((prev) =>
        (Array.isArray(prev) ? prev : []).map((c) => ({ ...c, unreadCount: 0 }))
      );

      // Re-synchroniser depuis le backend (évite que le badge réapparaisse)
      loadConversations();
    } catch (error) {
      console.error('Erreur lors du marquage des messages comme lus:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    try {
      await axios.post(API_PATHS.CHAT.SEND_MESSAGE, {
        conversationId: activeConversation._id,
        content: newMessage.trim(),
        type: 'text'
      });
      setNewMessage('');
    } catch (error) {
      toast.error('Erreur envoi message');
    }
  };

  const handleTyping = () => {
    if (!socketRef.current || !activeConversation) return;

    // Si un minuteur existe, on le nettoie.
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    } else {
      // Si pas de minuteur, c'est que l'utilisateur commence à taper.
      socketRef.current.emit('typing', {
        conversationId: activeConversation._id,
        userName: user?.name || 'Utilisateur'
      });
    }

    // On programme l'envoi de "stopTyping" dans 2 secondes.
    // Ce minuteur sera réinitialisé à chaque nouvelle frappe.
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stopTyping', { conversationId: activeConversation._id });
      typingTimeoutRef.current = null; // On réinitialise la ref.
    }, 2000);
  };

  const scrollToBottom = (instant = false) => {
    messagesEndRef.current?.scrollIntoView({ behavior: instant ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const joinAll = () => {
      (Array.isArray(conversations) ? conversations : []).forEach((c) => {
        if (c?._id) socket.emit('joinConversation', c._id);
      });
    };

    if (socket.connected) {
      joinAll();
    } else {
      socket.once('connect', joinAll);
    }
  }, [conversations]);

  // Scroll automatique vers le bas après chargement des messages
  useEffect(() => {
    scrollToBottom(true); // Scroll instantané lors du chargement/mise à jour des messages
  }, [messages]);

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConversationCreated = (newConversation) => {
    setConversations(prev => {
      const next = prev.filter(c => String(c._id) !== String(newConversation?._id));
      return [newConversation, ...next];
    });
    setActiveConversation(newConversation);
    loadMessages(newConversation._id);
    setShowCreateModal(false);
  };

  return (
    <div className="fixed inset-0 ml-64 bg-gray-50">

      {/* Sidebar conversations */}
      <div className="absolute inset-y-0 left-0 w-80 bg-white border-r border-gray-200 flex flex-col shadow-xl">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
              {unreadCount > 0 && (
                <span className="bg-green-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-2 animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            <button onClick={() => setShowCreateModal(true)} className="p-3 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-all shadow-md">
              <FaPlus size={18} />
            </button>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={copy.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <FaUsers className="mx-auto mb-4 text-5xl text-gray-300" />
              <p className="font-medium">{copy.noConversations}</p>
              <p className="text-sm mt-1">{copy.startConversation}</p>
            </div>
          ) : (
            filteredConversations.map(conv => (
              <div
                key={`conv-${conv._id}`}
                onClick={() => selectConversation(conv)}
                className={`px-5 py-4 cursor-pointer transition-all hover:bg-gray-50 ${activeConversation?._id === conv._id ? 'bg-[#2d5f3f]/10 border-l-4 border-l-[#2d5f3f]' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-[#2d5f3f] rounded-full flex items-center justify-center overflow-hidden">
                      {conv.type === 'private' ? (
                        (() => {
                          const other = getOtherParticipant(conv);
                          const photo = other?.profileImageUrl;
                          if (photo) {
                            return (
                              <img
                                src={photo}
                                alt={other?.name || 'Utilisateur'}
                                className="w-full h-full object-cover"
                              />
                            );
                          }
                          return (
                            <span className="text-white font-bold">
                              {getInitials(other?.name)}
                            </span>
                          );
                        })()
                      ) : (
                        <FaUsers className="text-white text-xl" />
                      )}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -bottom-0.5 -right-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ring-2 ring-white leading-none">
                        {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 truncate">{getConversationTitle(conv)}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {conv.type === 'private'
                        ? (isUserOnline(getOtherParticipant(conv)?._id) ? 'En ligne' : 'Hors ligne')
                        : `${conv.participants.length} participant${conv.participants.length > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Zone chat */}
      <div className="ml-80 h-full flex flex-col">
        {activeConversation ? (
          <>
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center gap-4 shadow-sm">
              <div className="relative w-12 h-12 bg-[#2d5f3f] rounded-full flex items-center justify-center overflow-hidden">
                {activeConversation.type === 'private' ? (
                  (() => {
                    const other = getOtherParticipant(activeConversation);
                    const photo = other?.profileImageUrl;
                    if (photo) {
                      return (
                        <img
                          src={photo}
                          alt={other?.name || 'Utilisateur'}
                          className="w-full h-full object-cover"
                        />
                      );
                    }
                    return (
                      <span className="text-white font-bold">
                        {getInitials(other?.name)}
                      </span>
                    );
                  })()
                ) : (
                  <FaUsers className="text-white text-2xl" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-gray-900 truncate">{getConversationTitle(activeConversation)}</h3>

                {activeConversation?.type === 'group' ? (
                  <p className="text-sm text-gray-500 truncate">
                    {Array.isArray(activeConversation?.participants)
                      ? activeConversation.participants
                        .map((p) => p?.user?.name)
                        .filter(Boolean)
                        .slice(0, 3)
                        .join(', ')
                      : ''}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {isUserOnline(getOtherParticipant(activeConversation)?._id) ? 'En ligne' : 'Hors ligne'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-8">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map(message => {
                  const isOwn = String(message?.sender?._id) === String(user?._id);
                  const sender = message?.sender;
                  const avatarUrl = sender?.profileImageUrl || sender?.profileImage || sender?.avatar || sender?.photoUrl || sender?.imageUrl;
                  const initial = (sender?.name || sender?.fullName || '?').charAt(0).toUpperCase();

                  return (
                    <div
                      key={`msg-${message._id}-${message.createdAt}`}
                      className={`flex gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isOwn && (
                        <div className="relative w-10 h-10 rounded-full bg-[#2d5f3f] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <span className="text-white font-bold text-sm">{initial}</span>
                          {avatarUrl && (
                            <img
                              src={avatarUrl}
                              alt={sender?.name || sender?.fullName || 'Avatar'}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.remove();
                              }}
                            />
                          )}
                        </div>
                      )}

                      <div className={`max-w-md px-6 py-4 rounded-3xl shadow-md ${isOwn
                        ? 'bg-[#2d5f3f] text-white rounded-br-lg'
                        : 'bg-white text-gray-800 rounded-bl-lg border border-gray-200'
                        }`}>
                        <p className="text-base leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 opacity-60 ${isOwn ? 'text-right' : ''}`}>
                          {new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {isOwn && (
                        <div className="relative w-10 h-10 rounded-full bg-[#2d5f3f] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <span className="text-white font-bold text-sm">{(user?.name || user?.fullName || '?').charAt(0).toUpperCase()}</span>
                          {(user?.profileImageUrl || user?.profileImage || user?.avatar || user?.photoUrl || user?.imageUrl) && (
                            <img
                              src={user?.profileImageUrl || user?.profileImage || user?.avatar || user?.photoUrl || user?.imageUrl}
                              alt={user?.name || user?.fullName || 'Avatar'}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.remove();
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
                    <div className="bg-white px-6 py-4 rounded-3xl rounded-bl-lg border border-gray-200 shadow-md">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-5 bg-white border-t border-gray-200">
              <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex items-center gap-4">
                <button type="button" className="text-gray-500 hover:text-[#2d5f3f] p-2 transition-colors">
                  <FaPaperclip size={24} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                  placeholder={copy.placeholder}
                  className="flex-1 px-6 py-4 bg-gray-100 rounded-full focus:outline-none focus:ring-4 focus:ring-[#2d5f3f]/20 text-base"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-7 py-4 bg-[#2d5f3f] text-white rounded-full hover:bg-[#1e4029] disabled:opacity-50 shadow-lg flex items-center gap-3 transition-all"
                >
                  <FaPaperPlane size={20} />
                  <span className="font-medium">{copy.send}</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FaUsers className="mx-auto mb-6 text-8xl text-gray-300" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">{copy.noConversations}</h3>
              <p className="text-gray-500 mb-8">{copy.startConversation}</p>
              <button onClick={() => setShowCreateModal(true)} className="px-8 py-4 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] shadow-lg">
                {copy.newConversation}
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateConversationModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onConversationCreated={handleConversationCreated} />
    </div>
  );
};

export default Chat;