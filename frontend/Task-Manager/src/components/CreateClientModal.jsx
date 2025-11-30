import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FiUpload, FiX } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const CreateClientModal = ({ isOpen, onClose, onClientCreated, editClient = null }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phoneNumber: "",
    address: "",
    website: "",
    companySize: "",
    industry: "",
    notes: "",
    status: "active"
  });

  const [logoImage, setLogoImage] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const industries = [
    "REAL ESTATE",
    "LEGAL",
    "AUTOMOTIVE",
    "FINANCE",
    "TECHNOLOGY",
    "HEALTHCARE",
    "RETAIL",
    "MANUFACTURING",
    "CONSULTING",
    "OTHER"
  ];

  const companySizes = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+"
  ];

  const statuses = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "prospect", label: "Prospect" }
  ];

  useEffect(() => {
    if (editClient) {
      setFormData({
        companyName: editClient.companyName || "",
        contactName: editClient.contactName || "",
        email: editClient.email || "",
        phoneNumber: editClient.phoneNumber || "",
        address: editClient.address || "",
        website: editClient.website || "",
        companySize: editClient.companySize || "",
        industry: editClient.industry || "",
        notes: editClient.notes || "",
        status: editClient.status || "active"
      });
      if (editClient.logoUrl) {
        setLogoPreview(editClient.logoUrl);
      }
    } else {
      resetForm();
    }
  }, [editClient, isOpen]);

  const resetForm = () => {
    setFormData({
      companyName: "",
      contactName: "",
      email: "",
      phoneNumber: "",
      address: "",
      website: "",
      companySize: "",
      industry: "",
      notes: "",
      status: "active"
    });
    setLogoImage(null);
    setLogoPreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoImage(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.companyName || !formData.contactName || !formData.email || !formData.industry) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      let logoUrl = editClient?.logoUrl || null;

      // Upload logo if new image selected
      if (logoImage) {
        try {
          const imageFormData = new FormData();
          imageFormData.append("image", logoImage);
          
          const uploadResponse = await axiosInstance.post(
            API_PATHS.IMAGE.UPLOAD_IMAGE,
            imageFormData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          logoUrl = uploadResponse.data?.imageUrl || null;
        } catch (uploadError) {
          console.error("Error uploading logo:", uploadError);
          toast.error("Failed to upload logo. Client will be saved without logo.");
          logoUrl = null;
        }
      }

      // Prepare client data
      const clientData = {
        ...formData,
        logoUrl: logoUrl || null,
      };

      // Convert empty strings to null
      Object.keys(clientData).forEach(key => {
        if (clientData[key] === "") {
          clientData[key] = null;
        }
      });

      let response;
      if (editClient) {
        // Update existing client
        response = await axiosInstance.put(
          API_PATHS.CLIENTS.UPDATE_CLIENT(editClient._id),
          clientData
        );
        toast.success("Client updated successfully!");
      } else {
        // Create new client
        response = await axiosInstance.post(
          API_PATHS.CLIENTS.CREATE_CLIENT,
          clientData
        );
        toast.success("Client created successfully!");
      }

      onClientCreated(response.data.client || response.data);
      handleClose();
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error(error.response?.data?.message || "Failed to save client");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editClient ? "Edit Client" : "Add New Client"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Enter company name"
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900 placeholder:text-gray-400"
            required
          />
        </div>

        {/* Contact Name */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            placeholder="Enter contact person name"
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900 placeholder:text-gray-400"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="client@company.com"
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900 placeholder:text-gray-400"
            required
            disabled={editClient}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+1 234 567 8900"
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Industry <span className="text-red-500">*</span>
          </label>
          <select
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all appearance-none cursor-pointer text-sm text-gray-900"
            required
          >
            <option value="">Select industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="123 Business St, City, Country"
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://company.com"
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Company Size */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Company Size
          </label>
          <select
            name="companySize"
            value={formData.companySize}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all appearance-none cursor-pointer text-sm text-gray-900"
          >
            <option value="">Select size</option>
            {companySizes.map((size) => (
              <option key={size} value={size}>
                {size} employees
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all appearance-none cursor-pointer text-sm text-gray-900"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Company Logo
          </label>
          {logoPreview ? (
            <div className="relative w-full h-32 bg-white rounded-md overflow-hidden">
              <img
                src={logoPreview}
                alt="Logo preview"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={removeLogo}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 bg-white border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors">
              <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500">Click to upload logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Additional notes about this client..."
            rows={3}
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900 placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : editClient ? "Update Client" : "Add Client"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClientModal;
