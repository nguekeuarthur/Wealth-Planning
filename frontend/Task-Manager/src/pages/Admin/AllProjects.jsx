import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { FiSearch, FiPlus } from "react-icons/fi";
import CreateProjectModal from "../../components/CreateProjectModal";

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
        return "bg-orange-100 text-orange-600";
      case "in review":
        return "bg-blue-100 text-blue-600";
      case "done":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
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
      <div className="my-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">All Projects</h1>
          <button
            onClick={handleAddProject}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiPlus className="text-lg" />
            Add project
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              onClick={() => handleProjectClick(project._id)}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl font-bold text-gray-300">
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
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                  {project.name}
                </h3>
                
                {project.category && (
                  <p className="text-sm text-gray-500 mb-3 truncate">
                    {project.category}
                  </p>
                )}

                {/* Progress Bar */}
                {project.completion !== undefined && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-xs font-medium text-gray-700">
                        {project.completion}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.completion}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Client Info */}
                {project.client && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                      {project.client.fullName?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <span className="text-xs text-gray-600 truncate">
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
          <div className="text-center py-16">
            <div className="text-gray-400 text-5xl mb-4">📁</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchQuery ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Try adjusting your search"
                : "Get started by creating your first project"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddProject}
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FiPlus className="text-lg" />
                Add project
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
