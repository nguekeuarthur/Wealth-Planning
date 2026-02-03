import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { FiSearch, FiGrid, FiList, FiClock, FiCheckCircle } from "react-icons/fi";
import { LuArrowRight } from "react-icons/lu";

const UserProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                // The backend logic for getAllProjects now filters by user role automatically
                const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS);
                setProjects(response.data.projects || []);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case "done":
            case "Completed":
                return "bg-[#dff5e7] text-[#1e4029]";
            case "in review":
                return "bg-[#fff7d6] text-[#7b6a25]";
            case "in progress":
            case "In Progress":
                return "bg-[#e6f0ea] text-[#2d5f3f]";
            default:
                return "bg-[#f4f7f4] text-[#7a8b7f]";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "done":
            case "Completed":
                return "Terminé";
            case "in review":
                return "En révision";
            case "in progress":
            case "In Progress":
                return "En cours";
            default:
                return status || "En attente";
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout activeMenu="Projets">
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] rounded-2xl shadow-xl p-8 my-6 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Mes Projets</h1>
                    <p className="text-white/80">Retrouvez tous les projets auxquels vous participez.</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7a8b7f] text-xl" />
                <input
                    type="text"
                    placeholder="Rechercher un projet..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all shadow-sm"
                />
            </div>

            {/* Projects Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5f3f]"></div>
                </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div
                            key={project._id}
                            onClick={() => navigate(`/user/project/${project._id || project.id}`)}
                            className="group bg-white border border-[#dfe8e1] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1 relative overflow-hidden"
                        >
                            {/* Decorative top border */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e4029] to-[#5a8f6f] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-[#f4f7f4] rounded-xl text-[#2d5f3f] group-hover:bg-[#e6f0ea] transition-colors">
                                    <FiGrid size={24} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(project.status)}`}>
                                    {getStatusLabel(project.status)}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-[#1e4029] mb-2 group-hover:text-[#2d5f3f] transition-colors">
                                {project.name}
                            </h3>

                            <p className="text-[#7a8b7f] text-sm mb-6 line-clamp-2 flex-grow">
                                {project.description || "Aucune description disponible."}
                            </p>

                            <div className="border-t border-[#f4f7f4] pt-4 mt-auto">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-[#7a8b7f]">Progression</span>
                                    <span className="font-semibold text-[#1e4029]">{project.completion || 0}%</span>
                                </div>
                                <div className="h-2 bg-[#f4f7f4] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#1e4029] to-[#5a8f6f] rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${project.completion || 0}%` }}
                                    />
                                </div>

                                <div className="mt-4 flex items-center justify-end text-[#2d5f3f] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    Voir les détails <LuArrowRight className="ml-2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white border border-[#dfe8e1] rounded-2xl shadow-sm">
                    <div className="w-16 h-16 bg-[#f4f7f4] rounded-full flex items-center justify-center mx-auto mb-4 text-[#7a8b7f]">
                        <FiSearch size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1e4029] mb-2">Aucun projet trouvé</h3>
                    <p className="text-[#7a8b7f]">
                        {searchQuery ? "Essayez de modifier votre recherche." : "Vous n'avez aucun projet assigné pour le moment."}
                    </p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default UserProjects;
