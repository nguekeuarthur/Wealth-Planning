import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { FiSearch, FiRotateCcw, FiArchive, FiFile, FiDownload, FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";

const ArchivedContracts = () => {
  const [archivedContracts, setArchivedContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/admin/contracts');
      return;
    }
    getArchivedContracts();
  }, [user, navigate]);

  useEffect(() => {
    let filtered = archivedContracts;

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((contract) =>
        contract.name?.toLowerCase().includes(query) ||
        contract.description?.toLowerCase().includes(query) ||
        contract.project?.name?.toLowerCase().includes(query)
      );
    }

    setFilteredContracts(filtered);
  }, [searchQuery, archivedContracts]);

  const getArchivedContracts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_ARCHIVED_DOCUMENTS, {
        params: { type: "contract" }
      });
      setArchivedContracts(response.data?.documents || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des contrats archivés :", error);
      toast.error("Échec du chargement des contrats archivés");
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreContract = async (contractId) => {
    try {
      await axiosInstance.put(API_PATHS.DOCUMENTS.RESTORE_DOCUMENT(contractId));
      toast.success("Contrat restauré avec succès");
      getArchivedContracts(); // Refresh the list
    } catch (error) {
      console.error("Erreur lors de la restauration :", error);
      toast.error("Échec de la restauration du contrat");
    }
  };

  const handleDownload = async (contractId, contractName) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.DOCUMENTS.DOWNLOAD_DOCUMENT(contractId),
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', contractName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Téléchargement réussi");
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
      toast.error("Échec du téléchargement");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Contrats">
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5f3f] mx-auto"></div>
            <p className="mt-4 text-[#7a8b7f]">Chargement des contrats archivés...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Contrats">
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
              onClick={() => navigate("/admin/contracts")}
              className="inline-flex items-center gap-2 text-white/70 text-xs uppercase tracking-[0.2em] mb-4 hover:text-white transition-colors"
            >
              ← Retour aux contrats actifs
            </button>
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
              Gestion des contrats
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Contrats archivés
            </h1>
            <p className="text-white/80 mt-2">
              Gérez et restaurez vos contrats archivés
            </p>
            <p className="text-white/60 text-sm mt-1">
              {filteredContracts.length} contrat{filteredContracts.length > 1 ? 's' : ''} archivé{filteredContracts.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Archive Icon */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
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
            placeholder="Rechercher un contrat archivé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors"
          />
        </div>

        {/* Contracts Table */}
        {filteredContracts.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-[#dfe8e1] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f4f7f4] border-b border-[#dfe8e1]">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1e4029] uppercase tracking-wider">
                      Nom du fichier
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1e4029] uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1e4029] uppercase tracking-wider">
                      Projet
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1e4029] uppercase tracking-wider">
                      Taille
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1e4029] uppercase tracking-wider">
                      Date d'archivage
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#1e4029] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfe8e1]">
                  {filteredContracts.map((contract) => (
                    <tr key={contract._id} className="hover:bg-[#f4f7f4]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#e8f0e8] rounded-lg">
                            <FiFile className="text-[#2d5f3f] text-lg" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1e4029]">
                              {contract.name}
                            </p>
                            <p className="text-xs text-[#7a8b7f]">
                              {contract.fileType || 'Fichier'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#7a8b7f] max-w-xs truncate">
                          {contract.description || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#7a8b7f]">
                          {contract.project?.name || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#7a8b7f]">
                          {formatFileSize(contract.fileSize)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-[#7a8b7f] text-sm" />
                          <p className="text-sm text-[#7a8b7f]">
                            {formatDate(contract.archivedAt)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDownload(contract._id, contract.name)}
                            className="p-2 bg-[#f4f7f4] hover:bg-[#e8f0e8] rounded-lg transition-colors"
                            title="Télécharger"
                          >
                            <FiDownload className="text-[#2d5f3f] text-sm" />
                          </button>
                          <button
                            onClick={() => handleRestoreContract(contract._id)}
                            className="p-2 bg-[#e8f0e8] hover:bg-[#d5e8db] rounded-lg transition-colors"
                            title="Restaurer"
                          >
                            <FiRotateCcw className="text-[#2d5f3f] text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white border border-[#dfe8e1] rounded-2xl">
            <div className="p-6 bg-[#f4f7f4] rounded-2xl mb-6 w-fit mx-auto">
              <FiArchive className="text-[#5a8f6f] text-6xl" />
            </div>
            <h3 className="text-xl font-medium text-[#1e4029] mb-2">
              {searchQuery ? "Aucun contrat archivé trouvé" : "Aucun contrat archivé"}
            </h3>
            <p className="text-[#7a8b7f] mb-6">
              {searchQuery
                ? "Essayez d'ajuster votre recherche"
                : "Les contrats archivés apparaîtront ici"}
            </p>
            <button
              onClick={() => navigate("/admin/contracts")}
              className="px-6 py-3 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-colors font-medium"
            >
              Voir tous les contrats
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ArchivedContracts;
