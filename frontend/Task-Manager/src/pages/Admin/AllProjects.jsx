import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { FiSearch, FiPlus, FiFolder, FiFilter, FiCheckSquare, FiSquare, FiArchive, FiSettings } from "react-icons/fi";
import toast from "react-hot-toast";
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
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    client: 'all',
    projectLead: 'all',
    dateRange: 'all',
    priority: 'all'
  });
  const [sortBy, setSortBy] = useState({
    field: 'createdAt',
    order: 'desc'
  });
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const navigate = useNavigate();

  // Fonction pour calculer la progression automatique d'un projet
  const calculateProjectCompletion = (project) => {
    if (!project.tasks || project.tasks.length === 0) {
      return project.completion || 0;
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    const calculatedCompletion = Math.round((completedTasks / totalTasks) * 100);

    // Si la progression calculée diffère de celle stockée, on peut la mettre à jour automatiquement
    if (calculatedCompletion !== (project.completion || 0)) {
      // Mise à jour automatique côté backend (optionnel)
      updateProjectCompletion(project._id, calculatedCompletion);
    }

    return calculatedCompletion;
  };

  // Fonction pour mettre à jour la progression côté backend
  const updateProjectCompletion = async (projectId, completion) => {
    try {
      await axiosInstance.put(API_PATHS.PROJECTS.UPDATE_PROJECT(projectId), {
        completion: completion
      });
    } catch (error) {
      console.error("Error updating project completion:", error);
    }
  };

  // Fonction pour déterminer automatiquement le statut basé sur la progression
  const calculateProjectStatus = (project, completion) => {
    if (completion === 100) {
      return 'done';
    } else if (completion >= 75) {
      return 'in review';
    } else {
      return project.status || 'in progress';
    }
  };

  const getAllProjects = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS);
      let projects = response.data?.projects || [];

      // Calculer automatiquement la progression et le statut pour chaque projet
      projects = projects.map(project => {
        const calculatedCompletion = calculateProjectCompletion(project);
        const calculatedStatus = calculateProjectStatus(project, calculatedCompletion);

        return {
          ...project,
          completion: calculatedCompletion,
          status: calculatedStatus
        };
      });

      setAllProjects(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  // Hook pour recalculer automatiquement la progression quand les tâches changent
  useEffect(() => {
    const interval = setInterval(() => {
      // Vérifier si les tâches ont changé et recalculer si nécessaire
      setAllProjects(prevProjects =>
        prevProjects.map(project => {
          const currentCompletion = calculateProjectCompletion(project);
          if (currentCompletion !== project.completion) {
            const newStatus = calculateProjectStatus(project, currentCompletion);
            return {
              ...project,
              completion: currentCompletion,
              status: newStatus
            };
          }
          return project;
        })
      );
    }, 5000); // Vérifier toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  // Fonction de filtrage avancé
  const applyFilters = (projects, search, filterOptions) => {
    let filtered = [...projects];

    // Recherche textuelle avancée
    if (search.trim() !== "") {
      const query = search.toLowerCase();
      filtered = filtered.filter((project) =>
        project.name.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.client?.fullName?.toLowerCase().includes(query) ||
        project.projectLead?.fullName?.toLowerCase().includes(query) ||
        project.tasks?.some(task => task.title?.toLowerCase().includes(query)) ||
        project.messages?.some(msg => msg.content?.toLowerCase().includes(query))
      );
    }

    // Filtres par statut
    if (filterOptions.status !== 'all') {
      filtered = filtered.filter(project => project.status === filterOptions.status);
    }

    // Filtres par catégorie
    if (filterOptions.category !== 'all') {
      filtered = filtered.filter(project => project.category === filterOptions.category);
    }

    // Filtres par client
    if (filterOptions.client !== 'all') {
      filtered = filtered.filter(project => project.client?._id === filterOptions.client);
    }

    // Filtres par chef de projet
    if (filterOptions.projectLead !== 'all') {
      filtered = filtered.filter(project => project.projectLead?._id === filterOptions.projectLead);
    }

    // Filtres par priorité (basé sur les délais et progression)
    if (filterOptions.priority !== 'all') {
      filtered = filtered.filter(project => {
        const daysRemaining = project.endDate ?
          Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

        switch (filterOptions.priority) {
          case 'high':
            return daysRemaining !== null && daysRemaining <= 7;
          case 'medium':
            return daysRemaining !== null && daysRemaining <= 30 && daysRemaining > 7;
          case 'low':
            return daysRemaining === null || daysRemaining > 30;
          default:
            return true;
        }
      });
    }

    // Filtres par période
    if (filterOptions.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(project => {
        const projectDate = new Date(project.createdAt);

        switch (filterOptions.dateRange) {
          case 'this_week':
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            return projectDate >= weekStart;
          case 'this_month':
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            return projectDate >= monthStart;
          case 'this_year':
            const yearStart = new Date(now.getFullYear(), 0, 1);
            return projectDate >= yearStart;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  // Fonction de tri
  const applySorting = (projects, sortOptions) => {
    return [...projects].sort((a, b) => {
      let aValue, bValue;

      switch (sortOptions.field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'completion':
          aValue = a.completion || 0;
          bValue = b.completion || 0;
          break;
        case 'endDate':
          aValue = a.endDate ? new Date(a.endDate) : new Date(9999, 12, 31);
          bValue = b.endDate ? new Date(b.endDate) : new Date(9999, 12, 31);
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOptions.order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  useEffect(() => {
    let filtered = applyFilters(allProjects, searchQuery, filters);
    filtered = applySorting(filtered, sortBy);
    setFilteredProjects(filtered);
  }, [searchQuery, filters, sortBy, allProjects]);

  const handleProjectClick = (projectId) => {
    navigate(`/admin/project/${projectId}`);
  };

  const handleAddProject = () => {
    setIsModalOpen(true);
  };

  const handleProjectCreated = (newProject) => {
    const calculatedCompletion = calculateProjectCompletion(newProject);
    const calculatedStatus = calculateProjectStatus(newProject, calculatedCompletion);

    const updatedProject = {
      ...newProject,
      completion: calculatedCompletion,
      status: calculatedStatus
    };

    setAllProjects([updatedProject, ...allProjects]);
  };

  // Fonction pour recalculer la progression d'un projet spécifique
  const recalculateProjectProgress = (projectId) => {
    setAllProjects(prevProjects =>
      prevProjects.map(project => {
        if (project._id === projectId) {
          const calculatedCompletion = calculateProjectCompletion(project);
          const calculatedStatus = calculateProjectStatus(project, calculatedCompletion);

          return {
            ...project,
            completion: calculatedCompletion,
            status: calculatedStatus
          };
        }
        return project;
      })
    );
  };

  // Fonction exposée pour les autres composants
  window.recalculateProjectProgress = recalculateProjectProgress;

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSortChange = (field, order) => {
    setSortBy({ field, order });
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      client: 'all',
      projectLead: 'all',
      dateRange: 'all',
      priority: 'all'
    });
    setSearchQuery("");
  };

  // Gestion de la sélection
  const handleProjectSelect = (projectId, checked) => {
    if (checked) {
      setSelectedProjects(prev => [...prev, projectId]);
    } else {
      setSelectedProjects(prev => prev.filter(id => id !== projectId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProjects(filteredProjects.map(p => p._id));
    } else {
      setSelectedProjects([]);
    }
  };

  const isProjectSelected = (projectId) => selectedProjects.includes(projectId);

  // Actions groupées
  const handleBulkStatusChange = async (newStatus) => {
    if (selectedProjects.length === 0) return;

    setBulkActionLoading(true);
    try {
      // Mettre à jour le statut de tous les projets sélectionnés
      const updatePromises = selectedProjects.map(projectId =>
        axiosInstance.put(API_PATHS.PROJECTS.UPDATE_PROJECT(projectId), { status: newStatus })
      );

      await Promise.all(updatePromises);

      // Mettre à jour l'état local avec recalcul automatique
      setAllProjects(prev =>
        prev.map(project =>
          selectedProjects.includes(project._id)
            ? (() => {
                const updatedProject = { ...project, status: newStatus };
                const calculatedCompletion = calculateProjectCompletion(updatedProject);
                return {
                  ...updatedProject,
                  completion: calculatedCompletion,
                  status: calculateProjectStatus(updatedProject, calculatedCompletion)
                };
              })()
            : project
        )
      );

      setSelectedProjects([]);
      toast.success(`${selectedProjects.length} projet(s) mis à jour`);
    } catch (error) {
      console.error("Error updating projects:", error);
      toast.error("Erreur lors de la mise à jour des projets");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkArchive = async () => {
    if (selectedProjects.length === 0) return;

    setBulkActionLoading(true);
    try {
      // Archiver tous les projets sélectionnés (soft delete)
      const archivePromises = selectedProjects.map(projectId =>
        axiosInstance.delete(API_PATHS.PROJECTS.DELETE_PROJECT(projectId))
      );

      await Promise.all(archivePromises);

      // Supprimer des projets de l'état local
      setAllProjects(prev => prev.filter(project => !selectedProjects.includes(project._id)));
      setSelectedProjects([]);
      toast.success(`${selectedProjects.length} projet(s) archivé(s)`);
    } catch (error) {
      console.error("Error archiving projects:", error);
      toast.error("Erreur lors de l'archivage des projets");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Effets pour gérer l'affichage des actions groupées
  useEffect(() => {
    setShowBulkActions(selectedProjects.length > 0);
  }, [selectedProjects]);

  // Options pour les filtres
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'in progress', label: 'En cours' },
    { value: 'in review', label: 'À revoir' },
    { value: 'done', label: 'Terminé' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'Création entreprise onshore', label: 'Création entreprise onshore' },
    { value: 'Création entreprise offshore', label: 'Création entreprise offshore' },
    { value: 'Ouverture compte bancaire onshore', label: 'Ouverture compte bancaire onshore' },
    { value: 'Ouverture compte bancaire offshore', label: 'Ouverture compte bancaire offshore' },
    { value: 'Domiciliation', label: 'Domiciliation' },
    { value: 'Réception courrier', label: 'Réception courrier' },
    { value: 'Proposition structuration patrimoniale', label: 'Proposition structuration patrimoniale' },
    { value: 'Proposition structuration patrimoniale:Reviewed', label: 'Proposition structuration patrimoniale:Reviewed' },
    { value: 'Exécution structuration patrimoniale', label: 'Exécution structuration patrimoniale' },
    { value: 'Proposition stratégie fiscale', label: 'Proposition stratégie fiscale' },
    { value: 'Proposition stratégie fiscale:Reviewed', label: 'Proposition stratégie fiscale:Reviewed' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'Toutes les périodes' },
    { value: 'this_week', label: 'Cette semaine' },
    { value: 'this_month', label: 'Ce mois' },
    { value: 'this_year', label: 'Cette année' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'Toutes les priorités' },
    { value: 'high', label: 'Haute' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'low', label: 'Basse' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date de création' },
    { value: 'name', label: 'Nom' },
    { value: 'completion', label: 'Progression' },
    { value: 'endDate', label: 'Échéance' }
  ];

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

        {/* Advanced Filters */}
        <div className="bg-white border border-[#dfe8e1] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-[#2d5f3f] font-medium"
            >
              <FiFilter className="text-lg" />
              Filtres avancés
              <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {(Object.values(filters).some(v => v !== 'all') || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-sm text-[#7a8b7f] hover:text-[#2d5f3f] underline"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-[#2d5f3f] mb-2">Statut</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-[#f4f7f4] border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f]"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-[#2d5f3f] mb-2">Catégorie</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-[#f4f7f4] border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f]"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-[#2d5f3f] mb-2">Priorité</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 bg-[#f4f7f4] border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f]"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-[#2d5f3f] mb-2">Période</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 bg-[#f4f7f4] border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f]"
                >
                  {dateRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-[#2d5f3f] mb-2">Trier par</label>
                <select
                  value={sortBy.field}
                  onChange={(e) => handleSortChange(e.target.value, sortBy.order)}
                  className="w-full px-3 py-2 bg-[#f4f7f4] border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f]"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-[#2d5f3f] mb-2">Ordre</label>
                <select
                  value={sortBy.order}
                  onChange={(e) => handleSortChange(sortBy.field, e.target.value)}
                  className="w-full px-3 py-2 bg-[#f4f7f4] border border-[#dfe8e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f]"
                >
                  <option value="desc">Décroissant</option>
                  <option value="asc">Croissant</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="bg-[#e6f0ea] border border-[#5a8f6f]/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#2d5f3f] font-medium">
                {selectedProjects.length} projet(s) sélectionné(s)
              </span>
              <button
                onClick={() => setSelectedProjects([])}
                className="text-sm text-[#7a8b7f] hover:text-[#2d5f3f] underline"
              >
                Désélectionner tout
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-[#2d5f3f] mr-2">Actions :</span>

              {/* Change Status */}
              <select
                onChange={(e) => e.target.value && handleBulkStatusChange(e.target.value)}
                disabled={bulkActionLoading}
                className="px-3 py-1 bg-white border border-[#dfe8e1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] disabled:opacity-50"
                defaultValue=""
              >
                <option value="">Changer statut</option>
                <option value="in progress">En cours</option>
                <option value="in review">À revoir</option>
                <option value="done">Terminé</option>
              </select>

              {/* Archive */}
              <button
                onClick={handleBulkArchive}
                disabled={bulkActionLoading}
                className="flex items-center gap-2 px-3 py-1 bg-white border border-[#dfe8e1] rounded-lg text-sm hover:bg-[#f4f7f4] transition-colors disabled:opacity-50"
              >
                <FiArchive className="text-sm" />
                Archiver
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSelectAll(selectedProjects.length !== filteredProjects.length)}
              className="flex items-center gap-2 text-[#2d5f3f] hover:text-[#1e4029] transition-colors"
            >
              {selectedProjects.length === filteredProjects.length && filteredProjects.length > 0 ? (
                <FiCheckSquare className="text-lg" />
              ) : (
                <FiSquare className="text-lg" />
              )}
              <span className="text-sm font-medium">
                {selectedProjects.length === filteredProjects.length && filteredProjects.length > 0
                  ? 'Tout désélectionner'
                  : 'Tout sélectionner'
                }
              </span>
            </button>
            <span className="text-[#7a8b7f] text-sm">
              {filteredProjects.length} projet(s) affiché(s)
            </span>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              onClick={() => !showBulkActions && handleProjectClick(project._id)}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border ${
                isProjectSelected(project._id)
                  ? 'border-[#5a8f6f] bg-[#f4f7f4]/50'
                  : 'border-[#dfe8e1] hover:border-[#5a8f6f]/30'
              }`}
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

                {/* Selection Checkbox */}
                <div className="absolute top-3 right-3">
                  <input
                    type="checkbox"
                    checked={isProjectSelected(project._id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleProjectSelect(project._id, e.target.checked);
                    }}
                    className="w-5 h-5 text-[#5a8f6f] bg-white border-2 border-[#dfe8e1] rounded focus:ring-[#5a8f6f] focus:ring-2 cursor-pointer"
                  />
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

