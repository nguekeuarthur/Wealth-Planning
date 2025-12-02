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


  // Charger les notifications depuis le localStorage au démarrage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('wealth-planning-notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    }
  }, []);

  // Sauvegarder les notifications dans le localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('wealth-planning-notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Générer des notifications basées sur le statut du profil utilisateur
  useEffect(() => {
    if (user && notifications.length >= 0) { // Attendre que les notifications soient chargées
      let updatedNotifications = [...notifications];

      // Notification pour compléter le profil (SEULEMENT pour les utilisateurs NON-admin)
      // Vérifier si l'utilisateur a déjà complété son profil (stocké dans localStorage)
      const profileCompletedKey = `profile-completed-${user._id}`;
      const hasCompletedProfile = localStorage.getItem(profileCompletedKey) === 'true';
      const needsProfileCompletion = user.role !== 'admin' && !hasCompletedProfile;

      const profileNotificationExists = notifications.some(n => n.id === "profile_completion");

      if (needsProfileCompletion && !profileNotificationExists) {
        updatedNotifications.push({
          id: "profile_completion",
          type: "profile",
          title: "Complétez votre profil",
          message: "Ajoutez votre date de naissance, nationalité et numéro de téléphone pour finaliser votre inscription.",
          priority: "high",
          read: false,
          createdAt: new Date().toISOString(),
          actionUrl: "/profile-completion"
        });
      } else if (!needsProfileCompletion && profileNotificationExists) {
        // Supprimer la notification si le profil est maintenant complété
        updatedNotifications = updatedNotifications.filter(n => n.id !== "profile_completion");
      }

      // Notification de bienvenue (toujours présente pour les nouveaux utilisateurs)
      const welcomeNotificationExists = notifications.some(n => n.id === "welcome");
      if (!welcomeNotificationExists) {
        updatedNotifications.push({
          id: "welcome",
          type: "welcome",
          title: "Bienvenue dans Wealth Planning !",
          message: "Découvrez toutes les fonctionnalités disponibles pour gérer vos projets et tâches.",
          priority: "normal",
          read: false,
          createdAt: new Date().toISOString()
        });
      }

      // Mettre à jour seulement si les notifications ont changé
      if (updatedNotifications.length !== notifications.length) {
        setNotifications(updatedNotifications);
        setUnreadCount(updatedNotifications.filter(n => !n.read).length);
      }
    }
  }, [user, notifications.length]); // Dépendre aussi de notifications.length pour éviter les boucles

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    // Recalculer le compteur de non lus
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
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
