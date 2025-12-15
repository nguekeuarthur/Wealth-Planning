import React, { useState } from "react";
import Modal from "./Modal";
import toast from "react-hot-toast";

const DeleteUserModal = ({ isOpen, onClose, onConfirm, user }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(user._id);
      onClose();
    } catch (err) {
      toast.error(err?.message || "Échec de la suppression");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? `Supprimer ${user.name}` : "Supprimer l'utilisateur"}>
      <div className="space-y-4">
        <p className="text-sm text-[#1e4029]">
          Vous êtes sur le point de supprimer définitivement cet utilisateur. Cette action est irréversible.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#dfe8e1] rounded-xl text-[#7a8b7f] hover:bg-[#f4f7f4]"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              "Supprimer"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteUserModal;
