import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../../assets/images/services.jpeg";
import { useLanguage } from "../../context/languageContext";

const content = {
  FR: {
    hero: {
      title: "Nos Services",
      subtitle: "Une offre complète pour la gestion et la protection de votre patrimoine.",
    },
    cards: [
      {
        title: "Création d'entreprise",
        description:
          "Solutions inshore et offshore adaptées à vos besoins pour une implantation optimale de votre structure.",
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      },
      {
        title: "Ouverture de compte bancaire",
        description:
          "Accès privilégié à des établissements bancaires fiables, traditionnels et alternatifs à l'international.",
        icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      },
      {
        title: "Service de domiciliation",
        description: "Adresse professionnelle prestigieuse avec service complet de réception et renvoi de courrier sécurisé.",
        icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      },
      {
        title: "Conseil en structuration patrimoniale",
        description: "Architectures sur mesure pour protéger et faire croître votre patrimoine en toute légalité.",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      },
      {
        title: "Optimisation fiscale",
        description:
          "Stratégies fiscales avancées pour minimiser votre imposition tout en respectant les cadres légaux.",
        icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
      },
    ],
    cta: {
      title: "Prêt à optimiser votre patrimoine ?",
      subtitle: "Contactez-nous dès aujourd'hui pour une consultation personnalisée.",
      button: "Commencer maintenant",
    },
  },
  EN: {
    hero: {
      title: "Our Services",
      subtitle: "A comprehensive suite designed to manage, protect, and grow your wealth.",
    },
    cards: [
      {
        title: "Company formation",
        description:
          "In-shore and off-shore structures tailored to your goals so you can incorporate quickly and compliantly.",
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      },
      {
        title: "Corporate bank onboarding",
        description:
          "Privileged access to reliable, international banking partners—both traditional and alternative.",
        icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      },
      {
        title: "Business domiciliation",
        description: "Prestigious business addresses with secure mail reception, scanning, and forwarding.",
        icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      },
      {
        title: "Wealth structuring advisory",
        description: "Custom architectures that safeguard and grow your assets while staying fully compliant.",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      },
      {
        title: "Tax optimisation",
        description: "Advanced strategies that lower tax exposure while respecting every jurisdiction.",
        icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
      },
    ],
    cta: {
      title: "Ready to optimise your wealth?",
      subtitle: "Reach out today for a tailored consultation.",
      button: "Get started now",
    },
  },
  DE: {
    hero: {
      title: "Unsere Dienstleistungen",
      subtitle: "Ein umfassendes Angebot zur Verwaltung, zum Schutz und zum Wachstum Ihres Vermögens.",
    },
    cards: [
      {
        title: "Unternehmensgründung",
        description:
          "Inshore- und Offshore-Strukturen, die auf Ihre Ziele zugeschnitten sind, damit Sie schnell und konform gründen können.",
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      },
      {
        title: "Firmenkontoeröffnung",
        description:
          "Privilegierter Zugang zu zuverlässigen, internationalen Bankpartnern – sowohl traditionell als auch alternativ.",
        icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      },
      {
        title: "Geschäftsdomizilierung",
        description: "Prestigeträchtige Geschäftsadressen mit sicherem Postempfang, Scannen und Weiterleitung.",
        icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      },
      {
        title: "Vermögensstrukturierungsberatung",
        description: "Maßgeschneiderte Architekturen, die Ihre Vermögenswerte schützen und vermehren und dabei vollständig konform bleiben.",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      },
      {
        title: "Steueroptimierung",
        description: "Fortgeschrittene Strategien, die die Steuerbelastung senken und gleichzeitig alle Rechtsordnungen respektieren.",
        icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
      },
    ],
    cta: {
      title: "Bereit, Ihr Vermögen zu optimieren?",
      subtitle: "Kontaktieren Sie uns noch heute für eine maßgeschneiderte Beratung.",
      button: "Jetzt starten",
    },
  },
  IT: {
    hero: {
      title: "I Nostri Servizi",
      subtitle: "Una suite completa progettata per gestire, proteggere e far crescere il tuo patrimonio.",
    },
    cards: [
      {
        title: "Costituzione aziendale",
        description:
          "Strutture in-shore e off-shore su misura per i tuoi obiettivi in modo da poter costituire rapidamente e in conformità.",
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      },
      {
        title: "Apertura conto aziendale",
        description:
          "Accesso privilegiato a partner bancari internazionali affidabili, sia tradizionali che alternativi.",
        icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      },
      {
        title: "Domiciliazione aziendale",
        description: "Indirizzi commerciali prestigiosi con ricezione sicura della posta, scansione e inoltro.",
        icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      },
      {
        title: "Consulenza sulla strutturazione patrimoniale",
        description: "Architetture personalizzate che salvaguardano e fanno crescere i tuoi asset rimanendo pienamente conformi.",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      },
      {
        title: "Ottimizzazione fiscale",
        description: "Strategie avanzate che riducono l'esposizione fiscale rispettando ogni giurisdizione.",
        icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
      },
    ],
    cta: {
      title: "Pronto a ottimizzare il tuo patrimonio?",
      subtitle: "Contattaci oggi per una consulenza personalizzata.",
      button: "Inizia ora",
    },
  },
};

const Services = () => {
  const { lang } = useLanguage();
  const copy = content[lang] ?? content.FR;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={bgImage} 
            alt="Geneva Landscape" 
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-br from-[#1e4029]/90 via-[#2d5f3f]/85 to-[#1e4029]/90"></div> */}
        </div>
        
        {/* Radial gradient overlays */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/3 left-10 w-32 h-0.5 bg-white/20"></div>
        <div className="absolute bottom-1/3 right-10 w-32 h-0.5 bg-white/20"></div>
        <div className="absolute top-1/4 right-20 w-3 h-3 rounded-full bg-white/30"></div>
        <div className="absolute bottom-1/4 left-20 w-3 h-3 rounded-full bg-white/30"></div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-light text-white mb-8 tracking-tight">
            {copy.hero.title}
          </h1>
          <div className="w-32 h-1 bg-white/40 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed max-w-4xl mx-auto">
            {copy.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-32 px-6 bg-gradient-to-b from-white via-[#f8faf9] to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2d5f3f] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5a8f6f] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-10">
            {copy.cards.map((service, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-3xl opacity-60 group-hover:opacity-100 blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse"></div>
                <div className="relative h-full bg-gradient-to-br from-white via-[#fafdfb] to-white rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-700 border-2 border-[#2d5f3f]/20 transform group-hover:scale-[1.03] group-hover:-rotate-1">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] flex items-center justify-center mb-10 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={service.icon} />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-light text-[#1e4029] mb-6 tracking-tight leading-tight">
                    {service.title}
                  </h3>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-transparent mb-8 rounded-full"></div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-light mb-8 tracking-tight">
            {copy.cta.title}
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-white/90 font-light leading-relaxed">
            {copy.cta.subtitle}
          </p>
          <Link
            to="/connexion"
            className="inline-block bg-white text-blue-900 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
          >
            {copy.cta.button}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
