import React, { useContext, useEffect, useState } from "react";
import { 
  SIDE_MENU_DATA, 
  SIDE_MENU_USER_DATA, 
  SIDE_MENU_CLIENT_DATA,
  SIDE_MENU_PARTNER_DATA,
  SIDE_MENU_COLLABORATOR_DATA 
} from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import ChangeProfilePhotoModal from "../ChangeProfilePhotoModal";

const SideMenu = ({ activeMenu }) => {
  const { user, logout, updateUser } = useContext(UserContext);
  const { unreadCount } = useNotifications();
  const [sideMenuData, setSideMenuData] = useState([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handelLogout();
      return;
    }

    navigate(route);
  };

  const handelLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    if(user){
      switch(user?.role) {
        case 'admin':
          setSideMenuData(SIDE_MENU_DATA);
          break;
        case 'client':
          setSideMenuData(SIDE_MENU_CLIENT_DATA);
          break;
        case 'partner':
          setSideMenuData(SIDE_MENU_PARTNER_DATA);
          break;
        case 'collaborator':
          setSideMenuData(SIDE_MENU_COLLABORATOR_DATA);
          break;
        default:
          setSideMenuData(SIDE_MENU_USER_DATA);
      }
    }
    return () => {};
  }, [user]);
  const handlePhotoUpdateSuccess = (newProfileImageUrl) => {
    if (updateUser) {
      updateUser({ profileImageUrl: newProfileImageUrl });
    }
  };

  return <div className="w-64 h-screen bg-white border-r border-gray-200/50 fixed top-0 left-0 z-20">
      <div className="flex flex-col items-center justify-center mb-6 pt-12">
        <div className="relative group">
          <img
            src={user?.profileImageUrl || null}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full cursor-pointer"
            onClick={() => setIsPhotoModalOpen(true)}
          />
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-600"
            title="Changer la photo de profil"
          >
            <FiEdit2 className="w-3 h-3" />
          </button>
        </div>

        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>

        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {sideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu == item.label
              ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
              : ""
          } py-3 px-6 mb-3 cursor-pointer relative`}
          onClick={() => handleClick(item.path)}
        >
          <div className="relative">
            <item.icon className="text-xl" />
            {/* Compteur de notifications pour l'élément "Notifications" - positionné sur l'icône */}
            {item.label === "Notifications" && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          <span>{item.label}</span>
        </button>
      ))}

      <ChangeProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentImage={user?.profileImageUrl}
        onSuccess={handlePhotoUpdateSuccess}
      />
    </div>;
};

export default SideMenu;
