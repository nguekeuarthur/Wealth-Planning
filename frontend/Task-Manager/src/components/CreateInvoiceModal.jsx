import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { FiUpload, FiX, FiFile, FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const CreateInvoiceModal = ({ isOpen, onClose, onInvoiceCreated, editInvoice = null }) => {
  const [formData, setFormData] = useState({
    project: "",
    invoiceFile: null,
    amount: "",
    dueDate: "",
    paymentLink: "",
    service: "",
    description: "",
    status: "en attente",
    issueDate: new Date().toISOString().split('T')[0]
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      if (editInvoice) {
        setFormData({
          project: editInvoice.project?._id || "",
          invoiceFile: null,
          amount: editInvoice.amount || "",
          dueDate: editInvoice.dueDate ? new Date(editInvoice.dueDate).toISOString().split('T')[0] : "",
          paymentLink: editInvoice.paymentLink || "",
          service: editInvoice.service || "",
          description: editInvoice.description || "",
          status: editInvoice.status || "en attente",
          issueDate: editInvoice.issueDate ? new Date(editInvoice.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setFileName(editInvoice.pdfPath ? editInvoice.pdfPath.split('/').pop() : "");
      } else {
        resetForm();
      }
    }
  }, [isOpen, editInvoice]);

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS);
      const projectsData = response.data?.projects || [];
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    }
  };

  const resetForm = () => {
    setFormData({
      project: "",
      invoiceFile: null,
      amount: "",
      dueDate: "",
      paymentLink: "",
      service: "",
      description: "",
      status: "en attente",
      issueDate: new Date().toISOString().split('T')[0]
    });
    setFileName("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
        toast.error("Please upload a PDF or image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        invoiceFile: file,
      }));
      setFileName(file.name);
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      invoiceFile: null,
    }));
    setFileName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.project) {
      toast.error("Please select a project");
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!formData.dueDate) {
      toast.error("Please select a due date");
      return;
    }
    if (!formData.service) {
      toast.error("Please enter a service description");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("project", formData.project);
      formDataToSend.append("amount", formData.amount);
      formDataToSend.append("dueDate", formData.dueDate);
      formDataToSend.append("service", formData.service);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("issueDate", formData.issueDate);
      
      if (formData.paymentLink) {
        formDataToSend.append("paymentLink", formData.paymentLink);
      }
      
      if (formData.invoiceFile) {
        formDataToSend.append("invoiceFile", formData.invoiceFile);
      }

      let response;
      if (editInvoice) {
        response = await axiosInstance.put(
          API_PATHS.INVOICES.UPDATE_INVOICE(editInvoice._id),
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Invoice updated successfully");
      } else {
        response = await axiosInstance.post(
          API_PATHS.INVOICES.CREATE_INVOICE,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Invoice created successfully");
      }

      onInvoiceCreated();
      handleClose();
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error(error.response?.data?.message || "Failed to save invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const statusOptions = [
    { value: "payée", label: "Payment Received" },
    { value: "en attente", label: "Payment Sent" },
    { value: "à envoyer", label: "To Send" },
    { value: "non payée", label: "Unpaid" },
    { value: "partiellement payée", label: "Partially Paid" },
    { value: "paiement reçu", label: "Payment Received" }
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {editInvoice ? "Edit Invoice" : "Add invoice"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project name <span className="text-red-500">*</span>
            </label>
            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Invoice File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice file
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                  <FiUpload className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {fileName || "Choose file"}
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {fileName && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <FiFile className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 truncate max-w-[150px]">
                    {fileName}
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">PDF or image file (max 10MB)</p>
          </div>

          {/* Service Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="service"
              value={formData.service}
              onChange={handleChange}
              placeholder="e.g., Web Development"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Issue Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment link
            </label>
            <input
              type="url"
              name="paymentLink"
              value={formData.paymentLink}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional notes..."
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : editInvoice ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateInvoiceModal;
