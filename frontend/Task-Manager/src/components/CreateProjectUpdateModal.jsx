import React, { useState } from "react";
import Modal from "./Modal";
import { FiX } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const CreateProjectUpdateModal = ({ isOpen, onClose, project, onUpdateCreated }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return toast.error("Le contenu de la note est obligatoire");
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.MESSAGES.SEND_MESSAGE, {
        content: content.trim(),
        project: project._id
      });

      toast.success("Note ajoutée avec succès !");
      onUpdateCreated(response.data.data);
      handleClose();
    } catch (error) {
      console.error("Error creating update:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout de la note");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setContent("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ajouter une note">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contenu de la note */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Note / Mise à jour <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Rédigez votre note ou mise à jour sur le projet..."
            rows={6}
            className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f] resize-none"
            required
          />
          <p className="text-xs text-[#7a8b7f] mt-1.5">
            Partagez des informations importantes, des décisions prises, des jalons atteints ou des blocages rencontrés.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#dfe8e1]">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-sm text-[#7a8b7f] bg-[#f4f7f4] rounded-xl hover:bg-[#e6f0ea] border border-[#dfe8e1]"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] font-medium shadow-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Ajout..." : "Ajouter la note"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectUpdateModal;

