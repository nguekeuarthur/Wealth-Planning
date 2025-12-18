import React, { createContext, useContext, useState, useEffect } from "react";
import { UserContext } from "./userContext";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useContext(UserContext);


  // Charger les notifications depuis le localStorage quand l'utilisateur change
  useEffect(() => {
    if (user?._id) {
      const storageKey = `wealth-planning-notifications-${user._id}`;
      const savedNotifications = localStorage.getItem(storageKey);
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed);
          setUnreadCount(parsed.filter(n => !n.read).length);
        } catch (error) {
          console.error('Erreur lors du chargement des notifications:', error);
          setNotifications([]);
          setUnreadCount(0);
        }
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } else if (!user) {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user?._id]);

  // Sauvegarder les notifications dans le localStorage
  useEffect(() => {
    if (user?._id) {
      const storageKey = `wealth-planning-notifications-${user._id}`;
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    }
  }, [notifications, user?._id]);

  // Générer des notifications basées sur le statut du profil utilisateur
  useEffect(() => {
    if (user && user._id) {
      setNotifications(prev => {
        let updated = [...prev];
        let changed = false;

        // 1. Notification pour compléter le profil
        const profileCompletedKey = `profile-completed-${user._id}`;
        const hasCompletedProfile = localStorage.getItem(profileCompletedKey) === 'true';
        const needsProfileCompletion = user.role !== 'admin' && !hasCompletedProfile;
        const profileNotificationExists = updated.some(n => n.id === "profile_completion");

        if (needsProfileCompletion && !profileNotificationExists) {
          updated.push({
            id: "profile_completion",
            type: "profile",
            title: "Complétez votre profil",
            message: "Ajoutez votre date de naissance, nationalité et numéro de téléphone pour finaliser votre inscription.",
            priority: "high",
            read: false,
            createdAt: new Date().toISOString(),
            actionUrl: "/profile-completion"
          });
          changed = true;
        } else if (!needsProfileCompletion && profileNotificationExists) {
          updated = updated.filter(n => n.id !== "profile_completion");
          changed = true;
        }

        // 2. Notification de bienvenue
        const welcomeKey = `welcome-notif-sent-${user._id}`;
        const welcomeAlreadySent = localStorage.getItem(welcomeKey);
        const welcomeNotificationExists = updated.some(n => n.id === "welcome");

        if (!welcomeAlreadySent && !welcomeNotificationExists) {
          updated.push({
            id: "welcome",
            type: "welcome",
            title: "Bienvenue dans Wealth Planning !",
            message: "Découvrez toutes les fonctionnalités disponibles pour gérer vos projets et tâches.",
            priority: "normal",
            read: false,
            createdAt: new Date().toISOString()
          });
          localStorage.setItem(welcomeKey, 'true');
          changed = true;
        }

        if (changed) {
          setUnreadCount(updated.filter(n => !n.read).length);
          return updated;
        }
        return prev;
      });
    }
  }, [user?._id]);

  const markAsRead = (notificationId) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === notificationId ? { ...n, read: true } : n);
      setUnreadCount(next.filter(n => !n.read).length);
      return next;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      setUnreadCount(0);
      return next;
    });
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => {
      const next = prev.filter(n => n.id !== notificationId);
      setUnreadCount(next.filter(n => !n.read).length);
      return next;
    });
  };

  const addNotification = (notification) => {
    setNotifications(prev => {
      const newNotification = {
        id: Date.now().toString(),
        read: false,
        createdAt: new Date().toISOString(),
        ...notification
      };
      const next = [newNotification, ...prev];
      setUnreadCount(next.filter(n => !n.read).length);
      return next;
    });
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
