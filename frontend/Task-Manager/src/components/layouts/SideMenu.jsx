import React, { useContext, useEffect, useState } from "react";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const SideMenu = ({ activeMenu }) => {
  const { user, logout } = useContext(UserContext);
  const { unreadCount } = useNotifications();
  const [sideMenuData, setSideMenuData] = useState([]);

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
      setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA)
    }
    return () => {};
  }, [user]);
  return <div className="w-64 h-screen bg-white border-r border-gray-200/50 fixed top-0 left-0 z-20">
      <div className="flex flex-col items-center justify-center mb-6 pt-12">
        <div className="relative">
          <img
            src={user?.profileImageUrl || null}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
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

      {sideMenuData.map((item, index) => {
        const isActive = activeMenu == item.label;
        return (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] ${
              isActive
                ? "text-[#1e4029] bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-4 border-[#1e4029] font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            } py-3 px-6 mb-3 cursor-pointer relative transition-all duration-200`}
            onClick={() => handleClick(item.path)}
          >
          <item.icon className={`text-xl ${isActive ? "text-[#1e4029] stroke-2" : ""}`} />
          <span>{item.label}</span>
          {/* Compteur de notifications pour l'élément "Notifications" */}
          {item.label === "Notifications" && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
        );
      })}
    </div>;
};

export default SideMenu;
