import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaGlobe } from "react-icons/fa";
import { useLanguage } from "../../context/languageContext";

const translations = {
  FR: {
    links: {
      home: "Accueil",
      about: "À propos",
      services: "Services",
      contact: "Contact",
    },
    languageLabel: "Langue",
  },
  EN: {
    links: {
      home: "Home",
      about: "About",
      services: "Services",
      contact: "Contact",
    },
    languageLabel: "Language",
  },
  DE: {
    links: {
      home: "Startseite",
      about: "Über uns",
      services: "Dienstleistungen",
      contact: "Kontakt",
    },
    languageLabel: "Sprache",
  },
  IT: {
    links: {
      home: "Home",
      about: "Chi siamo",
      services: "Servizi",
      contact: "Contatto",
    },
    languageLabel: "Lingua",
  },
};

const languageOptions = [
  { code: "FR", label: "Français" },
  { code: "EN", label: "English" },
  { code: "DE", label: "Deutsch" },
  { code: "IT", label: "Italiano" },
];

const PublicNavbar = () => {
  const { lang: currentLang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const location = useLocation();

  const copy = translations[currentLang] ?? translations.FR;

  const navLinks = [
    { name: copy.links.home, path: "/" },
    { name: copy.links.about, path: "/about" },
    { name: copy.links.services, path: "/services" },
    { name: copy.links.contact, path: "/contact" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-[#e8e8e8] sticky top-0 z-50 relative">
      <div className="max-w-7xl mx-auto px-6 pr-0">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-start gap-2 -ml-2">
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
                WEALTH<br />PLANNING
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 absolute right-6 top-0 h-20">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-light transition-colors tracking-wide ${isActive(link.path)
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
                  {languageOptions.map((option) => (
                    <button
                      key={option.code}
                      onClick={() => {
                        setLang(option.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-light transition-colors ${currentLang === option.code
                          ? "bg-[#2d5f3f] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
                className={`block text-sm font-light py-2 transition-colors ${isActive(link.path)
                    ? "text-[#2d5f3f]"
                    : "text-gray-700 hover:text-[#2d5f3f]"
                  }`}
              >
                {link.name}
              </Link>
            ))}
            {/* Language Selector Mobile */}
            <div className="border-t border-gray-300 pt-4 mt-4">
              <p className="text-xs text-gray-500 font-light mb-2">{copy.languageLabel}</p>
              <div className="grid grid-cols-2 gap-2">
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => {
                      setLang(option.code);
                    }}
                    className={`px-3 py-2 rounded text-sm font-light transition-colors ${currentLang === option.code
                        ? "bg-[#2d5f3f] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {option.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
