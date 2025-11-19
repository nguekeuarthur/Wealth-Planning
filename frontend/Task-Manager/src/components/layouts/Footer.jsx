import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaTwitter, FaFacebook, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <div className="flex flex-col">
                <span className="text-white text-sm font-light tracking-[0.15em] leading-tight">GENEVA</span>
                <div className="flex items-center">
                  <span className="text-white text-[13px] font-light tracking-[0.2em] leading-tight mr-2">WEALTH</span>
                  <span className="text-white text-[9px] font-light tracking-[0.15em] border-l border-white pl-2 leading-tight">WEALTH<br/>PLANNING</span>
                </div>
                <span className="text-white text-[9px] font-light tracking-[0.3em] leading-tight">PARTNERS</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4 font-light leading-relaxed text-sm">
              Conseil en structuration patrimoniale et fiscale pour entrepreneurs et investisseurs.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="bg-gray-700 hover:bg-[#2d5f3f] w-10 h-10 flex items-center justify-center transition-colors"
              >
                <FaLinkedin />
              </a>
              <a
                href="#"
                className="bg-gray-700 hover:bg-[#2d5f3f] w-10 h-10 flex items-center justify-center transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="bg-gray-700 hover:bg-[#2d5f3f] w-10 h-10 flex items-center justify-center transition-colors"
              >
                <FaFacebook />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-light mb-4 tracking-wide">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors font-light">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors font-light">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors font-light">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors font-light">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/connexion" className="text-gray-300 hover:text-white transition-colors font-light">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-light mb-4 tracking-wide">Nos Services</h3>
            <ul className="space-y-2 text-gray-300 font-light">
              <li>Création d'entreprise</li>
              <li>Ouverture de compte Bancaire</li>
              <li>Service de Domiciliation</li>
              <li>Conseil en Structuration Patrimoniale</li>
              <li>Optimisation Fiscale</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-light mb-4 tracking-wide">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-[#5a8f6f] mt-1 flex-shrink-0" />
                <a href="mailto:contact@genevawealthpartners.ch" className="text-gray-300 hover:text-white transition-colors font-light">
                  contact@genevawealthpartners.ch
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaPhone className="text-[#5a8f6f] mt-1 flex-shrink-0" />
                <a href="tel:+41779863255" className="text-gray-300 hover:text-white transition-colors font-light">
                  +41 77 98 63 255
                </a>
              </li>
              {/* <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-[#5a8f6f] mt-1 flex-shrink-0" />
                <span className="text-gray-300 font-light leading-relaxed">
                  123 Avenue des Champs-Élysées<br />
                  75008 Paris, France
                </span>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 font-light">
            © {new Date().getFullYear()} GENEVA WEALTH PARTNERS. Tous droits réservés.
          </p>
          <div className="mt-2 space-x-4">
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors font-light">
              Politique de confidentialité
            </a>
            <span className="text-gray-500">|</span>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors font-light">
              Conditions d'utilisation
            </a>
            <span className="text-gray-500">|</span>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors font-light">
              Mentions légales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
