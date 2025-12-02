import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFile,
  FiMoreVertical,
  FiDownload
} from "react-icons/fi";
import toast from "react-hot-toast";
import CreateContractModal from "../../components/CreateContractModal";

const brandPalette = {
  primary: "#1e4029",
  secondary: "#2d5f3f",
  accent: "#5a8f6f",
  soft: "#f4f7f4",
  border: "#dfe8e1",
  muted: "#7a8b7f",
};

const AllContracts = () => {
  const navigate = useNavigate();
  const [allContracts, setAllContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [deletingContract, setDeletingContract] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const sortOptions = [
    { value: "name", label: "File name" },
    { value: "createdAt", label: "Created time" },
    { value: "project", label: "Project" }
  ];

  const statusColors = {
    "signed": "bg-[#dff5e7] text-[#1e4029] border-[#dfe8e1]",
    "pending": "bg-[#fff7d6] text-[#7b6a25] border-[#dfe8e1]",
    "draft": "bg-[#f4f7f4] text-[#7a8b7f] border-[#dfe8e1]",
    "expired": "bg-red-50 text-red-700 border-red-200"
  };

  const getAllContracts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_ALL_DOCUMENTS, {
        params: { type: "contract" }
      });
      console.log("API Response:", response.data);
      
      const contracts = response.data?.documents || [];
      
      console.log(`Loaded ${contracts.length} contracts`);
      setAllContracts(contracts);
      setFilteredContracts(contracts);
    } catch (error) {
      console.error("Erreur lors de la récupération des contrats :", error);
      toast.error("Échec du chargement des contrats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllContracts();
  }, []);

  useEffect(() => {
    let filtered = allContracts;

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((contract) =>
        contract.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.project?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return a.name?.localeCompare(b.name);
      } else if (sortBy === "createdAt") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "project") {
        return (a.project?.name || "").localeCompare(b.project?.name || "");
      }
      return 0;
    });

    setFilteredContracts(filtered);
  }, [searchQuery, sortBy, allContracts]);

  const handleAddContract = () => {
    setEditingContract(null);
    setIsModalOpen(true);
  };

  const handleEditContract = (contract) => {
    setEditingContract(contract);
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDeleteContract = async (contractId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contrat ?")) {
      return;
    }

    try {
      setDeletingContract(contractId);
      await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(contractId));
      toast.success("Contrat supprimé avec succès");
      getAllContracts();
    } catch (error) {
      console.error("Erreur lors de la suppression du contrat :", error);
      toast.error("Échec de la suppression du contrat");
    } finally {
      setDeletingContract(null);
      setOpenDropdown(null);
    }
  };

  const handleContractCreated = () => {
    getAllContracts();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileType) => {
    return <FiFile className="w-4 h-4" />;
  };

  const toggleDropdown = (contractId, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === contractId ? null : contractId);
  };

  const handleDownload = async (contract, e) => {
    e.stopPropagation();
    try {
      const response = await axiosInstance.get(contract.fileUrl, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', contract.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Téléchargement démarré");
    } catch (error) {
      console.error("Error downloading contract:", error);
      toast.error("Échec du téléchargement du contrat");
    }
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdown) setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  if (loading) {
    return (
      <DashboardLayout activeMenu="Contrats">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a8f6f]"></div>
          <p className="mt-4 text-[#2d5f3f] font-medium">Chargement des contrats...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Contracts">
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
              Gestion des contrats
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Tous les contrats
            </h1>
            <p className="text-white/80 mt-2">
              Gérez et consultez tous vos contrats clients
            </p>
            <p className="text-white/60 mt-1 text-sm">
              {allContracts.length} contrat{allContracts.length !== 1 ? 's' : ''} au total
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <button
              onClick={handleAddContract}
              className="group bg-[#5a8f6f]/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-300 text-sm font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl hover:bg-[#5a8f6f] hover:scale-105 border border-white/10"
            >
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <FiPlus className="text-lg" />
              </div>
              Nouveau contrat
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">

        {/* Search and Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7a8b7f]" />
              <input
                type="text"
                placeholder="Rechercher un contrat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors"
              />
            </div>
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] cursor-pointer transition-colors"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label === "File name" ? "Nom du fichier" :
                   option.label === "Created time" ? "Date de création" :
                   option.label === "Project" ? "Projet" : option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contracts Table */}
        {filteredContracts.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#dfe8e1]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f4f7f4] border-b border-[#dfe8e1]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#7a8b7f] uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#7a8b7f] uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#7a8b7f] uppercase tracking-wider">
                      Date de création
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#7a8b7f] uppercase tracking-wider">
                      Fichier
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#7a8b7f] uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[#7a8b7f] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfe8e1]">
                  {filteredContracts.map((contract) => {
                    return (
                      <tr
                        key={contract._id}
                        className="hover:bg-[#f4f7f4] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-[#1e4029]">
                            {contract.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-[#7a8b7f] max-w-xs truncate">
                            {contract.description || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#7a8b7f]">
                            {formatDate(contract.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-[#2d5f3f] hover:text-[#1e4029] cursor-pointer">
                            {getFileIcon(contract.fileType)}
                            <span>{contract.name || "Fichier"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors["signed"]}`}>
                            Signed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => toggleDropdown(contract._id, e)}
                              className="p-2 text-[#7a8b7f] hover:bg-[#f4f7f4] rounded-lg transition-colors"
                              disabled={deletingContract === contract._id}
                            >
                              <FiMoreVertical className="w-5 h-5" />
                            </button>

                            {/* Dropdown Menu */}
                            {openDropdown === contract._id && (
                              <div
                                className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-[#dfe8e1] py-1 z-50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditContract(contract);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#7a8b7f] hover:bg-[#f4f7f4] transition-colors"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                  Modifier
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteContract(contract._id);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  disabled={deletingContract === contract._id}
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16 bg-white border border-[#dfe8e1] rounded-2xl">
            <div className="p-6 bg-[#f4f7f4] rounded-2xl mb-6 w-fit mx-auto">
              <FiFile className="text-[#5a8f6f] text-6xl" />
            </div>
            <h3 className="text-xl font-medium text-[#1e4029] mb-2">
              {searchQuery ? "Aucun contrat trouvé" : "Aucun contrat pour le moment"}
            </h3>
            <p className="text-[#7a8b7f] mb-6">
              {searchQuery
                ? "Essayez d'ajuster votre recherche"
                : "Commencez par créer votre premier contrat"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddContract}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-colors font-medium"
              >
                <FiPlus className="w-5 h-5" />
                Créer votre premier contrat
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Contract Modal */}
      <CreateContractModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContract(null);
        }}
        onContractCreated={handleContractCreated}
        editContract={editingContract}
      />
    </DashboardLayout>
  );
};

export default AllContracts;

