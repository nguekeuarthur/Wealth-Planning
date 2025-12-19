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
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaProjectDiagram,
} from "react-icons/fa";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

moment.locale('fr');

const UserDashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const { unreadCount } = useUnreadMessages();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [projects, setProjects] = useState([]);

  // Prepare Chart Data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null)
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getProjects = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS);
      console.log("UserDashboard - Projects response:", response.data);
      console.log("UserDashboard - Projects array:", response.data.projects);
      if (response.data) {
        setProjects(response.data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const onSeeMore = () => {
    navigate('/user/tasks')
  }

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

  useEffect(() => {
    getDashboardData();
    getProjects();
    return () => { };
  }, []);

  if (!dashboardData) {
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
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden translate-y-5">
                {user?.profileImageUrl ? (
                  <img
                    src={fullImageUrl(user?.profileImageUrl)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#5a8f6f] flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
                  Tableau de bord Utilisateur
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
                Total Tâches
              </p>
              <h3 className="text-3xl font-bold text-[#1e4029]">
                {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.All || 0)}
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
                En Attente
              </p>
              <h3 className="text-3xl font-bold text-[#1e4029]">
                {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-[#f0f5f1] text-[#2d5f3f] shadow-inner">
              <FaClock className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#7a8b7f] font-semibold mb-2">
                En Cours
              </p>
              <h3 className="text-3xl font-bold text-[#1e4029]">
                {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-[#f0f5f1] text-[#2d5f3f] shadow-inner">
              <FaClock className="text-xl" />
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
            onClick={() => navigate("/user/projects")}
            className="text-sm font-medium text-[#2d5f3f] flex items-center gap-2 hover:gap-3 transition-all"
          >
            Voir tous les projets <LuArrowRight />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.slice(0, 3).map((project) => (
              <div
                key={project._id || project.id}
                onClick={() => navigate(`/user/project/${project._id || project.id}`)}
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase text-[#7a8b7f] tracking-[0.2em] mb-2">
                Distribution
              </p>
              <h3 className="text-xl font-bold text-[#1e4029]">
                Répartition des tâches
              </h3>
            </div>
          </div>

          <CustomPieChart
            data={pieChartData}
            colors={COLORS}
          />
        </div>

        <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase text-[#7a8b7f] tracking-[0.2em] mb-2">
                Priorités
              </p>
              <h3 className="text-xl font-bold text-[#1e4029]">
                Niveaux de priorité
              </h3>
            </div>
          </div>

          <CustomBarChart
            data={barChartData}
          />
        </div>

        <div className="md:col-span-2 bg-white border border-[#dfe8e1] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase text-[#7a8b7f] tracking-[0.2em] mb-2">
                Tâches
              </p>
              <h3 className="text-xl font-bold text-[#1e4029]">
                Tâches récentes
              </h3>
            </div>

            <button
              className="text-sm font-medium text-[#2d5f3f] flex items-center gap-2 hover:gap-3 transition-all"
              onClick={onSeeMore}
            >
              Voir toutes <LuArrowRight className="text-base" />
            </button>
          </div>

          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
