import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FiX, FiSearch, FiUsers, FiUser, FiCheck } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const ManageProjectTeamsModal = ({ isOpen, onClose, project, onUpdate }) => {
  const [allTeams, setAllTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTeams();
      if (project?.teams) {
        setSelectedTeams(project.teams.map(team => team._id));
      }
    }
  }, [isOpen, project]);

  const fetchTeams = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TEAMS.GET_ALL_TEAMS);
      setAllTeams(response.data?.teams || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Erreur lors du chargement des équipes");
    }
  };

  const handleTeamToggle = (teamId) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axiosInstance.put(API_PATHS.PROJECTS.UPDATE_PROJECT(project._id), {
        teams: selectedTeams
      });
      toast.success("Équipes mises à jour avec succès");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating teams:", error);
      toast.error("Erreur lors de la mise à jour des équipes");
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = allTeams.filter(team =>
    team.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isTeamSelected = (teamId) => selectedTeams.includes(teamId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gérer les équipes du projet">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a8b7f] w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher une équipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#fdfdfc] border border-[#dfe8e1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a8f6f] text-sm text-[#1e4029] placeholder:text-[#7a8b7f]"
          />
        </div>

        {/* Teams List */}
        <div className="max-h-96 overflow-y-auto space-y-3">
          {filteredTeams.length === 0 ? (
            <div className="text-center py-8 text-[#7a8b7f]">
              <FiUsers className="mx-auto text-4xl mb-2 opacity-30" />
              <p>Aucune équipe trouvée</p>
            </div>
          ) : (
            filteredTeams.map((team) => (
              <div
                key={team._id}
                onClick={() => handleTeamToggle(team._id)}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  isTeamSelected(team._id)
                    ? "border-[#5a8f6f] bg-[#f4f7f4]"
                    : "border-[#dfe8e1] hover:border-[#5a8f6f]/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: team.color || "#5a8f6f" }}
                      >
                        <FiUsers />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1e4029]">{team.name}</h4>
                      </div>
                      {isTeamSelected(team._id) && (
                        <div className="ml-auto">
                          <div className="w-6 h-6 bg-[#5a8f6f] rounded-full flex items-center justify-center">
                            <FiCheck className="text-white text-xs" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Team Leader */}
                    {team.leader && (
                      <div className="ml-14 mb-2">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-[#7a8b7f] text-xs" />
                          <span className="text-xs text-[#7a8b7f]">Chef d'équipe:</span>
                          <span className="text-xs font-medium text-[#2d5f3f]">
                            {team.leader.name || team.leader.email}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Team Members */}
                    {team.members && team.members.length > 0 && (
                      <div className="ml-14">
                        <p className="text-xs text-[#7a8b7f] mb-1">
                          Membres ({team.members.length}):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {team.members.slice(0, 5).map((member, idx) => (
                            <div
                              key={member._id || idx}
                              className="px-2 py-1 bg-white border border-[#dfe8e1] rounded text-xs text-[#2d5f3f]"
                            >
                              {member.name || member.email}
                            </div>
                          ))}
                          {team.members.length > 5 && (
                            <div className="px-2 py-1 bg-white border border-[#dfe8e1] rounded text-xs text-[#7a8b7f]">
                              +{team.members.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#dfe8e1]">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm text-[#7a8b7f] bg-[#f4f7f4] rounded-xl hover:bg-[#e6f0ea] border border-[#dfe8e1]"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 text-sm bg-[#2d5f3f] text-white rounded-xl hover:bg-[#1e4029] font-medium shadow-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ManageProjectTeamsModal;

