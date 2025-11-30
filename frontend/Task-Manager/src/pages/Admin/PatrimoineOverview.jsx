import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { FaProjectDiagram, FaFileInvoiceDollar, FaTasks, FaEnvelope, FaFile } from "react-icons/fa";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import PendingTasksList from "../../components/PendingTasksList";
import RecentDiscussions from "../../components/RecentDiscussions";
import RecentDocuments from "../../components/RecentDocuments";

const PROJECT_STATUS_COLORS = ["#4ECDC4", "#FFE66D", "#95E1D3"];
const INVOICE_STATUS_COLORS = ["#95E1D3", "#F38181", "#AA96DA", "#FCBAD3", "#A8D8EA", "#FFE66D"];
const CATEGORY_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DFE6E9", "#74B9FF", "#A29BFE", "#FD79A8", "#FDCB6E", "#6C5CE7"];

const PatrimoineOverview = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  const [patrimoineData, setPatrimoineData] = useState(null);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [discussionsData, setDiscussionsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [projectStatusData, setProjectStatusData] = useState([]);
  const [invoiceStatusData, setInvoiceStatusData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);

  // Charger la vue d'ensemble du patrimoine
  const loadPatrimoineOverview = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.PATRIMOINE_OVERVIEW);
      if (response.data) {
        setPatrimoineData(response.data);
        
        // Préparer les données pour les graphiques
        const projectsChart = response.data.charts.projectsByStatus.map(item => ({
          name: item.status === 'in progress' ? 'En cours' : 
                item.status === 'in review' ? 'En révision' : 
                item.status === 'done' ? 'Terminé' : item.status,
          value: item.count
        }));
        setProjectStatusData(projectsChart);

        const invoicesChart = response.data.charts.invoicesByStatus.map(item => ({
          name: item.status,
          value: item.count,
          amount: item.totalAmount
        }));
        setInvoiceStatusData(invoicesChart);

        const categoriesChart = response.data.charts.projectsByCategory.map(item => ({
          name: item.category,
          value: item.count,
          projects: item.projects
        }));
        setCategoriesData(categoriesChart);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la vue d'ensemble:", error);
    }
  };

  // Charger les tâches en attente
  const loadPendingTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.PENDING_TASKS);
      if (response.data) {
        setPendingTasks(response.data.tasks);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error);
    }
  };

  // Charger les discussions et documents récents
  const loadDiscussions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.RECENT_DISCUSSIONS);
      if (response.data) {
        setDiscussionsData(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        loadPatrimoineOverview(),
        loadPendingTasks(),
        loadDiscussions()
      ]);
    };
    
    loadAllData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout activeMenu="Patrimoine">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Patrimoine">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 my-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Vue d'Ensemble du Patrimoine
            </h2>
            <p className="text-sm text-blue-100 mt-2">
              Bonjour, {user?.name} - Gérez vos projets et activités
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">Projets Actifs</p>
              <h3 className="text-3xl font-bold">
                {patrimoineData?.activeProjects?.length || 0}
              </h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaProjectDiagram className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-medium mb-2">Factures</p>
              <h3 className="text-3xl font-bold">
                {invoiceStatusData.reduce((acc, curr) => acc + curr.value, 0)}
              </h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaFileInvoiceDollar className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-2">Tâches en Attente</p>
              <h3 className="text-3xl font-bold">
                {pendingTasks.length}
              </h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaTasks className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-2">Messages Non Lus</p>
              <h3 className="text-3xl font-bold">
                {(discussionsData?.inboxMessages?.unread || 0) + 
                 (discussionsData?.projectMessages?.messages?.filter(m => !m.isRead)?.length || 0)}
              </h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaEnvelope className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Projets par statut */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-semibold text-gray-800">Projets par Statut</h5>
              <p className="text-xs text-gray-500 mt-1">3 statuts</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-lg">
              <FaProjectDiagram className="text-white text-xl" />
            </div>
          </div>
          <CustomPieChart data={projectStatusData} colors={PROJECT_STATUS_COLORS} />
        </div>

        {/* Factures par statut */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-semibold text-gray-800">Factures par Statut</h5>
              <p className="text-xs text-gray-500 mt-1">6 statuts</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg">
              <FaFileInvoiceDollar className="text-white text-xl" />
            </div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {invoiceStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: INVOICE_STATUS_COLORS[index % INVOICE_STATUS_COLORS.length] }}
                  />
                  <span className="text-sm font-medium capitalize">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{item.value}</div>
                  <div className="text-xs text-gray-600">{item.amount?.toLocaleString()} €</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catégories de projets */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-semibold text-gray-800">Par Catégories</h5>
              <p className="text-xs text-gray-500 mt-1">Distribution</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-lg">
              <FaProjectDiagram className="text-white text-xl" />
            </div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categoriesData.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                    />
                    <span className="text-xs font-semibold text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tâches en attente */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaTasks className="text-orange-500" />
              Rappels des Tâches en Attente
            </h5>
            <p className="text-xs text-gray-500 mt-1">{pendingTasks.length} tâche{pendingTasks.length > 1 ? 's' : ''} à traiter</p>
          </div>
        </div>
        <PendingTasksList tasks={pendingTasks} />
      </div>

      {/* Discussions et Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discussions récentes */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaEnvelope className="text-blue-500" />
                Accès Rapide aux Discussions
              </h5>
              <p className="text-xs text-gray-500 mt-1">Dernières 24 heures</p>
            </div>
          </div>
          <RecentDiscussions 
            projectMessages={discussionsData?.projectMessages?.messages || []}
            inboxMessages={discussionsData?.inboxMessages?.messages || []}
          />
        </div>

        {/* Documents récents */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaFile className="text-green-500" />
                Documents Récents
              </h5>
              <p className="text-xs text-gray-500 mt-1">Dernières 24 heures</p>
            </div>
          </div>
          <RecentDocuments documents={discussionsData?.recentDocuments?.documents || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatrimoineOverview;
