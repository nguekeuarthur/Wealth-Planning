import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { FiUpload, FiX, FiFile, FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const CreateContractModal = ({ isOpen, onClose, onContractCreated, editContract = null }) => {
  const [formData, setFormData] = useState({
    project: "",
    name: "",
    description: "",
    category: "",
    contractFile: null,
    status: "pending"
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState("");

  const statusOptions = [
    { value: "pending", label: "En attente" },
    { value: "signed", label: "Signé" },
    { value: "expired", label: "Expiré" }
  ];

  const categoryOptions = [
    { value: "", label: "Sélectionner une catégorie" },
    { value: "Contrat de service", label: "Contrat de service" },
    { value: "Contrat de domiciliation", label: "Contrat de domiciliation" },
    { value: "Contrat bancaire", label: "Contrat bancaire" },
    { value: "Contrat de confidentialité", label: "Contrat de confidentialité" },
    { value: "Contrat de partenariat", label: "Contrat de partenariat" },
    { value: "Autre", label: "Autre" }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      if (editContract) {
        setFormData({
          project: editContract.project?._id || "",
          name: editContract.name || "",
          description: editContract.description || "",
          category: editContract.category || "",
          contractFile: null,
          status: editContract.status || "pending"
        });
        setFileName(editContract.filePath ? editContract.filePath.split('/').pop() : "");
        if (editContract.fileUrl) {
          setFilePreview(editContract.fileUrl);
        }
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
      toast.error("Erreur lors du chargement des projets");
    }
  };

  const resetForm = () => {
    setFormData({
      project: "",
      name: "",
      description: "",
      category: "",
      contractFile: null,
      status: "pending"
    });
    setFileName("");
    setFilePreview(null);
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
        toast.error("Le fichier ne doit pas dépasser 10MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        contractFile: file,
      }));
      setFileName(file.name);
      
      // Prévisualisation pour les images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      contractFile: null,
    }));
    setFileName("");
    setFilePreview(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!editContract && !formData.project) {
      toast.error("Veuillez sélectionner un projet");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Le nom du contrat est obligatoire");
      return;
    }
    if (!editContract && !formData.contractFile) {
      toast.error("Veuillez sélectionner un fichier de contrat");
      return;
    }

    setLoading(true);

    try {
      let response;
      
      if (editContract) {
        // Mise à jour
        if (formData.contractFile) {
          // Mise à jour avec nouveau fichier
          const fileFormData = new FormData();
          fileFormData.append("file", formData.contractFile);
          fileFormData.append("name", formData.name);
          fileFormData.append("description", formData.description || "");
          fileFormData.append("category", formData.category || "");
          fileFormData.append("status", formData.status);
          fileFormData.append("type", "contract");

        response = await axiosInstance.put(
          API_PATHS.DOCUMENTS.UPDATE_DOCUMENT(editContract._id),
            fileFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        } else {
          // Mise à jour sans nouveau fichier
          const updateData = {
            name: formData.name,
            description: formData.description || "",
            category: formData.category || "",
            status: formData.status,
            type: "contract"
          };

          response = await axiosInstance.put(
            API_PATHS.DOCUMENTS.UPDATE_DOCUMENT(editContract._id),
            updateData
          );
        }
        toast.success("Contrat mis à jour avec succès");
      } else {
        // Création - fichier obligatoire
        const fileFormData = new FormData();
        fileFormData.append("file", formData.contractFile);
        fileFormData.append("name", formData.name);
        fileFormData.append("description", formData.description || "");
        fileFormData.append("category", formData.category || "");
        fileFormData.append("status", formData.status);
        fileFormData.append("type", "contract");
        if (formData.project) {
          fileFormData.append("project", formData.project);
        }

        response = await axiosInstance.post(
          API_PATHS.DOCUMENTS.UPLOAD_DOCUMENT,
          fileFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Contrat créé avec succès");
      }

      onContractCreated();
      handleClose();
    } catch (error) {
      console.error("Error saving contract:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la sauvegarde du contrat");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editContract ? "Modifier le contrat" : "Créer un contrat"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Projet */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Projet {!editContract && <span className="text-red-500">*</span>}
          </label>
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            required={!editContract}
            disabled={editContract}
            className={`w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029] appearance-none cursor-pointer ${editContract ? 'bg-[#f4f7f4] cursor-not-allowed' : ''}`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237a8b7f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}
          >
            <option value="">Sélectionner un projet</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

        {/* Nom du contrat */}
          <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Nom du contrat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
            name="name"
            value={formData.name}
              onChange={handleChange}
            placeholder="Ex: Contrat de service XYZ"
              required
            className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
            />
          </div>

        {/* Catégorie et Statut */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
              Catégorie
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029] appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237a8b7f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem"
              }}
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
              Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029] appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237a8b7f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem"
              }}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
            onChange={handleChange}
            placeholder="Description du contrat..."
            rows={4}
            className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f] resize-none"
          />
        </div>

        {/* Upload de fichier */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Fichier du contrat {!editContract && <span className="text-red-500">*</span>}
          </label>
          
          {filePreview ? (
            <div className="relative">
              <img
                src={filePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl border border-[#dfe8e1]"
              />
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-[#f4f7f4]"
              >
                <FiX className="text-[#2d5f3f]" />
              </button>
            </div>
          ) : fileName ? (
            <div className="p-4 border border-[#dfe8e1] rounded-xl bg-[#f4f7f4] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <FiFile className="text-[#2d5f3f] text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1e4029]">{fileName}</p>
                  {formData.contractFile && (
                    <p className="text-xs text-[#7a8b7f]">{formatFileSize(formData.contractFile.size)}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-[#7a8b7f] hover:text-red-500"
              >
                <FiX size={20} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#dfe8e1] rounded-xl cursor-pointer bg-[#fdfdfc] hover:bg-[#f4f7f4] transition-colors">
              <FiUpload className="w-8 h-8 text-[#7a8b7f] mb-2" />
              <span className="text-sm text-[#7a8b7f] font-medium">
                Cliquez pour téléverser un fichier
              </span>
              <span className="text-xs text-[#99aca2] mt-1">
                PDF, Word, Images (max 10MB)
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </label>
          )}
        </div>

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
            {loading ? "Enregistrement..." : editContract ? "Modifier" : "Créer le contrat"}
            </button>
          </div>
        </form>
    </Modal>
  );
};

export default CreateContractModal;
