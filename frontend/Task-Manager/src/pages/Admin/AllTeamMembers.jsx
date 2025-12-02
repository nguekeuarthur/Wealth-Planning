import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  FiSearch, FiMail, FiPhone, FiUser, FiPlus,
  FiEdit3, FiTrash2, FiExternalLink
} from "react-icons/fi";
import toast from "react-hot-toast";
import CreateTeamMemberModal from "../../components/CreateTeamMemberModal";

const AllClients = () => {
  const navigate = useNavigate();
  const [allClients, setAllClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);

  const industries = [
    "All Industries", "REAL ESTATE", "LEGAL", "AUTOMOTIVE", "FINANCE", 
    "TECHNOLOGY", "HEALTHCARE", "RETAIL", "MANUFACTURING", "CONSULTING", "OTHER"
  ];

  const getAllClients = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      const users = response.data?.users || [];
      setAllClients(users);
      setFilteredClients(users);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients :", error);
      toast.error("Échec du chargement des clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllClients();
  }, []);

  useEffect(() => {
    let filtered = allClients;

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((client) =>
        client.name?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.company?.toLowerCase().includes(query) ||
        client.website?.toLowerCase().includes(query) ||
        client.industry?.toLowerCase().includes(query)
      );
    }

    if (selectedIndustry !== "all" && selectedIndustry !== "All Industries") {
      filtered = filtered.filter(
        (client) => client.industry?.toUpperCase() === selectedIndustry.toUpperCase()
      );
    }

    setFilteredClients(filtered);
  }, [searchQuery, selectedIndustry, allClients]);

  const groupedClients = filteredClients.reduce((acc, client) => {
    const industry = client.industry?.toUpperCase() || "OTHER";
    if (!acc[industry]) acc[industry] = [];
    acc[industry].push(client);
    return acc;
  }, {});

  // Palette de couleurs harmonisée avec le thème vert du site
  const getIndustryColor = (industry) => {
    // Utilise des variations de la palette verte pour différencier les industries
    const colors = {
      "REAL ESTATE": "bg-[#f4f7f4] text-[#1e4029] border-[#dfe8e1]",
      "LEGAL": "bg-[#e6f0ea] text-[#2d5f3f] border-[#dfe8e1]",
      "AUTOMOTIVE": "bg-[#f4f7f4] text-[#1e4029] border-[#dfe8e1]",
      "FINANCE": "bg-[#dff5e7] text-[#1e4029] border-[#dfe8e1]",
      "TECHNOLOGY": "bg-[#e6f0ea] text-[#2d5f3f] border-[#dfe8e1]",
      "HEALTHCARE": "bg-[#f4f7f4] text-[#1e4029] border-[#dfe8e1]",
      "RETAIL": "bg-[#e6f0ea] text-[#2d5f3f] border-[#dfe8e1]",
      "MANUFACTURING": "bg-[#f4f7f4] text-[#1e4029] border-[#dfe8e1]",
      "CONSULTING": "bg-[#dff5e7] text-[#1e4029] border-[#dfe8e1]",
      "OTHER": "bg-[#f4f7f4] text-[#7a8b7f] border-[#dfe8e1]"
    };
    return colors[industry] || colors["OTHER"];
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleClientCreated = (newClient) => {
    if (editingClient) {
      setAllClients(allClients.map(c => c._id === newClient._id ? newClient : c));
      setFilteredClients(filteredClients.map(c => c._id === newClient._id ? newClient : c));
    } else {
      setAllClients([newClient, ...allClients]);
      setFilteredClients([newClient, ...filteredClients]);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm("Êtes-vous sûr ? Cette action ne peut pas être annulée.")) return;
    try {
      setDeletingClient(clientId);
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(clientId));
      setAllClients(allClients.filter(c => c._id !== clientId));
      setFilteredClients(filteredClients.filter(c => c._id !== clientId));
      toast.success("Client supprimé avec succès");
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la suppression");
    } finally {
      setDeletingClient(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Team">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a8f6f]"></div>
          <p className="mt-4 text-[#2d5f3f] font-medium">Chargement de l'équipe...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Team">
      {/* Header Section with Enhanced Design */}
      <div className="relative bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] rounded-2xl shadow-xl p-8 my-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Title Section */}
          <div className="flex-1">
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
              Gestion de l'équipe
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Membres de l'équipe
            </h1>
            <p className="text-white/80 mt-2">
              Gérez et suivez tous les membres de votre équipe
            </p>
            <p className="text-white/60 mt-1 text-sm">
              {filteredClients.length} membre{filteredClients.length !== 1 ? 's' : ''} dans l'équipe
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <button
              onClick={handleAddClient}
              className="group bg-[#5a8f6f]/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-300 text-sm font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl hover:bg-[#5a8f6f] hover:scale-105 border border-white/10"
            >
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <FiPlus className="text-lg" />
              </div>
              Nouveau membre
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7a8b7f]" />
              <input
                type="text"
                placeholder="Rechercher par nom, entreprise ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] transition-colors"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] focus:border-[#5a8f6f] cursor-pointer transition-colors"
            >
              <option value="all">Tous les secteurs</option>
              {industries.slice(1).map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clients Grid */}
        {Object.keys(groupedClients).length > 0 ? (
          <div className="space-y-10">
            {Object.entries(groupedClients).map(([industry, clients]) => (
              <div key={industry} className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-5 border-b border-[#dfe8e1] pb-2">
                  <h2 className="text-lg font-bold text-[#1e4029] tracking-wide uppercase">
                    {industry === 'OTHER' ? 'AUTRES' : industry}
                  </h2>
                  <span className="bg-[#f4f7f4] text-[#7a8b7f] text-xs px-2.5 py-0.5 rounded-full font-medium">
                    {clients.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {clients.map((client) => (
                    <div
                      key={client._id}
                      onClick={() => navigate(`/admin/team/${client._id}`)}
                      className="group bg-white rounded-2xl border border-[#dfe8e1] hover:border-[#5a8f6f] hover:shadow-xl hover:shadow-[#5a8f6f]/5 transition-all duration-300 cursor-pointer overflow-hidden relative h-64"
                    >
                      {/* Decorative Top Gradient */}
                      <div className="h-16 bg-gradient-to-br from-[#f4f7f4] via-[#e8f0e8] to-white opacity-80 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Avatar/Logo - Floating Effect */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-14 h-14 rounded-xl bg-white p-1 shadow-md border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                           {client.logoUrl && client.logoUrl.trim() !== "" ? (
                              <img
                                src={client.logoUrl}
                                alt={client.company}
                                className="w-full h-full object-contain rounded-lg"
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                              />
                           ) : null}
                           <div className={`w-full h-full rounded-lg bg-gradient-to-br from-[#5a8f6f] to-[#2d5f3f] flex items-center justify-center ${client.logoUrl ? 'hidden' : 'flex'}`}>
                              <span className="text-white text-xl font-bold shadow-sm">
                                {(client.company || client.name)?.charAt(0).toUpperCase() || "C"}
                              </span>
                           </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 pt-2 px-4 pb-4 h-48 overflow-hidden">
                        <div className="mt-8 mb-3">
                          <div className="flex justify-between items-start">
                             <h3 className="font-bold text-[#1e4029] text-base leading-tight group-hover:text-[#2d5f3f] transition-colors line-clamp-1">
                               {client.company || client.name || "Membre sans nom"}
                             </h3>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                             {client.industry && (
                               <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getIndustryColor(client.industry.toUpperCase())}`}>
                                 {client.industry}
                               </span>
                             )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm text-[#7a8b7f] mb-4 flex-grow">
                          {client.website && (
                            <div className="flex items-center gap-2 group/link">
                              <FiExternalLink className="text-[#7a8b7f] group-hover/link:text-[#2d5f3f]" />
                              <a
                                href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="hover:text-[#2d5f3f] truncate hover:underline decoration-[#5a8f6f] underline-offset-2 transition-colors"
                              >
                                {client.website.replace(/^https?:\/\//, '')}
                              </a>
                            </div>
                          )}
                          {client.email && (
                            <div className="flex items-center gap-2">
                              <FiMail className="text-[#7a8b7f] flex-shrink-0" />
                              <span className="truncate">{client.email}</span>
                            </div>
                          )}
                          {client.phoneNumber && (
                            <div className="flex items-center gap-2">
                              <FiPhone className="text-[#7a8b7f] flex-shrink-0" />
                              <span className="truncate">{client.phoneNumber}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Footer */}
                        <div className="pt-3 border-t border-gray-50 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-gray-400 font-medium">
                                Membre depuis {new Date(client.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric'})}
                            </span>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEditClient(client); }}
                                    className="p-2 rounded-lg text-[#2d5f3f] bg-[#e6f0ea] hover:bg-[#e6f0ea]/80 transition-colors"
                                    title="Modifier"
                                >
                                    <FiEdit3 size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteClient(client._id); }}
                                    disabled={deletingClient === client._id}
                                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    title="Supprimer"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white border border-[#dfe8e1] rounded-2xl">
            <div className="p-6 bg-[#f4f7f4] rounded-2xl mb-6 w-fit mx-auto">
              <FiUser className="text-[#5a8f6f] text-6xl" />
            </div>
            <h3 className="text-xl font-medium text-[#1e4029] mb-2">
              {searchQuery ? "Aucun membre trouvé" : "Aucun membre dans l'équipe"}
            </h3>
            <p className="text-[#7a8b7f] mb-6">
              {searchQuery
                ? "Essayez d'ajuster votre recherche"
                : "Commencez par ajouter votre premier membre d'équipe"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddClient}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-colors font-medium"
              >
                <FiPlus className="w-5 h-5" />
                Ajouter un membre
              </button>
            )}
          </div>
        )}
      </div>

      <CreateTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        onClientCreated={handleClientCreated}
        editClient={editingClient}
      />
    </DashboardLayout>
  );
};

export default AllClients;