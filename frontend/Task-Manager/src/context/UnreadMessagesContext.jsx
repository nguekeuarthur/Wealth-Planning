import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from '../utils/axiosInstance';
import { API_PATHS, BASE_URL } from '../utils/apiPaths';
import { getSession, subscribeSession } from '../utils/authStorage';

const UnreadMessagesContext = createContext();

export const useUnreadMessages = () => {
    const context = useContext(UnreadMessagesContext);
    if (!context) {
        throw new Error("useUnreadMessages must be used within an UnreadMessagesProvider");
    }
    return context;
};

export const UnreadMessagesProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [sessionToken, setSessionToken] = useState(() => getSession().token);
    const socketRef = useRef(null);

    const getUserIdFromToken = (token) => {
        try {
            if (!token) return null;
            const payload = token.split('.')[1];
            if (!payload) return null;
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = JSON.parse(atob(base64));
            return decoded?.id || decoded?._id || null;
        } catch (e) {
            return null;
        }
    };

    const loadUnreadCount = async () => {
        try {
            const { token } = getSession();
            if (!token) {
                setUnreadCount(0);
                return;
            }
            const response = await axios.get(API_PATHS.MESSAGES.GET_UNREAD_COUNT);
            setUnreadCount(response.data.unreadCount || 0);
        } catch (error) {
            console.error('Erreur chargement compteur messages non lus:', error);
        }
    };

    const incrementUnreadCount = () => {
        setUnreadCount(prev => prev + 1);
    };

    const resetUnreadCount = () => {
        setUnreadCount(0);
    };

    useEffect(() => {
        const unsubscribe = subscribeSession((nextSession) => {
            const nextToken = nextSession?.token || null;
            setSessionToken(nextToken);

            if (!nextToken) {
                setUnreadCount(0);
            }
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

        loadUnreadCount();

        const socket = io(BASE_URL, {
            auth: { token: sessionToken }
        });

        socketRef.current = socket;

        const session = getSession();
        const userId = session.user?._id || getUserIdFromToken(sessionToken);

        const joinAllConversations = async () => {
            try {
                const res = await axios.get(API_PATHS.CHAT.GET_CONVERSATIONS);
                const conversations = res.data?.conversations || [];
                conversations.forEach((c) => {
                    if (c?._id) socket.emit('joinConversation', c._id);
                });
            } catch (error) {
                console.error('Erreur join conversations (UnreadMessagesContext):', error);
            }
        };

        socket.on('connect', () => {
            joinAllConversations();
        });

        socket.on('newMessage', (message) => {
            // Ne pas incrémenter pour le sender
            const senderId = message?.sender?._id || message?.sender;
            if (userId && String(senderId) === String(userId)) return;

            incrementUnreadCount();
        });

        return () => {
            if (socket && socket.disconnect) {
                socket.off('connect');
                socket.off('newMessage');
                socket.disconnect();
            }
        };
    }, [sessionToken]);

    return (
        <UnreadMessagesContext.Provider value={{
            unreadCount,
            loadUnreadCount,
            incrementUnreadCount,
            resetUnreadCount
        }}>
            {children}
        </UnreadMessagesContext.Provider>
    );
};
