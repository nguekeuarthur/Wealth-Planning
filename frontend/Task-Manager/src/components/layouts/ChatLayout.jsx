import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import SideMenu from "./SideMenu";

const ChatLayout = ({ children }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="flex h-screen bg-gray-50">
      <SideMenu activeMenu="Messagerie" />
      {user && children}
    </div>
  );
};

export default ChatLayout;
