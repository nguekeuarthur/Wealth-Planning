import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FiCalendar } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const EditTaskModal = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Pending",
    dueDate: ""
  });
  const [loading, setLoading] = useState(false);

  const priorityOptions = [
    { value: "Low", label: "Basse", color: "bg-blue-100 text-blue-700" },
    { value: "Medium", label: "Moyenne", color: "bg-yellow-100 text-yellow-700" },
    { value: "High", label: "Haute", color: "bg-orange-100 text-orange-700" },
    { value: "Urgent", label: "Urgente", color: "bg-red-100 text-red-700" }
  ];

  const statusOptions = [
    { value: "Pending", label: "En attente" },
    { value: "In Progress", label: "En cours" },
    { value: "Completed", label: "Terminée" }
  ];

  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Low",
        status: task.status || "Pending",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ""
      });
    }
  }, [task, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return toast.error("Le titre de la tâche est obligatoire");
    }

    if (!formData.dueDate) {
      return toast.error("La date d'échéance est obligatoire");
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(task._id),
        {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: formData.status,
          dueDate: new Date(formData.dueDate).toISOString()
        }
      );

      toast.success("Tâche modifiée avec succès !");
      onTaskUpdated?.(response.data.task);
      handleClose();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Low",
      status: "Pending",
      dueDate: ""
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Modifier la tâche">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Titre de la tâche <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Ex: Réviser le contrat client"
            className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Décrivez les détails de la tâche..."
            rows={4}
            className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
          />
        </div>

        {/* Priorité et Statut */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
              Priorité
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029]"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
              Statut
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029]"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date d'échéance */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Date d'échéance <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a8b7f] w-4 h-4" />
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029]"
              required
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 border border-[#dfe8e1] text-[#2d5f3f] rounded-xl hover:bg-[#f4f7f4] transition-colors font-medium"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-colors font-medium disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Modification..." : "Modifier"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;
