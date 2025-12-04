import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import 'moment/locale/fr';

// Configuration de moment pour utiliser le français
moment.updateLocale('fr', {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  monthsParseExact: true,
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
  weekdaysMin: 'di_lu_ma_me_je_ve_sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Aujourd’hui à] LT',
    nextDay: '[Demain à] LT',
    nextWeek: 'dddd [à] LT',
    lastDay: '[Hier à] LT',
    lastWeek: 'dddd [dernier à] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'dans %s',
    past: 'il y a %s',
    s: 'quelques secondes',
    ss: '%d secondes',
    m: 'une minute',
    mm: '%d minutes',
    h: 'une heure',
    hh: '%d heures',
    d: 'un jour',
    dd: '%d jours',
    M: 'un mois',
    MM: '%d mois',
    y: 'un an',
    yy: '%d ans'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
  ordinal: function (number) {
    return number + (number === 1 ? 'er' : 'e');
  },
  meridiemParse: /PD|MD/,
  isPM: function (input) {
    return input.charAt(0) === 'M';
  },
  // In case the meridiem units are not separated around 12, then implement
  // this function (look at locale/id.js for an example).
  // meridiemHour : function (hour, meridiem) {
  //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
  // },
  meridiem: function (hours) {
    return hours < 12 ? 'PD' : 'MD';
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4  // Used to determine first week of the year.
  }
});

// Définir la locale française comme défaut
moment.locale('fr');
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import {
  FaProjectDiagram,
  FaFileInvoiceDollar,
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTasks,
  FaCog,
  FaCircleNotch,
  FaChartLine,
  FaPlus,
} from "react-icons/fa";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

const COLORS = ["#2d5f3f", "#5a8f6f", "#a7c9ad"];

