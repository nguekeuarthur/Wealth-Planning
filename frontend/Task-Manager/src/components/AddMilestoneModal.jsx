import React, { useState } from "react";
import Modal from "./Modal";
import { FiCalendar, FiClock } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const AddMilestoneModal = ({ isOpen, onClose, onMilestoneCreated, projectId }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    completedAt: "",
    completedTime: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.name.trim()) {
      toast.error("Le nom du milestone est requis");
      return;
    }

    if (!formData.description || !formData.description.trim()) {
      toast.error("La description est requise");
      return;
    }

    if (!formData.completedAt) {
      toast.error("La date de complétion est requise");
      return;
    }

    // Combine date and time
    const completedAt = formData.completedTime
      ? `${formData.completedAt}T${formData.completedTime}:00`
      : `${formData.completedAt}T00:00:00`;

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.MILESTONES.CREATE_MILESTONE, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        completedAt,
        project: projectId,
      });

      toast.success("Milestone ajouté avec succès");
      onMilestoneCreated(response.data.milestone);
      handleClose();
    } catch (error) {
      console.error("Error creating milestone:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout du milestone");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      completedAt: "",
      completedTime: "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ajouter un jalon">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du jalon <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nom du jalon"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date d'achèvement <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="completedAt"
                value={formData.completedAt}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>
            <div className="relative">
              <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="time"
                name="completedTime"
                value={formData.completedTime}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description du jalon..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={loading}
          >
            {loading ? "Ajout..." : "Ajouter"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMilestoneModal;

