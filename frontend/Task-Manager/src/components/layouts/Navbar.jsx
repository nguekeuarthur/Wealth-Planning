import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaGlobe, FaUser } from "react-icons/fa";
import { UserContext } from "../../context/userContext";
import { useLanguage } from "../../context/languageContext";
import SideMenu from "./SideMenu";

const translations = {
  FR: {
    dashboard: "Tableau de bord",
    projects: "Projets",
    clients: "Clients",
    contracts: "Contrats",
    invoices: "Factures",
    team: "Équipe",
    settings: "Paramètres",
    logout: "Déconnexion",
    languageLabel: "Langue",
  },
  EN: {
    dashboard: "Dashboard",
    projects: "Projects",
    clients: "Clients",
    contracts: "Contracts",
    invoices: "Factures",
    team: "Team",
    settings: "Settings",
    logout: "Logout",
    languageLabel: "Language",
  },
  DE: {
    dashboard: "Dashboard",
    projects: "Projekte",
    clients: "Kunden",
    contracts: "Verträge",
    invoices: "Rechnungen",
    team: "Team",
    settings: "Einstellungen",
    logout: "Abmelden",
    languageLabel: "Sprache",
  },
  IT: {
    dashboard: "Dashboard",
    projects: "Progetti",
    clients: "Clienti",
    contracts: "Contratti",
    invoices: "Fatture",
    team: "Team",
    settings: "Impostazioni",
    logout: "Disconnetti",
    languageLabel: "Lingua",
  },
};

const languageOptions = [
  { code: "FR", label: "Français" },
  { code: "EN", label: "English" },
  { code: "DE", label: "Deutsch" },
  { code: "IT", label: "Italiano" },
];

const Navbar = ({ activeMenu }) => {
  const { user, logout } = useContext(UserContext);
  const { lang: currentLang, setLang } = useLanguage();
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const copy = translations[currentLang] ?? translations.FR;

  const adminNavLinks = [
    { name: copy.dashboard, path: "/admin/dashboard" },
    { name: copy.projects, path: "/admin/projects" },
    { name: copy.clients, path: "/admin/clients" },
    { name: copy.contracts, path: "/admin/contracts" },
    { name: copy.invoices, path: "/admin/invoices" },
    { name: copy.team, path: "/admin/team" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#e8e8e8] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Mobile Menu */}
        {openSideMenu && (
          <div className="py-4 space-y-4 border-t border-gray-300">
            {adminNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpenSideMenu(false)}
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
              <p className="text-xs text-gray-500 font-light mb-2">{copy.languageLabel}</p>
              <div className="grid grid-cols-2 gap-2">
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => {
                      setLang(option.code);
                      setIsLangOpen(false);
                    }}
                    className={`px-3 py-2 rounded text-sm font-light transition-colors ${
                      currentLang === option.code
                        ? "bg-[#2d5f3f] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.code}
                  </button>
                ))}
              </div>
            </div>

            {/* User Profile Mobile */}
            <button
              onClick={() => {
                navigate("/admin/profile");
                setOpenSideMenu(false);
              }}
              className="flex items-center justify-center gap-2 text-[#2d5f3f] py-2 font-light w-full"
            >
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <FaUser className="w-5 h-5" />
              )}
              Profil
            </button>

            {/* Logout Mobile */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 text-red-600 py-2 font-light w-full"
            >
              <FaTimes className="w-5 h-5" />
              {copy.logout}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Side Menu Overlay (for consistency with existing SideMenu) */}
      {openSideMenu && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden">
          <div className="fixed top-20 left-0 right-0 bg-white shadow-xl">
            <SideMenu activeMenu={activeMenu} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
