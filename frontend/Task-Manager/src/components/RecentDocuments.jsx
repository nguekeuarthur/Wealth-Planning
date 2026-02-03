import React from 'react';
import { FaFile, FaClock, FaUser, FaProjectDiagram, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt } from 'react-icons/fa';
import moment from 'moment';

const RecentDocuments = ({ documents = [] }) => {
  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase();
    if (type?.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (type?.includes('word') || type?.includes('doc')) return <FaFileWord className="text-blue-500" />;
    if (type?.includes('excel') || type?.includes('sheet')) return <FaFileExcel className="text-green-500" />;
    if (type?.includes('image') || type?.includes('png') || type?.includes('jpg')) return <FaFileImage className="text-purple-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <FaFile className="text-5xl text-gray-300 mx-auto mb-4" />
        <p className="text-sm text-gray-500">Aucun document récent</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200 shadow-sm">
              {getFileIcon(doc.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h6 className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors" title={doc.name}>
                {doc.name}
              </h6>
              
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <FaClock className="text-xs" />
                  {moment(doc.uploadDate).fromNow()}
                </p>
                
                {doc.clientName && (
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <FaUser className="text-xs text-blue-500" />
                    {doc.clientName}
                  </p>
                )}
                
                {doc.projectName && (
                  <p className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full w-fit flex items-center gap-1">
                    <FaProjectDiagram className="text-xs" />
                    {doc.projectName}
                  </p>
                )}
              </div>
              
              <div className="mt-3">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {doc.type || 'Document'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentDocuments;
