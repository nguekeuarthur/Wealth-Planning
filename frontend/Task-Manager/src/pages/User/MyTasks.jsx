import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import moment from "moment";
import 'moment/locale/fr';

moment.locale('fr');

const MyTasks = () => {
  const { user } = useContext(UserContext);
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      // Map statusSummary data with fixed labels and order
      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  if (loading) {
    return (
      <DashboardLayout activeMenu="Mes tâches">
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
    <DashboardLayout activeMenu="Mes tâches">
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
                    src={user.profileImageUrl}
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
                  Mes Tâches
                </p>
                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Gestion des tâches
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

      {/* Task Status Tabs */}
      <div className="my-6">
        {tabs?.[0]?.count > 0 && (
          <TaskStatusTabs
            tabs={tabs}
            activeTab={filterStatus}
            setActiveTab={setFilterStatus}
          />
        )}
      </div>

      {/* Tasks Grid */}
      <div className="mb-10">
        {allTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTasks?.map((item, index) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => {
                  handleClick(item._id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-[#dfe8e1] rounded-2xl">
            <LuFileSpreadsheet className="text-7xl text-[#d5e2d5] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#1e4029] mb-2">
              Aucune tâche trouvée
            </h3>
            <p className="text-[#7a8b7f]">
              {filterStatus === "All" 
                ? "Vous n'avez aucune tâche assignée pour le moment."
                : `Aucune tâche avec le statut "${filterStatus}".`
              }
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
