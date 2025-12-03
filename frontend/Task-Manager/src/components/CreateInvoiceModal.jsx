import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FiX } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const CreateInvoiceModal = ({ isOpen, onClose, project, invoice, onInvoiceCreated }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    amount: "",
    service: "",
    description: "",
    status: "en attente",
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    client: project?.client?._id || ""
  });
  const [loading, setLoading] = useState(false);

  const invoiceStatuses = [
    { value: "en attente", label: "En attente" },
    { value: "payée", label: "Payée" },
    { value: "partiellement payée", label: "Partiellement payée" },
    { value: "paiement reçu", label: "Paiement reçu" },
    { value: "non payée", label: "Non payée" }
  ];

  useEffect(() => {
    if (invoice) {
      // Mode édition
      const invoiceStatus = invoice.status || "en attente";
      setFormData({
        invoiceNumber: invoice.invoiceNumber || "",
        amount: invoice.amount || "",
        service: invoice.service || "",
        description: invoice.description || "",
        status: invoiceStatus,
        issueDate: invoice.issueDate 
          ? new Date(invoice.issueDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        // Ne charger la date d'échéance que si le statut est "en attente" ou "partiellement payée"
        dueDate: (invoiceStatus === 'en attente' || invoiceStatus === 'partiellement payée') && invoice.dueDate
          ? new Date(invoice.dueDate).toISOString().split('T')[0]
          : "",
        client: invoice.client?._id || project?.client?._id || ""
      });
    } else {
      // Mode création - le numéro sera généré automatiquement par le backend
      setFormData({
        invoiceNumber: "",
        amount: "",
        service: "",
        description: "",
        status: "en attente",
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: "",
        client: project?.client?._id || ""
      });
    }
  }, [invoice, project]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Si le statut change et n'est plus "en attente" ou "partiellement payée", vider la date d'échéance
    if (name === 'status' && value !== 'en attente' && value !== 'partiellement payée') {
      setFormData(prev => ({ ...prev, [name]: value, dueDate: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return toast.error("Le montant doit être supérieur à 0");
    }

    if (!formData.service.trim()) {
      return toast.error("Le service est obligatoire");
    }

    // Si le statut est "en attente" ou "partiellement payée", la date d'échéance est obligatoire
    if ((formData.status === 'en attente' || formData.status === 'partiellement payée') && !formData.dueDate) {
      return toast.error("La date d'échéance est obligatoire pour les factures en attente ou partiellement payées");
    }

    if (!formData.client) {
      return toast.error("Le client est obligatoire");
    }

    setLoading(true);
    try {
      let payload;
      
      if (invoice) {
        // Mise à jour : inclure le numéro de facture (ne peut pas être modifié mais on le garde)
        payload = {
          ...formData,
          amount: parseFloat(formData.amount),
          project: project?._id,
          client: formData.client,
          // Ne pas envoyer la date d'échéance si le statut n'est pas "en attente" ou "partiellement payée"
          dueDate: (formData.status === 'en attente' || formData.status === 'partiellement payée') 
            ? formData.dueDate 
            : null
        };
      } else {
        // Création : ne pas envoyer invoiceNumber, il sera généré automatiquement par le backend
        const { invoiceNumber, ...restFormData } = formData;
        payload = {
          ...restFormData,
          amount: parseFloat(formData.amount),
          project: project?._id,
          client: formData.client,
          // Ne pas envoyer la date d'échéance si le statut n'est pas "en attente" ou "partiellement payée"
          dueDate: (formData.status === 'en attente' || formData.status === 'partiellement payée') 
            ? formData.dueDate 
            : null
        };
      }

      let response;
      if (invoice) {
        // Mise à jour
        response = await axiosInstance.put(
          API_PATHS.INVOICES.UPDATE_INVOICE(invoice._id),
          payload
        );
        toast.success("Facture mise à jour avec succès !");
      } else {
        // Création
        response = await axiosInstance.post(
          API_PATHS.INVOICES.CREATE_INVOICE,
          payload
        );
        toast.success("Facture créée avec succès !");
      }

      onInvoiceCreated(response.data.invoice);
      handleClose();
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la sauvegarde de la facture");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      invoiceNumber: "",
      amount: "",
      service: "",
      description: "",
      status: "en attente",
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: "",
      client: project?.client?._id || ""
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={invoice ? "Modifier la facture" : "Créer une facture"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Numéro de facture */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Numéro de facture
          </label>
          {invoice ? (
            // Mode édition : afficher en lecture seule
            <input
              type="text"
              value={formData.invoiceNumber}
              disabled
              className="w-full px-3 py-2.5 bg-[#f4f7f4] border border-[#dfe8e1] rounded-xl text-sm text-[#7a8b7f] cursor-not-allowed"
            />
          ) : (
            // Mode création : afficher un message indiquant qu'il sera généré automatiquement
            <div className="w-full px-3 py-2.5 bg-[#f4f7f4] border border-[#dfe8e1] rounded-xl text-sm text-[#7a8b7f] flex items-center gap-2">
              <span className="text-xs italic">Généré automatiquement lors de la création</span>
            </div>
          )}
        </div>

        {/* Montant et Service */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
              Montant (CHF) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
              Service <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              placeholder="Ex: Consultation, Création entreprise..."
              className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description détaillée de la facture..."
            rows={3}
            className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
          />
        </div>

        {/* Dates */}
        <div className={formData.status === 'en attente' || formData.status === 'partiellement payée' 
          ? "grid sm:grid-cols-2 gap-4" 
          : ""}>
          <div>
            <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
              Date d'émission
            </label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029]"
            />
          </div>

          {(formData.status === 'en attente' || formData.status === 'partiellement payée') && (
            <div>
              <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
                Date d'échéance <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                min={formData.issueDate}
                className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029]"
                required
              />
            </div>
          )}
        </div>

        {/* Statut */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Statut
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029] appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237a8b7f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
          >
            {invoiceStatuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Client (affiché en lecture seule si un projet est sélectionné) */}
        {project?.client && (
          <div>
            <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
              Client
            </label>
            <input
              type="text"
              value={project.client.companyName || project.client.contactName || "Client du projet"}
              disabled
              className="w-full px-3 py-2.5 bg-[#f4f7f4] border border-[#dfe8e1] rounded-xl text-sm text-[#7a8b7f] cursor-not-allowed"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#dfe8e1]">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-sm text-[#7a8b7f] bg-[#f4f7f4] rounded-xl hover:bg-[#e6f0ea] border border-[#dfe8e1]"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] font-medium shadow-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : invoice ? "Modifier" : "Créer la facture"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateInvoiceModal;
