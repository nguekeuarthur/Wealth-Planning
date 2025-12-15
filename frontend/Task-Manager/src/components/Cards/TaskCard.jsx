import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip, LuPencil, LuTrash2 } from "react-icons/lu";
import moment from "moment";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
  onEdit,
  onDelete,
  canModify = false,
}) => {
  const getStatusLabel = () => {
    switch (status) {
      case "In Progress":
        return "En cours";
      case "Completed":
        return "Terminée";
      case "Pending":
        return "En attente";
      default:
        return status;
    }
  };

  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";

      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getPriorityLabel = () => {
    switch (priority) {
      case "Low":
        return "Basse";
      case "Medium":
        return "Moyenne";
      case "High":
        return "Haute";
      case "Urgent":
        return "Urgente";
      default:
        return priority;
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";

      case "Medium":
        return "text-amber-500 bg-amber-50 border border-amber-500/10";

      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  return <div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded `}
        >
          {getStatusLabel()}
        </div>
        <div
          className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}
        >
          {getPriorityLabel()}
        </div>
      </div>

      <div
        className={`px-4 border-l-[3px] ${
          status === "In Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-indigo-500"
            : "border-violet-500"
        }`}
      >
        <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
          {title}
        </p>

        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>

        {canModify && (
          <>
            <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
              Tâches terminées:{" "}
              <span className="font-semibold text-gray-700">
                {completedTodoCount} / {todoChecklist.length || 0}
              </span>
            </p>

            <Progress progress={progress} status={status} />
          </>
        )}
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500">Date de début</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <label className="text-xs text-gray-500">Échéance</label>
              <p className="text-[13px] font-medium text-gray-900">
                {moment(dueDate).format("Do MMM YYYY")}
              </p>
            </div>
            
            {canModify && (
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                  }}
                  className="p-1.5 hover:bg-[#f4f7f4] rounded-lg transition-colors"
                  title="Modifier"
                >
                  <LuPencil className="w-4 h-4 text-[#2d5f3f]" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <LuTrash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} />

          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <LuPaperclip className="text-primary" />{" "}
              <span className="text-xs text-gray-900">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
};

export default TaskCard;
