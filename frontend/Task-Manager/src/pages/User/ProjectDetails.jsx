import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import 'moment/locale/fr';
import {
    FiArrowLeft,
    FiCalendar,
    FiUser,
    FiFolder,
    FiCheckCircle,
    FiClock,
    FiFile,
    FiFlag,
    FiCheckSquare
} from "react-icons/fi";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";

moment.locale('fr');

const memberTabs = [
    { id: "overview", label: "Vue d'ensemble", icon: FiFolder },
    { id: "tasks", label: "Tâches", icon: FiCheckSquare },
    { id: "milestones", label: "Jalons", icon: FiFlag },
    { id: "documents", label: "Documents", icon: FiFile }
];

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
    const [tasks, setTasks] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [draggedTaskId, setDraggedTaskId] = useState(null);

    const fetchProjectData = async () => {
        try {
            setLoading(true);

            const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_PROJECT_BY_ID(id));
            const projectData = response.data?.project || response.data;
            setProject(projectData);

            const tasksRes = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
                params: { project: id }
            });
            setTasks(tasksRes.data.tasks || []);

            const milestonesRes = await axiosInstance.get(API_PATHS.MILESTONES.GET_BY_PROJECT(id));
            setMilestones(milestonesRes.data.milestones || []);

            const documentsRes = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_ALL_DOCUMENTS, {
                params: {
                    project: id,
                    assignedTo: user?._id
                }
            });
            setDocuments(documentsRes.data.documents || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des détails du projet:", error);
            toast.error("Impossible de charger les détails du projet");
            if (error.response?.status === 404 || error.response?.status === 403) {
                navigate("/user/dashboard");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const handleTaskDragStart = (task) => {
        setDraggedTaskId(task._id);
    };

    const handleTaskDragEnd = () => {
        setDraggedTaskId(null);
    };

    const handleStatusDrop = async (event, newStatus) => {
        event.preventDefault();
        if (!draggedTaskId) return;

        const statusMap = {
            'pending': 'Pending',
            'in-progress': 'In Progress',
            'completed': 'Completed'
        };
        const formattedStatus = statusMap[newStatus] || newStatus;

        try {
            await axiosInstance.put(
                API_PATHS.TASKS.UPDATE_TASK_STATUS(draggedTaskId),
                { status: formattedStatus }
            );
            toast.success("Statut de la tâche mis à jour");

            setTasks((prevTasks) =>
                prevTasks.map((t) =>
                    t._id === draggedTaskId
                        ? { ...t, status: formattedStatus }
                        : t
                )
            );

            try {
                const projectRes = await axiosInstance.get(API_PATHS.PROJECTS.GET_PROJECT_BY_ID(id));
                setProject(projectRes.data?.project || projectRes.data);
            } catch (projectError) {
                console.error("Erreur lors du rechargement du projet:", projectError);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut de la tâche:", error);
            toast.error(
                error.response?.data?.message ||
                "Impossible de mettre à jour le statut de la tâche"
            );
        } finally {
            setDraggedTaskId(null);
        }
    };

    const renderTaskCard = (task, { onDragStart, onDragEnd } = {}) => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const isCompleted = task.status === "Completed" || task.status === "completed";
        const isOverdue = dueDate && dueDate < new Date() && !isCompleted;

        return (
            <div
                draggable={!!onDragStart}
                onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    onDragStart && onDragStart(task);
                }}
                onDragEnd={() => {
                    onDragEnd && onDragEnd();
                }}
                className="p-4 border border-[#dfe8e1] rounded-2xl hover:border-[#5a8f6f]/40 hover:shadow-md transition-all bg-white cursor-pointer"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h4 className="text-[#1e4029] font-semibold text-base mb-2">
                            {task.title || "Tâche sans titre"}
                        </h4>
                        <p className="text-sm text-[#7a8b7f] line-clamp-2 mb-3">
                            {task.description || "Pas de description"}
                        </p>
                        {task.dueDate && (
                            <div className="flex items-center gap-2 text-xs">
                                <FiCalendar className={`w-3 h-3 ${isOverdue ? 'text-red-500' : 'text-[#7a8b7f]'}`} />
                                <span className={`${isOverdue ? 'text-red-500 font-medium' : 'text-[#7a8b7f]'}`}>
                                    {moment(task.dueDate).format('DD MMM YYYY')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

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
                        icon={<FiFolder />}
                        title="Projet non trouvé"
                        subtitle="Le projet que vous cherchez n'existe pas ou vous n'y avez pas accès."
                    />
                </div>
            </DashboardLayout>
        );
    }

    const renderTasks = () => {
        return (
            <div>
                <h2 className="text-xl font-semibold text-[#1e4029] mb-4">Mes tâches</h2>
                {tasks.length > 0 ? (
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div
                            className="bg-[#f9fbf9] rounded-2xl border border-[#e1ebe4] p-4 flex flex-col gap-3 min-h-[160px]"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleStatusDrop(e, "pending")}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-semibold text-[#1e4029]">En attente</h3>
                                <span className="text-xs text-[#7a8b7f]">
                                    {tasks.filter((t) => !t.status || t.status === "pending" || t.status === "Pending").length}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {tasks
                                    .filter((t) => !t.status || t.status === "pending" || t.status === "Pending")
                                    .map((task) => (
                                        <div key={task._id}>
                                            {renderTaskCard(task, {
                                                onDragStart: handleTaskDragStart,
                                                onDragEnd: handleTaskDragEnd,
                                            })}
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div
                            className="bg-[#fffaf2] rounded-2xl border border-[#f3e0c8] p-4 flex flex-col gap-3 min-h-[160px]"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleStatusDrop(e, "in-progress")}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-semibold text-[#8a5a24]">En cours</h3>
                                <span className="text-xs text-[#b76a28]">
                                    {tasks.filter((t) => t.status === "in-progress" || t.status === "In Progress" || t.status === "in progress").length}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {tasks
                                    .filter((t) => t.status === "in-progress" || t.status === "In Progress" || t.status === "in progress")
                                    .map((task) => (
                                        <div key={task._id}>
                                            {renderTaskCard(task, {
                                                onDragStart: handleTaskDragStart,
                                                onDragEnd: handleTaskDragEnd,
                                            })}
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div
                            className="bg-[#f4faf6] rounded-2xl border border-[#d5ecde] p-4 flex flex-col gap-3 min-h-[160px]"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleStatusDrop(e, "completed")}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-semibold text-[#1e4029]">Terminée</h3>
                                <span className="text-xs text-[#4e7c59]">
                                    {tasks.filter((t) => t.status === "completed" || t.status === "Completed").length}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {tasks
                                    .filter((t) => t.status === "completed" || t.status === "Completed")
                                    .map((task) => (
                                        <div key={task._id}>
                                            {renderTaskCard(task, {
                                                onDragStart: handleTaskDragStart,
                                                onDragEnd: handleTaskDragEnd,
                                            })}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        icon={<FiCheckCircle />}
                        title="Aucune tâche"
                        subtitle="Aucune tâche assignée"
                    />
                )}
            </div>
        );
    };

    const getMilestoneStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-[#dff5e7] text-[#1e4029]';
            case 'in-progress':
                return 'bg-[#fff7d6] text-[#7b6a25]';
            case 'upcoming':
                return 'bg-[#e6f0ea] text-[#2d5f3f]';
            default:
                return 'bg-[#f4f7f4] text-[#7a8b7f]';
        }
    };

    const renderMilestones = () => (
        <div>
            <h2 className="text-xl font-semibold text-[#1e4029] mb-4">Jalons</h2>
            {milestones.length > 0 ? (
                <div className="space-y-3">
                    {milestones.map((milestone) => (
                        <div key={milestone._id} className="border border-[#dfe8e1] rounded-xl p-4 hover:bg-[#f4f7f4] transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-[#1e4029]">{milestone.title}</h3>
                                    <p className="text-sm text-[#7a8b7f] mt-1">{milestone.description}</p>
                                    {milestone.dueDate && (
                                        <p className="text-xs text-[#7a8b7f] mt-2">
                                            Échéance: {moment(milestone.dueDate).format('DD MMM YYYY')}
                                        </p>
                                    )}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMilestoneStatusBadge(milestone.status)}`}>
                                    {milestone.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<FiFlag />}
                    title="Aucun jalon"
                    subtitle="Aucun jalon défini"
                />
            )}
        </div>
    );

    const renderDocuments = () => (
        <div>
            <h2 className="text-xl font-semibold text-[#1e4029] mb-4">Documents partagés</h2>
            {documents.length > 0 ? (
                <div className="space-y-3">
                    {documents.map((doc) => (
                        <div key={doc._id} className="border border-[#dfe8e1] rounded-xl p-4 hover:bg-[#f4f7f4] transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-[#1e4029]">{doc.name}</h3>
                                    <p className="text-sm text-[#7a8b7f] mt-1">{doc.description}</p>
                                    <p className="text-xs text-[#7a8b7f] mt-2">
                                        Ajouté le {moment(doc.createdAt).format('DD MMM YYYY')}
                                    </p>
                                </div>
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        try {
                                            const response = await axiosInstance.get(
                                                `${API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(doc._id)}/download`,
                                                { responseType: 'blob' }
                                            );

                                            const contentType = response.headers?.['content-type'] || doc.fileType || 'application/octet-stream';
                                            const blob = new Blob([response.data], { type: contentType });

                                            const contentDisposition = response.headers?.['content-disposition'];
                                            let fileName = doc.name || 'document';
                                            if (contentDisposition) {
                                                const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;\n]*)/);
                                                const asciiMatch = contentDisposition.match(/filename="?([^";\n]*)"?/);
                                                const rawName = utf8Match?.[1] || asciiMatch?.[1];
                                                if (rawName) {
                                                    try {
                                                        fileName = decodeURIComponent(rawName);
                                                    } catch {
                                                        fileName = rawName;
                                                    }
                                                }
                                            }

                                            const mimeToExt = {
                                                'application/pdf': '.pdf',
                                                'application/msword': '.doc',
                                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
                                                'application/vnd.ms-excel': '.xls',
                                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
                                                'application/vnd.ms-powerpoint': '.ppt',
                                                'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
                                                'image/jpeg': '.jpg',
                                                'image/png': '.png',
                                                'image/gif': '.gif',
                                                'text/plain': '.txt',
                                                'text/csv': '.csv'
                                            };
                                            const hasExtension = /\.[\w]+$/.test(fileName);
                                            const ext = mimeToExt[contentType] || mimeToExt[doc.fileType];
                                            if (!hasExtension && ext) {
                                                fileName += ext;
                                            }

                                            const url = window.URL.createObjectURL(blob);
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = fileName;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            window.URL.revokeObjectURL(url);
                                        } catch (error) {
                                            console.error('Erreur lors du téléchargement:', error);
                                            toast.error(
                                                error.response?.data?.message ||
                                                'Erreur lors du téléchargement du fichier'
                                            );
                                        }
                                    }}
                                    className="text-[#2d5f3f] hover:text-[#1e4029] text-sm font-medium"
                                >
                                    Télécharger
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<FiFile />}
                    title="Aucun document partagé"
                    subtitle="Aucun document partagé"
                />
            )}
        </div>
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/user/dashboard')}
                        className="flex items-center gap-2 text-[#7a8b7f] hover:text-[#2d5f3f] mb-4 transition-colors"
                    >
                        <FiArrowLeft />
                        Retour au tableau de bord
                    </button>

                    <div className="bg-white border border-[#dfe8e1] rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-[#1e4029] mb-2">{project.name}</h1>
                                <p className="text-[#7a8b7f]">{project.description}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs text-[#7a8b7f]">Progression</p>
                                    <p className="text-lg font-semibold text-[#2d5f3f]">{project.completion || 0}%</p>
                                </div>
                                <div className="w-32 h-2 bg-[#f4f7f4] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#5a8f6f] rounded-full transition-all"
                                        style={{ width: `${project.completion || 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#dfe8e1]">
                            <div className="flex items-center gap-3">
                                <FiCalendar className="text-[#7a8b7f]" />
                                <div>
                                    <p className="text-xs text-[#7a8b7f]">Date de début</p>
                                    <p className="text-sm font-medium text-[#1e4029]">
                                        {project.startDate ? moment(project.startDate).format('DD MMM YYYY') : 'Non définie'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiClock className="text-[#7a8b7f]" />
                                <div>
                                    <p className="text-xs text-[#7a8b7f]">Date de fin</p>
                                    <p className="text-sm font-medium text-[#1e4029]">
                                        {project.endDate ? moment(project.endDate).format('DD MMM YYYY') : 'Non définie'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiUser className="text-[#7a8b7f]" />
                                <div>
                                    <p className="text-xs text-[#7a8b7f]">Chef de projet</p>
                                    <p className="text-sm font-medium text-[#1e4029]">
                                        {project.projectLead?.name || project.projectManager?.name || 'Non assigné'}
                                    </p>
                                </div>
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
                <div className="bg-white border border-[#dfe8e1] rounded-2xl p-6 shadow-sm">
                    {activeTab === 'overview' && (
                        <div>
                            <h2 className="text-xl font-semibold text-[#1e4029] mb-4">Vue d'ensemble</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-[#f4f7f4] rounded-xl p-4">
                                    <p className="text-sm text-[#7a8b7f] mb-1">Tâches assignées</p>
                                    <p className="text-2xl font-bold text-[#2d5f3f]">{tasks.length}</p>
                                </div>
                                <div className="bg-[#f4f7f4] rounded-xl p-4">
                                    <p className="text-sm text-[#7a8b7f] mb-1">Tâches terminées</p>
                                    <p className="text-2xl font-bold text-[#2d5f3f]">
                                        {tasks.filter(t => t.status === 'completed' || t.status === 'Completed').length}
                                    </p>
                                </div>
                                <div className="bg-[#f4f7f4] rounded-xl p-4">
                                    <p className="text-sm text-[#7a8b7f] mb-1">Documents partagés</p>
                                    <p className="text-2xl font-bold text-[#2d5f3f]">{documents.length}</p>
                                </div>
                                <div className="bg-[#f4f7f4] rounded-xl p-4">
                                    <p className="text-sm text-[#7a8b7f] mb-1">Jalons</p>
                                    <p className="text-2xl font-bold text-[#2d5f3f]">{milestones.length}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tasks' && renderTasks()}
                    {activeTab === 'milestones' && renderMilestones()}
                    {activeTab === 'documents' && renderDocuments()}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserProjectDetails;
