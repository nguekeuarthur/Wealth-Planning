import React from "react";
import { Link } from "react-router-dom";
import lacLemanImage from "../../assets/images/lac-leman-alpes.jpg";
import { useLanguage } from "../../context/languageContext";

const content = {
  FR: {
    hero: {
      title: "Geneva Wealth Partners",
      subtitle: "CONSEIL EN STRUCTURATION PATRIMONIALE ET FISCALE",
      cta: "Rejoignez-nous",
    },
    servicesIntro: {
      title: "Nos Services",
      paragraphs: [
        "Geneva Wealth Partners est une entreprise spécialisée dans le conseil et l'accompagnement en structuration patrimoniale et fiscale pour les entrepreneurs, investisseurs et particuliers souhaitant créer une société en Suisse ou à l'étranger.",
        "Nous facilitons toutes les démarches administratives et bancaires allant de la création d'entreprise, la domiciliation, l'ouverture de compte bancaire, réception de courrier et accompagnement sur mesure.",
      ],
      cta: "En savoir plus",
    },
    steps: {
      title: "Notre Fonctionnement",
      items: [
        {
          title: "Diagnostic Personnalisé en Ligne",
          intro: "Nous analysons votre situation patrimoniale grâce à un pré-audit :",
          bullets: [
            "Questionnaire interactif pour cerner vos objectifs.",
            "Bilan de la situation.",
            "Pré-recommandations sous 48h.",
          ],
          footnote: "Idéal pour une première approche sécurisée.",
        },
        {
          title: "Bénéficiez d'un accompagnement sur mesure",
          intro: "Échanges avec votre conseiller dédié.",
          bullets: [
            "Stratégies fiscales et patrimoniales clarifiées.",
            "Validation des scénarios par nos experts.",
          ],
          footnote: "Parfait pour approfondir votre projet personnalisé.",
        },
        {
          title: "Rencontre avec votre expert",
          intro: "Pour définir les enjeux patrimoniaux :",
          bullets: [
            "Analyse approfondie en face-à-face.",
            "Montages sur-mesure (SCI/SCCV, holding, solutions internationales).",
            "Réseau d'experts (notaires, avocats) mobilisé pour vous.",
          ],
          footnote: "L'excellence pour les patrimoines exigeants.",
        },
      ],
    },
    reasons: {
      title: "Pourquoi Nous Choisir",
      items: [
        {
          title: "Accès privilégié à des solutions bancaires fermées",
          text: "Grâce à notre réseau de partenaires bancaires internationaux, nous ouvrons des comptes dans des établissements peu accessibles aux particuliers, y compris pour les profils complexes (non-résidents, secteurs sensibles, patrimoines familiaux).",
        },
        {
          title: "Gain de temps radical",
          text: "Un seul interlocuteur pour gérer création d'entreprise + banque + domiciliation + optimisation fiscale, sans perdre des mois en démarches complexes.",
        },
        {
          title: "Architectures juridiques robustes et pérennes",
          text: "Nous ne proposons pas de montages standards, mais des architectures sur mesure, résistantes aux audits fiscaux, conçues par des experts en droit international.",
        },
        {
          title: "Discrétion et sécurité absolues",
          text: "Votre confidentialité est notre priorité. Nos solutions garantissent anonymat et protection des données, sans papertraces inutiles.",
        },
        {
          title: "Pas de conflits d'intérêts",
          text: "Contrairement aux banques ou family offices, nous ne touchons aucune commission sur vos placements. Nos conseils sont 100% impartiaux.",
        },
        {
          title: "Approche globale et interconnectée",
          text: "Notre expertise duale nous permet de concevoir des stratégies sur mesure qui optimisent intelligemment les dispositifs inshore et offshore.",
        },
      ],
    },
    ctaSection: {
      title: "Réservez une Consultation Gratuite",
      paragraph1:
        "Nous offrons des consultations gratuites pour discuter de vos besoins en matière de création d'entreprise en Suisse et offshore, domiciliation commerciale, ouverture de comptes bancaires, accompagnement administratif et patrimonial de clients internationaux.",
      paragraph2: "Cliquez ici pour réserver votre consultation dès maintenant.",
      button: "Rejoignez-nous",
    },
  },
  EN: {
    hero: {
      title: "Geneva Wealth Partners",
      subtitle: "WEALTH AND TAX STRUCTURING ADVISORY",
      cta: "Contact us",
    },
    servicesIntro: {
      title: "Our Services",
      paragraphs: [
        "Geneva Wealth Partners supports entrepreneurs, investors, and families who want to set up companies in Switzerland or abroad with bespoke wealth and tax structuring advice.",
        "We streamline every administrative and banking step: company formation, domiciliation, corporate bank accounts, secured mail handling, and ongoing tailored guidance.",
      ],
      cta: "Learn more",
    },
    steps: {
      title: "How We Work",
      items: [
        {
          title: "Personalized Online Assessment",
          intro: "We review your wealth profile through a short pre-audit:",
          bullets: [
            "Interactive questionnaire to capture your objectives.",
            "Comprehensive status report.",
            "Preliminary recommendations within 48 hours.",
          ],
          footnote: "Ideal for a first, secure approach.",
        },
        {
          title: "Tailor-Made Advisory Journey",
          intro: "Dedicated conversations with your private advisor.",
          bullets: [
            "Clarified wealth and tax strategies.",
            "Scenario validation with our senior experts.",
          ],
          footnote: "Perfect to deep dive into your bespoke plan.",
        },
        {
          title: "Meet Your Expert",
          intro: "Together we define your strategic priorities:",
          bullets: [
            "In-depth, face-to-face analysis.",
            "Custom structures (SCI/SCCV, holding, international solutions).",
            "Trusted network of notaries and lawyers mobilised for you.",
          ],
          footnote: "Excellence tailored to demanding estates.",
        },
      ],
    },
    reasons: {
      title: "Why Choose Us",
      items: [
        {
          title: "Privileged access to restricted banking",
          text: "Our international banking partners allow us to open accounts with institutions that remain closed to most private clients, including sensitive or non-resident profiles.",
        },
        {
          title: "Radical time savings",
          text: "One single partner for company creation, banking, domiciliation, and tax optimisation so you avoid months of scattered processes.",
        },
        {
          title: "Robust, long-lasting legal architectures",
          text: "We only design custom structures that withstand tax audits and comply with international regulations.",
        },
        {
          title: "Absolute confidentiality and security",
          text: "Discretion drives everything we do. Our processes protect your identity, data, and mail from unnecessary exposure.",
        },
        {
          title: "No conflicts of interest",
          text: "Unlike banks or family offices, we do not take commissions on your assets. Our advice is fully independent.",
        },
        {
          title: "Holistic, interconnected vision",
          text: "We master both in-shore and off-shore frameworks to build smart, connected strategies.",
        },
      ],
    },
    ctaSection: {
      title: "Book a Complimentary Consultation",
      paragraph1:
        "Share your plans for Swiss or international expansion, corporate domiciliation, bank onboarding, and administrative support. We will show you the best route forward.",
      paragraph2: "Click below to reserve your time slot now.",
      button: "Talk to us",
    },
  },
  DE: {
    hero: {
      title: "Geneva Wealth Partners",
      subtitle: "BERATUNG ZUR VERMöGENS- UND STEUERSTRUKTURIERUNG",
      cta: "Kontaktieren Sie uns",
    },
    servicesIntro: {
      title: "Unsere Dienstleistungen",
      paragraphs: [
        "Geneva Wealth Partners unterstützt Unternehmer, Investoren und Familien, die Unternehmen in der Schweiz oder im Ausland gründen möchten, mit maßgeschneiderter Beratung zur Vermögens- und Steuerstrukturierung.",
        "Wir rationalisieren jeden administrativen und bankentechnischen Schritt: Unternehmensgründung, Domizilierung, Firmenkonten, sichere Postbearbeitung und laufende maßgeschneiderte Beratung.",
      ],
      cta: "Mehr erfahren",
    },
    steps: {
      title: "Wie wir arbeiten",
      items: [
        {
          title: "Personalisierte Online-Bewertung",
          intro: "Wir überprüfen Ihr Vermögensprofil durch eine kurze Vorab-Prüfung:",
          bullets: [
            "Interaktiver Fragebogen zur Erfassung Ihrer Ziele.",
            "Umfassender Statusbericht.",
            "Vorläufige Empfehlungen innerhalb von 48 Stunden.",
          ],
          footnote: "Ideal für einen ersten, sicheren Ansatz.",
        },
        {
          title: "Maßgeschneiderte Beratung",
          intro: "Persönliche Gespräche mit Ihrem privaten Berater.",
          bullets: [
            "Geklärte Vermögens- und Steuerstrategien.",
            "Szenariovalidierung mit unseren Senior-Experten.",
          ],
          footnote: "Perfekt, um tief in Ihren maßgeschneiderten Plan einzutauchen.",
        },
        {
          title: "Treffen Sie Ihren Experten",
          intro: "Gemeinsam definieren wir Ihre strategischen Prioritäten:",
          bullets: [
            "Eingehende Analyse von Angesicht zu Angesicht.",
            "Individuelle Strukturen (SCI/SCCV, Holding, internationale Lösungen).",
            "Vertrauenswürdiges Netzwerk von Notaren und Anwälten für Sie mobilisiert.",
          ],
          footnote: "Exzellenz für anspruchsvolle Vermögen.",
        },
      ],
    },
    reasons: {
      title: "Warum uns wählen",
      items: [
        {
          title: "Privilegierter Zugang zu eingeschränkten Bankdienstleistungen",
          text: "Unsere internationalen Bankpartner ermöglichen es uns, Konten bei Instituten zu eröffnen, die für die meisten Privatkunden unzugänglich sind, einschließlich sensibler oder nicht-residenter Profile.",
        },
        {
          title: "Radikale Zeitersparnis",
          text: "Ein einziger Partner für Unternehmensgründung, Banking, Domizilierung und Steueroptimierung, damit Sie Monate verstreuter Prozesse vermeiden.",
        },
        {
          title: "Robuste, langlebige rechtliche Architekturen",
          text: "Wir entwerfen nur maßgeschneiderte Strukturen, die Steuerprüfungen standhalten und internationalen Vorschriften entsprechen.",
        },
        {
          title: "Absolute Vertraulichkeit und Sicherheit",
          text: "Diskretion bestimmt alles, was wir tun. Unsere Prozesse schützen Ihre Identität, Daten und Post vor unnötiger Offenlegung.",
        },
        {
          title: "Keine Interessenkonflikte",
          text: "Im Gegensatz zu Banken oder Family Offices nehmen wir keine Provisionen auf Ihre Vermögenswerte. Unsere Beratung ist vollständig unabhängig.",
        },
        {
          title: "Ganzheitliche, vernetzte Vision",
          text: "Wir beherrschen sowohl Inshore- als auch Offshore-Rahmen, um intelligente, vernetzte Strategien zu entwickeln.",
        },
      ],
    },
    ctaSection: {
      title: "Buchen Sie eine kostenlose Beratung",
      paragraph1:
        "Teilen Sie uns Ihre Pläne für Schweizer oder internationale Expansion, Firmendomizilierung, Bank-Onboarding und administrative Unterstützung mit. Wir zeigen Ihnen den besten Weg nach vorne.",
      paragraph2: "Klicken Sie unten, um jetzt Ihren Zeitfenster zu reservieren.",
      button: "Sprechen Sie mit uns",
    },
  },
  IT: {
    hero: {
      title: "Geneva Wealth Partners",
      subtitle: "CONSULENZA SULLA STRUTTURAZIONE PATRIMONIALE E FISCALE",
      cta: "Contattaci",
    },
    servicesIntro: {
      title: "I Nostri Servizi",
      paragraphs: [
        "Geneva Wealth Partners supporta imprenditori, investitori e famiglie che desiderano costituire società in Svizzera o all'estero con consulenza su misura sulla strutturazione patrimoniale e fiscale.",
        "Semplifichiamo ogni passaggio amministrativo e bancario: costituzione di società, domiciliazione, conti bancari aziendali, gestione sicura della corrispondenza e supporto personalizzato continuo.",
      ],
      cta: "Scopri di più",
    },
    steps: {
      title: "Come Lavoriamo",
      items: [
        {
          title: "Valutazione Online Personalizzata",
          intro: "Rivediamo il tuo profilo patrimoniale attraverso una breve pre-audit:",
          bullets: [
            "Questionario interattivo per acquisire i tuoi obiettivi.",
            "Rapporto completo sullo stato.",
            "Raccomandazioni preliminari entro 48 ore.",
          ],
          footnote: "Ideale per un primo approccio sicuro.",
        },
        {
          title: "Percorso di Consulenza Su Misura",
          intro: "Conversazioni dedicate con il tuo consulente privato.",
          bullets: [
            "Strategie patrimoniali e fiscali chiarite.",
            "Validazione degli scenari con i nostri esperti senior.",
          ],
          footnote: "Perfetto per approfondire il tuo piano personalizzato.",
        },
        {
          title: "Incontra il Tuo Esperto",
          intro: "Insieme definiamo le tue priorità strategiche:",
          bullets: [
            "Analisi approfondita faccia a faccia.",
            "Strutture personalizzate (SCI/SCCV, holding, soluzioni internazionali).",
            "Rete fidata di notai e avvocati mobilitata per te.",
          ],
          footnote: "Eccellenza su misura per patrimoni esigenti.",
        },
      ],
    },
    reasons: {
      title: "Perché Sceglierci",
      items: [
        {
          title: "Accesso privilegiato a servizi bancari riservati",
          text: "I nostri partner bancari internazionali ci consentono di aprire conti presso istituzioni che rimangono chiuse alla maggior parte dei clienti privati, compresi profili sensibili o non residenti.",
        },
        {
          title: "Risparmio di tempo radicale",
          text: "Un unico partner per costituzione aziendale, banking, domiciliazione e ottimizzazione fiscale, così eviti mesi di processi dispersi.",
        },
        {
          title: "Architetture legali robuste e durature",
          text: "Progettiamo solo strutture personalizzate che resistono agli audit fiscali e rispettano le normative internazionali.",
        },
        {
          title: "Riservatezza e sicurezza assolute",
          text: "La discrezione guida tutto ciò che facciamo. I nostri processi proteggono la tua identità, i dati e la corrispondenza da esposizioni non necessarie.",
        },
        {
          title: "Nessun conflitto di interessi",
          text: "A differenza di banche o family office, non prendiamo commissioni sui tuoi asset. La nostra consulenza è completamente indipendente.",
        },
        {
          title: "Visione olistica e interconnessa",
          text: "Padroneggiamo sia i framework in-shore che off-shore per costruire strategie intelligenti e connesse.",
        },
      ],
    },
    ctaSection: {
      title: "Prenota una Consulenza Gratuita",
      paragraph1:
        "Condividi i tuoi piani per l'espansione svizzera o internazionale, domiciliazione aziendale, onboarding bancario e supporto amministrativo. Ti mostreremo il miglior percorso da seguire.",
      paragraph2: "Clicca qui sotto per prenotare il tuo appuntamento ora.",
      button: "Parla con noi",
    },
  },
};

