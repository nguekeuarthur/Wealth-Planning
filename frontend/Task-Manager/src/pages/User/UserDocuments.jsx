import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { addThousandsSeparator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import { LuArrowRight, LuPlus, LuSearch, LuFilter, LuDownload, LuEye, LuTrash2, LuFileText, LuFile, LuImage } from "react-icons/lu";

const UserDocuments = () => {
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
                return <LuFileText className="text-red-500" />;
            case 'doc':
            case 'docx':
                return <LuFileText className="text-blue-500" />;
            case 'xls':
            case 'xlsx':
                return <LuFileText className="text-green-500" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <LuImage className="text-purple-500" />;
            default:
                return <LuFile className="text-gray-500" />;
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

    useEffect(() => {
        getDocuments();
        return () => { };
    }, []);

    return (
        <DashboardLayout activeMenu="Documents">
            <div className="card my-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl md:text-2xl">Documents</h2>
                        <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
                            Gérez tous vos documents en un seul endroit
                        </p>
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
                            className="btn-primary flex items-center gap-2 cursor-pointer"
                        >
                            <LuPlus className="text-lg" />
                            Ajouter des documents
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
                    <InfoCard
                        label="Total Documents"
                        value={addThousandsSeparator(Array.isArray(documents) ? documents.length : 0)}
                        color="bg-primary"
                    />

                    <InfoCard
                        label="PDF"
                        value={addThousandsSeparator(Array.isArray(documents) ? documents.filter(d => d.type === 'pdf').length : 0)}
                        color="bg-red-500"
                    />

                    <InfoCard
                        label="Images"
                        value={addThousandsSeparator(Array.isArray(documents) ? documents.filter(d => d.type === 'image').length : 0)}
                        color="bg-purple-500"
                    />

                    <InfoCard
                        label="Autres"
                        value={addThousandsSeparator(Array.isArray(documents) ? documents.filter(d => !['pdf', 'image'].includes(d.type)).length : 0)}
                        color="bg-gray-500"
                    />
                </div>
            </div>

            <div className="card my-4">
                <div className="flex items-center justify-between mb-6">
                    <h5 className="text-lg font-medium">Liste des Documents</h5>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un document..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
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
                                    <tr key={doc._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-xl">
                                                    {getFileIcon(doc.name)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{doc.name}</div>
                                                    <div className="text-sm text-gray-500">{doc.description}</div>
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
                                                <button className="text-blue-600 hover:text-blue-800 p-1" title="Visualiser">
                                                    <LuEye className="text-lg" />
                                                </button>
                                                <button className="text-green-600 hover:text-green-800 p-1" title="Télécharger">
                                                    <LuDownload className="text-lg" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-800 p-1" title="Supprimer">
                                                    <LuTrash2 className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredDocuments.length === 0 && !loading && (
                            <div className="text-center py-8 text-gray-500">
                                Aucun document trouvé
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserDocuments;
