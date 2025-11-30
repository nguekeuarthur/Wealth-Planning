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
    "PAYMENT RECEIVED": "bg-green-100 text-green-700 border-green-200",
    "PAYMENT SENT": "bg-blue-100 text-blue-700 border-blue-200",
    "UNPAID": "bg-red-100 text-red-700 border-red-200",
    "OVERDUE": "bg-orange-100 text-orange-700 border-orange-200"
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
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load invoices");
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
    if (!window.confirm("Are you sure you want to delete this invoice?")) {
      return;
    }

    try {
      setDeletingInvoice(invoiceId);
      await axiosInstance.delete(API_PATHS.INVOICES.DELETE_INVOICE(invoiceId));
      toast.success("Invoice deleted successfully");
      getAllInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    } finally {
      setDeletingInvoice(null);
    }
  };

  const handleInvoiceCreated = () => {
    getAllInvoices();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const isOverdue = (dueDate, status) => {
    if (status?.toUpperCase() === "PAYMENT RECEIVED") return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading invoices...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
            <p className="text-sm text-gray-500 mt-1">{allInvoices.length} total invoices</p>
          </div>
          <button
            onClick={handleAddInvoice}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <FiPlus className="w-5 h-5" />
            Add invoice
          </button>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by invoice number, project, client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              {statuses.slice(1).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Invoices Table */}
        {filteredInvoices.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Invoiced Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => {
                    const overdue = isOverdue(invoice.dueDate, invoice.status);
                    const displayStatus = overdue ? "OVERDUE" : (invoice.status?.toUpperCase() || "UNPAID");
                    
                    return (
                      <tr 
                        key={invoice._id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber || invoice._id.slice(-6)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {invoice.project?.name || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatAmount(invoice.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiCalendar className="w-4 h-4" />
                            {formatDate(invoice.issueDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
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
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditInvoice(invoice);
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
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
                              title="Delete"
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
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchQuery || selectedStatus !== "all" ? "No invoices found" : "No invoices yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedStatus !== "all"
                ? "Try adjusting your search or filter"
                : "Start by creating your first invoice"}
            </p>
            {!searchQuery && selectedStatus === "all" && (
              <button
                onClick={handleAddInvoice}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <FiPlus className="w-5 h-5" />
                Create your first invoice
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
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Invoice Details</h3>
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Invoice ID</p>
                  <p className="text-lg font-bold text-gray-900">
                    {viewingInvoice.invoiceNumber || viewingInvoice._id.slice(-6)}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 mb-1">PROJECT</p>
                  <p className="text-sm font-medium text-blue-600">
                    {viewingInvoice.project?.name || "N/A"}
                  </p>
                </div>

                {viewingInvoice.client && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">COMPANY</p>
                    <p className="text-sm font-medium text-gray-900">
                      {viewingInvoice.client?.name || viewingInvoice.client?.companyName || "N/A"}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[viewingInvoice.status?.toUpperCase()] || statusColors["UNPAID"]}`}>
                    {viewingInvoice.status?.toUpperCase() || "UNPAID"}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">AMOUNT</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatAmount(viewingInvoice.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">INVOICED DATE</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(viewingInvoice.issueDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">DUE DATE</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(viewingInvoice.dueDate)}
                  </p>
                </div>

                {viewingInvoice.description && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">NOTES</p>
                    <p className="text-sm text-gray-700">
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
