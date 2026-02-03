/**
 * SEO Keywords optimisés pour Geneva Wealth Partners
 * Fichier de configuration des mots-clés et schémas SEO
 */

export const SEO_KEYWORDS = {
  // Mots-clés principaux
  primary: [
    "conseil en structuration patrimoniale",
    "conseil en structuration fiscale",
    "cabinet de conseil patrimonial",
    "cabinet de conseil fiscal",
    "optimisation patrimoniale",
    "optimisation fiscale",
    "ingénierie patrimoniale",
    "ingénierie fiscale",
  ],
  // Mots-clés métiers & expertise
  expertise: [
    "conseil en gestion de patrimoine",
    "structuration de patrimoine privé",
    "structuration de patrimoine professionnel",
    "audit patrimonial",
    "audit fiscal",
    "stratégie patrimoniale",
    "stratégie fiscale",
    "accompagnement patrimonial",
    "accompagnement fiscal",
  ],
  // Mots-clés fiscalité
  fiscalite: [
    "optimisation de la fiscalité",
    "réduction de l'imposition",
    "fiscalité du patrimoine",
    "fiscalité des revenus",
    "fiscalité des dirigeants",
    "fiscalité société immobilière",
    "fiscalité immobilière",
    "fiscalité des investissements",
    "fiscalité française et suisse",
  ],
  // Mots-clés transmission & protection
  transmission: [
    "transmission de patrimoine",
    "préparation de la succession",
    "stratégie successorale",
    "protection du patrimoine",
    "protection des dirigeants",
    "protection de la famille",
  ],
  // Mots-clés investissement & structures
  investissement: [
    "structuration d'investissements",
    "structuration holding",
    "création de holding patrimoniale",
    "organisation juridique et fiscale",
    "montage juridique et fiscal",
    "stratégie d'investissement patrimonial",
  ],
  // Mots-clés cibles clients
  clients: [
    "conseil patrimonial dirigeants",
    "conseil patrimonial chefs d'entreprise",
    "conseil patrimonial professions libérales",
    "conseil patrimonial investisseurs",
    "conseil patrimonial entrepreneurs",
    "conseil patrimonial particuliers fortunés",
    "conseil patrimonial HNWI",
  ],
  // Mots-clés géolocalisés
  geolocalises: [
    "cabinet de conseil patrimonial Genève",
    "cabinet de conseil en Suisse",
    "conseil en structuration patrimoniale France Suisse",
    "conseil fiscal patrimonial Paris Genève",
  ],
  // Mots-clés longue traîne
  longTail: [
    "comment optimiser son patrimoine",
    "comment structurer son patrimoine",
    "cabinet expert en structuration patrimoniale et fiscale",
    "accompagnement global patrimonial et fiscal",
    "conseil indépendant en structuration patrimoniale",
    "quitter la France stratégie patrimoniale",
    "expatriation patrimoniale haut de gamme",
    "protection patrimoine international famille",
    "sécurisation des actifs à l'étranger",
    "structuration patrimoniale France Suisse",
    "résidence fiscale et protection du patrimoine",
  ],
  // Mots-clés Google Ads acceptables
  googleAds: [
    "changement de résidence fiscale conseil",
    "expatriation accompagnement patrimonial",
    "protection patrimoine international",
    "structuration patrimoniale internationale",
    "comparaison fiscale France Suisse",
  ],
};

/**
 * Génère tous les mots-clés SEO combinés
 */
export const getAllKeywords = () => {
  return Object.values(SEO_KEYWORDS).flat().join(", ");
};

/**
 * Génère le schéma JSON-LD pour l'organisation
 */
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Geneva Wealth Partners",
  alternateName: "GWP",
  description:
    "Cabinet de conseil en structuration patrimoniale et fiscale à Genève. Expertise en optimisation fiscale, ingénierie patrimoniale, transmission de patrimoine et accompagnement des dirigeants, entrepreneurs et particuliers fortunés.",
  url: "https://www.genevawealthpartners.com",
  logo: "https://www.genevawealthpartners.com/logo.png",
  image: "https://www.genevawealthpartners.com/og-image.jpg",
  telephone: "+41 22 XXX XX XX",
  email: "contact@genevawealthpartners.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rue du Rhône",
    addressLocality: "Genève",
    postalCode: "1204",
    addressCountry: "CH",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "46.2044",
    longitude: "6.1432",
  },
  areaServed: [
    { "@type": "Country", name: "Suisse" },
    { "@type": "Country", name: "France" },
    { "@type": "City", name: "Genève" },
    { "@type": "City", name: "Paris" },
  ],
  priceRange: "€€€€",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [
    "https://www.linkedin.com/company/geneva-wealth-partners",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services de conseil patrimonial",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Conseil en structuration patrimoniale",
          description: "Optimisation et structuration de votre patrimoine privé et professionnel",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Optimisation fiscale",
          description: "Stratégies fiscales avancées pour dirigeants et particuliers fortunés",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Transmission de patrimoine",
          description: "Planification successorale et protection du patrimoine familial",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Création de holding patrimoniale",
          description: "Structuration holding et montages juridiques pour entrepreneurs",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Accompagnement expatriation",
          description: "Conseil en changement de résidence fiscale et protection patrimoine international",
        },
      },
    ],
  },
  knowsAbout: [
    "Structuration patrimoniale",
    "Optimisation fiscale",
    "Ingénierie patrimoniale",
    "Transmission de patrimoine",
    "Holding patrimoniale",
    "Fiscalité France Suisse",
    "Protection patrimoine international",
    "Conseil dirigeants",
    "Conseil HNWI",
  ],
});

/**
 * Génère le schéma JSON-LD pour les FAQ
 */
export const getFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

/**
 * Génère le schéma JSON-LD pour un service
 */
export const getServiceSchema = (service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: service.type,
  name: service.name,
  description: service.description,
  provider: {
    "@type": "FinancialService",
    name: "Geneva Wealth Partners",
  },
  areaServed: ["Suisse", "France", "Genève", "Paris"],
});

/**
 * Génère le schéma JSON-LD pour un article de blog / page
 */
export const getWebPageSchema = (page) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: page.title,
  description: page.description,
  url: page.url,
  publisher: {
    "@type": "Organization",
    name: "Geneva Wealth Partners",
  },
  inLanguage: page.language || "fr",
});

/**
 * Défaut descriptions SEO par page
 */
export const DEFAULT_SEO = {
  title: "Geneva Wealth Partners - Cabinet de Conseil en Structuration Patrimoniale et Fiscale | Genève Suisse",
  description: "Cabinet de conseil en structuration patrimoniale et fiscale à Genève. Expertise en optimisation fiscale, ingénierie patrimoniale, transmission de patrimoine pour dirigeants, entrepreneurs et particuliers fortunés. France - Suisse.",
};
