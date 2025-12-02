import React, { useState } from "react";
import { FiFile, FiEdit, FiTrash2, FiMoreHorizontal, FiDownload } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import toast from "react-hot-toast";

const FilesList = ({ files, onFileDeleted, onFileUpdated, projectId, onEditFile }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(null);

  const getTypeLabel = (type) => {
    switch (type) {
      case "contract":
        return "CONTRACT";
      case "livrable":
        return "DELIVERABLE";
      default:
        return type.toUpperCase();
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "contract":
        return "bg-blue-100 text-blue-700";
      case "livrable":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDownload = async (file) => {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(file._id)}/download`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name || "file");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Fichier téléchargé avec succès");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Erreur lors du téléchargement");
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(fileId));
      toast.success("Fichier supprimé avec succès");
      onFileDeleted(fileId);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "contract" && file.type === "contract") ||
      (activeFilter === "deliverable" && file.type === "livrable");

    const matchesSearch =
      !searchQuery ||
      file.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun fichier pour le moment</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("contract")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === "contract"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            CONTRACT
          </button>
          <button
            onClick={() => setActiveFilter("deliverable")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === "deliverable"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            DELIVERABLE
          </button>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Type Tag */}
            <div className="mb-3">
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded ${getTypeColor(
                  file.type
                )}`}
              >
                {getTypeLabel(file.type)}
              </span>
            </div>

            {/* Title */}
            <h4 className="text-lg font-bold text-gray-900 mb-2">{file.name}</h4>

            {/* Description */}
            {file.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {file.description}
              </p>
            )}

            {/* File Attachment */}
            <div className="mb-4">
              <button
                onClick={() => handleDownload(file)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
              >
                <FiFile className="text-gray-600" />
                <span className="text-sm text-gray-700 truncate">
                  {file.name || "Example file (4).docx"}
                </span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  if (onEditFile) {
                    onEditFile(file);
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <FiEdit size={16} />
                Edit
              </button>
              <div className="relative">
                <button
                  onClick={() =>
                    setShowMenu(showMenu === file._id ? null : file._id)
                  }
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiMoreHorizontal size={20} />
                </button>
                {showMenu === file._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={() => {
                        handleDownload(file);
                        setShowMenu(null);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiDownload size={16} />
                      Download
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(file._id);
                        setShowMenu(null);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery
              ? "Aucun fichier ne correspond à votre recherche"
              : "Aucun fichier dans cette catégorie"}
          </p>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(null)}
        />
      )}
    </div>
  );
};

export default FilesList;

