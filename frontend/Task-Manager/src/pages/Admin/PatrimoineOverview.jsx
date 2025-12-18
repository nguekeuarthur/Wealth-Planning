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
      <div className="relative bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] rounded-2xl shadow-2xl p-8 my-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full translate-y-36 -translate-x-36"></div>
        </div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-2">
              Gestion Patrimoniale
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Vue d'Ensemble du Patrimoine
            </h2>
            <p className="text-white/80 mt-3 text-sm">
              Bonjour, {user?.name} - Gérez vos projets et activités
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#dfe8e1] hover:shadow-xl transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#7a8b7f] text-sm font-medium mb-2 uppercase tracking-wide">Projets Actifs</p>
              <h3 className="text-4xl font-bold text-[#1e4029] group-hover:text-[#2d5f3f] transition-colors">
                {patrimoineData?.activeProjects?.length || 0}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-[#2d5f3f] to-[#1e4029] p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform">
              <FaProjectDiagram className="text-2xl text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#dfe8e1] hover:shadow-xl transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#7a8b7f] text-sm font-medium mb-2 uppercase tracking-wide">Factures</p>
              <h3 className="text-4xl font-bold text-[#1e4029] group-hover:text-[#2d5f3f] transition-colors">
                {invoiceStatusData.reduce((acc, curr) => acc + curr.value, 0)}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-[#5a8f6f] to-[#4a7a5f] p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform">
              <FaFileInvoiceDollar className="text-2xl text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#dfe8e1] hover:shadow-xl transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#7a8b7f] text-sm font-medium mb-2 uppercase tracking-wide">Tâches en Attente</p>
              <h3 className="text-4xl font-bold text-[#1e4029] group-hover:text-[#2d5f3f] transition-colors">
                {pendingTasks.length}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-[#7a9d7e] to-[#5a8f6f] p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform">
              <FaTasks className="text-2xl text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#dfe8e1] hover:shadow-xl transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#7a8b7f] text-sm font-medium mb-2 uppercase tracking-wide">Messages Non Lus</p>
              <h3 className="text-4xl font-bold text-[#1e4029] group-hover:text-[#2d5f3f] transition-colors">
                {(discussionsData?.inboxMessages?.unread || 0) + 
                 (discussionsData?.projectMessages?.messages?.filter(m => !m.isRead)?.length || 0)}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-[#3d6e4f] to-[#2d5f3f] p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform">
              <FaEnvelope className="text-2xl text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Projets par statut */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#dfe8e1] hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-bold text-[#1e4029]">Projets par Statut</h5>
              <p className="text-xs text-[#7a8b7f] mt-1 uppercase tracking-wide">3 statuts</p>
            </div>
            <div className="bg-gradient-to-br from-[#2d5f3f] to-[#1e4029] p-3 rounded-xl shadow-md">
              <FaProjectDiagram className="text-white text-xl" />
            </div>
          </div>
          <CustomPieChart data={projectStatusData} colors={PROJECT_STATUS_COLORS} />
        </div>

        {/* Factures par statut */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#dfe8e1] hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-bold text-[#1e4029]">Factures par Statut</h5>
              <p className="text-xs text-[#7a8b7f] mt-1 uppercase tracking-wide">6 statuts</p>
            </div>
            <div className="bg-gradient-to-br from-[#5a8f6f] to-[#4a7a5f] p-3 rounded-xl shadow-md">
              <FaFileInvoiceDollar className="text-white text-xl" />
            </div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {invoiceStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-[#f8faf9] to-white rounded-lg hover:shadow-md transition-all border-l-4 border-[#5a8f6f]">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-inner" 
                    style={{ backgroundColor: INVOICE_STATUS_COLORS[index % INVOICE_STATUS_COLORS.length] }}
                  />
                  <span className="text-sm font-semibold text-[#1e4029] capitalize">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#2d5f3f]">{item.value}</div>
                  <div className="text-xs text-gray-600">
                    {new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(item.amount || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catégories de projets */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#dfe8e1] hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-bold text-[#1e4029]">Par Catégories</h5>
              <p className="text-xs text-[#7a8b7f] mt-1 uppercase tracking-wide">Distribution</p>
            </div>
            <div className="bg-gradient-to-br from-[#7a9d7e] to-[#5a8f6f] p-3 rounded-xl shadow-md">
              <FaProjectDiagram className="text-white text-xl" />
            </div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categoriesData.map((item, index) => (
              <div key={index} className="p-3 bg-gradient-to-r from-[#f8faf9] to-white rounded-lg hover:shadow-md transition-all border-l-4 border-[#5a8f6f]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full shadow-inner" 
                      style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                    />
                    <span className="text-xs font-semibold text-[#1e4029]">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[#2d5f3f]">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tâches en attente */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#dfe8e1] mb-8 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h5 className="text-lg font-bold text-[#1e4029] flex items-center gap-2">
              <FaTasks className="text-[#2d5f3f]" />
              Rappels des Tâches en Attente
            </h5>
            <p className="text-xs text-[#7a8b7f] mt-1 uppercase tracking-wide">{pendingTasks.length} tâche{pendingTasks.length > 1 ? 's' : ''} à traiter</p>
          </div>
        </div>
        <PendingTasksList tasks={pendingTasks} />
      </div>

      {/* Discussions et Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discussions récentes */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#dfe8e1] hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-bold text-[#1e4029] flex items-center gap-2">
                <FaEnvelope className="text-[#2d5f3f]" />
                Accès Rapide aux Discussions
              </h5>
              <p className="text-xs text-[#7a8b7f] mt-1 uppercase tracking-wide">Dernières 24 heures</p>
            </div>
          </div>
          <RecentDiscussions 
            projectMessages={discussionsData?.projectMessages?.messages || []}
            inboxMessages={discussionsData?.inboxMessages?.messages || []}
          />
        </div>

        {/* Documents récents */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#dfe8e1] hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-bold text-[#1e4029] flex items-center gap-2">
                <FaFile className="text-[#5a8f6f]" />
                Documents Récents
              </h5>
              <p className="text-xs text-[#7a8b7f] mt-1 uppercase tracking-wide">Dernières 24 heures</p>
            </div>
          </div>
          <RecentDocuments documents={discussionsData?.recentDocuments?.documents || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatrimoineOverview;
