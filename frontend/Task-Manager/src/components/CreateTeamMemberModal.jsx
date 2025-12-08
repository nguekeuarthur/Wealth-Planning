import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FiSearch, FiX, FiUser, FiUserPlus } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const CreateTeamMemberModal = ({ isOpen, onClose, onClientCreated, editClient = null }) => { // eslint-disable-line no-unused-vars
  const [formData, setFormData] = useState({
    selectedUser: null,
    role: "member",
    company: "",
  });

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Liste des entreprises récupérée dynamiquement
  const [companies, setCompanies] = useState([]);
  const [companySearch, setCompanySearch] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const roles = [
    { value: "member", label: "Utilisateur" },
    { value: "project_lead", label: "Chef de projet" }
  ];

  // Charger les utilisateurs et clients disponibles
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingUsers(true);
        setLoadingCompanies(true);

        // Charger tous les utilisateurs (pour la recherche)
        const usersResponse = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
        const allUsers = usersResponse.data?.users || [];
        console.log("Utilisateurs chargés:", allUsers.slice(0, 3)); // Debug: voir la structure
        setUsers(allUsers);

        // Charger les entreprises via l'API dédiée
        const companiesResponse = await axiosInstance.get(API_PATHS.USERS.GET_COMPANIES);
        const companies = companiesResponse.data?.companies || [];
        setCompanies(companies);

      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoadingUsers(false);
        setLoadingCompanies(false);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.company-dropdown')) {
        setShowCompanyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectUser = (user) => {
    setFormData(prev => ({ ...prev, selectedUser: user }));
    setUserSearch("");
    setShowUserDropdown(false);
  };

  const handleRemoveUser = () => {
    setFormData(prev => ({ ...prev, selectedUser: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.selectedUser) {
      toast.error("Veuillez choisir un utilisateur inscrit");
      return;
    }

    setLoading(true);
    try {
      // Mettre à jour le rôle et l'entreprise de l'utilisateur
      const updateData = {
        role: formData.role,
        company: formData.company,
      };

      const response = await axiosInstance.put(
        API_PATHS.USERS.UPDATE_USER(formData.selectedUser._id),
        updateData
      );

      toast.success("Utilisateur ajouté avec succès !");
      onClientCreated(response.data.user || response.data);
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      toast.error(error.response?.data?.message || "Échec de l'ajout de l'utilisateur");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      selectedUser: null,
      role: "member",
      company: "",
    });
    setUserSearch("");
    setShowUserDropdown(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Ajouter un utilisateur"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Sélection de l'utilisateur */}
        <div>
          <label className="block text-sm font-semibold text-[#1e4029] mb-2">
            Choisir un utilisateur inscrit <span className="text-red-500">*</span>
          </label>

          {/* Utilisateur sélectionné */}
          {formData.selectedUser ? (
                <div className="flex items-center justify-between p-3 bg-[#f4f7f4] border border-[#dfe8e1] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#5a8f6f] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {formData.selectedUser.name?.charAt(0).toUpperCase() || formData.selectedUser.fullName?.charAt(0).toUpperCase() || formData.selectedUser.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1e4029]">
                    {formData.selectedUser.name || formData.selectedUser.fullName || formData.selectedUser.email || "Utilisateur"}
                  </div>
                  <div className="text-xs text-[#7a8b7f]">
                    {formData.selectedUser.email}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveUser}
                className="text-[#7a8b7f] hover:text-red-500 transition-colors p-1"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <>
              {/* Recherche d'utilisateur */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher parmi les utilisateurs inscrits..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setShowUserDropdown(true);
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
                />
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7a8b7f] w-5 h-5" />
              </div>

              {/* Dropdown des utilisateurs */}
              {showUserDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-[#dfe8e1] rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {loadingUsers ? (
                    <div className="px-4 py-3 text-sm text-[#7a8b7f] text-center">
                      Chargement...
                    </div>
                  ) : (
                    users
                      .filter(u =>
                        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.fullName?.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.email?.toLowerCase().includes(userSearch.toLowerCase())
                      )
                      .slice(0, 10)
                      .map((user) => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => handleSelectUser(user)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f4f7f4] transition-colors text-left"
                        >
                          <div className="w-8 h-8 bg-[#5a8f6f] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {user.name?.charAt(0).toUpperCase() || user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#1e4029]">
                              {user.name || user.fullName || user.email || "Utilisateur"}
                            </div>
                            <div className="text-xs text-[#7a8b7f]">
                              {user.email}
                            </div>
                            {/* Debug temporaire */}
                            {console.log("User data:", { name: user.name, fullName: user.fullName, email: user.email, firstName: user.firstName, lastName: user.lastName })}
                          </div>
                        </button>
                      ))
                  )}
                  {!loadingUsers && users.filter(u =>
                    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                    u.fullName?.toLowerCase().includes(userSearch.toLowerCase()) ||
                    u.email?.toLowerCase().includes(userSearch.toLowerCase())
                  ).length === 0 && userSearch && (
                    <div className="px-4 py-3 text-sm text-[#7a8b7f] text-center">
                      Aucun utilisateur trouvé
                    </div>
                  )}
                </div>
              )}

              {/* Fermeture du dropdown au clic extérieur */}
              {showUserDropdown && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserDropdown(false)}
                />
              )}
            </>
          )}
        </div>

        {/* Rôle */}
        <div>
          <label className="block text-sm font-semibold text-[#1e4029] mb-2">
            Rôle dans l'équipe
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all appearance-none cursor-pointer text-sm text-[#1e4029]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237a8b7f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 1rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "3rem"
            }}
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>


        {/* Entreprise cliente */}
        <div className="relative company-dropdown">
          <label className="block text-sm font-semibold text-[#1e4029] mb-2">
            Entreprise cliente
          </label>
          <div className="relative">
            <input
              type="text"
              value={companySearch}
              onChange={(e) => {
                setCompanySearch(e.target.value);
                setFormData(prev => ({ ...prev, company: e.target.value }));
                setShowCompanyDropdown(true);
              }}
              onFocus={() => setShowCompanyDropdown(true)}
              placeholder="Tapez le nom de l'entreprise..."
              className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-all text-[#1e4029] placeholder-[#7a8b7f]"
            />

            {/* Dropdown des suggestions */}
            {showCompanyDropdown && (companySearch || companies.length > 0) && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-[#dfe8e1] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {loadingCompanies ? (
                  <div className="px-4 py-3 text-sm text-[#7a8b7f]">Chargement...</div>
                ) : (
                  <>
                    {/* Suggestions filtrées */}
                    {companies
                      .filter(company =>
                        company.name.toLowerCase().includes(companySearch.toLowerCase())
                      )
                      .map((company) => (
                        <div
                          key={company.name}
                          className="px-4 py-3 hover:bg-[#f4f7f4] cursor-pointer border-b border-[#f4f7f4] last:border-b-0"
                          onClick={() => {
                            setCompanySearch(company.name);
                            setFormData(prev => ({ ...prev, company: company.name }));
                            setShowCompanyDropdown(false);
                          }}
                        >
                          <div className="font-medium text-[#1e4029]">{company.name}</div>
                          <div className="text-xs text-[#7a8b7f]">{company.count} employé{company.count > 1 ? 's' : ''}</div>
                        </div>
                      ))}

                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-[#dfe8e1]">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-sm font-medium text-[#7a8b7f] bg-[#f4f7f4] rounded-xl hover:bg-[#e6f0ea] transition-colors"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#2d5f3f] rounded-xl hover:bg-[#1e4029] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Ajout en cours..." : "Ajouter à l'équipe"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTeamMemberModal;
