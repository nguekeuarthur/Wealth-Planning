import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";
import toast from "react-hot-toast";
import bgImage from "../../assets/images/contact.jpg";
import { useLanguage } from "../../context/languageContext";

const content = {
  FR: {
    hero: {
      title: "Contactez-Nous",
      subtitle: "Une question ? Besoin d'aide ? Notre équipe est là pour vous accompagner.",
    },
    form: {
      title: "Envoyez-nous un message",
      success: "Message envoyé avec succès ! Nous vous répondrons bientôt.",
      fields: {
        nameLabel: "Nom complet *",
        namePlaceholder: "Votre nom",
        emailLabel: "Email *",
        emailPlaceholder: "votre.email@exemple.com",
        serviceLabel: "Service *",
        servicePlaceholder: "Sélectionnez un service",
        messageLabel: "Message *",
        messagePlaceholder: "Décrivez votre demande...",
      },
      selectOptions: [
        "Création d'entreprise",
        "Ouverture de compte bancaire",
        "Service de Domiciliation",
        "Conseil en Structuration Patrimoniale",
        "Optimisation Fiscale",
        "Autre",
      ],
      button: "Envoyer le message",
    },
    contactInfo: {
      title: "Informations de contact",
      description:
        "Notre équipe est disponible du lundi au vendredi de 9h à 18h pour répondre à toutes vos questions et vous accompagner dans vos démarches.",
      emailLabel: "Email",
      emailNote: "Réponse sous 24h",
      phoneLabel: "Téléphone",
      phoneNote: "Lun-Ven 9h-18h",
      socialTitle: "Suivez-nous",
      mapPlaceholder: "Carte interactive (Google Maps)",
    },
    faq: {
      title: "Questions Fréquentes",
      subtitle: "Trouvez rapidement les réponses à vos questions",
      categories: [
        {
          category: "NOTRE APPROCHE",
          questions: [
            {
              question: "En quoi votre approche est-elle différente de celle de mon banquier ?",
              answer:
                "Contrairement à un banquier qui propose principalement ses produits, nous sommes indépendants et vous conseillons de manière neutre. Nous élaborons une stratégie patrimoniale globale qui intègre tous vos actifs, avec un seul objectif : servir exclusivement vos intérêts.",
            },
            {
              question: "À partir de quel patrimoine est-il pertinent de faire une analyse patrimoniale ?",
              answer:
                "Dès que vous commencez à accumuler des actifs ou avez des objectifs financiers spécifiques (transmission, création de société, ouverture de compte, optimisation fiscale). Il n'y a pas de montant minimum, mieux vaut anticiper que corriger.",
            },
          ],
        },
        {
          category: "NOS SERVICES",
          questions: [
            {
              question: "Quelle est la différence entre une SCI et une holding ?",
              answer:
                "Une SCI sert principalement à gérer un patrimoine immobilier familial. Une holding détient des participations et facilite la transmission ou l'optimisation d'un groupe de sociétés. Nous vous aidons à choisir la structure adaptée à vos objectifs.",
            },
            {
              question: "Quelle est la différence entre l'évasion fiscale et l'optimisation fiscale ?",
              answer:
                "Nous pratiquons uniquement l'optimisation fiscale, c'est-à-dire l'utilisation des dispositifs prévus par la loi pour réduire votre imposition. L'évasion fiscale (fraude) consiste à dissimuler des revenus ou actifs au fisc et est illégale.",
            },
            {
              question: "Proposez-vous un premier entretien gratuit ?",
              answer:
                "Oui, nous proposons un premier audit patrimonial sans engagement afin de comprendre vos objectifs et de vous présenter les axes d'optimisation que nous identifions.",
            },
          ],
        },
        {
          category: "ENGAGEMENT & TARIFS",
          questions: [
            {
              question: "Quels sont vos honoraires ?",
              answer:
                "Nos honoraires dépendent de la complexité de votre situation et de l'étendue du mandat. Après le diagnostic initial, vous recevez une proposition détaillée et forfaitaire pour éviter toute surprise.",
            },
            {
              question: "Comment garantissez-vous la confidentialité de mes données ?",
              answer:
                "La confidentialité est au cœur de notre métier. Vos données sont protégées par des engagements contractuels stricts et par des systèmes sécurisés. Nous sommes soumis au secret professionnel.",
            },
            {
              question: "Travaillez-vous avec des clients non-résidents ?",
              answer:
                "Oui, nous accompagnons de nombreux clients expatriés ou non-résidents. Nos experts maîtrisent les conventions fiscales internationales et les contraintes multi-juridictionnelles.",
            },
          ],
        },
      ],
    },
  },
  EN: {
    hero: {
      title: "Get In Touch",
      subtitle: "Questions or bespoke support needs? Our team is here to help.",
    },
    form: {
      title: "Send Us a Message",
      success: "Message sent successfully! We will be in touch shortly.",
      fields: {
        nameLabel: "Full name *",
        namePlaceholder: "Your name",
        emailLabel: "Email *",
        emailPlaceholder: "your.email@example.com",
        serviceLabel: "Service *",
        servicePlaceholder: "Select a service",
        messageLabel: "Message *",
        messagePlaceholder: "Tell us more about your request...",
      },
      selectOptions: [
        "Company formation",
        "Corporate bank onboarding",
        "Business domiciliation",
        "Wealth structuring advisory",
        "Tax optimisation",
        "Other",
      ],
      button: "Send message",
    },
    contactInfo: {
      title: "Contact information",
      description:
        "Our advisors are available Monday to Friday, 9am to 6pm (CET) to answer questions and guide you through each step.",
      emailLabel: "Email",
      emailNote: "Reply within 24h",
      phoneLabel: "Phone",
      phoneNote: "Mon–Fri 9am-6pm",
      socialTitle: "Follow us",
      mapPlaceholder: "Interactive map (Google Maps)",
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Find quick answers before we speak",
      categories: [
        {
          category: "OUR APPROACH",
          questions: [
            {
              question: "How is your approach different from a banker’s?",
              answer:
                "We are fully independent, so every recommendation is neutral and tailored to your entire balance sheet. Bankers typically distribute their in-house products, while we architect a global wealth strategy around your objectives.",
            },
            {
              question: "When should I request a wealth analysis?",
              answer:
                "As soon as you start growing assets or have clear financial goals (succession, company creation, account opening, tax optimisation). There is no minimum threshold—anticipation avoids costly corrections later.",
            },
          ],
        },
        {
          category: "OUR SERVICES",
          questions: [
            {
              question: "What is the difference between an SCI and a holding company?",
              answer:
                "In France an SCI manages family real estate, while a holding owns shares and optimises control or transmission of multiple companies. We help you determine the structure that best fits your goals.",
            },
            {
              question: "How do you distinguish tax optimisation from tax evasion?",
              answer:
                "Optimisation leverages legal frameworks (treaties, deductions, tailored structures) to reduce taxes. Evasion hides assets or revenues and is illegal—we strictly operate within compliant, auditable strategies.",
            },
            {
              question: "Do you offer an initial consultation?",
              answer:
                "Yes. We provide a complimentary introductory review to understand your objectives and outline how we can help.",
            },
          ],
        },
        {
          category: "ENGAGEMENT & FEES",
          questions: [
            {
              question: "How do your fees work?",
              answer:
                "Pricing depends on the complexity of your situation and scope. After the initial review you receive a transparent, fixed proposal so you know the exact cost before committing.",
            },
            {
              question: "How do you protect my confidential information?",
              answer:
                "Confidentiality is foundational to our work. Your data is protected by strict contractual clauses and secure infrastructure, and our advisors operate under professional secrecy.",
            },
            {
              question: "Do you work with non-resident or expatriate clients?",
              answer:
                "Absolutely. Managing cross-border holdings is one of our specialties, and we master the international tax treaties and obligations that come with it.",
            },
          ],
        },
      ],
    },
  },
  DE: {
    hero: {
      title: "Kontakt",
      subtitle: "Fragen oder individuelle Unterstützungswünsche? Unser Team ist für Sie da.",
    },
    form: {
      title: "Senden Sie uns eine Nachricht",
      success: "Nachricht erfolgreich gesendet! Wir werden uns in Kürze bei Ihnen melden.",
      fields: {
        nameLabel: "Vollständiger Name *",
        namePlaceholder: "Ihr Name",
        emailLabel: "E-Mail *",
        emailPlaceholder: "ihre.email@beispiel.com",
        serviceLabel: "Dienstleistung *",
        servicePlaceholder: "Wählen Sie eine Dienstleistung",
        messageLabel: "Nachricht *",
        messagePlaceholder: "Erzählen Sie uns mehr über Ihre Anfrage...",
      },
      selectOptions: [
        "Unternehmensgründung",
        "Firmenkonto-Eröffnung",
        "Geschäftsdomizilierung",
        "Vermögensstrukturierungsberatung",
        "Steueroptimierung",
        "Andere",
      ],
      button: "Nachricht senden",
    },
    contactInfo: {
      title: "Kontaktinformationen",
      description:
        "Unsere Berater sind Montag bis Freitag von 9 bis 18 Uhr (MEZ) verfügbar, um Fragen zu beantworten und Sie durch jeden Schritt zu führen.",
      emailLabel: "E-Mail",
      emailNote: "Antwort innerhalb von 24 Stunden",
      phoneLabel: "Telefon",
      phoneNote: "Mo–Fr 9–18 Uhr",
      socialTitle: "Folgen Sie uns",
      mapPlaceholder: "Interaktive Karte (Google Maps)",
    },
    faq: {
      title: "Häufig gestellte Fragen",
      subtitle: "Finden Sie schnelle Antworten, bevor wir sprechen",
      categories: [
        {
          category: "UNSER ANSATZ",
          questions: [
            {
              question: "Wie unterscheidet sich Ihr Ansatz von dem eines Bankers?",
              answer:
                "Wir sind völlig unabhängig, sodass jede Empfehlung neutral und auf Ihre gesamte Bilanz zugeschnitten ist. Banker vertreiben in der Regel ihre hausinternen Produkte, während wir eine globale Vermögensstrategie rund um Ihre Ziele entwickeln.",
            },
            {
              question: "Wann sollte ich eine Vermögensanalyse anfordern?",
              answer:
                "Sobald Sie beginnen, Vermögenswerte aufzubauen oder klare finanzielle Ziele haben (Nachfolge, Unternehmensgründung, Kontoeöffnung, Steueroptimierung). Es gibt keine Mindestschwelle – Vorbeugung vermeidet später kostspielige Korrekturen.",
            },
          ],
        },
        {
          category: "UNSERE DIENSTLEISTUNGEN",
          questions: [
            {
              question: "Was ist der Unterschied zwischen einer SCI und einer Holdinggesellschaft?",
              answer:
                "In Frankreich verwaltet eine SCI Familienimmobilien, während eine Holding Anteile besitzt und die Kontrolle oder Übertragung mehrerer Unternehmen optimiert. Wir helfen Ihnen, die Struktur zu bestimmen, die am besten zu Ihren Zielen passt.",
            },
            {
              question: "Wie unterscheiden Sie Steueroptimierung von Steuerhinterziehung?",
              answer:
                "Optimierung nutzt gesetzliche Rahmenbedingungen (Verträge, Abzüge, maßgeschneiderte Strukturen), um Steuern zu senken. Hinterziehung verbirgt Vermögenswerte oder Einnahmen und ist illegal – wir arbeiten streng innerhalb konformer, prüfbarer Strategien.",
            },
            {
              question: "Bieten Sie eine erste Beratung an?",
              answer:
                "Ja. Wir bieten eine kostenlose Einführungsprüfung an, um Ihre Ziele zu verstehen und zu skizzieren, wie wir helfen können.",
            },
          ],
        },
        {
          category: "ENGAGEMENT & GEBÜHREN",
          questions: [
            {
              question: "Wie funktionieren Ihre Gebühren?",
              answer:
                "Die Preisgestaltung hängt von der Komplexität Ihrer Situation und dem Umfang ab. Nach der ersten Überprüfung erhalten Sie ein transparentes, festes Angebot, damit Sie die genauen Kosten vor der Verpflichtung kennen.",
            },
            {
              question: "Wie schützen Sie meine vertraulichen Informationen?",
              answer:
                "Vertraulichkeit ist die Grundlage unserer Arbeit. Ihre Daten werden durch strikte vertragliche Klauseln und sichere Infrastruktur geschützt, und unsere Berater arbeiten unter Berufsgeheimnis.",
            },
            {
              question: "Arbeiten Sie mit nicht-residenten oder expatriierten Kunden?",
              answer:
                "Absolut. Die Verwaltung grenzüberschreitender Beteiligungen ist eine unserer Spezialitäten, und wir beherrschen die internationalen Steuerabkommen und Verpflichtungen, die damit einhergehen.",
            },
          ],
        },
      ],
    },
  },
  IT: {
    hero: {
      title: "Contattaci",
      subtitle: "Domande o esigenze di supporto personalizzate? Il nostro team è qui per aiutarti.",
    },
    form: {
      title: "Inviaci un Messaggio",
      success: "Messaggio inviato con successo! Ti contatteremo a breve.",
      fields: {
        nameLabel: "Nome completo *",
        namePlaceholder: "Il tuo nome",
        emailLabel: "Email *",
        emailPlaceholder: "tua.email@esempio.com",
        serviceLabel: "Servizio *",
        servicePlaceholder: "Seleziona un servizio",
        messageLabel: "Messaggio *",
        messagePlaceholder: "Raccontaci di più sulla tua richiesta...",
      },
      selectOptions: [
        "Costituzione aziendale",
        "Apertura conto aziendale",
        "Domiciliazione aziendale",
        "Consulenza sulla strutturazione patrimoniale",
        "Ottimizzazione fiscale",
        "Altro",
      ],
      button: "Invia messaggio",
    },
    contactInfo: {
      title: "Informazioni di contatto",
      description:
        "I nostri consulenti sono disponibili dal lunedì al venerdì, dalle 9 alle 18 (CET) per rispondere alle domande e guidarti in ogni fase.",
      emailLabel: "Email",
      emailNote: "Risposta entro 24 ore",
      phoneLabel: "Telefono",
      phoneNote: "Lun–Ven 9–18",
      socialTitle: "Seguici",
      mapPlaceholder: "Mappa interattiva (Google Maps)",
    },
    faq: {
      title: "Domande Frequenti",
      subtitle: "Trova risposte rapide prima di parlare",
      categories: [
        {
          category: "IL NOSTRO APPROCCIO",
          questions: [
            {
              question: "In che modo il vostro approccio è diverso da quello di un banchiere?",
              answer:
                "Siamo completamente indipendenti, quindi ogni raccomandazione è neutrale e su misura per l'intero bilancio. I banchieri in genere distribuiscono i loro prodotti interni, mentre noi archittetiamo una strategia patrimoniale globale attorno ai tuoi obiettivi.",
            },
            {
              question: "Quando dovrei richiedere un'analisi patrimoniale?",
              answer:
                "Non appena inizi a far crescere gli asset o hai obiettivi finanziari chiari (successione, costituzione aziendale, apertura conto, ottimizzazione fiscale). Non c'è una soglia minima: l'anticipazione evita correzioni costose in seguito.",
            },
          ],
        },
        {
          category: "I NOSTRI SERVIZI",
          questions: [
            {
              question: "Qual è la differenza tra una SCI e una holding?",
              answer:
                "In Francia una SCI gestisce immobili familiari, mentre una holding possiede quote e ottimizza il controllo o la trasmissione di più società. Ti aiutiamo a determinare la struttura che meglio si adatta ai tuoi obiettivi.",
            },
            {
              question: "Come distinguete l'ottimizzazione fiscale dall'evasione fiscale?",
              answer:
                "L'ottimizzazione sfrutta i quadri legali (trattati, deduzioni, strutture su misura) per ridurre le tasse. L'evasione nasconde asset o entrate ed è illegale: operiamo rigorosamente all'interno di strategie conformi e verificabili.",
            },
            {
              question: "Offrite una consulenza iniziale?",
              answer:
                "Sì. Forniamo una revisione introduttiva gratuita per comprendere i tuoi obiettivi e delineare come possiamo aiutare.",
            },
          ],
        },
        {
          category: "IMPEGNO E TARIFFE",
          questions: [
            {
              question: "Come funzionano le vostre tariffe?",
              answer:
                "Il prezzo dipende dalla complessità della tua situazione e dall'ambito. Dopo la revisione iniziale ricevi una proposta trasparente e fissa in modo da conoscere il costo esatto prima di impegnarti.",
            },
            {
              question: "Come proteggete le mie informazioni riservate?",
              answer:
                "La riservatezza è fondamentale per il nostro lavoro. I tuoi dati sono protetti da clausole contrattuali rigorose e infrastrutture sicure, e i nostri consulenti operano sotto segreto professionale.",
            },
            {
              question: "Lavorate con clienti non residenti o espatriati?",
              answer:
                "Assolutamente. La gestione di partecipazioni transfrontaliere è una delle nostre specialità e padroneggiamo i trattati fiscali internazionali e gli obblighi che ne derivano.",
            },
          ],
        },
      ],
    },
  },
};

