import React, { useState } from "react";
import Modal from "./Modal";
import { FiX } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const AddWeeklyUpdateModal = ({ isOpen, onClose, onUpdateCreated, projectId }) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!note || !note.trim()) {
      toast.error("La note ne peut pas être vide");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.WEEKLY_UPDATES.CREATE_UPDATE, {
        note: note.trim(),
        project: projectId,
      });

      toast.success("Note ajoutée avec succès");
      onUpdateCreated(response.data.update);
      handleClose();
    } catch (error) {
      console.error("Error creating weekly update:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout de la note");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNote("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ajouter une note">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note <span className="text-red-500">*</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Entrez votre note..."
            rows={6}
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

export default AddWeeklyUpdateModal;

