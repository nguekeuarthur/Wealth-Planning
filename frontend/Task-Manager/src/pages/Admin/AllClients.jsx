import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { FiSearch, FiMail, FiPhone, FiUser, FiPlus, FiEdit2, FiTrash2, FiGlobe, FiUsers } from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";
import toast from "react-hot-toast";
import CreateClientModal from "../../components/CreateClientModal";

const brandPalette = {
  primary: "#1e4029",
  secondary: "#2d5f3f",
  accent: "#5a8f6f",
  soft: "#f4f7f4",
  border: "#dfe8e1",
  muted: "#7a8b7f",
};

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

  // Industries/Sectors available
  const industries = [
    "All Industries",
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

  const getAllClients = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.CLIENTS.GET_ALL_CLIENTS);
      console.log("API Response:", response.data);
      
      const clients = response.data?.clients || [];
      
      console.log(`Loaded ${clients.length} clients`);
      setAllClients(clients);
      setFilteredClients(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllClients();
  }, []);

  useEffect(() => {
    let filtered = allClients;

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((client) =>
        client.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.website?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by industry
    if (selectedIndustry !== "all" && selectedIndustry !== "All Industries") {
      filtered = filtered.filter(
        (client) => client.industry?.toUpperCase() === selectedIndustry.toUpperCase()
      );
    }

    setFilteredClients(filtered);
  }, [searchQuery, selectedIndustry, allClients]);

  // Group clients by industry
  const groupedClients = filteredClients.reduce((acc, client) => {
    const industry = client.industry?.toUpperCase() || "OTHER";
    if (!acc[industry]) {
      acc[industry] = [];
    }
    acc[industry].push(client);
    return acc;
  }, {});

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

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm("Are you sure you want to delete this client?")) {
      return;
    }

    try {
      setDeletingClient(clientId);
      await axiosInstance.delete(API_PATHS.CLIENTS.DELETE_CLIENT(clientId));
      toast.success("Client deleted successfully");
      getAllClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    } finally {
      setDeletingClient(null);
    }
  };

  const handleClientCreated = () => {
    getAllClients();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading clients...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Clients">
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
              Gestion des clients
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Tous les clients
            </h1>
            <p className="text-white/80 mt-2">
              Gérez votre portefeuille client et suivez vos relations commerciales
            </p>
            <p className="text-white/60 mt-1 text-sm">
              {allClients.length} client{allClients.length !== 1 ? 's' : ''} au total
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
              Nouveau client
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
                placeholder="Rechercher par nom, entreprise, site web, email ou secteur..."
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
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clients Display by Industry */}
        {Object.keys(groupedClients).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedClients).map(([industry, clients]) => (
              <div key={industry}>
                {/* Industry Header */}
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold text-[#1e4029]">
                    {industry}
                  </h2>
                  <span className="text-sm text-[#7a8b7f]">
                    ({clients.length} client{clients.length !== 1 ? 's' : ''})
                  </span>
                </div>

                {/* Clients Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {clients.map((client) => (
                    <div
                      key={client._id}
                      onClick={() => navigate(`/admin/client/${client._id}`)}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#dfe8e1] overflow-hidden cursor-pointer group hover:border-[#5a8f6f]/30"
                    >
                      {/* Logo/Image Section */}
                      <div className="h-32 bg-gradient-to-br from-[#f4f7f4] to-[#e8f0e8] flex items-center justify-center p-4 group-hover:from-[#e6f0ea] group-hover:to-[#e6f0ea] transition-colors">
                        {client.logoUrl && client.logoUrl.trim() !== "" ? (
                          <>
                            <img
                              src={client.logoUrl}
                              alt={client.companyName}
                              className="max-h-20 max-w-full object-contain"
                              style={{ display: 'block' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const fallback = e.target.parentElement.querySelector('.fallback-avatar');
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="fallback-avatar w-20 h-20 rounded-xl bg-gradient-to-br from-[#5a8f6f] to-[#2d5f3f] items-center justify-center shadow-md" style={{ display: 'none' }}>
                              <LuBuilding2 className="w-10 h-10 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#5a8f6f] to-[#2d5f3f] flex items-center justify-center shadow-md">
                            <LuBuilding2 className="w-10 h-10 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Client Info Section */}
                      <div className="p-5">
                        {/* Client Name/Company */}
                        <div className="mb-3">
                          <h3 className="font-bold text-[#1e4029] text-lg mb-1 line-clamp-2 min-h-[3.5rem] group-hover:text-[#2d5f3f] transition-colors">
                            {client.companyName || "Sans nom"}
                          </h3>

                          {/* Industry Badge */}
                          {client.industry && (
                            <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold border ${getIndustryColor(client.industry.toUpperCase())}`}>
                              {client.industry}
                            </span>
                          )}
                        </div>

                        {/* Website Link */}
                        {client.website && (
                          <a
                            href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-sm text-[#2d5f3f] hover:text-[#1e4029] font-medium mb-3 hover:underline transition-colors"
                          >
                            <FiGlobe className="w-4 h-4" />
                            <span className="truncate">{client.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                          </a>
                        )}

                        {/* Contact Details */}
                        <div className="space-y-2 pt-3 border-t border-[#dfe8e1]">
                          <div className="flex items-center gap-2 text-sm text-[#7a8b7f]">
                            <FiMail className="text-[#7a8b7f] flex-shrink-0" size={14} />
                            <span className="truncate">{client.email}</span>
                          </div>

                          {client.phoneNumber && (
                            <div className="flex items-center gap-2 text-sm text-[#7a8b7f]">
                              <FiPhone className="text-[#7a8b7f] flex-shrink-0" size={14} />
                              <span>{client.phoneNumber}</span>
                            </div>
                          )}

                          {client.contactName && (
                            <div className="flex items-center gap-2 text-sm text-[#7a8b7f]">
                              <FiUser className="text-[#7a8b7f] flex-shrink-0" size={14} />
                              <span className="truncate">{client.contactName}</span>
                            </div>
                          )}
                        </div>

                        {/* Projects Count */}
                        {client.projects && client.projects.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-[#dfe8e1]">
                            <div className="flex items-center justify-between text-xs text-[#7a8b7f]">
                              <span>Projets</span>
                              <span className="font-semibold text-[#2d5f3f]">
                                {client.projects.length}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 pt-3 border-t border-[#dfe8e1]">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClient(client);
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#e6f0ea] text-[#2d5f3f] rounded-lg hover:bg-[#e6f0ea]/80 transition-colors text-sm font-medium"
                            >
                              <FiEdit2 size={14} />
                              Modifier
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClient(client._id);
                              }}
                              disabled={deletingClient === client._id}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiTrash2 size={14} />
                              {deletingClient === client._id ? "..." : "Supprimer"}
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
          // Empty State
          <div className="text-center py-16 bg-white border border-[#dfe8e1] rounded-2xl">
            <div className="p-6 bg-[#f4f7f4] rounded-2xl mb-6 w-fit mx-auto">
              <FiUsers className="text-[#5a8f6f] text-6xl" />
            </div>
            <h3 className="text-xl font-medium text-[#1e4029] mb-2">
              {searchQuery || selectedIndustry !== "all" ? "Aucun client trouvé" : "Aucun client pour le moment"}
            </h3>
            <p className="text-[#7a8b7f] mb-6">
              {searchQuery || selectedIndustry !== "all"
                ? "Essayez d'ajuster votre recherche ou votre filtre"
                : "Commencez par ajouter votre premier client"}
            </p>
            {!searchQuery && selectedIndustry === "all" && (
              <button
                onClick={handleAddClient}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] transition-colors font-medium"
              >
                <FiPlus className="w-5 h-5" />
                Ajouter votre premier client
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Client Modal */}
      <CreateClientModal
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