const TASK_CARD_CONFIG = [
  { label: "Total Tâches", key: "All", icon: FaTasks },
  { label: "En Attente", key: "Pending", icon: FaClock },
  { label: "En Cours", key: "InProgress", icon: FaCircleNotch },
  { label: "Terminées", key: "Completed", icon: FaCheckCircle },
];

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
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

  // Prepare Project Chart Data
  const prepareProjectChartData = (projectsByStatus) => {
    if (!projectsByStatus) return;
    
    const statusMap = {
      'in progress': 'En cours',
      'in review': 'En révision',
      'done': 'Terminé'
    };

    const _data = projectsByStatus.map(item => ({
      status: statusMap[item._id] || item._id,
      count: item.count
    }));
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


  useEffect(() => {
    getDashboardData();
    getDashboardStats();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Tableau de bord">
      {/* Header Section with Enhanced Design */}
      <div className="relative bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] rounded-2xl shadow-xl p-8 my-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Welcome Section */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl || null}
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
                  Tableau de bord
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <button
              onClick={() => navigate('/admin/patrimoine')}
              className="group bg-white/95 backdrop-blur-sm text-[#1e4029] px-6 py-3 rounded-xl transition-all duration-300 text-sm font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl hover:bg-white hover:scale-105 border border-white/20"
            >
              <div className="p-2 bg-[#f0f5f1] rounded-lg group-hover:bg-[#e6f0ea] transition-colors">
                <FaChartLine className="text-lg" />
              </div>
              Vue Patrimoine
            </button>

            <button
              onClick={() => navigate('/admin/create-project')}
              className="group bg-[#5a8f6f]/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-300 text-sm font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl hover:bg-[#5a8f6f] hover:scale-105 border border-white/10"
            >
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <FaPlus className="text-lg" />
              </div>
              Nouveau Projet
            </button>

            <button
              onClick={() => navigate('/admin/calendar')}
              className="group bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 text-sm font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl hover:bg-white/20 hover:scale-105"
            >
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <FaCalendarAlt className="text-lg" />
              </div>
              Planifier RDV
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {TASK_CARD_CONFIG.map((card) => {
            const Icon = card.icon;
            const totalTasks =
              dashboardData?.charts?.taskDistribution?.All || 0;
            const value =
              dashboardData?.charts?.taskDistribution?.[card.key] || 0;
            const percentage =
              card.key === "All" || totalTasks === 0
                ? 100
                : Math.min(100, Math.round((value / totalTasks) * 100));

            return (
              <div
                key={card.key}
                className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#7a8b7f] font-semibold mb-2">
                      {card.label}
                    </p>
                    <h3 className="text-3xl font-bold text-[#1e4029]">
                      {addThousandsSeparator(value)}
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f0f5f1] text-[#2d5f3f] shadow-inner">
                    <Icon className={`text-xl ${card.key === "InProgress" ? "animate-spin" : ""}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-[#7a8b7f] mb-1">
                    <span>{percentage}%</span>
                    <span>
                      {card.key === "All"
                        ? "Tâches totales"
                        : "du volume global"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#f5f7f4] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#5a8f6f]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      {/* Active Projects Section */}
      <div className="my-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#7a8b7f] mb-2">
              Projets actifs
            </p>
            <h3 className="text-2xl font-bold text-[#1e4029]">Vue projets</h3>
          </div>
          <button
            onClick={() => navigate("/admin/projects")}
            className="text-sm font-medium text-[#2d5f3f] flex items-center gap-2 hover:gap-3 transition-all"
          >
            Voir tous les projets <LuArrowRight />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats?.projects?.recent?.length > 0 ? (
            stats.projects.recent.slice(0, 3).map((project) => (
              <div
                key={project._id || project.id}
                onClick={() => navigate(`/admin/project/${project._id || project.id}`)}
                className="bg-white border border-[#dfe8e1] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col gap-4 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/admin/project/${project._id || project.id}`);
                  }
                }}
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

                <div className="flex items-center gap-3 text-xs text-[#7a8b7f]">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="text-[#2d5f3f]" />
                    <span>
                      {project.startDate
                        ? moment(project.startDate).locale('fr').format("DD MMM YYYY")
                        : "Date à définir"}
                    </span>
                  </div>
                  <span className="text-[#dfe8e1]">•</span>
                  <div className="flex items-center gap-1">
                    <FaEnvelope className="text-[#2d5f3f]" />
                    <span>
                      {project.owner?.name || "Responsable non défini"}
                    </span>
                  </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#dfe8e1] hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-semibold text-[#1e4029]">
                Répartition des tâches
              </h5>
              <p className="text-xs text-[#7a8b7f] mt-1">
                Vue d'ensemble des statuts
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#eef5f0] text-[#2d5f3f]">
              <FaCheckCircle className="text-xl" />
            </div>
          </div>

          <CustomPieChart data={pieChartData} colors={COLORS} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#dfe8e1] hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-lg font-semibold text-[#1e4029]">
                Niveaux de priorité
              </h5>
              <p className="text-xs text-[#7a8b7f] mt-1">
                Distribution par urgence
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#eef5f0] text-[#2d5f3f]">
              <FaClock className="text-xl" />
            </div>
          </div>

          <CustomBarChart data={barChartData} />
        </div>
      </div>

      {/* Open Invoices Section */}
      <div className="my-10">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#dfe8e1]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase text-[#7a8b7f] tracking-[0.2em] mb-2">
                Factures
              </p>
              <h3 className="text-2xl font-bold text-[#1e4029]">
                Factures ouvertes
              </h3>
            </div>
            <button
              onClick={() => navigate("/admin/invoices")}
              className="text-sm text-[#2d5f3f] font-medium hover:underline"
            >
              Exporter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f4f7f4] border border-[#dfe8e1] rounded-xl">
                <tr className="text-left text-xs font-semibold text-[#46614f] uppercase tracking-wider">
                  <th className="px-6 py-3">Référence</th>
                  <th className="px-6 py-3">Projet</th>
                  <th className="px-6 py-3">Montant</th>
                  <th className="px-6 py-3">Facturée le</th>
                  <th className="px-6 py-3">Échéance</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#f1f3f1]">
                {stats?.invoices?.byStatus && invoiceChartData.length > 0 ? (
                  invoiceChartData.slice(0, 4).map((invoice, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[#f8fbf8] transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#1e4029]">
                        INV-{index + 101}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#4b5c52]">
                        {invoice.status}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#2d5f3f]">
                        {invoice.amount
                          ? addThousandsSeparator(invoice.amount)
                          : Math.floor(Math.random() * 9000) + 500}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#7a8b7f]">
                        {moment()
                          .subtract(index, "weeks")
                          .format("DD/MM/YYYY")}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#7a8b7f]">
                        {moment()
                          .add(index + 1, "weeks")
                          .format("DD/MM/YYYY")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate("/admin/invoices")}
                          className="text-[#2d5f3f] hover:text-[#1e4029] text-sm font-medium"
                        >
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <FaFileInvoiceDollar className="text-5xl text-[#d5e2d5] mx-auto mb-3" />
                      <p className="text-[#7a8b7f]">
                        Aucune facture ouverte pour le moment
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default Dashboard;
