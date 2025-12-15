import React, { useEffect, useState } from "react";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      const users = response.data?.users || response.data || [];
      setAllUsers(Array.isArray(users) ? users : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => ({ url: user.profileImageUrl, name: user.name }));

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // initialize temp selection when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedUsers(Array.isArray(selectedUsers) ? selectedUsers : []);
    }
  }, [isModalOpen, selectedUsers]);

  const filteredUsers = allUsers.filter((user) => {
    if (roleFilter !== "all" && user.role !== roleFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (user.name || "").toLowerCase().includes(q) || (user.email || "").toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAvatars.length === 0 && (
        <button className="card-btn" onClick={() => setIsModalOpen(true)}>
          <LuUsers className="text-sm" /> Add Members
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sélectionner des utilisateurs">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="p-2 border rounded">
              <option value="all">Tous les rôles</option>
              <option value="collaborator">Collaborator</option>
              <option value="partner">Partner</option>
              <option value="member">Member</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredUsers.map((user) => (
              <div key={user._id} className="flex items-center gap-4 p-3 border-b border-gray-200">
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#5a8f6f] flex items-center justify-center text-white font-medium">{(user.name || user.email || "").charAt(0).toUpperCase()}</div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                  <p className="text-[13px] text-gray-500">{user.email} • <span className="text-xs">{user.role}</span></p>
                </div>

                <input type="checkbox" checked={tempSelectedUsers.includes(user._id)} onChange={() => toggleUserSelection(user._id)} className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none" />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button className="card-btn" onClick={() => setIsModalOpen(false)}>ANNULER</button>
            <button className="card-btn-fill" onClick={handleAssign}>AJOUTER</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