const Home = () => {
  const { lang } = useLanguage();
  const copy = content[lang] ?? content.FR;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-32 md:py-48 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={lacLemanImage}
            alt="Lac Léman - Geneva Wealth Partners"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wide">{copy.hero.title}</h1>
          <p className="text-base md:text-lg mb-8 font-light tracking-wider uppercase">{copy.hero.subtitle}</p>
          <Link
            to="/contact"
            className="inline-block border-2 border-white text-white px-8 py-3 font-light text-sm tracking-wide hover:bg-white hover:text-gray-800 transition-all"
          >
            {copy.hero.cta}
          </Link>
        </div>
      </section>

      {/* Services Intro Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-800">{copy.servicesIntro.title}</h2>
          {copy.servicesIntro.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-700 text-base mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              {paragraph}
            </p>
          ))}
          <Link
            to="/services"
            className="inline-block border border-gray-800 text-gray-800 px-8 py-3 font-light text-sm tracking-wide hover:bg-gray-800 hover:text-white transition-all"
          >
            {copy.servicesIntro.cta}
          </Link>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-4 text-gray-800 text-center tracking-wide">
            {copy.steps.title}
          </h2>
          <div className="w-24 h-1 bg-[#2d5f3f] mx-auto mb-20"></div>

          <div className="grid md:grid-cols-3 gap-0">
            {copy.steps.items.map((item, index) => (
              <div
                key={item.title}
                className={`relative text-white p-10 md:p-12 group transition-all duration-500 ${
                  index === 1
                    ? "bg-[#2d5f3f] hover:bg-[#1e4029] hover:-translate-y-2 hover:scale-105 hover:shadow-2xl md:-mt-8 md:shadow-2xl z-10"
                    : "bg-[#5a8f6f] hover:bg-[#4a7f5f] hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:z-20"
                }`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d={
                          index === 0
                            ? "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            : index === 1
                            ? "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            : "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        }
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-light mb-6 tracking-wide leading-tight">{item.title}</h3>
                <p className="font-light text-sm leading-relaxed mb-6 opacity-90">{item.intro}</p>
                <div className="space-y-3 mb-6">
                  {item.bullets.map((bullet) => (
                    <div className="flex items-start" key={bullet}>
                      <span className="text-white/60 mr-3">•</span>
                      <span className="text-sm font-light leading-relaxed">{bullet}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm font-light italic opacity-80">{item.footnote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-gray-800 text-center">{copy.reasons.title}</h2>

          <div className="grid md:grid-cols-3 gap-12">
            {copy.reasons.items.map((item) => (
              <div key={item.title}>
                <h3 className="text-xl font-light mb-4 text-gray-800 border-b border-gray-300 pb-2">{item.title}</h3>
                <p className="text-gray-700 font-light text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#2d5f3f] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">{copy.ctaSection.title}</h2>
          <p className="text-base mb-8 font-light leading-relaxed max-w-3xl mx-auto">{copy.ctaSection.paragraph1}</p>
          <p className="text-sm mb-8 font-light">{copy.ctaSection.paragraph2}</p>
          <Link
            to="/contact"
            className="inline-block border-2 border-white text-white px-10 py-3 font-light text-sm tracking-wide hover:bg-white hover:text-[#2d5f3f] transition-all"
          >
            {copy.ctaSection.button}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
