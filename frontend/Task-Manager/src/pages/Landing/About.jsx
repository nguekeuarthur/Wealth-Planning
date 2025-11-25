import React from "react";
import bgImage from "../../assets/images/about.jpg";
import { useLanguage } from "../../context/languageContext";

const content = {
  FR: {
    hero: {
      title: "À Propos de Nous",
      leadPrefix: "Chez ",
      leadSuffix:
        ", nous mettons notre expertise au service des entrepreneurs, investisseurs et particuliers du monde entier souhaitant établir leur présence en Suisse et à l'étranger.",
    },
    expertise: {
      title: "Notre Expertise",
      body:
        "Nous mettons à votre disposition notre expertise approfondie dans la structuration patrimoniale et fiscale, ainsi que dans toutes les démarches administratives et bancaires tant nationales qu'internationales. Nous vous accompagnons dans la prise de décisions avisées pour optimiser votre situation financière et patrimoniale.",
    },
    philosophy: {
      title: "Notre Philosophie",
      body:
        "Notre philosophie repose sur une approche personnalisée, transparente et éthique. Nous croyons en l'importance de bâtir des relations de confiance avec nos clients, en fournissant des conseils fiables et en agissant dans leur intérêt supérieur.",
    },
    engagement: {
      title: "Notre Engagement envers les Résultats",
      body:
        "Nous nous engageons à atteindre des résultats concrets et durables pour nos clients. Notre approche proactive et notre recherche constante de solutions innovantes nous permettent de répondre aux besoins spécifiques de chaque client avec efficacité.",
    },
    experience: {
      title: "Notre Expérience",
      body:
        "Fort de nombreuses années d'expérience, notre équipe a accompagné avec succès de nombreux entrepreneurs, investisseurs et particuliers dans la structuration et la gestion de leur patrimoine. Nous sommes fiers de notre parcours et des réussites de nos clients.",
    },
    services: {
      tagline: "Excellence Suisse",
      title: "Nos Services",
      paragraphs: [
        "Notre équipe est composée de professionnels ayant une solide expérience en banque privée suisse.",
        "Ce savoir-faire nous permet d'offrir des solutions haut de gamme, dans un cadre sécurisé, rigoureux et conforme aux standards les plus exigeants.",
      ],
    },
    values: {
      title: "Nos Valeurs",
      subtitle: "Les principes fondamentaux qui guident notre excellence",
      items: [
        {
          title: "Transparence",
          text:
            "Chez Geneva Wealth Partners, nous croyons que la confiance naît de la clarté. Nous nous engageons à fournir à nos clients une information claire, loyale et accessible à chaque étape du processus. Aucune surprise, tout est expliqué, documenté et justifié.",
          icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
        },
        {
          title: "Accompagnement sur mesure",
          text:
            "Nous plaçons l'humain au cœur de notre démarche. Chaque client bénéficie d'un accompagnement personnalisé, de la création d'entreprise à l'ouverture de comptes bancaires, en passant par la domiciliation et la gestion administrative.",
          icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        },
        {
          title: "Excellence du service",
          text:
            "Notre mission est de simplifier vos démarches tout en vous garantissant un service de qualité suisse. Réactivité, efficacité et sens du détail sont les piliers de notre engagement quotidien.",
          icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
        },
        {
          title: "Discrétion absolue",
          text:
            "Nous traitons chaque dossier avec la plus grande confidentialité. Qu'il s'agisse de structures offshore, de courriers sensibles ou d'actifs patrimoniaux, nous garantissons une discrétion irréprochable, dans le respect des normes en vigueur.",
          icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
        },
        {
          title: "Fiabilité",
          text:
            "Notre logo, marqué par la clé et l'écusson, symbolise la confiance et la protection. En choisissant Geneva Wealth Partners, vous choisissez un partenaire fiable, intègre et rigoureux, capable de vous représenter durablement en Suisse et à l'étranger.",
          icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        },
      ],
    },
  },
  EN: {
    hero: {
      title: "About Us",
      leadPrefix: "At ",
      leadSuffix:
        ", we place our Swiss expertise at the service of entrepreneurs, investors, and families who want to establish a trusted presence in Switzerland and abroad.",
    },
    expertise: {
      title: "Our Expertise",
      body:
        "We bring you deep know-how in wealth and tax structuring, along with every administrative and banking procedure, locally and internationally. We help you make informed decisions so your assets remain protected, compliant, and future-proof.",
    },
    philosophy: {
      title: "Our Philosophy",
      body:
        "We believe in tailor-made, transparent, and ethical advisory. Trust thrives when every recommendation is explained, documented, and delivered with your best interest in mind.",
    },
    engagement: {
      title: "Our Commitment to Results",
      body:
        "We aim for tangible, lasting outcomes. A proactive mindset and constant search for innovative solutions allow us to respond precisely to each client’s situation.",
    },
    experience: {
      title: "Our Experience",
      body:
        "With years of experience, our team has guided entrepreneurs, investors, and families through every angle of wealth structuring and governance. We are proud of the journeys we have secured for our clients.",
    },
    services: {
      tagline: "Swiss Excellence",
      title: "Our Services",
      paragraphs: [
        "Our advisors come from leading Swiss private banking institutions.",
        "This background allows us to deliver high-end solutions within a secure, rigorous, and regulation-ready framework.",
      ],
    },
    values: {
      title: "Our Values",
      subtitle: "Foundational principles that drive our excellence",
      items: [
        {
          title: "Transparency",
          text:
            "We believe trust is born from clarity. Every step of our process is documented and shared so you always know why a decision is being recommended.",
          icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
        },
        {
          title: "Tailor-made support",
          text:
            "People remain at the center of everything we do. From company creation to banking, domiciliation, and administration, you receive bespoke guidance at every milestone.",
          icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        },
        {
          title: "Service excellence",
          text:
            "Our mission is to simplify your journey while upholding Swiss-grade service. Responsiveness, precision, and attention to detail are non-negotiable standards.",
          icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
        },
        {
          title: "Absolute discretion",
          text:
            "Every dossier is handled with uncompromising confidentiality—from offshore structures to sensitive mail and asset documentation.",
          icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
        },
        {
          title: "Reliability",
          text:
            "Our crest and key embody trust and protection. Working with Geneva Wealth Partners means partnering with a diligent representative for both Swiss and international ambitions.",
          icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        },
      ],
    },
  },
  DE: {
    hero: {
      title: "Über uns",
      leadPrefix: "Bei ",
      leadSuffix:
        " stellen wir unsere Schweizer Expertise in den Dienst von Unternehmern, Investoren und Familien, die eine vertrauenswürdige Präsenz in der Schweiz und im Ausland etablieren möchten.",
    },
    expertise: {
      title: "Unsere Expertise",
      body:
        "Wir bringen Ihnen tiefes Know-how in Vermögens- und Steuerstrukturierung sowie in allen administrativen und bankentechnischen Verfahren, lokal und international. Wir helfen Ihnen, fundierte Entscheidungen zu treffen, damit Ihre Vermögenswerte geschützt, konform und zukunftssicher bleiben.",
    },
    philosophy: {
      title: "Unsere Philosophie",
      body:
        "Wir glauben an maßgeschneiderte, transparente und ethische Beratung. Vertrauen entsteht, wenn jede Empfehlung erklärt, dokumentiert und mit Ihrem besten Interesse im Sinn geliefert wird.",
    },
    engagement: {
      title: "Unser Engagement für Ergebnisse",
      body:
        "Wir streben nach greifbaren, dauerhaften Ergebnissen. Eine proaktive Denkweise und ständige Suche nach innovativen Lösungen ermöglichen es uns, präzise auf die Situation jedes Kunden zu reagieren.",
    },
    experience: {
      title: "Unsere Erfahrung",
      body:
        "Mit jahrelanger Erfahrung hat unser Team Unternehmer, Investoren und Familien durch jeden Winkel der Vermögensstrukturierung und -verwaltung geführt. Wir sind stolz auf die Wege, die wir für unsere Kunden gesichert haben.",
    },
    services: {
      tagline: "Schweizer Exzellenz",
      title: "Unsere Dienstleistungen",
      paragraphs: [
        "Unsere Berater kommen von führenden Schweizer Private-Banking-Institutionen.",
        "Dieser Hintergrund ermöglicht es uns, High-End-Lösungen in einem sicheren, rigorosen und regulierungsbereiten Rahmen zu liefern.",
      ],
    },
    values: {
      title: "Unsere Werte",
      subtitle: "Grundlegende Prinzipien, die unsere Exzellenz antreiben",
      items: [
        {
          title: "Transparenz",
          text:
            "Wir glauben, dass Vertrauen aus Klarheit entsteht. Jeder Schritt unseres Prozesses wird dokumentiert und geteilt, damit Sie immer wissen, warum eine Entscheidung empfohlen wird.",
          icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
        },
        {
          title: "Maßgeschneiderte Unterstützung",
          text:
            "Menschen bleiben im Mittelpunkt von allem, was wir tun. Von der Unternehmensgründung bis zum Banking, Domizilierung und Verwaltung erhalten Sie bei jedem Meilenstein maßgeschneiderte Beratung.",
          icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        },
        {
          title: "Serviceexzellenz",
          text:
            "Unsere Mission ist es, Ihre Reise zu vereinfachen und gleichzeitig Schweizer Service aufrechtzuerhalten. Reaktionsfähigkeit, Präzision und Liebe zum Detail sind nicht verhandelbare Standards.",
          icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
        },
        {
          title: "Absolute Diskretion",
          text:
            "Jedes Dossier wird mit kompromissloser Vertraulichkeit behandelt – von Offshore-Strukturen über sensible Post bis hin zur Vermögensdokumentation.",
          icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
        },
        {
          title: "Zuverlässigkeit",
          text:
            "Unser Wappen und Schlüssel verkörpern Vertrauen und Schutz. Die Zusammenarbeit mit Geneva Wealth Partners bedeutet eine Partnerschaft mit einem sorgfältigen Vertreter für Schweizer und internationale Ambitionen.",
          icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        },
      ],
    },
  },
  IT: {
    hero: {
      title: "Chi Siamo",
      leadPrefix: "A ",
      leadSuffix:
        ", mettiamo la nostra expertise svizzera al servizio di imprenditori, investitori e famiglie che desiderano stabilire una presenza affidabile in Svizzera e all'estero.",
    },
    expertise: {
      title: "La Nostra Expertise",
      body:
        "Ti portiamo un know-how approfondito nella strutturazione patrimoniale e fiscale, insieme a ogni procedura amministrativa e bancaria, localmente e internazionalmente. Ti aiutiamo a prendere decisioni informate in modo che i tuoi asset rimangano protetti, conformi e preparati per il futuro.",
    },
    philosophy: {
      title: "La Nostra Filosofia",
      body:
        "Crediamo in una consulenza su misura, trasparente ed etica. La fiducia prospera quando ogni raccomandazione è spiegata, documentata e fornita con il tuo miglior interesse in mente.",
    },
    engagement: {
      title: "Il Nostro Impegno per i Risultati",
      body:
        "Puntiamo a risultati tangibili e duraturi. Una mentalità proattiva e una ricerca costante di soluzioni innovative ci permettono di rispondere con precisione alla situazione di ogni cliente.",
    },
    experience: {
      title: "La Nostra Esperienza",
      body:
        "Con anni di esperienza, il nostro team ha guidato imprenditori, investitori e famiglie attraverso ogni aspetto della strutturazione e governance patrimoniale. Siamo orgogliosi dei percorsi che abbiamo assicurato per i nostri clienti.",
    },
    services: {
      tagline: "Eccellenza Svizzera",
      title: "I Nostri Servizi",
      paragraphs: [
        "I nostri consulenti provengono da importanti istituzioni di private banking svizzero.",
        "Questo background ci permette di fornire soluzioni di alta gamma all'interno di un quadro sicuro, rigoroso e pronto per la regolamentazione.",
      ],
    },
    values: {
      title: "I Nostri Valori",
      subtitle: "Principi fondamentali che guidano la nostra eccellenza",
      items: [
        {
          title: "Trasparenza",
          text:
            "Crediamo che la fiducia nasca dalla chiarezza. Ogni fase del nostro processo è documentata e condivisa in modo che tu sappia sempre perché una decisione viene raccomandata.",
          icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
        },
        {
          title: "Supporto su misura",
          text:
            "Le persone rimangono al centro di tutto ciò che facciamo. Dalla costituzione aziendale al banking, domiciliazione e amministrazione, ricevi una guida su misura in ogni fase.",
          icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        },
        {
          title: "Eccellenza del servizio",
          text:
            "La nostra missione è semplificare il tuo percorso mantenendo un servizio di livello svizzero. Reattività, precisione e attenzione ai dettagli sono standard non negoziabili.",
          icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
        },
        {
          title: "Discrezione assoluta",
          text:
            "Ogni dossier è gestito con riservatezza senza compromessi, dalle strutture offshore alla posta sensibile e alla documentazione degli asset.",
          icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
        },
        {
          title: "Affidabilità",
          text:
            "Il nostro stemma e la chiave incarnano fiducia e protezione. Lavorare con Geneva Wealth Partners significa collaborare con un rappresentante diligente per le ambizioni svizzere e internazionali.",
          icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        },
      ],
    },
  },
};

