import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { 
  FiSearch, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiFile,
  FiMoreVertical,
  FiDownload
} from "react-icons/fi";
import toast from "react-hot-toast";
import CreateContractModal from "../../components/CreateContractModal";

const AllContracts = () => {
  const navigate = useNavigate();
  const [allContracts, setAllContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [deletingContract, setDeletingContract] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const sortOptions = [
    { value: "name", label: "File name" },
    { value: "createdAt", label: "Created time" },
    { value: "project", label: "Project" }
  ];

  const statusColors = {
    "signed": "bg-blue-100 text-blue-700 border-blue-200",
    "pending": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "draft": "bg-gray-100 text-gray-700 border-gray-200",
    "expired": "bg-red-100 text-red-700 border-red-200"
  };

  const getAllContracts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_ALL_DOCUMENTS, {
        params: { type: "contract" }
      });
      console.log("API Response:", response.data);
      
      const contracts = response.data?.documents || [];
      
      console.log(`Loaded ${contracts.length} contracts`);
      setAllContracts(contracts);
      setFilteredContracts(contracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast.error("Failed to load contracts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllContracts();
  }, []);

  useEffect(() => {
    let filtered = allContracts;

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((contract) =>
        contract.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.project?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return a.name?.localeCompare(b.name);
      } else if (sortBy === "createdAt") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "project") {
        return (a.project?.name || "").localeCompare(b.project?.name || "");
      }
      return 0;
    });

    setFilteredContracts(filtered);
  }, [searchQuery, sortBy, allContracts]);

  const handleAddContract = () => {
    setEditingContract(null);
    setIsModalOpen(true);
  };

  const handleEditContract = (contract) => {
    setEditingContract(contract);
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDeleteContract = async (contractId) => {
    if (!window.confirm("Are you sure you want to delete this contract?")) {
      return;
    }

    try {
      setDeletingContract(contractId);
      await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(contractId));
      toast.success("Contract deleted successfully");
      getAllContracts();
    } catch (error) {
      console.error("Error deleting contract:", error);
      toast.error("Failed to delete contract");
    } finally {
      setDeletingContract(null);
      setOpenDropdown(null);
    }
  };

  const handleContractCreated = () => {
    getAllContracts();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileType) => {
    return <FiFile className="w-4 h-4" />;
  };

  const toggleDropdown = (contractId, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === contractId ? null : contractId);
  };

  const handleDownload = async (contract, e) => {
    e.stopPropagation();
    try {
      const response = await axiosInstance.get(contract.fileUrl, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', contract.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading contract:", error);
      toast.error("Failed to download contract");
    }
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdown) setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading contracts...</div>
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
            <h1 className="text-2xl font-bold text-gray-800">Contracts</h1>
            <p className="text-sm text-gray-500 mt-1">{allContracts.length} total contracts</p>
          </div>
          <button
            onClick={handleAddContract}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <FiPlus className="w-5 h-5" />
            Add contract
          </button>
        </div>

        {/* Search and Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contracts Table */}
        {filteredContracts.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredContracts.map((contract) => {
                    return (
                      <tr 
                        key={contract._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contract.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {contract.description || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {formatDate(contract.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                            {getFileIcon(contract.fileType)}
                            <span>Example file (4).docx</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors["signed"]}`}>
                            Signed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => toggleDropdown(contract._id, e)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              disabled={deletingContract === contract._id}
                            >
                              <FiMoreVertical className="w-5 h-5" />
                            </button>

                            {/* Dropdown Menu */}
                            {openDropdown === contract._id && (
                              <div 
                                className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditContract(contract);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteContract(contract._id);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  disabled={deletingContract === contract._id}
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <FiFile className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchQuery ? "No contracts found" : "No contracts yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Try adjusting your search"
                : "Start by creating your first contract"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddContract}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <FiPlus className="w-5 h-5" />
                Create your first contract
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Contract Modal */}
      <CreateContractModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContract(null);
        }}
        onContractCreated={handleContractCreated}
        editContract={editingContract}
      />
    </DashboardLayout>
  );
};

export default AllContracts;
