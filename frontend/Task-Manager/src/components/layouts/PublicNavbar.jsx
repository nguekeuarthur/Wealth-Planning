import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
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
          <Link to="/" className="flex flex-col">
            <div className="flex items-center">
              <span className="text-[#2d5f3f] text-lg font-light tracking-[0.15em] leading-tight">GENEVA</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#2d5f3f] text-[15px] font-light tracking-[0.2em] leading-tight mr-2">WEALTH</span>
              <span className="text-[#2d5f3f] text-[10px] font-light tracking-[0.15em] border-l border-[#2d5f3f] pl-2 leading-tight">WEALTH<br/>PLANNING</span>
            </div>
            <span className="text-[#2d5f3f] text-[10px] font-light tracking-[0.3em] leading-tight">PARTNERS</span>
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
