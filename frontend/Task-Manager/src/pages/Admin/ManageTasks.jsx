import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { LuFileSpreadsheet, LuTrash2 } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import EditTaskModal from "../../components/EditTaskModal";
import toast from "react-hot-toast";

const ManageTasks = () => {
  const { user } = useContext(UserContext);
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const navigate = useNavigate();

  const getAllTasks = async () => {

    try {
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
    }
  };

  const handleClick = (taskData) => {
    navigate(`/admin/tasks/view/${taskData._id}`);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleDelete = (task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(selectedTask._id));
      toast.success("Tâche supprimée avec succès");
      setShowDeleteModal(false);
      setSelectedTask(null);
      getAllTasks(filterStatus);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleTaskUpdated = () => {
    getAllTasks(filterStatus);
  };

  const canModifyTask = (task) => {
    return user?.role === 'admin' || task?.createdBy?._id === user?._id;
  };

  // download task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading details:", error);
      toast.error("Failed to download details. Please try again.");
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Projects">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

            <button
              className="flex lg:hidden download-btn"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button className="hidden lg:flex download-btn" onClick={handleDownloadReport}>
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
              onClick={() => handleClick(item)}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
              canModify={canModifyTask(item)}
            />
          ))}
        </div>
      </div>

      {/* Modal d'édition */}
      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onTaskUpdated={handleTaskUpdated}
      />

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <LuTrash2 className="text-red-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#1e4029] mb-2">
                  Supprimer la tâche
                </h3>
                <p className="text-sm text-[#7a8b7f] mb-4">
                  Êtes-vous sûr de vouloir supprimer la tâche "{selectedTask?.title}" ? Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedTask(null);
                    }}
                    className="flex-1 px-4 py-2 border border-[#dfe8e1] text-[#2d5f3f] rounded-xl hover:bg-[#f4f7f4] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageTasks;
