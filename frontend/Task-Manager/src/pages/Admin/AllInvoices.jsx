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
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiEye
} from "react-icons/fi";
import toast from "react-hot-toast";
import CreateInvoiceModal from "../../components/CreateInvoiceModal";

const brandPalette = {
  primary: "#1e4029",
  secondary: "#2d5f3f",
  accent: "#5a8f6f",
  soft: "#f4f7f4",
  border: "#dfe8e1",
  muted: "#7a8b7f",
};

const AllInvoices = () => {
  const navigate = useNavigate();
  const [allInvoices, setAllInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [deletingInvoice, setDeletingInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const statuses = [
    "All Status",
    "PAYMENT RECEIVED",
    "PAYMENT SENT",
    "UNPAID",
    "OVERDUE"
  ];

  const statusColors = {
    "PAYMENT RECEIVED": "bg-[#dff5e7] text-[#1e4029] border-[#dfe8e1]",
    "PAYMENT SENT": "bg-[#e6f0ea] text-[#2d5f3f] border-[#dfe8e1]",
    "UNPAID": "bg-red-50 text-red-700 border-red-200",
    "OVERDUE": "bg-[#fff7d6] text-[#7b6a25] border-[#dfe8e1]"
  };

  const getAllInvoices = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.INVOICES.GET_ALL_INVOICES);
      console.log("API Response:", response.data);
      
      const invoices = response.data?.invoices || [];
      
      console.log(`Loaded ${invoices.length} invoices`);
      setAllInvoices(invoices);
      setFilteredInvoices(invoices);
    } catch (error) {
      console.error("Erreur lors de la récupération des factures :", error);
      toast.error("Échec du chargement des factures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllInvoices();
  }, []);

  useEffect(() => {
    let filtered = allInvoices;

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((invoice) =>
        invoice.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.project?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.service?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== "all" && selectedStatus !== "All Status") {
      filtered = filtered.filter(
        (invoice) => invoice.status?.toUpperCase() === selectedStatus.toUpperCase()
      );
    }

    setFilteredInvoices(filtered);
  }, [searchQuery, selectedStatus, allInvoices]);

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setIsModalOpen(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleViewInvoice = (invoice) => {
    setViewingInvoice(invoice);
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      return;
    }

    try {
      setDeletingInvoice(invoiceId);
      await axiosInstance.delete(API_PATHS.INVOICES.DELETE_INVOICE(invoiceId));
      toast.success("Facture supprimée avec succès");
      getAllInvoices();
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture :", error);
      toast.error("Échec de la suppression de la facture");
    } finally {
      setDeletingInvoice(null);
    }
  };

  const handleInvoiceCreated = () => {
    getAllInvoices();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const isOverdue = (dueDate, status) => {
    if (status?.toUpperCase() === "PAYMENT RECEIVED") return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Factures">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a8f6f]"></div>
          <p className="mt-4 text-[#2d5f3f] font-medium">Chargement des factures...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Invoices">
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
              Gestion des factures
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Toutes les factures
            </h1>
            <p className="text-white/80 mt-2">
              Gérez et suivez toutes vos factures clients
            </p>
            <p className="text-white/60 mt-1 text-sm">
              {allInvoices.length} facture{allInvoices.length !== 1 ? 's' : ''} au total
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <button
            onClick={handleAddInvoice}
              className="group bg-[#5a8f6f]/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-300 text-sm font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl hover:bg-[#5a8f6f] hover:scale-105 border border-white/10"
            >
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <FiPlus className="text-lg" />
              </div>
              Nouvelle facture
          </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7a8b7f]" />
              <input
                type="text"
                placeholder="Rechercher par numéro de facture, projet, client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] cursor-pointer transition-colors"
            >
              <option value="all">Tous les statuts</option>
              {statuses.slice(1).map((status) => (
                <option key={status} value={status}>
                  {status === 'PAYMENT RECEIVED' ? 'Paiement reçu' :
                   status === 'PAYMENT SENT' ? 'Paiement envoyé' :
                   status === 'UNPAID' ? 'Non payé' :
                   status === 'OVERDUE' ? 'En retard' : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Invoices Table */}
        {filteredInvoices.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#dfe8e1]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f4f7f4] border-b border-[#dfe8e1]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#7a8b7f] uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#7a8b7f] uppercase tracking-wider">
                      Projet
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#7a8b7f] uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#7a8b7f] uppercase tracking-wider">
                      Date de facturation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#7a8b7f] uppercase tracking-wider">
                      Échéance
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
                  {filteredInvoices.map((invoice) => {
                    const overdue = isOverdue(invoice.dueDate, invoice.status);
                    const displayStatus = overdue ? "OVERDUE" : (invoice.status?.toUpperCase() || "UNPAID");
                    
                    return (
                      <tr 
                        key={invoice._id}
                        className="hover:bg-[#f4f7f4] transition-colors cursor-pointer"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#1e4029]">
                            {invoice.invoiceNumber || invoice._id.slice(-6)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-[#2d5f3f]">
                            {invoice.project?.name || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-[#1e4029]">
                            {formatAmount(invoice.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-[#7a8b7f]">
                            <FiCalendar className="w-4 h-4" />
                            {formatDate(invoice.issueDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-[#7a8b7f]">
                            <FiCalendar className="w-4 h-4" />
                            {formatDate(invoice.dueDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[displayStatus] || statusColors["UNPAID"]}`}>
                            {displayStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewInvoice(invoice);
                              }}
                              className="p-2 text-[#2d5f3f] hover:bg-[#e6f0ea] rounded-lg transition-colors"
                              title="Voir"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditInvoice(invoice);
                              }}
                              className="p-2 text-[#7a8b7f] hover:bg-[#f4f7f4] rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteInvoice(invoice._id);
                              }}
                              disabled={deletingInvoice === invoice._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Supprimer"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
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
              <FiFileText className="text-[#5a8f6f] text-6xl" />
            </div>
            <h3 className="text-xl font-medium text-[#1e4029] mb-2">
              {searchQuery || selectedStatus !== "all" ? "Aucune facture trouvée" : "Aucune facture pour le moment"}
            </h3>
            <p className="text-[#7a8b7f] mb-6">
              {searchQuery || selectedStatus !== "all"
                ? "Essayez d'ajuster votre recherche ou votre filtre"
                : "Commencez par créer votre première facture"}
            </p>
            {!searchQuery && selectedStatus === "all" && (
              <button
                onClick={handleAddInvoice}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-colors font-medium"
              >
                <FiPlus className="w-5 h-5" />
                Créer votre première facture
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingInvoice(null);
        }}
        onInvoiceCreated={handleInvoiceCreated}
        editInvoice={editingInvoice}
      />

      {/* View Invoice Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-[#dfe8e1]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#1e4029]">Détails de la facture</h3>
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="text-[#7a8b7f] hover:text-[#2d5f3f] transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#7a8b7f] mb-1 uppercase tracking-wide">ID Facture</p>
                  <p className="text-lg font-bold text-[#1e4029]">
                    {viewingInvoice.invoiceNumber || viewingInvoice._id.slice(-6)}
                  </p>
                </div>

                <div className="border-t border-[#dfe8e1] pt-4">
                  <p className="text-xs text-[#7a8b7f] mb-1 uppercase tracking-wide">PROJET</p>
                  <p className="text-sm font-medium text-[#2d5f3f]">
                    {viewingInvoice.project?.name || "N/A"}
                  </p>
                </div>

                {viewingInvoice.client && (
                  <div>
                    <p className="text-xs text-[#7a8b7f] mb-1 uppercase tracking-wide">ENTREPRISE</p>
                    <p className="text-sm font-medium text-[#1e4029]">
                      {viewingInvoice.client?.name || viewingInvoice.client?.companyName || "N/A"}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-[#7a8b7f] mb-1 uppercase tracking-wide">STATUT</p>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[viewingInvoice.status?.toUpperCase()] || statusColors["UNPAID"]}`}>
                    {viewingInvoice.status?.toUpperCase() === 'PAYMENT RECEIVED' ? 'Paiement reçu' :
                     viewingInvoice.status?.toUpperCase() === 'PAYMENT SENT' ? 'Paiement envoyé' :
                     viewingInvoice.status?.toUpperCase() === 'UNPAID' ? 'Non payé' :
                     viewingInvoice.status?.toUpperCase() === 'OVERDUE' ? 'En retard' :
                     viewingInvoice.status?.toUpperCase() || "Non payé"}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-[#7a8b7f] mb-1 uppercase tracking-wide">MONTANT</p>
                  <p className="text-lg font-bold text-[#1e4029]">
                    {formatAmount(viewingInvoice.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7a8b7f] mb-1 uppercase tracking-wide">DATE DE FACTURATION</p>
                  <p className="text-sm text-[#2d5f3f]">
                    {formatDate(viewingInvoice.issueDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7a8b7f] mb-1 uppercase tracking-wide">ÉCHÉANCE</p>
                  <p className="text-sm text-[#2d5f3f]">
                    {formatDate(viewingInvoice.dueDate)}
                  </p>
                </div>

                {viewingInvoice.description && (
                  <div>
                    <p className="text-xs text-[#7a8b7f] mb-1 uppercase tracking-wide">NOTES</p>
                    <p className="text-sm text-[#7a8b7f]">
                      {viewingInvoice.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllInvoices;
