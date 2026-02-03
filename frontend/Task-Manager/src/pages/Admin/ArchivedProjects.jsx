import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { FiSearch, FiRotateCcw, FiArchive, FiFolder, FiUser, FiCalendar, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";

const brandPalette = {
  primary: "#1e4029",
  secondary: "#2d5f3f",
  accent: "#5a8f6f",
  soft: "#f4f7f4",
  border: "#dfe8e1",
  muted: "#7a8b7f",
};

const ArchivedProjects = () => {
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/admin/projects');
      return;
    }
    getArchivedProjects();
  }, [user, navigate]);

  useEffect(() => {
    let filtered = archivedProjects;

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((project) =>
        project.name.toLowerCase().includes(query) ||
        project.category?.toLowerCase().includes(query) ||
        project.client?.name?.toLowerCase().includes(query) ||
        project.projectLead?.name?.toLowerCase().includes(query)
      );
    }

    setFilteredProjects(filtered);
  }, [searchQuery, archivedProjects]);

  const getArchivedProjects = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_ARCHIVED_PROJECTS);
      setArchivedProjects(response.data?.projects || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des projets archivés :", error);
      toast.error("Échec du chargement des projets archivés");
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreProject = async (projectId) => {
    try {
      await axiosInstance.put(API_PATHS.PROJECTS.RESTORE_PROJECT(projectId));
      toast.success("Projet restauré avec succès");
      getArchivedProjects(); // Refresh the list
    } catch (error) {
      console.error("Erreur lors de la restauration :", error);
      toast.error("Échec de la restauration du projet");
    }
  };

  const handleDeleteProjects = async () => {
    try {
      const deletePromises = selectedProjects.map(projectId =>
        axiosInstance.delete(API_PATHS.PROJECTS.DELETE_PROJECT(projectId))
      );

      await Promise.all(deletePromises);
      toast.success(`${selectedProjects.length} projet(s) supprimé(s) définitivement`);
      setSelectedProjects([]);
      setShowDeleteConfirm(false);
      getArchivedProjects(); // Refresh the list
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error("Échec de la suppression des projets");
    }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(p => p._id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Projects">
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5f3f] mx-auto"></div>
            <p className="mt-4 text-[#7a8b7f]">Chargement des projets archivés...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Projects">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] rounded-2xl shadow-xl p-8 my-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Title Section */}
          <div className="flex-1">
            <button
              onClick={() => navigate("/admin/projects")}
              className="inline-flex items-center gap-2 text-white/70 text-xs uppercase tracking-[0.2em] mb-4"
            >
              ← Retour aux projets actifs
            </button>
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
              Gestion des projets
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Projets archivés
            </h1>
            <p className="text-white/80 mt-2">
              Gérez et restaurez vos projets archivés
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            {selectedProjects.length > 0 && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                <FiTrash2 className="text-lg" />
                Supprimer ({selectedProjects.length})
              </button>
            )}
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <FiArchive className="text-white text-2xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7a8b7f] text-xl" />
          <input
            type="text"
            placeholder="Rechercher un projet archivé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors"
          />
        </div>

        {/* Select All */}
        {filteredProjects.length > 0 && (
          <div className="flex items-center gap-2 bg-white border border-[#dfe8e1] rounded-xl p-3">
            <input
              type="checkbox"
              checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-[#2d5f3f] bg-gray-100 border-gray-300 rounded focus:ring-[#2d5f3f]"
            />
            <span className="text-sm text-[#1e4029] font-medium">
              Tout sélectionner ({filteredProjects.length})
            </span>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#dfe8e1] hover:border-[#5a8f6f]/30"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-[#f4f7f4] to-[#e8f0e8]">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover opacity-50"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl font-bold text-[#7a8b7f] opacity-30">
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}

                {/* Checkbox and Restore Button */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project._id)}
                    onChange={() => handleSelectProject(project._id)}
                    className="w-5 h-5 text-[#2d5f3f] bg-white border-gray-300 rounded focus:ring-[#2d5f3f] cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={() => handleRestoreProject(project._id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-sm"
                    title="Restaurer le projet"
                  >
                    <FiRotateCcw className="text-[#2d5f3f] text-sm" />
                  </button>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#1e4029] mb-2 truncate">
                  {project.name}
                </h3>

                {project.category && (
                  <p className="text-sm text-[#7a8b7f] mb-3 truncate">
                    {project.category}
                  </p>
                )}

                {/* Archive Date */}
                <div className="flex items-center gap-2 mb-3">
                  <FiCalendar className="text-[#7a8b7f] text-sm" />
                  <span className="text-xs text-[#7a8b7f]">
                    Archivé le {formatDate(project.archivedAt)}
                  </span>
                </div>

                {/* Client and Project Lead Info */}
                <div className="space-y-2">
                  {project.client && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-[#f4f7f4] rounded-full flex items-center justify-center text-xs font-medium text-[#7a8b7f]">
                        {project.client.name?.charAt(0).toUpperCase() || "C"}
                      </div>
                      <span className="text-xs text-[#7a8b7f] truncate">
                        Client: {project.client.name || "Client"}
                      </span>
                    </div>
                  )}

                  {project.projectLead && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-[#2d5f3f] rounded-full flex items-center justify-center text-xs font-medium text-white">
                        {project.projectLead.name?.charAt(0).toUpperCase() || "P"}
                      </div>
                      <span className="text-xs text-[#2d5f3f] truncate font-medium">
                        Chef: {project.projectLead.name || project.projectLead.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#dfe8e1] rounded-2xl">
            <div className="p-6 bg-[#f4f7f4] rounded-2xl mb-6 w-fit mx-auto">
              <FiArchive className="text-[#5a8f6f] text-6xl" />
            </div>
            <h3 className="text-xl font-medium text-[#1e4029] mb-2">
              {searchQuery ? "Aucun projet archivé trouvé" : "Aucun projet archivé"}
            </h3>
            <p className="text-[#7a8b7f] mb-6">
              {searchQuery
                ? "Essayez d'ajuster votre recherche"
                : "Les projets archivés apparaîtront ici"}
            </p>
            <button
              onClick={() => navigate("/admin/projects")}
              className="inline-flex items-center gap-2 bg-[#2d5f3f] text-white px-6 py-3 rounded-xl hover:bg-[#1e4029] transition-colors font-medium"
            >
              <FiFolder className="text-lg" />
              Voir les projets actifs
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <FiTrash2 className="text-red-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1e4029]">
                  Confirmer la suppression
                </h3>
                <p className="text-sm text-[#7a8b7f]">
                  Cette action est irréversible
                </p>
              </div>
            </div>

            <p className="text-[#1e4029] mb-6">
              Êtes-vous sûr de vouloir supprimer définitivement{" "}
              <span className="font-semibold">
                {selectedProjects.length} projet{selectedProjects.length > 1 ? "s" : ""}
              </span>{" "}
              ? Cette action ne peut pas être annulée.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-[#1e4029] rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteProjects}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ArchivedProjects;
