import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaTwitter, FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";
import { useLanguage } from "../../context/languageContext";

const translations = {
  FR: {
    description: "Conseil en structuration patrimoniale et fiscale pour entrepreneurs et investisseurs.",
    quickLinksTitle: "Liens Rapides",
    quickLinks: {
      home: "Accueil",
      about: "À propos",
      services: "Services",
      contact: "Contact",
      login: "Connexion",
    },
    servicesTitle: "Nos Services",
    servicesList: [
      "Création d'entreprise",
      "Ouverture de compte bancaire",
      "Service de domiciliation",
      "Conseil en structuration patrimoniale",
      "Optimisation fiscale",
    ],
    contactTitle: "Contact",
    legalLinks: ["Politique de confidentialité", "Conditions d'utilisation", "Mentions légales"],
    copyright: "Tous droits réservés.",
  },
  EN: {
    description: "Wealth and tax structuring advisory for entrepreneurs and investors.",
    quickLinksTitle: "Quick Links",
    quickLinks: {
      home: "Home",
      about: "About",
      services: "Services",
      contact: "Contact",
      login: "Sign in",
    },
    servicesTitle: "Our Services",
    servicesList: [
      "Company formation",
      "Corporate bank onboarding",
      "Business domiciliation",
      "Wealth structuring advisory",
      "Tax optimisation",
    ],
    contactTitle: "Contact",
    legalLinks: ["Privacy policy", "Terms of use", "Legal notice"],
    copyright: "All rights reserved.",
  },
  DE: {
    description: "Vermögens- und Steuerstrukturierungsberatung für Unternehmer und Investoren.",
    quickLinksTitle: "Schnellzugriff",
    quickLinks: {
      home: "Startseite",
      about: "Über uns",
      services: "Dienstleistungen",
      contact: "Kontakt",
      login: "Anmelden",
    },
    servicesTitle: "Unsere Dienstleistungen",
    servicesList: [
      "Unternehmensgründung",
      "Firmenkontoeöffnung",
      "Geschäftsdomizilierung",
      "Vermögensstrukturierungsberatung",
      "Steueroptimierung",
    ],
    contactTitle: "Kontakt",
    legalLinks: ["Datenschutzrichtlinie", "Nutzungsbedingungen", "Impressum"],
    copyright: "Alle Rechte vorbehalten.",
  },
  IT: {
    description: "Consulenza sulla strutturazione patrimoniale e fiscale per imprenditori e investitori.",
    quickLinksTitle: "Link Rapidi",
    quickLinks: {
      home: "Home",
      about: "Chi siamo",
      services: "Servizi",
      contact: "Contatto",
      login: "Accedi",
    },
    servicesTitle: "I Nostri Servizi",
    servicesList: [
      "Costituzione aziendale",
      "Apertura conto aziendale",
      "Domiciliazione aziendale",
      "Consulenza sulla strutturazione patrimoniale",
      "Ottimizzazione fiscale",
    ],
    contactTitle: "Contatto",
    legalLinks: ["Informativa sulla privacy", "Termini di utilizzo", "Note legali"],
    copyright: "Tutti i diritti riservati.",
  },
};

const Footer = () => {
  const { lang } = useLanguage();
  const copy = translations[lang] ?? translations.FR;
  const legalItems = copy.legalLinks;

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col">
                  <span className="text-white text-sm font-light tracking-[0.15em] leading-tight">GENEVA</span>
                  <span className="text-white text-[13px] font-light tracking-[0.2em] leading-tight">WEALTH</span>
                  <span className="text-white text-[9px] font-light tracking-[0.3em] leading-tight">PARTNERS</span>
                </div>

                <div className="flex items-end h-full relative" style={{ height: "45px" }}>
                  <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white"></div>
                  <span className="text-white text-[9px] font-light tracking-[0.15em] pl-2 leading-tight italic whitespace-nowrap">
                    WEALTH
                    <br />
                    PLANNING
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-4 font-light leading-relaxed text-sm">{copy.description}</p>
            <div className="flex space-x-3">
              {[FaLinkedin, FaTwitter, FaFacebook].map((Icon, index) => (
                <a key={Icon.displayName ?? index} href="#" className="bg-gray-700 hover:bg-[#2d5f3f] w-10 h-10 flex items-center justify-center transition-colors">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-light mb-4 tracking-wide">{copy.quickLinksTitle}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors font-light">
                  {copy.quickLinks.home}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors font-light">
                  {copy.quickLinks.about}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors font-light">
                  {copy.quickLinks.services}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors font-light">
                  {copy.quickLinks.contact}
                </Link>
              </li>
              <li>
                <Link to="/connexion" className="text-gray-300 hover:text-white transition-colors font-light">
                  {copy.quickLinks.login}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-light mb-4 tracking-wide">{copy.servicesTitle}</h3>
            <ul className="space-y-2 text-gray-300 font-light">
              {copy.servicesList.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-light mb-4 tracking-wide">{copy.contactTitle}</h3>
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
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 font-light">
            © {new Date().getFullYear()} GENEVA WEALTH PARTNERS. {copy.copyright}
          </p>
          <div className="mt-2 space-x-4">
            {legalItems.map((item, index) => (
              <React.Fragment key={item}>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors font-light">
                  {item}
                </a>
                {index !== legalItems.length - 1 && <span className="text-gray-500">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
