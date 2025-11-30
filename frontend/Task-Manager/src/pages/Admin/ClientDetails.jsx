import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { 
  FiMail, 
  FiPhone, 
  FiGlobe, 
  FiMapPin, 
  FiUsers, 
  FiPlus,
  FiArrowLeft,
  FiCalendar,
  FiEdit2
} from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";
import toast from "react-hot-toast";
import CreateProjectModal from "../../components/CreateProjectModal";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Industry colors mapping
  const industryColors = {
    "REAL ESTATE": "bg-blue-100 text-blue-700",
    "LEGAL": "bg-purple-100 text-purple-700",
    "AUTOMOTIVE": "bg-red-100 text-red-700",
    "FINANCE": "bg-green-100 text-green-700",
    "TECHNOLOGY": "bg-indigo-100 text-indigo-700",
    "HEALTHCARE": "bg-pink-100 text-pink-700",
    "RETAIL": "bg-orange-100 text-orange-700",
    "MANUFACTURING": "bg-gray-100 text-gray-700",
    "CONSULTING": "bg-yellow-100 text-yellow-700",
    "OTHER": "bg-slate-100 text-slate-700"
  };

  // Status colors mapping
  const statusColors = {
    "in progress": "bg-blue-100 text-blue-700",
    "in review": "bg-yellow-100 text-yellow-700",
    "done": "bg-green-100 text-green-700"
  };

  useEffect(() => {
    fetchClientDetails();
    fetchClientProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.CLIENTS.GET_CLIENT_BY_ID(id));
      setClient(response.data);
    } catch (error) {
      console.error("Error fetching client details:", error);
      toast.error("Failed to load client details");
    } finally {
      setLoading(false);
    }
  };

  const fetchClientProjects = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS);
      const allProjects = response.data?.projects || [];
      
      // Filter projects for this specific client
      const clientProjects = allProjects.filter(
        project => project.client?._id === id || project.client === id
      );
      
      setProjects(clientProjects);
    } catch (error) {
      console.error("Error fetching client projects:", error);
      toast.error("Failed to load projects");
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
    fetchClientProjects(); // Refresh to get complete data
  };

  const handleProjectClick = (projectId) => {
    navigate(`/admin/project/${projectId}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!client) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Client not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/clients")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Client Details</h1>
          </div>
          <button
            onClick={() => navigate(`/admin/clients`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit Client
          </button>
        </div>

        {/* Client Information Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {client.logoUrl && client.logoUrl.trim() !== "" ? (
                <img
                  src={client.logoUrl}
                  alt={client.companyName}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${client.logoUrl && client.logoUrl.trim() !== "" ? 'hidden' : 'flex'}`}
              >
                <LuBuilding2 className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Client Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {client.companyName}
                  </h2>
                  {client.industry && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${industryColors[client.industry] || industryColors["OTHER"]}`}>
                      {client.industry}
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Person */}
              {client.contactName && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Contact Person</p>
                  <p className="text-lg font-semibold text-gray-800">{client.contactName}</p>
                </div>
              )}

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FiMail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-800">{client.email}</p>
                  </div>
                </div>

                {client.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <FiPhone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-800">{client.phoneNumber}</p>
                    </div>
                  </div>
                )}

                {client.website && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <FiGlobe className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Website</p>
                      <a 
                        href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {client.website}
                      </a>
                    </div>
                  </div>
                )}

                {client.address && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <FiMapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium text-gray-800">{client.address}</p>
                    </div>
                  </div>
                )}

                {client.companySize && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <FiUsers className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Company Size</p>
                      <p className="text-sm font-medium text-gray-800">{client.companySize} employees</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              {client.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{client.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Projects ({projects.length})
            </h3>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <FiPlus className="w-5 h-5" />
              Add Project
            </button>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <LuBuilding2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No projects yet for this client</p>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create the first project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => handleProjectClick(project._id)}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <LuBuilding2 className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${statusColors[project.status] || statusColors["in progress"]}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h4>
                    
                    {project.category && (
                      <p className="text-xs text-gray-500 mb-3">
                        {project.category}
                      </p>
                    )}

                    {project.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {/* Project Dates */}
                    {project.startDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          Started {new Date(project.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Completion Bar */}
                    {project.completion !== undefined && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span className="font-semibold">{project.completion}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.completion}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
        preSelectedClientId={client._id}
      />
    </DashboardLayout>
  );
};

export default ClientDetails;
