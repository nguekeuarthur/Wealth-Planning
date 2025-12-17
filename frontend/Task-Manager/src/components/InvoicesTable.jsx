import React, { useState, useContext } from "react";
import { FiEdit, FiMoreHorizontal, FiCalendar, FiPaperclip, FiArrowUp, FiEye } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import moment from "moment";
import "moment/locale/fr";

moment.locale("fr");

const InvoicesTable = ({ invoices, onInvoiceDeleted, onInvoiceUpdated, onEditInvoice }) => {
  const { user } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;

    switch (sortField) {
      case "amount":
        aValue = a.amount || 0;
        bValue = b.amount || 0;
        break;
      case "issueDate":
        aValue = new Date(a.issueDate || 0);
        bValue = new Date(b.issueDate || 0);
        break;
      default:
        return 0;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleMarkPaymentReceived = async (invoiceId) => {
    try {
      await axiosInstance.put(API_PATHS.INVOICES.UPDATE_INVOICE(invoiceId), {
        status: "paiement reçu",
      });
      toast.success("Paiement marqué comme reçu");
      onInvoiceUpdated();
      setShowMenu(null);
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "paiement reçu" || status === "payée") {
      return (
        <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs font-medium rounded">
          PAYMENT RECEIVED
        </span>
      );
    }
    return (
      <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">
        {status || "Pending"}
      </span>
    );
  };

  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune facture pour le moment</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                # Notes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("amount")}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  # Amount
                  {sortField === "amount" && (
                    <FiArrowUp
                      className={`w-4 h-4 transition-transform ${
                        sortDirection === "desc" ? "transform rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("issueDate")}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  <FiCalendar className="w-4 h-4" />
                  Invoiced date
                  {sortField === "issueDate" && (
                    <FiArrowUp
                      className={`w-4 h-4 transition-transform ${
                        sortDirection === "desc" ? "transform rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  Due date
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <FiPaperclip className="w-4 h-4" />
                  Project
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                {/* Actions column */}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedInvoices.map((invoice, index) => (
              <tr
                key={invoice._id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {invoice.invoiceNumber || index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {invoice.amount?.toLocaleString() || "0"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {invoice.issueDate
                    ? moment(invoice.issueDate).format("DD/MM/YYYY")
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {invoice.dueDate
                    ? moment(invoice.dueDate).format("DD/MM/YYYY")
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(invoice.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block">
                    <button
                      onClick={() =>
                        setShowMenu(showMenu === invoice._id ? null : invoice._id)
                      }
                      className="text-gray-600 hover:text-gray-900 p-2"
                    >
                      <FiMoreHorizontal className="w-5 h-5" />
                    </button>
                    {showMenu === invoice._id && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        {user?.role === 'collaborator' ? (
                          // Collaborateur : Mode lecture seule
                          <div className="px-4 py-3 text-sm text-[#7a8b7f] border-b border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                              <FiEye size={16} />
                              <span className="font-medium">Mode lecture seule</span>
                            </div>
                            <p className="text-xs">Les collaborateurs ne peuvent pas modifier les factures</p>
                          </div>
                        ) : (
                          // Admin : Accès complet
                          <>
                            <button
                              onClick={() => {
                                if (onEditInvoice) {
                                  onEditInvoice(invoice);
                                }
                                setShowMenu(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <FiEdit size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleMarkPaymentReceived(invoice._id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <span className="w-4 h-4 flex items-center justify-center">
                                ✓
                              </span>
                              Mark "Payment Received"
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(null)}
        />
      )}
    </div>
  );
};

export default InvoicesTable;

