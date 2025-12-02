import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="">
      <Navbar activeMenu={activeMenu} />
      <SideMenu activeMenu={activeMenu} />

      <div className="pt-20 pl-64">

      {user && (
        <div className="grow mx-8 mt-6">{children}</div>
      )}
    </div>
    </div>
  );
};

export default DashboardLayout;
