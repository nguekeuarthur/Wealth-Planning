import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex gap-5 bg-white border boredr-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      {/* Logo Geneva Wealth Planning */}
      <div className="flex items-start gap-2">
        {/* Texte principal */}
        <div className="flex flex-col">
          <span className="text-[#2d5f3f] text-sm font-light tracking-[0.15em] leading-tight">GENEVA</span>
          <span className="text-[#2d5f3f] text-[13px] font-light tracking-[0.2em] leading-tight">WEALTH</span>
          <span className="text-[#2d5f3f] text-[9px] font-light tracking-[0.3em] leading-tight">PARTNERS</span>
        </div>
        
        {/* Barre verticale + Wealth Planning */}
        <div className="flex items-end h-full relative" style={{ height: '45px' }}>
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#2d5f3f]"></div>
          <span className="text-[#2d5f3f] text-[9px] font-light tracking-[0.15em] pl-2 leading-tight italic whitespace-nowrap">
            WEALTH<br/>PLANNING
          </span>
        </div>
      </div>

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
