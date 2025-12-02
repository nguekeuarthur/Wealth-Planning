import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="">
      <SideMenu activeMenu={activeMenu} />

      <div className="pl-64 pt-0">

      {user && (
        <div className="grow mx-8">{children}</div>
      )}
    </div>
    </div>
  );
};

export default DashboardLayout;
