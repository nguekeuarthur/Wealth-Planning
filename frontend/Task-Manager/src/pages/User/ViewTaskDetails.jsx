import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import DashboardLayout from "../../components/layouts/DashboardLayout";
import AvatarGroup from "../../components/AvatarGroup";
import EditTaskModal from "../../components/EditTaskModal";
import { UserContext } from "../../context/userContext";
import moment from "moment";
import toast from "react-hot-toast";
import { LuSquareArrowOutUpRight, LuPencil, LuTrash2 } from "react-icons/lu";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [task, setTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";

      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  // get Task info by ID
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );

      if (response.data) {
        const taskInfo = response.data;
        setTask(taskInfo);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // handle todo check
  const updateTodoChecklist = async (index) => {
    const todoChecklist = [...task?.todoChecklist];
    const taskId = id;

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;

      try {
        const response = await axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
          { todoChecklist }
        );
        if (response.status === 200) {
          setTask(response.data?.task || task);
        } else {
          // Optionally revert the toggle if the API call fails.
          todoChecklist[index].completed = !todoChecklist[index].completed;
        }
      } catch (error) {
        todoChecklist[index].completed = !todoChecklist[index].completed;
      }
    }
  };

  // Handle attachment link lick
  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link; // Default to HTTPS
    }
    window.open(link, "_blank");
  };

  // Handle delete task
  const handleDeleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(id));
      toast.success("Tâche supprimée avec succès");
      navigate("/user/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  // Handle edit task
  const handleEditTask = () => {
    setShowEditModal(true);
  };

  // Handle task update success
  const handleTaskUpdated = () => {
    getTaskDetailsByID(); // Refresh task data
    setShowEditModal(false);
  };

  // Check if user can edit/delete (admin, task creator, or assigned user)
  const canModify =
    user?.role === 'admin' ||
    task?.createdBy?._id === user?._id ||
    task?.assignedTo?.some(assignedUser => assignedUser._id === user?._id) ||
    (task?.assignedRoles && task.assignedRoles.includes(user?.role));

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
    return () => { };
  }, [id]);

  return (
    <DashboardLayout activeMenu="Mes tâches">
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4 gap-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm md:text-xl font-medium">
                  {task?.title}
                </h2>

                <div className="flex items-center gap-3">
                  <div
                    className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(
                      task?.status
                    )} px-4 py-0.5 rounded `}
                  >
                    {task?.status}
                  </div>

                  {canModify && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditTask}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#2d5f3f] text-white rounded-lg hover:bg-[#1e4029] transition-colors text-sm"
                      >
                        <LuPencil size={14} />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <LuTrash2 size={14} />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox label="Description" value={task?.description} />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Priority" value={task?.priority} />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("Do MMM YYYY")
                        : "N/A"
                    }
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">
                    Assigned To
                  </label>

                  <AvatarGroup
                    avatars={
                      task?.assignedTo?.map((item) => fullImageUrl(item?.profileImageUrl)) ||
                      []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="text-xs font-medium text-slate-500">
                  Roles assignés
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {task?.assignedRoles && task.assignedRoles.length > 0 ? (
                    task.assignedRoles.map((role, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#e8f0e8] text-[#2d5f3f] text-xs font-medium rounded-lg border border-[#d5e8db]"
                      >
                        {role === 'admin' ? 'Administrateur' :
                          role === 'partner' ? 'Partenaire' :
                            role === 'collaborator' ? 'Collaborateur' :
                              role === 'client' ? 'Client' : role}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">Aucun rôle assigné</span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-medium text-slate-500">
                  Todo Checklist
                </label>

                {task?.todoChecklist?.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item.text}
                    isChecked={item?.completed}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>

              {task?.attachments?.length > 0 && (
                <div className="mt-2">
                  <label className="text-xs font-medium text-slate-500">
                    Attachments
                  </label>

                  {task?.attachments?.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(fullImageUrl(link))}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
                  Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 border border-[#dfe8e1] text-[#2d5f3f] rounded-xl hover:bg-[#f4f7f4] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteTask();
                      setShowDeleteModal(false);
                    }}
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

      {/* Modal d'édition */}
      {showEditModal && task && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">{label}</label>

      <p className="text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5">
        {value}
      </p>
    </>
  );
};

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
      />

      <p className="text-[13px] text-gray-800">{text}</p>
    </div>
  );
};

const Attachment = ({ link, index, onClick }) => {
  return (
    <div
      className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-1 flex items-center gap-3">
        <span className="text-xs text-gray-400 font-semibold mr-2">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>

        <p className="text-xs text-black">{link}</p>
      </div>

      <LuSquareArrowOutUpRight className="text-gray-400" />
    </div>
  );
};
