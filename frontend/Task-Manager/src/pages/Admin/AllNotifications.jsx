import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNotifications } from "../../context/NotificationContext";
import { UserContext } from "../../context/userContext";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiClock,
  FiAlertTriangle,
  FiInfo,
  FiUser,
  FiCheckCircle
} from "react-icons/fi";
import toast from "react-hot-toast";

const brandPalette = {
  primary: "#1e4029",
  secondary: "#2d5f3f",
  accent: "#5a8f6f",
  soft: "#f4f7f4",
  border: "#dfe8e1",
  muted: "#7a8b7f",
};

const AllNotifications = () => {
  const { notifications, markAsRead, markAllAsRead, dismissNotification } = useNotifications();
  const { user, loading: userLoading } = useContext(UserContext);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Marquer automatiquement toutes les notifications comme lues quand on accède à la page
  useEffect(() => {
    if (user && notifications.length > 0) {
      const unreadNotifications = notifications.filter(n => !n.read);
      if (unreadNotifications.length > 0) {
        markAllAsRead();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // Se déclenche à chaque fois qu'on arrive sur cette page


  // Formater et filtrer les notifications
  useEffect(() => {
    if (!user) return; // Ne pas filtrer si pas d'utilisateur

    let filtered = notifications;

    // Filtrage par recherche
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((notification) =>
        notification.title?.toLowerCase().includes(query) ||
        notification.message?.toLowerCase().includes(query)
      );
    }

    // Filtrage par statut
    if (selectedFilter !== "all") {
      if (selectedFilter === "read") {
        filtered = filtered.filter(notification => notification.read);
      } else if (selectedFilter === "unread") {
        filtered = filtered.filter(notification => !notification.read);
      }
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchQuery, selectedFilter, user]);


  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success("Toutes les notifications ont été marquées comme lues");
  };

  const handleDismissNotification = (notificationId) => {
    dismissNotification(notificationId);
    toast.success("Notification supprimée");
  };

  const handleNotificationClick = (notification) => {
    // Marquer comme lue
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Rediriger vers l'action URL si elle existe
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };


  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "task":
        return <FiCheck className={`${iconClass} text-[#2d5f3f]`} />;
      case "invoice":
        return <FiAlertTriangle className={`${iconClass} text-red-600`} />;
      case "contract":
        return <FiInfo className={`${iconClass} text-[#5a8f6f]`} />;
      case "project":
        return <FiClock className={`${iconClass} text-[#7a8b7f]`} />;
      default:
        return <FiInfo className={`${iconClass} text-[#7a8b7f]`} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-50 text-red-700 border-red-200";
      case "high":
        return "bg-[#fff7d6] text-[#7b6a25] border-[#dfe8e1]";
      case "normal":
        return "bg-[#e6f0ea] text-[#2d5f3f] border-[#dfe8e1]";
      case "low":
        return "bg-[#f4f7f4] text-[#7a8b7f] border-[#dfe8e1]";
      default:
        return "bg-[#f4f7f4] text-[#7a8b7f] border-[#dfe8e1]";
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;

    return notificationDate.toLocaleDateString('fr-FR');
  };

  // Vérifier si l'utilisateur est en cours de chargement
  if (userLoading) {
    return (
      <DashboardLayout activeMenu="Notifications">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a8f6f]"></div>
          <p className="mt-4 text-[#2d5f3f] font-medium">Chargement de l'utilisateur...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Vérifier si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <DashboardLayout activeMenu="Notifications">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-center">
            <FiUser className="mx-auto text-[#7a8b7f] text-6xl mb-4" />
            <h3 className="text-xl font-medium text-[#1e4029] mb-2">
              Connexion requise
            </h3>
            <p className="text-[#7a8b7f] mb-6">
              Vous devez être connecté pour accéder aux notifications.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout activeMenu="Notifications">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a8f6f]"></div>
          <p className="mt-4 text-[#2d5f3f] font-medium">Chargement des notifications...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Notifications">
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
              Centre de notifications
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Toutes les notifications
            </h1>
            <p className="text-white/80 mt-2">
              Restez informé de toutes les activités et mises à jour importantes
            </p>
            <p className="text-white/60 mt-1 text-sm">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''} au total
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <button
              onClick={handleMarkAllAsRead}
              className="group bg-[#5a8f6f]/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-300 text-sm font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl hover:bg-[#5a8f6f] hover:scale-105 border border-white/10"
            >
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <FiCheck className="text-lg" />
              </div>
              Tout marquer comme lu
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7a8b7f]" />
              <input
                type="text"
                placeholder="Rechercher dans les notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] cursor-pointer transition-colors"
            >
              <option value="all">Tous les types</option>
              <option value="unread">Non lues</option>
              <option value="read">Lues</option>
              <option value="task">Tâches</option>
              <option value="invoice">Factures</option>
              <option value="contract">Contrats</option>
              <option value="project">Projets</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg cursor-pointer group ${
                  !notification.read
                    ? 'border-[#5a8f6f] bg-[#f4f7f4]/50 shadow-sm'
                    : 'border-[#dfe8e1] hover:border-[#5a8f6f]/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${
                            !notification.read ? 'text-[#1e4029]' : 'text-[#2d5f3f]'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-[#7a8b7f] mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-xs text-[#7a8b7f]">
                              {formatDate(notification.createdAt)}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(notification.priority)}`}>
                              {notification.priority === 'urgent' ? 'Urgent' :
                               notification.priority === 'high' ? 'Élevé' :
                               notification.priority === 'normal' ? 'Normal' : 'Faible'}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16 bg-white border border-[#dfe8e1] rounded-2xl">
            <div className="p-6 bg-[#f4f7f4] rounded-2xl mb-6 w-fit mx-auto">
              <FiCheck className="text-[#5a8f6f] text-6xl" />
            </div>
            <h3 className="text-xl font-medium text-[#1e4029] mb-2">
              {searchQuery ? "Aucune notification trouvée" : "Aucune notification"}
            </h3>
            <p className="text-[#7a8b7f] mb-6">
              {searchQuery
                ? "Essayez d'ajuster votre recherche"
                : "Vous êtes à jour ! Toutes vos notifications apparaîtront ici."}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AllNotifications;