const Contact = () => {
  const { lang } = useLanguage();
  const copy = content[lang] ?? content.FR;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(copy.form.success);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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

      {/* Contact Form & Info */}
      <section className="py-32 px-6 bg-gradient-to-b from-white via-[#f8faf9] to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2d5f3f] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5a8f6f] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-3xl opacity-40 group-hover:opacity-60 blur-xl transition-all duration-700"></div>
              <div className="relative bg-gradient-to-br from-white via-[#fafdfb] to-white rounded-3xl p-12 shadow-2xl border-2 border-[#2d5f3f]/20">
                <h2 className="text-4xl font-light text-[#1e4029] mb-8 tracking-tight">{copy.form.title}</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-transparent mb-10 rounded-full"></div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-light mb-3 text-lg">
                      {copy.form.fields.nameLabel}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors font-light text-lg"
                      placeholder={copy.form.fields.namePlaceholder}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-light mb-3 text-lg">
                      {copy.form.fields.emailLabel}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors font-light text-lg"
                      placeholder={copy.form.fields.emailPlaceholder}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-light mb-3 text-lg">
                      {copy.form.fields.serviceLabel}
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors font-light text-lg bg-white"
                    >
                      <option value="">{copy.form.fields.servicePlaceholder}</option>
                      {copy.form.selectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-light mb-3 text-lg">
                      {copy.form.fields.messageLabel}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors resize-none font-light text-lg"
                      placeholder={copy.form.fields.messagePlaceholder}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-[#2d5f3f] text-white py-5 rounded-xl font-light text-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]"
                  >
                    {copy.form.button}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-4xl font-light text-[#1e4029] mb-8 tracking-tight">{copy.contactInfo.title}</h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-transparent mb-10 rounded-full"></div>
              
              <p className="text-gray-700 mb-12 leading-relaxed text-lg font-light">
                {copy.contactInfo.description}
              </p>

              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start gap-6 group">
                  <div className="bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <FaEnvelope className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-light text-[#1e4029] mb-2 text-xl">{copy.contactInfo.emailLabel}</h3>
                    <a href="mailto:contact@genevawealth.com" className="text-[#2d5f3f] hover:text-[#5a8f6f] text-lg transition-colors">
                      contact@genevawealth.com
                    </a>
                    <p className="text-gray-600 text-base mt-2 font-light">{copy.contactInfo.emailNote}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-6 group">
                  <div className="bg-gradient-to-br from-[#5a8f6f] to-[#2d5f3f] w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <FaPhone className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-light text-[#1e4029] mb-2 text-xl">{copy.contactInfo.phoneLabel}</h3>
                    <a href="tel:+41223456789" className="text-[#2d5f3f] hover:text-[#5a8f6f] text-lg transition-colors">
                      +41 22 345 67 89
                    </a>
                    <p className="text-gray-600 text-base mt-2 font-light">{copy.contactInfo.phoneNote}</p>
                  </div>
                </div>

                {/* Address */}
                {/* <div className="flex items-start gap-6 group">
                  <div className="bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <FaMapMarkerAlt className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-light text-[#1e4029] mb-2 text-xl">Adresse</h3>
                    <p className="text-gray-700 font-light text-lg leading-relaxed">
                      Rue du Rhône 123<br />
                      1204 Genève, Suisse
                    </p>
                  </div>
                </div> */}
              </div>

              {/* Social Media */}
              <div className="mt-16">
                <h3 className="font-light text-[#1e4029] mb-6 text-2xl">{copy.contactInfo.socialTitle}</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] text-white w-14 h-14 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-500"
                  >
                    <FaLinkedin className="text-2xl" />
                  </a>
                  <a
                    href="#"
                    className="bg-gradient-to-br from-[#5a8f6f] to-[#2d5f3f] text-white w-14 h-14 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-500"
                  >
                    <FaTwitter className="text-2xl" />
                  </a>
                  <a
                    href="#"
                    className="bg-gradient-to-br from-[#1e4029] to-[#2d5f3f] text-white w-14 h-14 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-500"
                  >
                    <FaFacebook className="text-2xl" />
                  </a>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-72 flex items-center justify-center shadow-lg border-2 border-gray-200">
                <p className="text-gray-500 font-light text-lg">{copy.contactInfo.mapPlaceholder}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#f8faf9] via-white to-[#f0f7f3] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#2d5f3f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#5a8f6f]/5 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center mb-8 gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] animate-pulse shadow-lg"></div>
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#5a8f6f] to-[#2d5f3f] animate-pulse shadow-lg" style={{animationDelay: '0.2s'}}></div>
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#2d5f3f] to-[#1e4029] animate-pulse shadow-lg" style={{animationDelay: '0.4s'}}></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-light text-[#1e4029] mb-6 tracking-tight">
              {copy.faq.title}
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-transparent via-[#2d5f3f] to-transparent mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-700 font-light">
              {copy.faq.subtitle}
            </p>
          </div>

          <div className="space-y-8">
            {copy.faq.categories.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-6">
                <div className="mb-8">
                  <div className="inline-block">
                    <h3 className="text-2xl font-light text-[#2d5f3f] mb-2 tracking-wider">{section.category}</h3>
                    <div className="w-full h-1 bg-gradient-to-r from-[#2d5f3f] to-transparent rounded-full"></div>
                  </div>
                </div>
                
                {section.questions.map((faq, index) => (
                  <div key={index} className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] rounded-2xl opacity-20 group-hover:opacity-40 blur transition-all duration-500"></div>
                    <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100">
                      <h4 className="font-light text-xl text-[#1e4029] mb-4">
                        {faq.question}
                      </h4>
                      <p className="text-gray-700 font-light leading-relaxed text-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
