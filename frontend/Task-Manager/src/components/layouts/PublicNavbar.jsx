import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaGlobe } from "react-icons/fa";

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const [currentLang, setCurrentLang] = React.useState("FR");
  const location = useLocation();

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "À propos", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-[#e8e8e8] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-start gap-2">
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
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-light transition-colors tracking-wide ${
                  isActive(link.path)
                    ? "text-[#2d5f3f]"
                    : "text-gray-700 hover:text-[#2d5f3f]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 text-sm font-light text-gray-700 hover:text-[#2d5f3f] transition-colors"
              >
                <FaGlobe className="text-base" />
                <span>{currentLang}</span>
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {["FR", "EN", "DE", "IT"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setCurrentLang(lang);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-light transition-colors ${
                        currentLang === lang
                          ? "bg-[#2d5f3f] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {lang === "FR" && "Français"}
                      {lang === "EN" && "English"}
                      {lang === "DE" && "Deutsch"}
                      {lang === "IT" && "Italiano"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Link
              to="/connexion"
              className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-[#2d5f3f] hover:text-[#2d5f3f] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 text-2xl focus:outline-none"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-300">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-light py-2 transition-colors ${
                  isActive(link.path)
                    ? "text-[#2d5f3f]"
                    : "text-gray-700 hover:text-[#2d5f3f]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* Language Selector Mobile */}
            <div className="border-t border-gray-300 pt-4 mt-4">
              <p className="text-xs text-gray-500 font-light mb-2">Langue</p>
              <div className="grid grid-cols-4 gap-2">
                {["FR", "EN", "DE", "IT"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setCurrentLang(lang);
                    }}
                    className={`px-3 py-2 rounded text-sm font-light transition-colors ${
                      currentLang === lang
                        ? "bg-[#2d5f3f] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            
            <Link
              to="/connexion"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 text-[#2d5f3f] py-2 font-light"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Connexion
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
