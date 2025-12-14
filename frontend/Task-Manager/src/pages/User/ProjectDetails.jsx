import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import {
    FiArrowLeft,
    FiCalendar,
    FiUser,
    FiUsers,
    FiFolder,
    FiMessageSquare,
    FiFileText,
    FiCheckCircle,
    FiClock,
    FiDollarSign,
    FiFile,
    FiTrendingUp,
    FiActivity,
    FiAlertTriangle,
    FiFlag,
    FiEdit3
} from "react-icons/fi";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";

const memberTabs = [
    { id: "overview", label: "Vue d'ensemble", icon: FiFolder },
    { id: "tasks", label: "Tâches", icon: FiCheckCircle },
    { id: "milestones", label: "Jalons", icon: FiFlag },
    { id: "documents", label: "Documents", icon: FiFileText },
    { id: "updates", label: "Messages", icon: FiMessageSquare }
];

const getStatusBadgeClass = (status) => {
    switch (status) {
        case "in progress":
            return "bg-[#fff6ea] text-[#b76a28]";
        case "in review":
            return "bg-[#e8f0ff] text-[#2a4fa2]";
        case "done":
            return "bg-[#dff5e7] text-[#1e4029]";
        default:
            return "bg-[#f4f7f4] text-[#7a8b7f]";
    }
};

const MetricCard = ({ icon, label, value, subtext }) => (
    <div className="bg-white p-4 rounded-2xl border border-[#dfe8e1] shadow-sm">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#f4f7f4] text-[#2d5f3f] text-lg">
                {icon}
            </div>
            <div>
                <p className="text-xs uppercase tracking-wide text-[#7a8b7f]">
                    {label}
                </p>
                <p className="text-xl font-semibold text-[#1e4029]">{value}</p>
                {subtext && (
                    <p className="text-xs text-[#99aca2] mt-0.5">{subtext}</p>
                )}
            </div>
        </div>
    </div>
);

const EmptyState = ({ icon, title, subtitle }) => (
    <div className="bg-white rounded-2xl border border-[#dfe8e1] p-12 text-center text-[#7a8b7f]">
        <div className="text-5xl mb-4 opacity-40">{icon}</div>
        <h3 className="text-lg font-semibold text-[#1e4029] mb-2">{title}</h3>
        <p>{subtitle}</p>
    </div>
);

const UserProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_PROJECT_BY_ID(id));
            setProject(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des détails du projet:", error);
            toast.error("Impossible de charger les détails du projet");
            if (error.response?.status === 404) {
                navigate("/user/dashboard");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectDetails();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5f3f] mx-auto"></div>
                        <p className="mt-4 text-[#7a8b7f]">Chargement du projet...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!project) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <EmptyState
                        icon={FiFolder}
                        title="Projet non trouvé"
                        subtitle="Le projet que vous cherchez n'existe pas ou vous n'y avez pas accès."
                    />
                </div>
            </DashboardLayout>
        );
    }

    const renderOverview = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6">
                <h3 className="text-lg font-semibold text-[#1e4029] mb-4">Description du projet</h3>
                <p className="text-[#7a8b7f] leading-relaxed">
                    {project.description || "Aucune description disponible"}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={FiCalendar}
                    label="Date de début"
                    value={project.startDate && !isNaN(new Date(project.startDate)) ? new Date(project.startDate).toLocaleDateString('fr-FR') : "Non définie"}
                />
                <MetricCard
                    icon={FiClock}
                    label="Date de fin"
                    value={project.endDate && !isNaN(new Date(project.endDate)) ? new Date(project.endDate).toLocaleDateString('fr-FR') : "Non définie"}
                />
                <MetricCard
                    icon={FiCheckCircle}
                    label="Statut"
                    value={
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(project.status)}`}>
                            {project.status === "in progress" ? "En cours" :
                                project.status === "in review" ? "En révision" :
                                    project.status === "done" ? "Terminé" : project.status}
                        </span>
                    }
                />
                <MetricCard
                    icon={FiUsers}
                    label="Équipe"
                    value={project.assignedUsers?.length || 0}
                    subtext="membres assignés"
                />
            </div>

            {project.projectLead && (
                <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6">
                    <h3 className="text-lg font-semibold text-[#1e4029] mb-4">Chef de projet</h3>
                    <div className="flex items-center gap-4">
                        {project.projectLead.profileImageUrl ? (
                            <img
                                src={project.projectLead.profileImageUrl}
                                alt={project.projectLead.name || "Avatar"}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white text-lg font-semibold">
                                {project.projectLead.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                        )}
                        <div>
                            <p className="text-[#1e4029] font-medium">{project.projectLead.name || "Nom non défini"}</p>
                            <p className="text-sm text-[#7a8b7f]">{project.projectLead.email}</p>
                        </div>
                    </div>
                </div>
            )}

            {project.client && (
                <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6">
                    <h3 className="text-lg font-semibold text-[#1e4029] mb-4">Client</h3>
                    <div className="flex items-center gap-4">
                        {project.client.profileImageUrl ? (
                            <img
                                src={project.client.profileImageUrl}
                                alt={project.client.name || "Avatar"}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white text-lg font-semibold">
                                {project.client.name?.charAt(0).toUpperCase() || project.client.company?.charAt(0).toUpperCase() || "?"}
                            </div>
                        )}
                        <div>
                            <p className="text-[#1e4029] font-medium">{project.client.company || project.client.name || "Nom non défini"}</p>
                            <p className="text-sm text-[#7a8b7f]">{project.client.email}</p>
                            {project.client.address && (
                                <p className="text-sm text-[#7a8b7f] mt-1">{project.client.address}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {project.assignedUsers && project.assignedUsers.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6">
                    <h3 className="text-lg font-semibold text-[#1e4029] mb-4">Équipe du projet</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.assignedUsers.map((member) => (
                            <div key={member._id} className="flex items-center gap-3 p-3 bg-[#f4f7f4] rounded-xl">
                                {member.profileImageUrl ? (
                                    <img
                                        src={member.profileImageUrl}
                                        alt={member.name || "Avatar"}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        {member.name?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="text-[#1e4029] font-medium">{member.name || "Nom non défini"}</p>
                                    <p className="text-xs text-[#7a8b7f]">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderTasks = () => {
        const userTasks = project.tasks?.filter(task =>
            task.assignedTo && (
                (Array.isArray(task.assignedTo) && task.assignedTo.some(assignee => assignee._id === user._id)) ||
                (task.assignedTo._id === user._id)
            )
        ) || [];

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {["To Do", "In Progress", "Completed"].map((status) => (
                        <div key={status} className="bg-white rounded-2xl border border-[#dfe8e1] p-4">
                            <h3 className="text-lg font-semibold text-[#1e4029] mb-4">{status}</h3>
                            <div className="space-y-3">
                                {userTasks.filter(task => task.status === status).map(task => (
                                    <div key={task._id} className="p-3 border border-[#dfe8e1] rounded-xl bg-white">
                                        <h4 className="text-[#1e4029] font-medium text-sm mb-1">{task.title}</h4>
                                        <p className="text-xs text-[#7a8b7f] line-clamp-2">{task.description}</p>
                                        {task.dueDate && !isNaN(new Date(task.dueDate)) && (
                                            <p className="text-xs text-[#99aca2] mt-2">
                                                Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                {userTasks.filter(task => task.status === status).length === 0 && (
                                    <p className="text-sm text-[#7a8b7f] text-center py-4">Aucune tâche</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderMilestones = () => (
        <div className="space-y-4">
            {project.milestones && project.milestones.length > 0 ? (
                project.milestones.map((milestone, index) => (
                    <div key={milestone._id} className="bg-white rounded-2xl border border-[#dfe8e1] p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-[#1e4029] mb-2">{milestone.title}</h3>
                                <p className="text-[#7a8b7f] mb-3">{milestone.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${milestone.status === "completed"
                                        ? "bg-[#dff5e7] text-[#1e4029]"
                                        : "bg-[#fff6ea] text-[#b76a28]"
                                        }`}>
                                        {milestone.status === "completed" ? "Terminé" : "En cours"}
                                    </span>
                                    {milestone.dueDate && !isNaN(new Date(milestone.dueDate)) && (
                                        <span className="text-[#99aca2]">
                                            Échéance: {new Date(milestone.dueDate).toLocaleDateString('fr-FR')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <EmptyState
                    icon={FiFlag}
                    title="Aucun jalon"
                    subtitle="Ce projet n'a pas encore de jalons définis."
                />
            )}
        </div>
    );

    const renderDocuments = () => (
        <div className="space-y-4">
            {project.documents && project.documents.length > 0 ? (
                project.documents.map((doc) => (
                    <div key={doc._id} className="bg-white rounded-2xl border border-[#dfe8e1] p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#f4f7f4] rounded-xl flex items-center justify-center">
                                <FiFile className="text-[#2d5f3f] text-xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-[#1e4029]">{doc.name}</h3>
                                <p className="text-sm text-[#7a8b7f]">
                                    Ajouté le {doc.uploadDate && !isNaN(new Date(doc.uploadDate)) ? new Date(doc.uploadDate).toLocaleDateString('fr-FR') : "Date inconnue"}
                                </p>
                            </div>
                            <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] text-sm font-medium"
                            >
                                Télécharger
                            </a>
                        </div>
                    </div>
                ))
            ) : (
                <EmptyState
                    icon={FiFileText}
                    title="Aucun document"
                    subtitle="Ce projet n'a pas encore de documents partagés."
                />
            )}
        </div>
    );

    const renderUpdates = () => (
        <div className="space-y-4">
            {project.updates && project.updates.length > 0 ? (
                project.updates.map((update) => (
                    <div key={update._id} className="bg-white rounded-2xl border border-[#dfe8e1] p-6">
                        <div className="flex items-start gap-4">
                            {update.author?.profileImageUrl ? (
                                <img
                                    src={update.author.profileImageUrl}
                                    alt={update.author.name || "Avatar"}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {update.author?.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-[#1e4029]">{update.author?.name || "Système"}</h3>
                                    <span className="text-xs text-[#99aca2]">
                                        {update.createdAt && !isNaN(new Date(update.createdAt)) ?
                                            `${new Date(update.createdAt).toLocaleDateString('fr-FR')} à ${new Date(update.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                                            : "Date inconnue"}
                                    </span>
                                </div>
                                <p className="text-[#7a8b7f]">{update.content}</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <EmptyState
                    icon={FiMessageSquare}
                    title="Aucun message"
                    subtitle="Aucun message n'a encore été partagé sur ce projet."
                />
            )}
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return renderOverview();
            case "tasks":
                return renderTasks();
            case "milestones":
                return renderMilestones();
            case "documents":
                return renderDocuments();
            case "updates":
                return renderUpdates();
            default:
                return renderOverview();
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/user/dashboard")}
                        className="flex items-center gap-2 text-[#7a8b7f] hover:text-[#1e4029] mb-4"
                    >
                        <FiArrowLeft size={20} />
                        Retour au tableau de bord
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#1e4029] mb-2">{project.name}</h1>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(project.status)}`}>
                                    {project.status === "in progress" ? "En cours" :
                                        project.status === "in review" ? "En révision" :
                                            project.status === "done" ? "Terminé" : project.status}
                                </span>
                                <span className="text-sm text-[#7a8b7f]">
                                    {project.category}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {memberTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                    ? "bg-[#e6f0ea] text-[#1e4029]"
                                    : "bg-white border border-[#dfe8e1] text-[#7a8b7f] hover:text-[#1e4029]"
                                    }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                {renderContent()}
            </div>
        </DashboardLayout>
    );
};

export default UserProjectDetails;
