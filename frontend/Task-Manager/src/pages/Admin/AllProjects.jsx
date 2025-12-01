import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { FiSearch, FiPlus, FiFolder } from "react-icons/fi";
import CreateProjectModal from "../../components/CreateProjectModal";

const brandPalette = {
  primary: "#1e4029",
  secondary: "#2d5f3f",
  accent: "#5a8f6f",
  soft: "#f4f7f4",
  border: "#dfe8e1",
  muted: "#7a8b7f",
};

const AllProjects = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const getAllProjects = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS);
      setAllProjects(response.data?.projects || []);
      setFilteredProjects(response.data?.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(allProjects);
    } else {
      const filtered = allProjects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, allProjects]);

  const handleProjectClick = (projectId) => {
    navigate(`/admin/project/${projectId}`);
  };

  const handleAddProject = () => {
    setIsModalOpen(true);
  };

  const handleProjectCreated = (newProject) => {
    setAllProjects([newProject, ...allProjects]);
    setFilteredProjects([newProject, ...filteredProjects]);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "in progress":
        return "bg-[#e6f0ea] text-[#2d5f3f]";
      case "in review":
        return "bg-[#fff7d6] text-[#7b6a25]";
      case "done":
        return "bg-[#dff5e7] text-[#1e4029]";
      default:
        return "bg-[#f4f7f4] text-[#7a8b7f]";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "in progress":
        return "In progress";
      case "in review":
        return "In review";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  return (
    <DashboardLayout activeMenu="Projects">
      {/* Header Section with Enhanced Design */}
      <div className="relative bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] rounded-2xl shadow-xl p-8 my-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Title Section */}
          <div className="flex-1">
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
              Gestion des projets
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Tous les projets
            </h1>
            <p className="text-white/80 mt-2">
              Gérez et suivez tous vos projets en cours
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <button
              onClick={handleAddProject}
              className="group bg-[#5a8f6f]/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-300 text-sm font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl hover:bg-[#5a8f6f] hover:scale-105 border border-white/10"
            >
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <FiPlus className="text-lg" />
              </div>
              Nouveau projet
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">

        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7a8b7f] text-xl" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              onClick={() => handleProjectClick(project._id)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-[#dfe8e1] hover:border-[#5a8f6f]/30"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-[#f4f7f4] to-[#e8f0e8]">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl font-bold text-[#7a8b7f]">
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
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

                {/* Progress Bar */}
                {project.completion !== undefined && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#7a8b7f]">Progression</span>
                      <span className="text-xs font-medium text-[#2d5f3f]">
                        {project.completion}%
                      </span>
                    </div>
                    <div className="w-full bg-[#f4f7f4] rounded-full h-2">
                      <div
                        className="bg-[#5a8f6f] h-2 rounded-full transition-all"
                        style={{ width: `${project.completion}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Client Info */}
                {project.client && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#f4f7f4] rounded-full flex items-center justify-center text-xs font-medium text-[#7a8b7f]">
                      {project.client.fullName?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <span className="text-xs text-[#7a8b7f] truncate">
                      {project.client.fullName || "Client"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#dfe8e1] rounded-2xl">
            <div className="p-6 bg-[#f4f7f4] rounded-2xl mb-6 w-fit mx-auto">
              <FiFolder className="text-[#5a8f6f] text-6xl" />
            </div>
            <h3 className="text-xl font-medium text-[#1e4029] mb-2">
              {searchQuery ? "Aucun projet trouvé" : "Aucun projet pour le moment"}
            </h3>
            <p className="text-[#7a8b7f] mb-6">
              {searchQuery
                ? "Essayez d'ajuster votre recherche"
                : "Commencez par créer votre premier projet"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddProject}
                className="inline-flex items-center gap-2 bg-[#2d5f3f] text-white px-6 py-3 rounded-xl hover:bg-[#1e4029] transition-colors font-medium"
              >
                <FiPlus className="text-lg" />
                Nouveau projet
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </DashboardLayout>
  );
};

export default AllProjects;
