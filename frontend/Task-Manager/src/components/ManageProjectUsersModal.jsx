import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import SelectUsers from "./Inputs/SelectUsers";

const ManageProjectUsersModal = ({ isOpen, onClose, project, onUpdate }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedUsers([]);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      if (!selectedUsers || selectedUsers.length === 0) {
        toast.error("Sélectionnez au moins un utilisateur");
        return;
      }

      setCreating(true);
      await axiosInstance.post(API_PATHS.PROJECTS.ADD_USERS_TO_PROJECT(project._id), {
        existingUserIds: selectedUsers,
      });
      toast.success("Utilisateurs assignés au projet");
      onUpdate && onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erreur lors de l'opération");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gérer les membres du projet">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-[#7a8b7f] mb-2">Sélectionnez des utilisateurs existants</p>
          <SelectUsers selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-white border rounded">Annuler</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-[#2d5f3f] text-white rounded" disabled={creating}>
            {creating ? 'Envoi...' : 'Ajouter au projet'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ManageProjectUsersModal;
