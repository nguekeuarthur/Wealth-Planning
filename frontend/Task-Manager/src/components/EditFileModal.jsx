import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const EditFileModal = ({ isOpen, onClose, onFileUpdated, file }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file) {
      setFormData({
        name: file.name || "",
        description: file.description || "",
        type: file.type || "",
      });
    }
  }, [file]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.name.trim()) {
      toast.error("Le nom du fichier est requis");
      return;
    }

    if (!formData.type) {
      toast.error("Le type de fichier est requis");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.DOCUMENTS.UPDATE_DOCUMENT(file._id),
        {
          name: formData.name.trim(),
          description: formData.description || "",
          type: formData.type,
        }
      );

      toast.success("Fichier mis à jour avec succès");
      onFileUpdated(response.data.document);
      handleClose();
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      type: "",
    });
    onClose();
  };

  const fileTypeOptions = [
    { value: "contract", label: "CONTRACT" },
    { value: "livrable", label: "DELIVERABLE" },
  ];

  if (!file) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit file">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="File name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
            required
          >
            <option value="">Select file type</option>
            {fileTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={loading}
          >
            {loading ? "Mise à jour..." : "Update"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditFileModal;

