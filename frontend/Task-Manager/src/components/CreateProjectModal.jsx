import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FiUpload, FiX, FiSearch, FiUser } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const CreateProjectModal = ({
  isOpen,
  onClose,
  onProjectCreated,
  preSelectedClient = null,
  preSelectedClientId = null
}) => {
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    client: "",
    description: "",
    projectLead: "",
    assignedUsers: [],
    startDate: "",
    endDate: "",
    category: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);

  const statusOptions = [
    { value: "in progress", label: "En cours" },
    { value: "in review", label: "En révision" },
    { value: "done", label: "Terminé" },
  ];

  const categoryOptions = [
    "Création entreprise onshore",
    "Création entreprise offshore",
    "Ouverture compte bancaire onshore",
    "Ouverture compte bancaire offshore",
    "Domiciliation",
    "Réception courrier",
    "Proposition structuration patrimoniale",
    "Proposition structuration patrimoniale:Reviewed",
    "Exécution structuration patrimoniale",
    "Proposition stratégie fiscale",
    "Proposition stratégie fiscale:Reviewed",
  ];

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchClients();
      if (preSelectedClient) {
        setFormData(prev => ({ ...prev, client: preSelectedClient._id }));
      } else if (preSelectedClientId) {
        setFormData(prev => ({ ...prev, client: preSelectedClientId }));
      }
    }
  }, [isOpen, preSelectedClient, preSelectedClientId]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      // Filter users with role "client"
      const clientUsers = (response.data?.users || []).filter(user => user.role === 'client');
      setClients(clientUsers);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.status || !formData.client || !formData.category || !formData.startDate) {
      return toast.error("Veuillez remplir tous les champs obligatoires");
    }

    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      return toast.error("La date de fin doit être postérieure à la date de début");
    }

    setLoading(true);
    try {
      let imageUrl = "";
      if (coverImage) {
        const imageFormData = new FormData();
        imageFormData.append("image", coverImage);

        const uploadResponse = await axiosInstance.post(
          API_PATHS.IMAGE.UPLOAD_IMAGE,
          imageFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        imageUrl = uploadResponse.data?.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.PROJECTS.CREATE_PROJECT, {
        ...formData,
        imageUrl,
        endDate: formData.endDate || undefined,
      });

      toast.success("Projet créé avec succès !");
      onProjectCreated(response.data.project);
      handleClose();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(error.response?.data?.message || "Création impossible");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      status: "",
      client: "",
      description: "",
      projectLead: "",
      assignedUsers: [],
      startDate: "",
      endDate: "",
      category: "",
    });
    setCoverImage(null);
    setCoverImagePreview(null);
    setLeadSearch("");
    setMemberSearch("");
    setShowLeadDropdown(false);
    setShowMemberDropdown(false);
    onClose();
  };

  const selectedLead = users.find(u => u._id === formData.projectLead);
  const selectedMembers = formData.assignedUsers.map(id => users.find(u => u._id === id)).filter(Boolean);
  const selectedClient = clients.find(c => c._id === formData.client);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nouveau projet">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#dfe8e1] bg-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#7a8b7f]">Identité</p>
                  <p className="text-sm text-[#99aca2]">Nom, catégorie, statut et description</p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nom du projet"
                  className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
                  required
                />

                <div className="grid sm:grid-cols-2 gap-3">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029]"
                    required
                  >
                    <option value="">Catégorie</option>
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029]"
                    required
                  >
                    <option value="">Statut</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description du projet"
                  rows={4}
                  className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
                  required
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#dfe8e1] bg-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#7a8b7f]">Client</p>
                  <p className="text-sm text-[#99aca2]">Sélectionnez le client rattaché</p>
                </div>
              </div>

              <select
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029]"
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.company || 'Entreprise non spécifiée'} - {client.name || client.email}
                  </option>
                ))}
              </select>

              <div className="rounded-xl border border-dashed border-[#dfe8e1] p-3 text-sm text-[#7a8b7f] min-h-[48px] flex items-center">
                {selectedClient ? (
                  <div>
                    <p className="text-[#2d5f3f] font-medium">{selectedClient.company || 'Entreprise non spécifiée'}</p>
                    <p className="text-xs text-[#99aca2] mt-1">{selectedClient.name || 'Sans nom'} - {selectedClient.email}</p>
                    {selectedClient.address && (
                      <p className="text-xs text-[#99aca2] mt-1">{selectedClient.address}</p>
                    )}
                  </div>
                ) : (
                  <span>Sélectionnez un client pour afficher ses informations</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-[#dfe8e1] bg-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#7a8b7f]">Équipe</p>
                  <p className="text-sm text-[#99aca2]">Chef de projet & membres</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <p className="text-xs text-[#7a8b7f] mb-1">Chef de projet</p>
                  {selectedLead ? (
                    <div className="flex items-center justify-between p-3 bg-[#f4f7f4] border border-[#dfe8e1] rounded-xl">
                        <div className="flex items-center gap-2">
                          {selectedLead.profileImageUrl ? (
                            <img
                              src={selectedLead.profileImageUrl}
                              alt={selectedLead.name || "Avatar"}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {selectedLead.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-[#1e4029] font-medium">{selectedLead.name || selectedLead.email}</p>
                            <p className="text-xs text-[#7a8b7f]">{selectedLead.email}</p>
                          </div>
                        </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, projectLead: "" }))}
                        className="text-[#7a8b7f] hover:text-red-500"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher un chef de projet..."
                        value={leadSearch}
                        onChange={(e) => {
                          setLeadSearch(e.target.value);
                          setShowLeadDropdown(true);
                        }}
                        onFocus={() => setShowLeadDropdown(true)}
                        className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
                      />
                      <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7a8b7f] w-4 h-4" />
                      {showLeadDropdown && (
                        <>
                        <div className="absolute left-0 right-0 z-40 mt-2 bg-white border border-[#dfe8e1] rounded-xl shadow-xl max-h-56 overflow-y-auto">
                          {users
                            .filter(u => u.role !== 'admin' && u.role !== 'member')
                            .filter(u =>
                              u.name?.toLowerCase().includes(leadSearch.toLowerCase()) ||
                              u.email?.toLowerCase().includes(leadSearch.toLowerCase())
                            )
                            .map(user => (
                              <button
                                key={user._id}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, projectLead: user._id }));
                                  setLeadSearch("");
                                  setShowLeadDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f4f7f4] text-left"
                              >
                                {user.profileImageUrl ? (
                                  <img
                                    src={user.profileImageUrl}
                                    alt={user.name || "Avatar"}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-[#1e4029]">{user.name || "Sans nom"}</p>
                                  <p className="text-xs text-[#7a8b7f]">{user.email} - {user.role}</p>
                                </div>
                              </button>
                            ))}
                          {users.filter(u => u.role !== 'admin' && u.role !== 'member').filter(u =>
                            u.name?.toLowerCase().includes(leadSearch.toLowerCase()) ||
                            u.email?.toLowerCase().includes(leadSearch.toLowerCase())
                          ).length === 0 && (
                            <div className="px-4 py-3 text-sm text-[#7a8b7f] text-center">
                              Aucun chef de projet trouvé
                            </div>
                          )}
                        </div>
                        <div className="fixed inset-0 z-30" onClick={() => setShowLeadDropdown(false)} />
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="text-xs text-[#7a8b7f] mb-1">Membres du projet (Partenaires & Collaborateurs)</p>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher un membre..."
                      value={memberSearch}
                      onChange={(e) => {
                        setMemberSearch(e.target.value);
                        setShowMemberDropdown(true);
                      }}
                      onFocus={() => setShowMemberDropdown(true)}
                      className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
                    />
                    <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7a8b7f] w-4 h-4" />
                  </div>
                  {showMemberDropdown && (
                    <>
                    <div className="absolute left-0 right-0 z-40 mt-2 bg-white border border-[#dfe8e1] rounded-xl shadow-xl max-h-56 overflow-y-auto">
                      {users
                        .filter(u => u.role === 'partner' || u.role === 'collaborator')
                        .filter(u => !formData.assignedUsers.includes(u._id))
                        .filter(u =>
                          u.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
                          u.email?.toLowerCase().includes(memberSearch.toLowerCase())
                        )
                        .map(user => (
                          <button
                            key={user._id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                assignedUsers: [...prev.assignedUsers, user._id]
                              }));
                              setMemberSearch("");
                              setShowMemberDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f4f7f4] text-left"
                          >
                            {user.profileImageUrl ? (
                              <img
                                src={user.profileImageUrl}
                                alt={user.name || "Avatar"}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-[#1e4029]">{user.name || "Sans nom"}</p>
                              <p className="text-xs text-[#7a8b7f]">{user.email} - {user.role === 'partner' ? 'Partenaire' : 'Collaborateur'}</p>
                            </div>
                            <FiUser className="ml-auto text-[#7a8b7f] w-4 h-4" />
                          </button>
                        ))}
                      {users
                        .filter(u => u.role === 'partner' || u.role === 'collaborator')
                        .filter(u => !formData.assignedUsers.includes(u._id))
                        .filter(u =>
                          u.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
                          u.email?.toLowerCase().includes(memberSearch.toLowerCase())
                        ).length === 0 && (
                        <div className="px-4 py-3 text-sm text-[#7a8b7f] text-center">
                          Aucun partenaire ou collaborateur disponible
                        </div>
                      )}
                    </div>
                    <div className="fixed inset-0 z-30" onClick={() => setShowMemberDropdown(false)} />
                    </>
                  )}

                  {selectedMembers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedMembers.map(member => (
                        <div
                          key={member._id}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-[#f4f7f4] border border-[#dfe8e1] rounded-xl text-sm"
                        >
                          {member.profileImageUrl ? (
                            <img
                              src={member.profileImageUrl}
                              alt={member.name || "Avatar"}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-[#5a8f6f] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {member.name?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-[#2d5f3f] font-medium">{member.name || member.email}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData(prev => ({
                                ...prev,
                                assignedUsers: prev.assignedUsers.filter(id => id !== member._id)
                              }))
                            }
                            className="text-[#7a8b7f] hover:text-red-500"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#dfe8e1] bg-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#7a8b7f]">Planning & média</p>
                  <p className="text-sm text-[#99aca2]">Dates et visuel de couverture</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#7a8b7f] mb-1">Date de début *</p>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029]"
                      required
                    />
                </div>
                <div>
                  <p className="text-xs text-[#7a8b7f] mb-1">Date de fin</p>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029]"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs text-[#7a8b7f] mb-2">Image de couverture</p>
                {coverImagePreview ? (
                  <div className="relative group">
                    <img
                      src={coverImagePreview}
                      alt="Aperçu"
                      className="w-full h-40 object-cover rounded-xl border border-[#dfe8e1]"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-[#f4f7f4]"
                    >
                      <FiX size={16} className="text-[#2d5f3f]" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-[#dfe8e1] rounded-xl cursor-pointer bg-[#fdfdfc] hover:bg-[#f4f7f4] text-sm text-[#7a8b7f]">
                    <FiUpload className="w-5 h-5 mb-1" />
                    Importer une image
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
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
            {loading ? "Création..." : "Créer le projet"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
