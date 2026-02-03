import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import {
  FiSearch,
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
  const { user } = useContext(UserContext);
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
    "Tous les statuts",
    "PAIEMENT REÇU",
    "PAIEMENT ENVOYÉ",
    "NON PAYÉ",
    "EN RETARD"
  ];

  const statusColors = {
    "PAIEMENT REÇU": "bg-[#dff5e7] text-[#1e4029] border-[#dfe8e1]",
    "PAIEMENT ENVOYÉ": "bg-[#e6f0ea] text-[#2d5f3f] border-[#dfe8e1]",
    "NON PAYÉ": "bg-red-50 text-red-700 border-red-200",
    "EN RETARD": "bg-[#fff7d6] text-[#7b6a25] border-[#dfe8e1]",
    "EN ATTENTE": "bg-blue-50 text-blue-700 border-blue-200"
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
    if (selectedStatus !== "all" && selectedStatus !== "Tous les statuts") {
      filtered = filtered.filter((invoice) => {
        const normalizedStatus = invoice.status?.toLowerCase();
        const overdue = isOverdue(invoice.dueDate, invoice.status);

        // Map backend status to display status
        let displayStatus;
        if (overdue) {
          displayStatus = "EN RETARD";
        } else if (normalizedStatus === "paiement reçu" || normalizedStatus === "payée") {
          displayStatus = "PAIEMENT REÇU";
        } else if (normalizedStatus === "paiement envoyé") {
          displayStatus = "PAIEMENT ENVOYÉ";
        } else if (normalizedStatus === "en attente") {
          displayStatus = "EN ATTENTE";
        } else {
          displayStatus = "NON PAYÉ";
        }

        return displayStatus === selectedStatus;
      });
    }

    setFilteredInvoices(filtered);
  }, [searchQuery, selectedStatus, allInvoices]);

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
    if (!date) return "Date non définie";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "Date invalide";
    return parsedDate.toLocaleDateString('fr-FR');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(amount);
  };

  const isOverdue = (dueDate, status) => {
    const normalizedStatus = status?.toLowerCase();
    if (normalizedStatus === "paiement reçu" || normalizedStatus === "payée") return false;
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
    <DashboardLayout activeMenu="Factures">
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
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Invoices Table or Grid depending on role */}
        {user?.role === 'client' ? (
          // Client View: Grid of Cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvoices.map((invoice) => {
              const overdue = isOverdue(invoice.dueDate, invoice.status);
              const normalizedStatus = invoice.status?.toLowerCase();
              let displayStatus;
              let statusStyle;

              if (overdue) {
                displayStatus = "EN RETARD";
                statusStyle = "bg-[#fff7d6] text-[#7b6a25]";
              } else if (normalizedStatus === "paiement reçu" || normalizedStatus === "payée") {
                displayStatus = "PAYÉE";
                statusStyle = "bg-[#dff5e7] text-[#1e4029]";
              } else if (normalizedStatus === "paiement envoyé") {
                displayStatus = "PAIEMENT ENVOYÉ";
                statusStyle = "bg-[#e6f0ea] text-[#2d5f3f]";
              } else if (normalizedStatus === "en attente") {
                displayStatus = "EN ATTENTE";
                statusStyle = "bg-[#e8f0ff] text-[#2a4fa2]";
              } else {
                displayStatus = "NON PAYÉ";
                statusStyle = "bg-red-50 text-red-600";
              }

              return (
                <div
                  key={invoice._id}
                  className="bg-white border border-[#dfe8e1] rounded-2xl p-5 hover:border-[#5a8f6f]/40 transition-colors shadow-sm hover:shadow-md cursor-pointer flex flex-col h-full"
                  onClick={() => handleViewInvoice(invoice)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-[#1e4029] text-lg mb-1">
                        {invoice.invoiceNumber || invoice._id.slice(-6).toUpperCase()}
                      </h4>
                      <p className="text-sm text-[#7a8b7f] font-medium">
                        {invoice.project?.name || "Projet non défini"}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap ${statusStyle}`}>
                      {displayStatus}
                    </span>
                  </div>

                  {invoice.description && (
                    <p className="text-sm text-[#7a8b7f] mb-4 line-clamp-2 flex-grow">
                      {invoice.description}
                    </p>
                  )}

                  <div className="space-y-3 mt-auto pt-4 border-t border-[#f0f5f1]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#7a8b7f]">Montant</span>
                      <span className="font-bold text-[#1e4029] text-base">
                        {formatAmount(invoice.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#7a8b7f]">Émission</span>
                      <span className="text-[#1e4029] font-medium">
                        {formatDate(invoice.issueDate)}
                      </span>
                    </div>
                    {invoice.dueDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#7a8b7f]">Échéance</span>
                        <span className={`font-medium ${overdue ? "text-red-600" : "text-[#1e4029]"}`}>
                          {formatDate(invoice.dueDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#f0f5f1] flex gap-3">
                    <button
                      className="flex-1 py-2 px-4 bg-[#f4f7f4] text-[#2d5f3f] rounded-lg text-sm font-semibold hover:bg-[#e6f0ea] transition-colors flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewInvoice(invoice);
                      }}
                    >
                      <FiEye /> Détails
                    </button>
                    {/* Placeholder for Download Button if file exists */}
                    <button
                      className="flex-1 py-2 px-4 bg-[#1e4029] text-white rounded-lg text-sm font-semibold hover:bg-[#2d5f3f] transition-colors flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add download logic here or in View Modal
                        toast("Téléchargement...");
                      }}
                    >
                      <FiFileText /> PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Admin View: Table or Empty State
          filteredInvoices.length > 0 ? (
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
                      const normalizedStatus = invoice.status?.toLowerCase();
                      let displayStatus;
                      if (overdue) {
                        displayStatus = "EN RETARD";
                      } else if (normalizedStatus === "paiement reçu" || normalizedStatus === "payée") {
                        displayStatus = "PAIEMENT REÇU";
                      } else if (normalizedStatus === "paiement envoyé") {
                        displayStatus = "PAIEMENT ENVOYÉ";
                      } else if (normalizedStatus === "en attente") {
                        displayStatus = "EN ATTENTE";
                      } else {
                        displayStatus = "NON PAYÉ";
                      }

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
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[displayStatus] || statusColors["NON PAYÉ"]}`}>
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
                              {user?.role === 'admin' && (
                                <>
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
                                </>
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
                <FiFileText className="text-[#5a8f6f] text-6xl" />
              </div>
              <h3 className="text-xl font-medium text-[#1e4029] mb-2">
                {searchQuery || selectedStatus !== "all" ? "Aucune facture trouvée" : "Aucune facture pour le moment"}
              </h3>
              <p className="text-[#7a8b7f] mb-6">
                {searchQuery || selectedStatus !== "all"
                  ? "Essayez d'ajuster votre recherche ou votre filtre"
                  : "Aucune facture disponible"}
              </p>
            </div>
          ))
        }
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
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setViewingInvoice(null)}
        >
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
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[viewingInvoice.status?.toUpperCase()] || statusColors["NON PAYÉ"]}`}>
                    {(() => {
                      const status = viewingInvoice.status?.toLowerCase();
                      if (status === 'paiement reçu' || status === 'payée') return 'PAIEMENT REÇU';
                      if (status === 'paiement envoyé') return 'PAIEMENT ENVOYÉ';
                      if (status === 'en attente') return 'EN ATTENTE';
                      if (status === 'non payée') return 'NON PAYÉ';
                      if (isOverdue(viewingInvoice.dueDate, viewingInvoice.status)) return 'EN RETARD';
                      return 'NON PAYÉ';
                    })()}
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
