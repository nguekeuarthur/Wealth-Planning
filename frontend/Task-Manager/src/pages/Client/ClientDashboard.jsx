import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useUnreadMessages } from "../../context/UnreadMessagesContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";

const fullImageUrl = (url) => {
  if (!url) return null;
  // Aggressive cleanup of historical localhost URLs
  let cleaned = url.replace(/^https?:\/\/localhost:8000/, '');
  if (cleaned.startsWith('http')) return cleaned;
  const baseUrlClean = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const pathClean = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
  return `${baseUrlClean}${pathClean}`;
};
import moment from "moment";
import 'moment/locale/fr';
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import {
  FaProjectDiagram,
  FaFileInvoiceDollar,
  FaEnvelope,
  FaTasks,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

moment.locale('fr');

const ClientDashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const { unreadCount } = useUnreadMessages();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    projects: [],
    invoices: [],
    tasks: [],
    messages: [],
    files: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Récupérer les projets du client
      const projectsRes = await axiosInstance.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS);

      // Récupérer les factures du client
      const invoicesRes = await axiosInstance.get(API_PATHS.INVOICES.GET_ALL_INVOICES);

      // Récupérer les tâches
      const tasksRes = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);

      // Récupérer les messages récents
      const messagesRes = await axiosInstance.get('/api/messages/recent');

      // Récupérer les fichiers tagués client
      const filesRes = await axiosInstance.get('/api/documents?tags=client');

      setStats({
        projects: projectsRes.data?.projects || [],
        invoices: invoicesRes.data?.invoices || [],
        tasks: tasksRes.data?.tasks || [],
        messages: messagesRes.data?.messages || [],
        files: filesRes.data?.documents || []
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectStatusBadge = (status) => {
    switch (status) {
      case "done":
        return "bg-[#dff5e7] text-[#1e4029]";
      case "in review":
        return "bg-[#fff7d6] text-[#7b6a25]";
      default:
        return "bg-[#e6f0ea] text-[#2d5f3f]";
    }
  };

  const getProjectStatusLabel = (status) => {
    switch (status) {
      case "done":
        return "Terminé";
      case "in review":
        return "En révision";
      default:
        return "En cours";
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Tableau de bord">
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5f3f] mx-auto"></div>
            <p className="mt-4 text-[#7a8b7f]">Chargement...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Tableau de bord">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] rounded-2xl shadow-xl p-8 my-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
                {user?.profileImageUrl ? (
                  <img
                    src={fullImageUrl(user?.profileImageUrl)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#5a8f6f] flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
                  Tableau de bord Client
                </p>
                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Bonjour, {user?.name}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <span className="inline-flex items-center gap-2 text-sm">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Connecté
              </span>
              <span className="text-white/60">•</span>
              <span className="text-sm font-medium">
                {moment().format("dddd DD MMMM YYYY")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#7a8b7f] font-semibold mb-2">
                Mes Projets
              </p>
              <h3 className="text-3xl font-bold text-[#1e4029]">
                {stats.projects.length}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-[#f0f5f1] text-[#2d5f3f] shadow-inner">
              <FaProjectDiagram className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#7a8b7f] font-semibold mb-2">
                Factures
              </p>
              <h3 className="text-3xl font-bold text-[#1e4029]">
                {stats.invoices.length}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-[#f0f5f1] text-[#2d5f3f] shadow-inner">
              <FaFileInvoiceDollar className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#7a8b7f] font-semibold mb-2">
                Tâches
              </p>
              <h3 className="text-3xl font-bold text-[#1e4029]">
                {stats.tasks.length}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-[#f0f5f1] text-[#2d5f3f] shadow-inner">
              <FaTasks className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#7a8b7f] font-semibold mb-2">
                Messages Non Lus
              </p>
              <h3 className="text-3xl font-bold text-[#1e4029]">
                {unreadCount}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-green-50 text-green-500 shadow-inner relative">
              <FaEnvelope className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Projects Section */}
      <div className="my-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#7a8b7f] mb-2">
              Mes Projets
            </p>
            <h3 className="text-2xl font-bold text-[#1e4029]">Vue projets</h3>
          </div>
          <button
            onClick={() => navigate("/client/projects")}
            className="text-sm font-medium text-[#2d5f3f] flex items-center gap-2 hover:gap-3 transition-all"
          >
            Voir tous les projets <LuArrowRight />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.projects.length > 0 ? (
            stats.projects.slice(0, 3).map((project) => (
              <div
                key={project._id || project.id}
                onClick={() => navigate(`/client/project/${project._id || project.id}`)}
                className="bg-white border border-[#dfe8e1] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col gap-4 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase text-[#7a8b7f] tracking-wide mb-1">
                      {project.category || "Catégorie non définie"}
                    </p>
                    <h4 className="text-lg font-semibold text-[#1e4029]">
                      {project.name}
                    </h4>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getProjectStatusBadge(
                      project.status
                    )}`}
                  >
                    {getProjectStatusLabel(project.status)}
                  </span>
                </div>

                <div className="text-sm text-[#7a8b7f]">
                  {project.description || "Description non fournie"}
                </div>

                <div className="flex items-center justify-between text-xs text-[#7a8b7f]">
                  <span>Avancement</span>
                  <span className="font-semibold text-[#2d5f3f]">
                    {project.completion || 0}%
                  </span>
                </div>
                <div className="h-2 bg-[#f4f7f4] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#5a8f6f]"
                    style={{ width: `${project.completion || 0}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16 bg-white border border-[#dfe8e1] rounded-2xl">
              <FaProjectDiagram className="text-6xl text-[#d5e2d5] mx-auto mb-4" />
              <p className="text-[#7a8b7f] text-lg">Aucun projet actif</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Files Section */}
      <div className="my-10">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#dfe8e1]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase text-[#7a8b7f] tracking-[0.2em] mb-2">
                Fichiers
              </p>
              <h3 className="text-2xl font-bold text-[#1e4029]">
                Mes fichiers récents
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {stats.files.length > 0 ? (
              stats.files.slice(0, 5).map((file) => (
                <div
                  key={file._id}
                  className="flex items-center gap-4 p-4 bg-[#f4f7f4] rounded-xl hover:bg-[#e6f0ea] transition-colors"
                >
                  <FaFileAlt className="text-[#2d5f3f] text-xl" />
                  <div className="flex-1">
                    <p className="font-medium text-[#1e4029]">{file.name}</p>
                    <p className="text-xs text-[#7a8b7f]">
                      {moment(file.uploadDate || file.createdAt).format("DD MMM YYYY")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FaFileAlt className="text-5xl text-[#d5e2d5] mx-auto mb-3" />
                <p className="text-[#7a8b7f]">Aucun fichier récent</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;

