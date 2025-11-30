import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { FiSearch, FiMail, FiPhone, FiUser, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
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
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      console.log("API Response:", response.data);
      
      // Backend returns users with role 'member' only
      const users = response.data?.users || [];
      
      console.log(`Loaded ${users.length} clients`);
      setAllClients(users);
      setFilteredClients(users);
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
        client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      "CONSULTING": "bg-teal-100 text-teal-700 border-teal-200",
      "OTHER": "bg-gray-100 text-gray-600 border-gray-200"
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
      // Update existing client
      setAllClients(allClients.map(c => c._id === newClient._id ? newClient : c));
      setFilteredClients(filteredClients.map(c => c._id === newClient._id ? newClient : c));
    } else {
      // Add new client
      setAllClients([newClient, ...allClients]);
      setFilteredClients([newClient, ...filteredClients]);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingClient(clientId);
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(clientId));
      
      setAllClients(allClients.filter(c => c._id !== clientId));
      setFilteredClients(filteredClients.filter(c => c._id !== clientId));
      
      toast.success("Client deleted successfully");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error(error.response?.data?.message || "Failed to delete client");
    } finally {
      setDeletingClient(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Clients">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading clients...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Clients">
      <div className="my-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold">All Clients</h1>
            <div className="text-sm text-gray-600 mt-1">
              {filteredClients.length} {filteredClients.length === 1 ? "client" : "clients"}
            </div>
          </div>
          <button
            onClick={handleAddClient}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiPlus className="text-lg" />
            Add client
          </button>
        </div>

        {/* Filters Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search by name, company, website, email or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Industry Filter */}
          <div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
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
                      onClick={() => navigate(`/admin/team/${client._id}`)}
                      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-200 overflow-hidden cursor-pointer group"
                    >
                      {/* Logo/Image Section */}
                      <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 group-hover:from-blue-50 group-hover:to-purple-50 transition-colors">
                        {client.logoUrl && client.logoUrl.trim() !== "" ? (
                          <>
                            <img
                              src={client.logoUrl}
                              alt={client.company || client.name}
                              className="max-h-20 max-w-full object-contain"
                              style={{ display: 'block' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const fallback = e.target.parentElement.querySelector('.fallback-avatar');
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="fallback-avatar w-20 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 items-center justify-center shadow-md" style={{ display: 'none' }}>
                              <span className="text-white text-3xl font-bold">
                                {(client.company || client.name)?.charAt(0).toUpperCase() || "C"}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                            <span className="text-white text-3xl font-bold">
                              {(client.company || client.name)?.charAt(0).toUpperCase() || "C"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Client Info Section */}
                      <div className="p-5">
                        {/* Client Name/Company */}
                        <div className="mb-3">
                          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                            {client.company || client.name || "No Name"}
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
                            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium mb-3 hover:underline"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <span className="truncate">{client.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                          </a>
                        )}

                        {/* Contact Details */}
                        <div className="space-y-2 pt-3 border-t border-gray-100">
                          {client.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FiMail className="text-gray-400 flex-shrink-0" size={14} />
                              <span className="truncate">{client.email}</span>
                            </div>
                          )}
                          
                          {client.phoneNumber && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FiPhone className="text-gray-400 flex-shrink-0" size={14} />
                              <span>{client.phoneNumber}</span>
                            </div>
                          )}

                          {client.name && client.company && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FiUser className="text-gray-400 flex-shrink-0" size={14} />
                              <span className="truncate">{client.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions & Member Since */}
                        <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                          {/* Action Buttons */}
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
                          
                          {/* Member Since */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Member since</span>
                            <span className="font-medium text-gray-700">
                              {new Date(client.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
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
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchQuery || selectedIndustry !== "all" ? "No clients found" : "No clients yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedIndustry !== "all"
                ? "Try adjusting your search or filter"
                : "Clients will appear here once added to the system"}
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Client Modal */}
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