const About = () => {
  const { lang } = useLanguage();
  const copy = content[lang] ?? content.FR;
  const brandName = "Geneva Wealth Partners";

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
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.2)_0%,transparent_50%)]"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
          <div className="flex items-center justify-center space-x-4 mb-10">
            <div className="w-16 h-0.5 bg-white/60"></div>
            <div className="w-3 h-3 rounded-full bg-white/80"></div>
            <div className="w-16 h-0.5 bg-white/60"></div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-light mb-10 tracking-wider">
            {copy.hero.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed max-w-4xl mx-auto">
            {copy.hero.leadPrefix}
            <span className="font-normal border-b-2 border-white/40">{brandName}</span>
            {copy.hero.leadSuffix}
          </p>
        </div>
      </section>

      {/* Expertise & Philosophie */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#f8faf9] via-white to-[#f0f7f3] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#2d5f3f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#5a8f6f]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-[#2d5f3f] rounded-3xl opacity-75 group-hover:opacity-100 blur-lg group-hover:blur-xl transition-all duration-700 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-white to-[#f8faf9] p-14 rounded-3xl shadow-2xl border-2 border-[#2d5f3f]/20 transform group-hover:scale-[1.02] transition-all duration-500 h-full min-h-[480px] flex flex-col">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#2d5f3f] flex items-center justify-center mb-8 shadow-2xl transform group-hover:rotate-6 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-5xl font-light text-[#1e4029] mb-6 tracking-tight">{copy.expertise.title}</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-transparent mb-8 rounded-full"></div>
                <p className="text-gray-700 leading-relaxed text-lg">{copy.expertise.body}</p>
              </div>
            </div>

            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-l from-[#5a8f6f] via-[#2d5f3f] to-[#5a8f6f] rounded-3xl opacity-75 group-hover:opacity-100 blur-lg group-hover:blur-xl transition-all duration-700 animate-pulse"></div>
              <div className="relative bg-gradient-to-bl from-white to-[#f8faf9] p-14 rounded-3xl shadow-2xl border-2 border-[#5a8f6f]/20 transform group-hover:scale-[1.02] transition-all duration-500 h-full min-h-[480px] flex flex-col">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5a8f6f] via-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center mb-8 shadow-2xl transform group-hover:-rotate-6 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-5xl font-light text-[#1e4029] mb-6 tracking-tight">{copy.philosophy.title}</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#5a8f6f] via-[#2d5f3f] to-transparent mb-8 rounded-full"></div>
                <p className="text-gray-700 leading-relaxed text-lg">{copy.philosophy.body}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement & Expérience */}
      <section className="py-32 px-6 bg-gradient-to-br from-white via-[#e8f5ee] to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-3 h-3 bg-[#2d5f3f] rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-2 h-2 bg-[#5a8f6f] rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-[#2d5f3f] rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-[#5a8f6f] rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="relative group h-full">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition duration-700 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-white via-[#f8fdf9] to-white rounded-3xl shadow-2xl overflow-hidden transform hover:-translate-y-4 hover:rotate-1 transition-all duration-700 border-t-4 border-[#2d5f3f] h-full min-h-[480px] flex flex-col">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2d5f3f]/10 via-[#5a8f6f]/5 to-transparent rounded-full -mr-32 -mt-32"></div>
                <div className="p-14 relative flex-1 flex flex-col">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] flex items-center justify-center mb-10 shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-light text-[#1e4029] mb-6 tracking-tight leading-tight">
                    {copy.engagement.title}
                  </h3>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-transparent mb-8 rounded-full"></div>
                  <p className="text-gray-700 leading-relaxed text-lg">{copy.engagement.body}</p>
                </div>
              </div>
            </div>

            <div className="relative group h-full">
              <div className="absolute -inset-2 bg-gradient-to-bl from-[#5a8f6f] via-[#2d5f3f] to-[#1e4029] rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition duration-700 animate-pulse"></div>
              <div className="relative bg-gradient-to-bl from-white via-[#f8fdf9] to-white rounded-3xl shadow-2xl overflow-hidden transform hover:-translate-y-4 hover:-rotate-1 transition-all duration-700 border-t-4 border-[#5a8f6f] h-full min-h-[480px] flex flex-col">
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-bl from-[#5a8f6f]/10 via-[#2d5f3f]/5 to-transparent rounded-full -ml-32 -mt-32"></div>
                <div className="p-14 relative flex-1 flex flex-col">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#5a8f6f] via-[#2d5f3f] to-[#1e4029] flex items-center justify-center mb-10 shadow-2xl transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-light text-[#1e4029] mb-6 tracking-tight leading-tight">
                    {copy.experience.title}
                  </h3>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-[#5a8f6f] via-[#2d5f3f] to-transparent mb-8 rounded-full"></div>
                  <p className="text-gray-700 leading-relaxed text-lg">{copy.experience.body}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Services */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-3">
              <div className="inline-flex items-center mb-6">
                <div className="w-12 h-0.5 bg-white/40 mr-4"></div>
                <span className="uppercase tracking-widest text-sm font-light text-white/70">
                  {copy.services.tagline}
                </span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-light mb-10 tracking-wide">
                {copy.services.title}
              </h2>
              
              {copy.services.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg font-light leading-relaxed text-white/80">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="lg:col-span-2 hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl transform rotate-6"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20">
                  <svg className="w-full h-64 text-white/10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-32 px-6 bg-gradient-to-b from-white via-[#f8faf9] to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2d5f3f] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5a8f6f] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center justify-center mb-8 gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] animate-pulse shadow-lg"></div>
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#5a8f6f] to-[#2d5f3f] animate-pulse shadow-lg" style={{animationDelay: '0.2s'}}></div>
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#2d5f3f] to-[#1e4029] animate-pulse shadow-lg" style={{animationDelay: '0.4s'}}></div>
            </div>
            <h2 className="text-6xl md:text-7xl font-light text-[#1e4029] mb-8 tracking-tight">
              {copy.values.title}
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-transparent via-[#2d5f3f] to-transparent mx-auto mb-6 rounded-full"></div>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {copy.values.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {copy.values.items.map((value, index) => (
              <div key={index} className={`group relative ${index === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-3xl opacity-60 group-hover:opacity-100 blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse"></div>
                <div className="relative h-full bg-gradient-to-br from-white via-[#fafdfb] to-white rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-700 border-2 border-[#2d5f3f]/20 transform group-hover:scale-[1.05] group-hover:-rotate-1">
                  <div className="flex items-center mb-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                      <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={value.icon} />
                      </svg>
                    </div>
                    <div className="ml-6 flex-1 h-1.5 bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-transparent rounded-full"></div>
                  </div>
                  <h3 className="text-3xl font-light text-[#1e4029] mb-6 tracking-tight">{value.title}</h3>
                  <p className="text-gray-700 leading-relaxed text-base">{value.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
