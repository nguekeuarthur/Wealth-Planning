import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import 'moment/locale/fr';
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight, LuPlus, LuSearch, LuFilter, LuDownload, LuEye, LuTrash2, LuFileText, LuFile, LuImage, LuFolderOpen } from "react-icons/lu";
import {
    FaFileAlt,
    FaFilePdf,
    FaFileWord,
    FaFileExcel,
    FaFileImage,
} from "react-icons/fa";

moment.locale('fr');

const ClientDocuments = () => {
    useUserAuth();

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [selectedFiles, setSelectedFiles] = useState([]);

    const getDocuments = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_ALL_DOCUMENTS);
            if (response.data) {
                setDocuments(response.data);
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (fileName) => {
        const extension = fileName?.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FaFilePdf className="text-red-500 text-xl" />;
            case 'doc':
            case 'docx':
                return <FaFileWord className="text-blue-500 text-xl" />;
            case 'xls':
            case 'xlsx':
                return <FaFileExcel className="text-green-500 text-xl" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FaFileImage className="text-purple-500 text-xl" />;
            default:
                return <FaFileAlt className="text-gray-500 text-xl" />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const filteredDocuments = Array.isArray(documents) ? documents.filter(doc => {
        const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === "all" || doc.type === filterType;
        return matchesSearch && matchesFilter;
    }) : [];

    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (files.length === 0) return;

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('documents', file);
        });

        try {
            const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD_DOCUMENT, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                getDocuments(); // Refresh the documents list
            }
        } catch (error) {
            console.error("Error uploading documents:", error);
        }
    };

    const handleViewDocument = (doc) => {
        // Implement document viewing logic
        window.open(doc.url, '_blank');
    };

    const handleDownloadDocument = (doc) => {
        // Implement document download logic
        const link = document.createElement('a');
        link.href = doc.url;
        link.download = doc.name;
        link.click();
    };

    const handleDeleteDocument = async (docId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
            try {
                await axiosInstance.delete(`${API_PATHS.DOCUMENTS.DELETE_DOCUMENT}/${docId}`);
                getDocuments(); // Refresh the documents list
            } catch (error) {
                console.error("Error deleting document:", error);
            }
        }
    };

    useEffect(() => {
        getDocuments();
        return () => { };
    }, []);

    if (loading) {
        return (
            <DashboardLayout activeMenu="Documents">
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5f3f] mx-auto"></div>
                        <p className="mt-4 text-[#7a8b7f]">Chargement...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeMenu="Documents">
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] rounded-2xl shadow-xl p-8 my-6 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <LuFolderOpen className="text-white text-xl" />
                            </div>
                            <div>
                                <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
                                    Documents
                                </p>
                                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                                    Mes Documents
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-white/80">
                            <span className="inline-flex items-center gap-2 text-sm">
                                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                {Array.isArray(documents) ? documents.length : 0} documents
                            </span>
                            <span className="text-white/60">•</span>
                            <span className="text-sm font-medium">
                                {moment().format("dddd DD MMMM YYYY")}
                            </span>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-white/20 transition-all border border-white/20"
                        >
                            <LuPlus className="text-lg" />
                            Ajouter des documents
                        </label>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#7a8b7f] font-semibold mb-2">
                                Total Documents
                            </p>
                            <h3 className="text-3xl font-bold text-[#1e4029]">
                                {addThousandsSeparator(Array.isArray(documents) ? documents.length : 0)}
                            </h3>
                        </div>
                        <div className="p-3 rounded-xl bg-[#f0f5f1] text-[#2d5f3f] shadow-inner">
                            <FaFileAlt className="text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#7a8b7f] font-semibold mb-2">
                                PDF
                            </p>
                            <h3 className="text-3xl font-bold text-[#1e4029]">
                                {addThousandsSeparator(Array.isArray(documents) ? documents.filter(d => d.type === 'pdf').length : 0)}
                            </h3>
                        </div>
                        <div className="p-3 rounded-xl bg-[#f0f5f1] text-red-500 shadow-inner">
                            <FaFilePdf className="text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#7a8b7f] font-semibold mb-2">
                                Images
                            </p>
                            <h3 className="text-3xl font-bold text-[#1e4029]">
                                {addThousandsSeparator(Array.isArray(documents) ? documents.filter(d => d.type === 'image').length : 0)}
                            </h3>
                        </div>
                        <div className="p-3 rounded-xl bg-[#f0f5f1] text-purple-500 shadow-inner">
                            <FaFileImage className="text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#7a8b7f] font-semibold mb-2">
                                Autres
                            </p>
                            <h3 className="text-3xl font-bold text-[#1e4029]">
                                {addThousandsSeparator(Array.isArray(documents) ? documents.filter(d => !['pdf', 'image'].includes(d.type)).length : 0)}
                            </h3>
                        </div>
                        <div className="p-3 rounded-xl bg-[#f0f5f1] text-gray-500 shadow-inner">
                            <FaFileAlt className="text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Documents List */}
            <div className="bg-white border border-[#dfe8e1] rounded-2xl shadow-sm p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                    <div>
                        <p className="text-xs uppercase text-[#7a8b7f] tracking-[0.2em] mb-2">
                            Documents
                        </p>
                        <h3 className="text-xl font-bold text-[#1e4029]">
                            Liste des documents
                        </h3>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:flex-initial">
                            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un document..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5f3f] w-full lg:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">Tous les types</option>
                            <option value="pdf">PDF</option>
                            <option value="image">Images</option>
                            <option value="document">Documents</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Nom du fichier</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Taille</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Date d'ajout</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocuments.map((doc) => (
                                <tr key={doc._id} className="border-b border-gray-100 hover:bg-[#f4f7f4] transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-xl">
                                                {getFileIcon(doc.name)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{doc.name}</div>
                                                <div className="text-sm text-gray-500">{doc.description || 'Aucune description'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${doc.type === 'pdf' ? 'bg-red-100 text-red-800' :
                                            doc.type === 'image' ? 'bg-purple-100 text-purple-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {doc.type?.toUpperCase() || 'AUTRE'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {formatFileSize(doc.size)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {moment(doc.createdAt).format('DD/MM/YYYY HH:mm')}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                                                title="Visualiser"
                                                onClick={() => handleViewDocument(doc)}
                                            >
                                                <LuEye className="text-lg" />
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-800 p-1 transition-colors"
                                                title="Télécharger"
                                                onClick={() => handleDownloadDocument(doc)}
                                            >
                                                <LuDownload className="text-lg" />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800 p-1 transition-colors"
                                                title="Supprimer"
                                                onClick={() => handleDeleteDocument(doc._id)}
                                            >
                                                <LuTrash2 className="text-lg" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredDocuments.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <FaFileAlt className="text-6xl text-[#d5e2d5] mx-auto mb-4" />
                            <p className="text-[#7a8b7f] text-lg">Aucun document trouvé</p>
                            <p className="text-[#7a8b7f] text-sm mt-2">
                                {searchTerm || filterType !== "all"
                                    ? "Essayez de modifier votre recherche ou vos filtres"
                                    : "Commencez par ajouter des documents"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ClientDocuments;
