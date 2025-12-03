import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
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
  FiShield,
  FiPlus
} from "react-icons/fi";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";

const tabs = [
  { id: "overview", label: "Vue d'ensemble", icon: FiFolder },
  { id: "tasks", label: "Tâches", icon: FiCheckCircle },
  { id: "documents", label: "Documents", icon: FiFileText },
  { id: "invoices", label: "Finances", icon: FiDollarSign },
  { id: "updates", label: "Updates", icon: FiMessageSquare }
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

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.PROJECTS.GET_PROJECT_DETAILS.replace(":id", id)
      );
      setProject(response.data?.project || null);
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("Impossible de charger le projet");
    } finally {
      setLoading(false);
    }
  };

  const calculateProjectMetrics = (data) => {
    const totalTasks = data?.tasks?.length || 0;
    const completedTasks =
      data?.tasks?.filter((task) => task.status === "completed").length || 0;
    const overdueTasks =
      data?.tasks?.filter((task) => {
        if (!task.dueDate || task.status === "completed") return false;
        return new Date(task.dueDate) < new Date();
      }).length || 0;

    const totalTime =
      data?.tasks?.reduce((sum, task) => sum + (task.timeSpent || 0), 0) || 0;

    const budgetUsed =
      data?.invoices?.reduce((sum, invoice) => sum + (invoice.amount || 0), 0) ||
      0;

    const daysRemaining = data?.endDate
      ? Math.ceil((new Date(data.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      totalTime,
      budgetUsed,
      completion: data?.completion || 0,
      daysRemaining
    };
  };

  const metrics = useMemo(
    () => (project ? calculateProjectMetrics(project) : null),
    [project]
  );

  const smartTags = useMemo(() => {
    if (!metrics) return [];
    const tags = [];

    if (metrics.daysRemaining !== null) {
      if (metrics.daysRemaining < 0) {
        tags.push({ label: "En retard", color: "bg-red-100 text-red-600" });
      } else if (metrics.daysRemaining <= 7) {
        tags.push({ label: "Urgent", color: "bg-orange-100 text-orange-600" });
      }
    }

    if (metrics.overdueTasks > 0) {
      tags.push({
        label: `${metrics.overdueTasks} tâche(s) en retard`,
        color: "bg-red-100 text-red-600"
      });
    }

    if (metrics.completedTasks === metrics.totalTasks && metrics.totalTasks > 0) {
      tags.push({ label: "Prêt à livrer", color: "bg-green-100 text-green-600" });
    }

    return tags.slice(0, 3);
  }, [metrics]);

  const can = (permission) => {
    if (!user || !project) return false;
    if (user.role === "admin") return true;

    const isLead = project.projectLead?._id === user._id;
    const isAssigned = project.assignedUsers?.some(
      (member) => member._id === user._id
    );
    const isClient = project.client?._id === user._id;

    switch (permission) {
      case "view":
        return isLead || isAssigned || isClient;
      case "edit":
        return isLead || (isAssigned && project.status !== "done");
      case "finance":
        return isLead || user.role === "finance";
      case "team":
        return isLead;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Projects">
        <div className="flex items-center justify-center h-[80vh]">
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
      <DashboardLayout activeMenu="Projects">
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-[#1e4029] mb-2">
            Projet introuvable
          </h3>
          <button
            onClick={() => navigate("/admin/projects")}
            className="mt-4 flex items-center gap-2 text-[#2d5f3f] hover:text-[#1e4029]"
          >
            <FiArrowLeft /> Retour à la liste
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Projects">
      <div className="my-5 space-y-6">
        <div className="relative bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] rounded-2xl shadow-xl p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-48 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-24"></div>
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center justify-between">
            <div>
              <button
                onClick={() => navigate("/admin/projects")}
                className="inline-flex items-center gap-2 text-white/70 text-xs uppercase tracking-[0.2em]"
              >
                <FiArrowLeft /> Retour aux projets
              </button>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  {project.name}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(project.status)}`}>
                  {project.status === "in progress"
                    ? "En cours"
                    : project.status === "in review"
                    ? "En revue"
                    : "Terminé"}
                </span>
                {smartTags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${tag.color}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>

              <p className="text-white/80 mt-2">
                {project.category || "Catégorie non définie"}
              </p>

              {project.description && (
                <p className="text-white/70 mt-4 max-w-2xl">
                  {project.description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-white/80 text-sm">
                <div>
                  <p className="text-white/60 text-xs uppercase">Client</p>
                  <p className="font-semibold">
                    {project.client?.fullName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase">
                    Chef de projet
                  </p>
                  <p className="font-semibold">
                    {project.projectLead?.fullName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase">
                    Budget utilisé
                  </p>
                  <p className="font-semibold">
                    {metrics ? `${metrics.budgetUsed.toLocaleString()} CHF` : "—"}
                  </p>
                </div>
              </div>
            </div>

            {can("edit") && (
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 border border-white/40 text-white rounded-xl text-sm font-medium">
                  Modifier
                </button>
                <button className="px-4 py-2 bg-white text-[#1e4029] rounded-xl text-sm font-semibold flex items-center gap-2">
                  <FiPlus /> Nouveau livrable
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
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

        <div className="grid xl:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <MetricCard
                    icon={<FiCheckCircle />}
                    label="Tâches terminées"
                    value={`${metrics?.completedTasks || 0}/${metrics?.totalTasks || 0}`}
                  />
                  <MetricCard
                    icon={<FiClock />}
                    label="Jours restants"
                    value={
                      metrics?.daysRemaining !== null
                        ? metrics.daysRemaining
                        : "—"
                    }
                    subtext={
                      metrics?.daysRemaining !== null
                        ? metrics.daysRemaining < 0
                          ? "En retard"
                          : "Avant échéance"
                        : undefined
                    }
                  />
                  <MetricCard
                    icon={<FiTrendingUp />}
                    label="Progression"
                    value={`${metrics?.completion || 0}%`}
                  />
                  <MetricCard
                    icon={<FiAlertTriangle />}
                    label="Tâches en retard"
                    value={metrics?.overdueTasks || 0}
                  />
                </div>

                <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm">
                  <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1e4029] mb-3">
                        Description
                      </h3>
                      <p className="text-[#4a5c52] whitespace-pre-wrap">
                        {project.description || "Aucune description fournie."}
                      </p>
                    </div>
                    <div className="lg:w-64 space-y-3">
                      <div className="p-4 rounded-xl bg-[#f4f7f4]">
                        <p className="text-xs text-[#7a8b7f] uppercase">
                          Dates clés
                        </p>
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="text-[#2d5f3f]" />
                            <span>
                              Début : {" "}
                              {project.startDate
                                ? new Date(project.startDate).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiClock className="text-[#b76a28]" />
                            <span>
                              Fin : {" "}
                              {project.endDate
                                ? new Date(project.endDate).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border border-dashed border-[#dfe8e1] text-xs text-[#7a8b7f]">
                        Utilisez les updates pour documenter les décisions,
                        jalons ou blocages.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e4029]">
                      Tâches du projet
                    </h3>
                    <p className="text-sm text-[#7a8b7f]">
                      {project.tasks?.length || 0} tâches au total
                    </p>
                  </div>
                  {can("edit") && (
                    <button
                      onClick={() => navigate(`/admin/create-task?project=${id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2d5f3f] text-white rounded-xl text-sm font-medium"
                    >
                      <FiPlus /> Nouvelle tâche
                    </button>
                  )}
                </div>

                {project.tasks?.length ? (
                  <div className="space-y-4">
                    {project.tasks.map((task) => (
                      <div
                        key={task._id}
                        className="p-4 border border-[#dfe8e1] rounded-2xl hover:border-[#5a8f6f]/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-[#1e4029] font-semibold text-base">
                              {task.title || "Tâche sans titre"}
                            </h4>
                            <p className="text-sm text-[#7a8b7f] mt-1">
                              {task.description || "Aucune description"}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#7a8b7f]">
                              {task.dueDate && (
                                <span className="flex items-center gap-1">
                                  <FiCalendar size={12} />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                              {task.assignedTo && (
                                <span className="flex items-center gap-1">
                                  <FiUser size={12} />
                                  {task.assignedTo.fullName || task.assignedTo.email}
                                </span>
                              )}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              task.status === "completed"
                                ? "bg-[#dff5e7] text-[#1e4029]"
                                : task.status === "in progress"
                                ? "bg-[#fff6ea] text-[#b76a28]"
                                : "bg-[#f4f7f4] text-[#7a8b7f]"
                            }`}
                          >
                            {task.status || "pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="✅"
                    title="Aucune tâche"
                    subtitle="Créez votre première tâche pour ce projet."
                  />
                )}
              </div>
            )}

            {activeTab === "documents" && (
              <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e4029]">
                      Documents
                    </h3>
                    <p className="text-sm text-[#7a8b7f]">
                      {project.documents?.length || 0} fichiers
                    </p>
                  </div>
                  {can("edit") && (
                    <button className="px-3 py-1.5 text-sm border border-[#dfe8e1] rounded-lg text-[#2d5f3f]">
                      Ajouter un document
                    </button>
                  )}
                </div>

                {project.documents?.length ? (
                  <div className="space-y-4">
                    {project.documents.map((doc) => (
                      <div
                        key={doc._id}
                        className="p-4 border border-[#dfe8e1] rounded-2xl flex items-center gap-4"
                      >
                        <div className="p-3 bg-[#f4f7f4] rounded-xl text-[#2d5f3f]">
                          <FiFile />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1e4029]">
                            {doc.title || "Document"}
                          </p>
                          <p className="text-sm text-[#7a8b7f]">
                            {doc.type || "Non catégorisé"} — {" "}
                            {doc.uploadedAt
                              ? new Date(doc.uploadedAt).toLocaleDateString()
                              : "Date inconnue"}
                          </p>
                        </div>
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2d5f3f] text-sm font-medium"
                          >
                            Ouvrir
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="📄"
                    title="Aucun document"
                    subtitle="Ajoutez des contrats, rapports ou pièces jointes."
                  />
                )}
              </div>
            )}

            {activeTab === "invoices" && (
              <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e4029]">
                      Factures & paiements
                    </h3>
                    <p className="text-sm text-[#7a8b7f]">
                      {project.invoices?.length || 0} factures
                    </p>
                  </div>
                  {can("finance") && (
                    <button className="px-3 py-1.5 text-sm border border-[#dfe8e1] rounded-lg text-[#2d5f3f]">
                      Générer une facture
                    </button>
                  )}
                </div>

                {project.invoices?.length ? (
                  <div className="space-y-4">
                    {project.invoices.map((invoice) => (
                      <div
                        key={invoice._id}
                        className="p-4 border border-[#dfe8e1] rounded-2xl flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-[#1e4029]">
                            {invoice.invoiceNumber || invoice._id}
                          </p>
                          <p className="text-sm text-[#7a8b7f]">
                            Échéance : {" "}
                            {invoice.dueDate
                              ? new Date(invoice.dueDate).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-[#1e4029]">
                            {invoice.amount
                              ? `${invoice.amount.toLocaleString()} CHF`
                              : "—"}
                          </p>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              invoice.status === "paid"
                                ? "bg-[#dff5e7] text-[#1e4029]"
                                : invoice.status === "overdue"
                                ? "bg-[#ffe5e5] text-[#c34242]"
                                : "bg-[#f4f7f4] text-[#7a8b7f]"
                            }`}
                          >
                            {invoice.status || "pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="💶"
                    title="Aucune facturation"
                    subtitle="Les factures du projet apparaîtront ici."
                  />
                )}
              </div>
            )}

            {activeTab === "updates" && (
              <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e4029]">
                      Journal & updates
                    </h3>
                    <p className="text-sm text-[#7a8b7f]">
                      Toutes les activités liées au projet
                    </p>
                  </div>
                  {can("edit") && (
                    <button className="px-3 py-1.5 text-sm border border-[#dfe8e1] rounded-lg text-[#2d5f3f]">
                      Ajouter une note
                    </button>
                  )}
                </div>

                {project.messages?.length ? (
                  <div className="space-y-4">
                    {project.messages.map((message) => (
                      <div
                        key={message._id}
                        className="p-4 border border-[#dfe8e1] rounded-2xl flex gap-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#f4f7f4] flex items-center justify-center text-[#2d5f3f] font-semibold">
                          {message.sender?.fullName?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-[#1e4029]">
                              {message.sender?.fullName || "Utilisateur"}
                            </p>
                            {message.createdAt && (
                              <span className="text-xs text-[#7a8b7f]">
                                {new Date(message.createdAt).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#4a5c52] mt-1">
                            {message.content || message.text || "—"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="💬"
                    title="Aucune activité"
                    subtitle="Les commentaires et updates apparaîtront ici."
                  />
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1e4029] flex items-center gap-2 mb-4">
                <FiUser /> Client
              </h3>
              {project.client ? (
                <div className="space-y-3 text-sm text-[#4a5c52]">
                  <div>
                    <p className="text-[#7a8b7f] text-xs uppercase">Nom</p>
                    <p className="font-semibold">{project.client.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[#7a8b7f] text-xs uppercase">Email</p>
                    <p>{project.client.email}</p>
                  </div>
                  {project.client.phoneNumber && (
                    <div>
                      <p className="text-[#7a8b7f] text-xs uppercase">Téléphone</p>
                      <p>{project.client.phoneNumber}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#7a8b7f]">Aucun client assigné.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1e4029] flex items-center gap-2">
                  <FiUsers /> Équipe ({project.assignedUsers?.length || 0})
                </h3>
                {can("team") && (
                  <button className="text-sm text-[#2d5f3f]">Gérer</button>
                )}
              </div>
              <div className="space-y-3">
                {project.projectLead && (
                  <div className="p-3 border border-[#dfe8e1] rounded-xl flex items-center gap-3 bg-[#f4f7f4]">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2d5f3f] font-semibold">
                      {project.projectLead.fullName?.charAt(0).toUpperCase() || "P"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1e4029]">
                        {project.projectLead.fullName}
                      </p>
                      <p className="text-xs text-[#7a8b7f]">Chef de projet</p>
                    </div>
                  </div>
                )}

                {project.assignedUsers?.length ? (
                  project.assignedUsers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-3 border border-[#dfe8e1] rounded-xl p-3"
                    >
                      <div className="w-8 h-8 bg-[#f4f7f4] rounded-full flex items-center justify-center text-[#2d5f3f] text-xs font-semibold">
                        {member.fullName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1e4029]">
                          {member.fullName}
                        </p>
                        <p className="text-xs text-[#7a8b7f]">{member.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#7a8b7f]">Aucun membre assigné.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#dfe8e1] p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1e4029] flex items-center gap-2 mb-4">
                <FiShield /> Permissions
              </h3>
              <div className="space-y-3 text-sm text-[#4a5c52]">
                <p>
                  <strong>Lecture :</strong> {can("view") ? "Autorisé" : "Restreint"}
                </p>
                <p>
                  <strong>Édition :</strong> {can("edit") ? "Autorisé" : "Restreint"}
                </p>
                <p>
                  <strong>Finances :</strong> {can("finance") ? "Autorisé" : "Restreint"}
                </p>
                <p>
                  <strong>Gestion équipe :</strong> {can("team") ? "Autorisé" : "Restreint"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
