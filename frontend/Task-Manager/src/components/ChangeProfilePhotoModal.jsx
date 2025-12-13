import React, { useState } from "react";
import { FiX, FiUpload, FiCamera } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const ChangeProfilePhotoModal = ({ isOpen, onClose, currentImage, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error("Veuillez sélectionner une image");
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5 Mo");
        return;
      }

      setSelectedFile(file);
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axiosInstance.post(
        API_PATHS.IMAGE.UPLOAD_IMAGE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Photo de profil mise à jour avec succès");
      onSuccess(response.data.imageUrl);
      handleClose();
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error(
        error.response?.data?.message || "Erreur lors de la mise à jour de la photo"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(currentImage);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Changer la photo de profil
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isUploading}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={previewUrl || "/default-avatar.png"}
                alt="Aperçu"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2">
                <FiCamera className="text-white" size={20} />
              </div>
            </div>
          </div>

          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner une nouvelle photo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="profileImageInput"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <label
                htmlFor="profileImageInput"
                className="flex flex-col items-center cursor-pointer"
              >
                <FiUpload className="text-gray-400 mb-2" size={32} />
                <span className="text-sm text-gray-600">
                  Cliquez pour télécharger une image
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  JPG, PNG ou GIF (max. 5 Mo)
                </span>
              </label>
            </div>

            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Fichier sélectionné: {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isUploading}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Téléchargement..." : "Mettre à jour"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePhotoModal;
