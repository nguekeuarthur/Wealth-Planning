import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu, fullWidth = false }) => {
  const { user } = useContext(UserContext);

  return (
    <div className={fullWidth ? "flex h-screen bg-gray-50" : ""}>
      <SideMenu activeMenu={activeMenu} />

      {fullWidth ? (
        user && children
      ) : (
        <div className="pl-64 pt-0">
          {user && (
            <div className="grow mx-8">{children}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
