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
            <button 
              onClick={() => navigate('/admin/patrimoine')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-md"
            >
              <FaProjectDiagram /> Vue Patrimoine
            </button>
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
      </div>

      {/* Active Projects Section */}
      <div className="my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Active Projects</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats?.projects?.recent?.length > 0 ? stats.projects.recent.slice(0, 3).map((project, index) => (
            <div key={index} className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group h-64">
              {/* Image de fond avec gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
                <div className="w-full h-full flex items-center justify-center opacity-20">
                  <FaProjectDiagram className="text-9xl text-gray-400" />
                </div>
              </div>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Badge statut en haut à gauche */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg backdrop-blur-sm ${
                  project.status === 'done' ? 'bg-green-500/90 text-white' :
                  project.status === 'in review' ? 'bg-yellow-500/90 text-white' :
                  'bg-blue-500/90 text-white'
                }`}>
                  {project.status === 'done' ? 'Terminé' : 
                   project.status === 'in review' ? 'En révision' : 
                   'In progress'}
                </span>
              </div>

              {/* Contenu en bas */}
              <div className="absolute bottom-0 left-0 right-0 bg-white p-5 z-10">
                <h4 className="font-bold text-lg text-gray-800 truncate group-hover:text-blue-600 transition-colors mb-2">
                  {project.name}
                </h4>
                <p className="text-sm text-gray-600 truncate mb-3">
                  {project.category || 'Catégorie non définie'}
                </p>
                
                {/* Barre de progression */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.status === 'done' ? 'bg-green-500' :
                        project.status === 'in review' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${project.completion || 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 min-w-[40px] text-right">
                    {project.completion || 0}%
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-16 bg-gray-50 rounded-xl">
              <FaProjectDiagram className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun projet actif</p>
            </div>
          )}
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
      </div>

      {/* Open Invoices Section */}
      <div className="my-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Open Invoices</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"># ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"># Project</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"># Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">📅 Invoiced date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">📅 Due date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats?.invoices?.byStatus && invoiceChartData.length > 0 ? (
                  invoiceChartData.slice(0, 4).map((invoice, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{index + 2}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{invoice.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {invoice.amount ? addThousandsSeparator(invoice.amount) : (Math.floor(Math.random() * 9000) + 500)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">21/05/2025</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {index === 0 ? '11/02/2023' : 
                           index === 1 ? '04/04/2025' : 
                           index === 2 ? '30/11/2024' : 
                           '10/01/2023'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <span className="text-xl">⋯</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <FaFileInvoiceDollar className="text-5xl text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Aucune facture ouverte</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {stats?.invoices?.byStatus && invoiceChartData.length > 0 && (
            <div className="mt-4 flex items-center justify-end text-xs text-gray-500">
              <span>Made with 💛 softr</span>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
