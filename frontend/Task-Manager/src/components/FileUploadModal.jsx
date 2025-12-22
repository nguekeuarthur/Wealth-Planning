import React, { useState, useRef } from 'react';
import { FaTimes, FaCloudUploadAlt, FaFile, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useLanguage } from '../context/languageContext';
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const FileUploadModal = ({ isOpen, onClose, onUploadSuccess, projectId }) => {
  const { lang } = useLanguage();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const content = {
    FR: {
      title: 'Uploader un document',
      subtitle: 'Ajoutez un nouveau document à ce projet',
      dragDrop: 'Glissez-déposez votre fichier ici',
      or: 'ou',
      browse: 'Parcourir les fichiers',
      fileName: 'Nom du document',
      description: 'Description (optionnel)',
      upload: 'Uploader',
      cancel: 'Annuler',
      uploading: 'Upload en cours...',
      success: 'Document uploadé avec succès !',
      error: 'Erreur lors de l\'upload',
      fileSelected: 'Fichier sélectionné',
      maxSize: 'Taille maximale: 10MB',
      allowedTypes: 'Types autorisés: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT',
      removeFile: 'Supprimer',
      noFileSelected: 'Aucun fichier sélectionné',
      nameRequired: 'Le nom du document est requis',
      fileRequired: 'Veuillez sélectionner un fichier'
    },
    EN: {
      title: 'Upload Document',
      subtitle: 'Add a new document to this project',
      dragDrop: 'Drag and drop your file here',
      or: 'or',
      browse: 'Browse files',
      fileName: 'Document name',
      description: 'Description (optional)',
      upload: 'Upload',
      cancel: 'Cancel',
      uploading: 'Uploading...',
      success: 'Document uploaded successfully!',
      error: 'Upload error',
      fileSelected: 'File selected',
      maxSize: 'Maximum size: 10MB',
      allowedTypes: 'Allowed types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT',
      removeFile: 'Remove',
      noFileSelected: 'No file selected',
      nameRequired: 'Document name is required',
      fileRequired: 'Please select a file'
    },
    DE: {
      title: 'Dokument hochladen',
      subtitle: 'Ein neues Dokument zu diesem Projekt hinzufügen',
      dragDrop: 'Ziehen Sie Ihre Datei hierher',
      or: 'oder',
      browse: 'Dateien durchsuchen',
      fileName: 'Dokumentname',
      description: 'Beschreibung (optional)',
      upload: 'Hochladen',
      cancel: 'Abbrechen',
      uploading: 'Wird hochgeladen...',
      success: 'Dokument erfolgreich hochgeladen!',
      error: 'Fehler beim Hochladen',
      fileSelected: 'Datei ausgewählt',
      maxSize: 'Maximale Größe: 10MB',
      allowedTypes: 'Zulässige Typen: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT',
      removeFile: 'Entfernen',
      noFileSelected: 'Keine Datei ausgewählt',
      nameRequired: 'Dokumentname ist erforderlich',
      fileRequired: 'Bitte wählen Sie eine Datei aus'
    },
    IT: {
      title: 'Carica Documento',
      subtitle: 'Aggiungi un nuovo documento a questo progetto',
      dragDrop: 'Trascina il tuo file qui',
      or: 'o',
      browse: 'Sfoglia file',
      fileName: 'Nome documento',
      description: 'Descrizione (opzionale)',
      upload: 'Carica',
      cancel: 'Annulla',
      uploading: 'Caricamento in corso...',
      success: 'Documento caricato con successo!',
      error: 'Errore durante il caricamento',
      fileSelected: 'File selezionato',
      maxSize: 'Dimensione massima: 10MB',
      allowedTypes: 'Tipi consentiti: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT',
      removeFile: 'Rimuovi',
      noFileSelected: 'Nessun file selezionato',
      nameRequired: 'Il nome del documento è richiesto',
      fileRequired: 'Seleziona un file'
    }
  };

  const copy = content[lang] || content.FR;

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'text/plain',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error('Type de fichier non autorisé');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      toast.error('Fichier trop volumineux (max 10MB)');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name.split('.')[0]); // Remove extension for default name
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileName('');
    setDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(copy.fileRequired);
      return;
    }

    if (!fileName.trim()) {
      toast.error(copy.nameRequired);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', fileName.trim());
      formData.append('description', description.trim());
      formData.append('project', projectId);

      // Simulate progress (since axios doesn't support progress for FormData easily)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD_DOCUMENT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success(copy.success);
      onUploadSuccess && onUploadSuccess(response.data.document);
      handleClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(copy.error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFileName('');
    setDescription('');
    setIsUploading(false);
    setUploadProgress(0);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📽️';
    if (fileType === 'text/plain') return '📄';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{copy.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{copy.subtitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* File Drop Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-[#2d5f3f] bg-[#f0f9f0]'
                : selectedFile
                ? 'border-[#2d5f3f] bg-[#f9fdf9]'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-4xl">{getFileIcon(selectedFile.type)}</div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title={copy.removeFile}
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
                <div className="text-sm text-green-600 font-medium flex items-center justify-center gap-2">
                  <FaCheckCircle />
                  {copy.fileSelected}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl text-gray-400">
                  <FaCloudUploadAlt />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">{copy.dragDrop}</p>
                  <p className="text-sm text-gray-500 mt-1">{copy.or}</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-[#2d5f3f] text-white rounded-lg hover:bg-[#1e4029] transition-colors font-medium"
                >
                  {copy.browse}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInputChange}
                  className="hidden"
                  accept={allowedTypes.join(',')}
                />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• {copy.maxSize}</p>
            <p>• {copy.allowedTypes}</p>
          </div>

          {/* Form Fields */}
          {selectedFile && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {copy.fileName}
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#2d5f3f] focus:ring-4 focus:ring-[#2d5f3f]/10"
                  placeholder={copy.fileName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {copy.description}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#2d5f3f] focus:ring-4 focus:ring-[#2d5f3f]/10 resize-none"
                  placeholder={copy.description}
                />
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{copy.uploading}</span>
                <span className="text-gray-500">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#2d5f3f] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copy.cancel}
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || !fileName.trim() || isUploading}
            className="px-5 py-2.5 bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg shadow-[#2d5f3f]/10"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{copy.uploading}</span>
              </>
            ) : (
              <>
                <FaCloudUploadAlt size={16} />
                <span>{copy.upload}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
