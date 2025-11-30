import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { FiUpload, FiX, FiFile } from "react-icons/fi";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const CreateContractModal = ({ isOpen, onClose, onContractCreated, editContract = null }) => {
  const [formData, setFormData] = useState({
    project: "",
    title: "",
    description: "",
    contractFile: null,
    status: "signed"
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      if (editContract) {
        setFormData({
          project: editContract.project?._id || "",
          title: editContract.name || "",
          description: editContract.description || "",
          contractFile: null,
          status: editContract.status || "signed"
        });
        setFileName(editContract.filePath ? editContract.filePath.split('/').pop() : "");
      } else {
        resetForm();
      }
    }
  }, [isOpen, editContract]);

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
      title: "",
      description: "",
      contractFile: null,
      status: "signed"
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
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        contractFile: file,
      }));
      setFileName(file.name);
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      contractFile: null,
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
    if (!formData.title) {
      toast.error("Please enter a title");
      return;
    }
    if (!editContract && !formData.contractFile) {
      toast.error("Please select a contract file");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("project", formData.project);
      formDataToSend.append("name", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("type", "contract");
      formDataToSend.append("status", formData.status);
      
      if (formData.contractFile) {
        formDataToSend.append("document", formData.contractFile);
      }

      let response;
      if (editContract) {
        response = await axiosInstance.put(
          API_PATHS.DOCUMENTS.UPDATE_DOCUMENT(editContract._id),
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Contract updated successfully");
      } else {
        response = await axiosInstance.post(
          API_PATHS.DOCUMENTS.UPLOAD_DOCUMENT,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Contract created successfully");
      }

      onContractCreated();
      handleClose();
    } catch (error) {
      console.error("Error saving contract:", error);
      toast.error(error.response?.data?.message || "Failed to save contract");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const statusOptions = [
    { value: "signed", label: "Signed" },
    { value: "pending", label: "Pending" },
    { value: "draft", label: "Draft" },
    { value: "expired", label: "Expired" }
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {editContract ? "Update contract" : "New contract"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project <span className="text-red-500">*</span>
            </label>
            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pick a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Contract File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contract {!editContract && <span className="text-red-500">*</span>}
            </label>
            <div className="flex flex-col gap-3">
              {!fileName && (
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    <FiUpload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Select a file
                    </span>
                    <span className="text-xs text-gray-400">Max 10MB</span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
              {fileName && (
                <div className="flex items-center justify-between gap-2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FiFile className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700 truncate max-w-[250px]">
                      {fileName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Status (for edit mode) */}
          {editContract && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
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
          )}

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
              {loading ? "Saving..." : editContract ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateContractModal;
