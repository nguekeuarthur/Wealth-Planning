import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { FaClock, FaUser, FaProjectDiagram, FaFlag } from 'react-icons/fa';

const PendingTasksList = ({ tasks = [] }) => {
  const navigate = useNavigate();
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <FaClock className="text-5xl text-gray-300 mx-auto mb-4" />
        <p className="text-sm text-gray-500">Aucune tâche en attente</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nom Tâche</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date Entrée</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date Fin</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Client</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Projet</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Statut</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Priorité</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Progression</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr 
              key={task.taskId} 
              className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
              onClick={() => navigate(`/user/task-details/${task.taskId}`)}
            >
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="text-xs font-mono font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  #{String(task.taskId).slice(-6)}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm font-semibold text-gray-900">{task.taskName}</div>
              </td>
              <td className="px-4 py-4">
                <div className="text-xs text-gray-600 max-w-xs truncate" title={task.taskDescription}>
                  {task.taskDescription || 'N/A'}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <FaClock className="text-gray-400" />
                  {moment(task.entryDate).format('DD/MM/YYYY')}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <FaClock className="text-red-400" />
                  {moment(task.dueDate).format('DD/MM/YYYY')}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-500 text-xs" />
                  <span className="text-xs font-medium text-gray-700">{task.clientName}</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <FaProjectDiagram className="text-purple-500 text-xs" />
                  <span className="text-xs font-medium text-gray-700">{task.projectName}</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 w-fit ${getPriorityColor(task.priority)}`}>
                  <FaFlag className="text-xs" />
                  {task.priority}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${task.progress || 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">{task.progress || 0}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingTasksList;
