import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import TaskDetailsModal from "../../components/TaskDetailsModal";
import toast from "react-hot-toast";
import moment from "moment";
import 'moment/locale/fr';

moment.locale('fr');

const ClientTasks = () => {
  const { user } = useContext(UserContext);
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

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
      console.error("Error fetching tasks:", error);
      toast.error("Erreur lors du chargement des tâches");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleCloseModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  useEffect(() => {
    getAllTasks(filterStatus);
  }, [filterStatus]);

  return (
    <DashboardLayout
      title="Gestion des tâches"
      subtitle="Consultez toutes vos tâches assignées"
      headerBgColor="#2d5f3f"
    >
      <div className="mb-6">
        <TaskStatusTabs
          tabs={tabs}
          filterStatus={filterStatus}
          onChange={(status) => setFilterStatus(status)}
        />
      </div>

      <div className="bg-[#f9fafb] rounded-2xl p-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5f3f]"></div>
          </div>
        ) : allTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTasks.map((task) => (
              <TaskCard
                key={task._id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                status={task.status}
                progress={task.progress || 0}
                createdAt={task.createdAt}
                dueDate={task.dueDate}
                assignedTo={task.assignedTo}
                attachmentCount={task.attachments?.length || 0}
                completedTodoCount={
                  task.todoChecklist?.filter((todo) => todo.isCompleted).length || 0
                }
                todoChecklist={task.todoChecklist || []}
                onClick={() => handleClick(task)}
                canModify={false}
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

      {/* Modal de détails de la tâche en lecture seule */}
      {selectedTask && (
        <TaskDetailsModal
          isOpen={showTaskModal}
          onClose={handleCloseModal}
          task={selectedTask}
          readOnly={true}
        />
      )}
    </DashboardLayout>
  );
};

export default ClientTasks;
