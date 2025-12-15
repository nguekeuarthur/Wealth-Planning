import React, { useMemo, useState } from "react";
import Modal from "./Modal";
import { FiUpload, FiFile, FiX, FiSearch } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const CreateProjectDocumentModal = ({ isOpen, onClose, project, onDocumentCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "other",
    category: ""
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignedUserIds, setAssignedUserIds] = useState([]);
  const [assignedTeamIds, setAssignedTeamIds] = useState([]);
  const [allowedRoles, setAllowedRoles] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredProjectUsers = useMemo(() => {
    const users = Array.isArray(project?.assignedUsers) ? project.assignedUsers : [];
    const q = (userSearch || "").trim().toLowerCase();
    let filtered = users;
    if (roleFilter !== "all") {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    if (!q) return filtered;
    return filtered.filter((u) => {
      const name = (u?.name || "").toLowerCase();
      const email = (u?.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [project?.assignedUsers, userSearch, roleFilter]);

  const documentTypes = [
    { value: "contract", label: "Contrat" },
    { value: "livrable", label: "Livrable" },
    { value: "personal_data", label: "Données personnelles" },
    { value: "other", label: "Autre" }
  ];

  const documentCategories = [
    { value: "", label: "Sélectionner une catégorie" },
    { value: "Contrat de service", label: "Contrat de service" },
    { value: "Contrat de domiciliation", label: "Contrat de domiciliation" },
    { value: "Contrat bancaire", label: "Contrat bancaire" },
    { value: "Rapport d'analyse", label: "Rapport d'analyse" },
    { value: "Proposition structuration", label: "Proposition structuration" },
    { value: "Stratégie fiscale", label: "Stratégie fiscale" },
    { value: "Facture", label: "Facture" },
    { value: "Devis", label: "Devis" },
    { value: "Correspondance", label: "Correspondance" },
    { value: "Document légal", label: "Document légal" },
    { value: "Document bancaire", label: "Document bancaire" },
    { value: "Document d'identité", label: "Document d'identité" },
    { value: "Justificatif", label: "Justificatif" },
    { value: "Note interne", label: "Note interne" },
    { value: "Autre", label: "Autre" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Vérifier la taille (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Le fichier ne doit pas dépasser 10MB");
        return;
      }
      setFile(selectedFile);

      // Prévisualisation pour les images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result);
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
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

    if (!formData.name.trim()) {
      return toast.error("Le nom du document est obligatoire");
    }

    if (!file) {
      return toast.error("Veuillez sélectionner un fichier");
    }

    setLoading(true);
    try {
      // Créer FormData avec le fichier et les données
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("type", formData.type);
      formDataToSend.append("category", formData.category || "");
      formDataToSend.append("project", project._id);
      // Attach assignments: send as JSON strings
      if (assignedUserIds && assignedUserIds.length) {
        formDataToSend.append('assignedUserIds', JSON.stringify(assignedUserIds));
      }
      if (assignedTeamIds && assignedTeamIds.length) {
        formDataToSend.append('assignedTeamIds', JSON.stringify(assignedTeamIds));
      }
      if (allowedRoles && allowedRoles.length) {
        formDataToSend.append('allowedRoles', JSON.stringify(allowedRoles));
      }

      const response = await axiosInstance.post(
        API_PATHS.DOCUMENTS.UPLOAD_DOCUMENT,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success("Document ajouté avec succès !");
      onDocumentCreated(response.data.document);
      handleClose();
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout du document");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      type: "other",
      category: ""
    });
    setFile(null);
    setFilePreview(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ajouter un document">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom du document */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Nom du document <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ex: Contrat client XYZ"
            className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
            required
          />
        </div>

        {/* Type et Catégorie */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029]"
              required
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
              Catégorie
            </label>
            <select
              name="category"
              value={formData.category}
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
              {documentCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
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
            onChange={handleInputChange}
            placeholder="Description du document..."
            rows={3}
            className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
          />
        </div>

        {/* Upload de fichier */}
        <div>
          <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">
            Fichier <span className="text-red-500">*</span>
          </label>

          {file ? (
            <div className="relative">
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
              ) : (
                <div className="p-4 border border-[#dfe8e1] rounded-xl bg-[#f4f7f4] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <FiFile className="text-[#2d5f3f] text-xl" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1e4029]">{file.name}</p>
                      <p className="text-xs text-[#7a8b7f]">{formatFileSize(file.size)}</p>
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
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#dfe8e1] rounded-xl cursor-pointer bg-[#fdfdfc] hover:bg-[#f4f7f4] transition-colors">
              <FiUpload className="w-8 h-8 text-[#7a8b7f] mb-2" />
              <span className="text-sm text-[#7a8b7f] font-medium">
                Cliquez pour téléverser un fichier
              </span>
              <span className="text-xs text-[#99aca2] mt-1">
                PDF, Images, Word, Excel (max 10MB)
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
              />
            </label>
          )}
        </div>

        {/* Actions */}
        {/* Assignements: users, teams, roles (admin only UI for assignment) */}
        {project && project._id && (
          <div className="bg-[#fbfff9] p-4 rounded-xl border border-[#e6f0ea] space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-[#1e4029]">Attribuer ce document</h4>
              <p className="text-xs text-[#7a8b7f] mt-1">Vous pouvez attribuer ce document à des utilisateurs, des équipes ou des rôles.</p>
            </div>

            {/* Users list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#7a8b7f]">Utilisateurs du projet</div>
                <div className="text-xs text-[#99aca2]">{assignedUserIds.length} sélectionné(s)</div>
              </div>

              {/* Filtre par rôle */}
              <div>
                <label className="block text-xs font-medium text-[#7a8b7f] mb-1.5">Filtrer par rôle</label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setRoleFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${roleFilter === "all"
                      ? "bg-[#2d5f3f] text-white"
                      : "bg-[#f4f7f4] text-[#7a8b7f] hover:bg-[#dfe8e1]"
                      }`}
                  >
                    Tous
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter("client")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${roleFilter === "client"
                      ? "bg-[#2d5f3f] text-white"
                      : "bg-[#f4f7f4] text-[#7a8b7f] hover:bg-[#dfe8e1]"
                      }`}
                  >
                    Clients
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter("partner")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${roleFilter === "partner"
                      ? "bg-[#2d5f3f] text-white"
                      : "bg-[#f4f7f4] text-[#7a8b7f] hover:bg-[#dfe8e1]"
                      }`}
                  >
                    Partenaires
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter("collaborator")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${roleFilter === "collaborator"
                      ? "bg-[#2d5f3f] text-white"
                      : "bg-[#f4f7f4] text-[#7a8b7f] hover:bg-[#dfe8e1]"
                      }`}
                  >
                    Collaborateurs
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter("member")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${roleFilter === "member"
                      ? "bg-[#2d5f3f] text-white"
                      : "bg-[#f4f7f4] text-[#7a8b7f] hover:bg-[#dfe8e1]"
                      }`}
                  >
                    Membres
                  </button>
                </div>
              </div>

              {/* Recherche */}
              <div className="relative">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Rechercher un membre..."
                  className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
                />
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7a8b7f] w-4 h-4" />
              </div>

              {/* Liste des utilisateurs */}
              <div className="bg-white border border-[#dfe8e1] rounded-xl max-h-44 overflow-y-auto">
                {(Array.isArray(project.assignedUsers) && project.assignedUsers.length > 0) ? (
                  filteredProjectUsers.length > 0 ? (
                    filteredProjectUsers.map((u) => {
                      const isSelected = assignedUserIds.includes(u._id);
                      return (
                        <label
                          key={u._id}
                          className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${isSelected ? "bg-[#f4f7f4]" : "hover:bg-[#f4f7f4]"}`}
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setAssignedUserIds((prev) =>
                                  prev.includes(u._id) ? prev.filter((x) => x !== u._id) : [...prev, u._id]
                                );
                              }}
                              className="h-4 w-4 rounded border-[#dfe8e1] text-[#2d5f3f] focus:ring-[#5a8f6f] focus:ring-offset-0 sr-only peer"
                            />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                              ? "bg-[#2d5f3f] border-[#2d5f3f]"
                              : "border-[#dfe8e1] bg-white peer-hover:border-[#5a8f6f]"
                              }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                          {u.profileImageUrl ? (
                            <img src={u.profileImageUrl} alt={u.name || u.email} className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#5a8f6f] text-white flex items-center justify-center text-xs font-semibold">
                              {(u.name || u.email || "").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-[#1e4029] truncate">{u.name || "Sans nom"}</p>
                            <p className="text-xs text-[#7a8b7f] truncate">{u.email}</p>
                          </div>
                        </label>
                      );
                    })
                  ) : (
                    <div className="px-3 py-3 text-sm text-[#7a8b7f] text-center">Aucun utilisateur trouvé</div>
                  )
                ) : (
                  <div className="px-3 py-3 text-sm text-[#7a8b7f] text-center">Aucun utilisateur assigné au projet</div>
                )}
              </div>
            </div>

            {/* Teams list */}
            {project.teams && project.teams.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#7a8b7f]">Équipes</div>
                  <div className="text-xs text-[#99aca2]">{assignedTeamIds.length} sélectionnée(s)</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {project.teams.map((t) => {
                    const isSelected = assignedTeamIds.includes(t._id);
                    return (
                      <label
                        key={t._id}
                        className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${isSelected ? "border-[#5a8f6f] bg-[#f4f7f4]" : "border-[#dfe8e1] bg-white hover:bg-[#f4f7f4]"}`}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setAssignedTeamIds((prev) =>
                                prev.includes(t._id) ? prev.filter((x) => x !== t._id) : [...prev, t._id]
                              );
                            }}
                            className="h-4 w-4 rounded border-[#dfe8e1] text-[#2d5f3f] focus:ring-[#5a8f6f] focus:ring-offset-0 sr-only peer"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                            ? "bg-[#2d5f3f] border-[#2d5f3f]"
                            : "border-[#dfe8e1] bg-white peer-hover:border-[#5a8f6f]"
                            }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-[#1e4029] truncate">{t.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
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
            {loading ? "Ajout..." : "Ajouter le document"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectDocumentModal;

