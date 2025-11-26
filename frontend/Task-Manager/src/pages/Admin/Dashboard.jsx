import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { addThousandsSeparator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import { LuArrowRight } from "react-icons/lu";
import { FaProjectDiagram, FaFileInvoiceDollar, FaEnvelope, FaCalendarAlt, FaCheckCircle, FaClock } from "react-icons/fa";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];
const PROJECT_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1"];
const INVOICE_COLORS = ["#95E1D3", "#F38181", "#AA96DA", "#FCBAD3", "#A8D8EA", "#FFE66D"];


const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [projectChartData, setProjectChartData] = useState([]);
  const [invoiceChartData, setInvoiceChartData] = useState([]);


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

  // Prepare Project Chart Data
  const prepareProjectChartData = (projectsByStatus) => {
    if (!projectsByStatus) return;
    
    const statusMap = {
      'in progress': 'En cours',
      'in review': 'En révision',
      'done': 'Terminé'
    };

    const data = projectsByStatus.map(item => ({
      status: statusMap[item._id] || item._id,
      count: item.count
    }));

    setProjectChartData(data);
  };

  // Prepare Invoice Chart Data
  const prepareInvoiceChartData = (invoicesByStatus) => {
    if (!invoicesByStatus) return;

    const data = invoicesByStatus.map(item => ({
      status: item._id,
      count: item.count,
      amount: item.totalAmount || 0
    }));

    setInvoiceChartData(data);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null)
      }
    } catch (error) {
      console.error("Error fetching tasks dashboard:", error);
    }
  };

  const getDashboardStats = async () => {
    try {
      const response = await axiosInstance.get("/api/dashboard/stats");
      if (response.data) {
        setStats(response.data);
        prepareProjectChartData(response.data?.projects?.byStatus);
        prepareInvoiceChartData(response.data?.invoices?.byStatus);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const onSeeMore = ()=>{
    navigate('/admin/tasks')
  }

  useEffect(() => {
    getDashboardData();
    getDashboardStats();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-[#2d5f3f] to-[#1e4029] rounded-xl shadow-lg p-8 my-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Bonjour, {user?.name} 👋
            </h2>
            <p className="text-sm text-gray-200 mt-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {moment().format("dddd Do MMMM YYYY")}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2">
              <FaProjectDiagram /> Nouveau Projet
            </button>
            <button className="bg-white hover:bg-gray-100 text-[#2d5f3f] px-5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2">
              <FaCalendarAlt /> Planifier RDV
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="space-y-6">

        {/* Statistics Cards - Tasks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">Total Tâches</p>
                <h3 className="text-3xl font-bold">
                  {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.All || 0)}
                </h3>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <FaCheckCircle className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-violet-100 text-sm font-medium mb-2">En Attente</p>
                <h3 className="text-3xl font-bold">
                  {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
                </h3>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <FaClock className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-cyan-100 text-sm font-medium mb-2">En Cours</p>
                <h3 className="text-3xl font-bold">
                  {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
                </h3>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <FaClock className="text-2xl animate-spin" style={{animationDuration: '3s'}} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm font-medium mb-2">Terminées</p>
                <h3 className="text-3xl font-bold">
                  {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Completed || 0)}
                </h3>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <FaCheckCircle className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards - Projects & Invoices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 border-l-4 border-blue-500 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Projets Actifs</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats?.projects?.byStatus?.find(p => p._id === 'in progress')?.count || 0}
                </h3>
                <p className="text-xs text-blue-500 mt-2 font-medium">En progression</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <FaProjectDiagram className="text-2xl text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 border-l-4 border-green-500 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Projets Terminés</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats?.projects?.byStatus?.find(p => p._id === 'done')?.count || 0}
                </h3>
                <p className="text-xs text-green-500 mt-2 font-medium">Complétés</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <FaCheckCircle className="text-2xl text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 border-l-4 border-emerald-500 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Revenu Total</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {addThousandsSeparator(stats?.invoices?.totalRevenue || 0)} €
                </h3>
                <p className="text-xs text-emerald-500 mt-2 font-medium">Revenus encaissés</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <FaFileInvoiceDollar className="text-2xl text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 border-l-4 border-orange-500 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Messages Non Lus</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats?.messages?.unread || 0}
                </h3>
                <p className="text-xs text-orange-500 mt-2 font-medium">À traiter</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg relative">
                <FaEnvelope className="text-2xl text-orange-500" />
                {stats?.messages?.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                    {stats?.messages?.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl shadow-md hover:shadow-xl p-6 border border-purple-200 cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500 p-3 rounded-xl shadow-lg">
                <FaCalendarAlt className="text-xl text-white" />
              </div>
              <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {stats?.appointments?.upcoming?.length || 0}
              </span>
            </div>
            <h4 className="text-gray-700 font-semibold text-sm">RDV à Venir</h4>
            <p className="text-purple-600 text-xs mt-1 font-medium">Prochains rendez-vous</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl shadow-md hover:shadow-xl p-6 border border-yellow-200 cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-500 p-3 rounded-xl shadow-lg">
                <FaClock className="text-xl text-white" />
              </div>
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {stats?.forms?.incomplete || 0}
              </span>
            </div>
            <h4 className="text-gray-700 font-semibold text-sm">Formulaires</h4>
            <p className="text-yellow-600 text-xs mt-1 font-medium">À compléter</p>
          </div>

          <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl shadow-md hover:shadow-xl p-6 border border-red-200 cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-500 p-3 rounded-xl shadow-lg">
                <FaFileInvoiceDollar className="text-xl text-white" />
              </div>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {stats?.invoices?.byStatus?.find(i => i._id === 'en attente')?.count || 0}
              </span>
            </div>
            <h4 className="text-gray-700 font-semibold text-sm">Factures</h4>
            <p className="text-red-600 text-xs mt-1 font-medium">En attente</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl shadow-md hover:shadow-xl p-6 border border-indigo-200 cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-500 p-3 rounded-xl shadow-lg relative">
                <FaEnvelope className="text-xl text-white" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full animate-pulse"></span>
              </div>
              <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {stats?.messages?.recent24h || 0}
              </span>
            </div>
            <h4 className="text-gray-700 font-semibold text-sm">Messages 24h</h4>
            <p className="text-indigo-600 text-xs mt-1 font-medium">Dernières 24h</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-semibold text-gray-800">Répartition des Tâches</h5>
              <p className="text-xs text-gray-500 mt-1">Vue d'ensemble des statuts</p>
            </div>
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-3 rounded-lg shadow-md">
              <FaCheckCircle className="text-white text-xl" />
            </div>
          </div>

          <CustomPieChart
            data={pieChartData}
            colors={COLORS}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-semibold text-gray-800">Niveaux de Priorité</h5>
              <p className="text-xs text-gray-500 mt-1">Distribution par urgence</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-lg shadow-md">
              <FaClock className="text-white text-xl" />
            </div>
          </div>

          <CustomBarChart
            data={barChartData}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-semibold text-gray-800">Projets par Statut</h5>
              <p className="text-xs text-gray-500 mt-1">Suivi de l'avancement</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg shadow-md">
              <FaProjectDiagram className="text-white text-xl" />
            </div>
          </div>

          <CustomPieChart
            data={projectChartData}
            colors={PROJECT_COLORS}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-semibold text-gray-800">Factures par Statut</h5>
              <p className="text-xs text-gray-500 mt-1">Aperçu financier</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-lg shadow-md">
              <FaFileInvoiceDollar className="text-white text-xl" />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {invoiceChartData.length > 0 ? invoiceChartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all duration-200 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm" 
                    style={{ backgroundColor: INVOICE_COLORS[index % INVOICE_COLORS.length] }}
                  />
                  <span className="text-sm font-semibold capitalize text-gray-700">{item.status}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-800">{item.count} facture{item.count > 1 ? 's' : ''}</div>
                  <div className="text-xs text-gray-600 font-medium">{addThousandsSeparator(item.amount)} €</div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <FaFileInvoiceDollar className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Aucune facture disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaProjectDiagram className="text-blue-500" />
                  Projets Récents
                </h5>
                <p className="text-xs text-gray-500 mt-1">Les 5 derniers projets actifs</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-center gap-1">
                Voir tout
                <LuArrowRight className="text-base" />
              </button>
            </div>

            <div className="space-y-3">
              {stats?.projects?.recent?.length > 0 ? stats.projects.recent.slice(0, 5).map((project, index) => (
                <div key={index} className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-200 border border-gray-200 group cursor-pointer">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                      project.status === 'done' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                      project.status === 'in review' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      'bg-gradient-to-br from-blue-400 to-blue-600'
                    }`}>
                      <FaProjectDiagram className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h6 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">{project.name}</h6>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span className="bg-gray-200 px-2 py-0.5 rounded-full">{project.category}</span>
                        <span>• Client: {project.client?.fullName || 'N/A'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              project.status === 'done' ? 'bg-green-500' :
                              project.status === 'in review' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${project.completion || 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">{project.completion || 0}%</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        project.status === 'done' ? 'bg-green-100 text-green-700' :
                        project.status === 'in review' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {project.status === 'done' ? '✓ Terminé' : 
                         project.status === 'in review' ? '⏳ En révision' : 
                         '🔄 En cours'}
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <FaProjectDiagram className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-400">Aucun projet récent</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaCalendarAlt className="text-purple-500" />
                  Rendez-vous à Venir
                </h5>
                <p className="text-xs text-gray-500 mt-1">Agenda des prochaines réunions</p>
              </div>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline flex items-center gap-1">
                Calendrier complet
                <LuArrowRight className="text-base" />
              </button>
            </div>

            <div className="space-y-3">
              {stats?.appointments?.upcoming?.length > 0 ? stats.appointments.upcoming.map((apt, index) => (
                <div key={index} className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-white rounded-xl hover:shadow-md transition-all duration-200 border border-purple-100 group cursor-pointer">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shadow-lg ${
                      apt.status === 'confirmé' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                      apt.status === 'en attente' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      'bg-gradient-to-br from-gray-400 to-gray-600'
                    }`}>
                      <span className="text-white text-xs font-semibold">{moment(apt.startDate).format('DD')}</span>
                      <span className="text-white text-[10px]">{moment(apt.startDate).format('MMM')}</span>
                    </div>
                    <div className="flex-1">
                      <h6 className="font-semibold text-sm text-gray-800 group-hover:text-purple-600 transition-colors">{apt.title}</h6>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <FaClock className="text-purple-500" />
                          {moment(apt.startDate).format('HH:mm')}
                        </p>
                        <span className="text-gray-300">•</span>
                        <p className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                          {apt.type}
                        </p>
                        <span className="text-gray-300">•</span>
                        <p className="text-xs text-gray-600">
                          {apt.client?.fullName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-sm ${
                      apt.status === 'confirmé' ? 'bg-green-100 text-green-700 border border-green-200' :
                      apt.status === 'en attente' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {apt.status === 'confirmé' ? '✓ Confirmé' : 
                       apt.status === 'en attente' ? '⏳ En attente' : 
                       apt.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <FaCalendarAlt className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-400">Aucun rendez-vous prévu</p>
                  <button className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium">
                    + Planifier un rendez-vous
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaCheckCircle className="text-cyan-500" />
                  Tâches Récentes
                </h5>
                <p className="text-xs text-gray-500 mt-1">Dernières activités</p>
              </div>
              <button 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg" 
                onClick={onSeeMore}
              >
                Voir Tout <LuArrowRight className="text-base" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <TaskListTable tableData={dashboardData?.recentTasks || []} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
