import React from 'react';
import moment from 'moment';
import { FaEnvelope, FaPaperclip, FaProjectDiagram, FaClock } from 'react-icons/fa';

const RecentDiscussions = ({ projectMessages = [], inboxMessages = [] }) => {
  return (
    <div className="space-y-6">
      {/* Messages sur les projets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h6 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FaProjectDiagram className="text-purple-500" />
            Messages sur les Projets (24h)
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold">
              {projectMessages.length}
            </span>
          </h6>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {projectMessages.length > 0 ? projectMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                msg.isRead 
                  ? 'bg-white border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow-md">
                      {msg.sender?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{msg.sender}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaClock className="text-xs" />
                        {moment(msg.sentAt).fromNow()}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">{msg.content}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {msg.projectName && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <FaProjectDiagram className="text-xs" />
                        {msg.projectName}
                      </span>
                    )}
                    {msg.projectCategory && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {msg.projectCategory}
                      </span>
                    )}
                    {msg.hasAttachments && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <FaPaperclip className="text-xs" />
                        Pièces jointes
                      </span>
                    )}
                  </div>
                </div>
                
                {!msg.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FaProjectDiagram className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Aucun message sur les projets</p>
            </div>
          )}
        </div>
      </div>

      {/* Messages inbox */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h6 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FaEnvelope className="text-blue-500" />
            Messagerie Inbox
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
              {inboxMessages.length}
            </span>
            {inboxMessages.filter(m => !m.isRead).length > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                {inboxMessages.filter(m => !m.isRead).length} non lu{inboxMessages.filter(m => !m.isRead).length > 1 ? 's' : ''}
              </span>
            )}
          </h6>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {inboxMessages.length > 0 ? inboxMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                msg.isRead 
                  ? 'bg-white border-gray-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs shadow-md">
                      {msg.sender?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{msg.sender}</p>
                      <p className="text-xs text-gray-500">{msg.senderEmail}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <FaClock className="text-xs" />
                        {moment(msg.sentAt).fromNow()}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">{msg.content}</p>
                  
                  {msg.hasAttachments && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit">
                      <FaPaperclip className="text-xs" />
                      Pièces jointes
                    </span>
                  )}
                </div>
                
                {!msg.isRead && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Aucun message dans la boîte de réception</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentDiscussions;
