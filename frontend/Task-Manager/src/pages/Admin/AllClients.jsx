import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { FiSearch, FiMail, FiPhone, FiUser, FiPlus, FiEdit2, FiTrash2, FiGlobe } from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";
import toast from "react-hot-toast";
import CreateClientModal from "../../components/CreateClientModal";

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
    const colors = {
      "REAL ESTATE": "bg-blue-100 text-blue-700 border-blue-200",
      "LEGAL": "bg-purple-100 text-purple-700 border-purple-200",
      "AUTOMOTIVE": "bg-red-100 text-red-700 border-red-200",
      "FINANCE": "bg-green-100 text-green-700 border-green-200",
      "TECHNOLOGY": "bg-indigo-100 text-indigo-700 border-indigo-200",
      "HEALTHCARE": "bg-pink-100 text-pink-700 border-pink-200",
      "RETAIL": "bg-orange-100 text-orange-700 border-orange-200",
      "MANUFACTURING": "bg-gray-100 text-gray-700 border-gray-200",
      "CONSULTING": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "OTHER": "bg-slate-100 text-slate-700 border-slate-200"
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
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Clients</h1>
            <p className="text-sm text-gray-500 mt-1">{allClients.length} clients</p>
          </div>
          <button
            onClick={handleAddClient}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <FiPlus className="w-5 h-5" />
            Add client
          </button>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, company, website, email or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Industries</option>
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
                  <h2 className="text-xl font-semibold text-gray-800">
                    {industry}
                  </h2>
                  <span className="text-sm text-gray-500">
                    ({clients.length})
                  </span>
                </div>

                {/* Clients Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {clients.map((client) => (
                    <div
                      key={client._id}
                      onClick={() => navigate(`/admin/client/${client._id}`)}
                      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-200 overflow-hidden cursor-pointer group"
                    >
                      {/* Logo/Image Section */}
                      <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 group-hover:from-blue-50 group-hover:to-purple-50 transition-colors">
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
                            <div className="fallback-avatar w-20 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 items-center justify-center shadow-md" style={{ display: 'none' }}>
                              <LuBuilding2 className="w-10 h-10 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                            <LuBuilding2 className="w-10 h-10 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Client Info Section */}
                      <div className="p-5">
                        {/* Client Name/Company */}
                        <div className="mb-3">
                          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                            {client.companyName || "No Name"}
                          </h3>
                          
                          {/* Industry Badge */}
                          {client.industry && (
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getIndustryColor(client.industry.toUpperCase())}`}>
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
                            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium mb-3 hover:underline"
                          >
                            <FiGlobe className="w-4 h-4" />
                            <span className="truncate">{client.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                          </a>
                        )}

                        {/* Contact Details */}
                        <div className="space-y-2 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiMail className="text-gray-400 flex-shrink-0" size={14} />
                            <span className="truncate">{client.email}</span>
                          </div>
                          
                          {client.phoneNumber && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FiPhone className="text-gray-400 flex-shrink-0" size={14} />
                              <span>{client.phoneNumber}</span>
                            </div>
                          )}

                          {client.contactName && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FiUser className="text-gray-400 flex-shrink-0" size={14} />
                              <span className="truncate">{client.contactName}</span>
                            </div>
                          )}
                        </div>

                        {/* Projects Count */}
                        {client.projects && client.projects.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Projects</span>
                              <span className="font-semibold text-blue-600">
                                {client.projects.length}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClient(client);
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                            >
                              <FiEdit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClient(client._id);
                              }}
                              disabled={deletingClient === client._id}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiTrash2 size={14} />
                              {deletingClient === client._id ? "..." : "Delete"}
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
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <LuBuilding2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchQuery || selectedIndustry !== "all" ? "No clients found" : "No clients yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedIndustry !== "all"
                ? "Try adjusting your search or filter"
                : "Start by adding your first client"}
            </p>
            {!searchQuery && selectedIndustry === "all" && (
              <button
                onClick={handleAddClient}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <FiPlus className="w-5 h-5" />
                Add your first client
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
