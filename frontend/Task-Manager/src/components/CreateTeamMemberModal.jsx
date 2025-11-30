import React, { useState } from "react";
import Modal from "./Modal";
import { FiUpload, FiX } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const CreateClientModal = ({ isOpen, onClose, onClientCreated, editClient = null }) => {
  const [formData, setFormData] = useState({
    name: editClient?.name || "",
    email: editClient?.email || "",
    password: "",
    company: editClient?.company || "",
    address: editClient?.address || "",
    industry: editClient?.industry || "",
    companySize: editClient?.companySize || "",
    phoneNumber: editClient?.phoneNumber || "",
    website: editClient?.website || "",
  });
  
  const [logoImage, setLogoImage] = useState(null);
  const [logoPreview, setLogoPreview] = useState(editClient?.logoUrl || null);
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
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should not exceed 5MB");
        return;
      }
      
      setLogoImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setLogoImage(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.company || !formData.industry) {
      toast.error("Please fill in all required fields (Company name and Industry)");
      return;
    }

    if (!editClient && !formData.email) {
      toast.error("Email is required for new clients");
      return;
    }

    if (!editClient && !formData.password) {
      toast.error("Password is required for new clients");
      return;
    }

    setLoading(true);
    try {
      // Upload logo if exists
      let logoUrl = editClient?.logoUrl || null;
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
          toast.error("Failed to upload logo. Client will be created without logo.");
          logoUrl = null;
        }
      }

      // Create or update client
      const clientData = {
        ...formData,
        logoUrl: logoUrl || null,
        role: "member", // Clients are members, not admins
      };
      
      // Remove empty strings to avoid validation errors
      Object.keys(clientData).forEach(key => {
        if (clientData[key] === "") {
          clientData[key] = null;
        }
      });

      let response;
      if (editClient) {
        // Update existing client
        response = await axiosInstance.put(
          API_PATHS.USERS.UPDATE_USER(editClient._id),
          clientData
        );
        toast.success("Client updated successfully!");
      } else {
        // Create new client
        response = await axiosInstance.post(
          API_PATHS.USERS.CREATE_USER,
          clientData
        );
        toast.success("Client created successfully!");
      }

      onClientCreated(response.data.user || response.data);
      handleClose();
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error(error.response?.data?.message || "Failed to save client");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      company: "",
      address: "",
      industry: "",
      companySize: "",
      phoneNumber: "",
      website: "",
    });
    setLogoImage(null);
    setLogoPreview(null);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={editClient ? "Edit Client" : "Add new client"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Company name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Company name"
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900 placeholder:text-gray-400"
            required
          />
        </div>

        {/* Contact Name */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Contact name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Contact person name"
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Email {!editClient && <span className="text-red-500">*</span>}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email address"
            disabled={!!editClient}
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required={!editClient}
          />
        </div>

        {/* Password (only for new clients) */}
        {!editClient && (
          <div>
            <label className="block text-xs font-medium text-white mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>
        )}

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
            placeholder="Address"
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
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
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

        {/* Company Size */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Company size
          </label>
          <select
            name="companySize"
            value={formData.companySize}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all appearance-none cursor-pointer text-sm text-gray-900"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
          >
            <option value="">Select size</option>
            {companySizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Phone number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Phone number"
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
            placeholder="https://www.example.com"
            className="w-full px-3 py-2.5 bg-white border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all text-sm text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Logo
          </label>
          <div className="w-full">
            {logoPreview ? (
              <div className="relative group">
                <div className="w-full h-48 bg-white rounded-md flex items-center justify-center p-4">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="max-h-40 max-w-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
                >
                  <FiX size={16} className="text-gray-700" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 border-0 rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-all">
                <div className="flex flex-col items-center justify-center">
                  <FiUpload className="w-6 h-6 mb-1.5 text-gray-400" />
                  <p className="text-xs text-gray-500">Upload logo</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-all font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={loading}
          >
            {loading ? (editClient ? "Updating..." : "Adding...") : (editClient ? "Update" : "Add")}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClientModal;
