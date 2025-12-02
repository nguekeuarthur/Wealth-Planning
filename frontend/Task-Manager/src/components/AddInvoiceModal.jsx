import React, { useState } from "react";
import Modal from "./Modal";
import { FiUpload } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const AddInvoiceModal = ({ isOpen, onClose, onInvoiceCreated, projectId, clientId }) => {
  const [formData, setFormData] = useState({
    invoiceFile: null,
    amount: "",
    paymentLink: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
        toast.error("Veuillez télécharger un fichier PDF ou une image");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("La taille du fichier doit être inférieure à 10MB");
        return;
      }
      setFormData((prev) => ({ ...prev, invoiceFile: file }));
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || formData.amount <= 0) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }

    if (!clientId) {
      toast.error("Ce projet n'a pas de client assigné. Veuillez assigner un client au projet d'abord.");
      return;
    }

    setLoading(true);
    try {
      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const invoiceData = {
        invoiceNumber,
        amount: parseFloat(formData.amount),
        project: projectId,
        client: clientId,
        service: "Service",
        description: formData.notes || "",
        status: "en attente",
        dueDate: new Date().toISOString().split('T')[0],
        issueDate: new Date().toISOString().split('T')[0],
      };
      
      if (formData.paymentLink) {
        invoiceData.paymentLink = formData.paymentLink;
      }

      const response = await axiosInstance.post(
        API_PATHS.INVOICES.CREATE_INVOICE,
        invoiceData
      );

      toast.success("Facture ajoutée avec succès");
      onInvoiceCreated();
      handleClose();
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout de la facture");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      invoiceFile: null,
      amount: "",
      paymentLink: "",
      notes: "",
    });
    setFileName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New invoice">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invoice
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FiUpload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Pick a file</span>
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,image/*"
              onChange={handleFileChange}
            />
          </label>
          {fileName && (
            <p className="mt-2 text-sm text-gray-600">
              Fichier sélectionné: {fileName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            step="0.01"
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment link
          </label>
          <input
            type="url"
            name="paymentLink"
            value={formData.paymentLink}
            onChange={handleChange}
            placeholder="Payment link"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={loading}
          >
            {loading ? "Ajout..." : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddInvoiceModal;

