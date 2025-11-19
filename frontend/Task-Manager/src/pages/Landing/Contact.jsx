import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";
import toast from "react-hot-toast";
import bgImage from "../../assets/images/contact.jpg";

const Contact = () => {
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
    // Simulation d'envoi de formulaire
    toast.success("Message envoyé avec succès ! Nous vous répondrons bientôt.");
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
            Contactez-Nous
          </h1>
          <div className="w-32 h-1 bg-white/40 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed max-w-4xl mx-auto">
            Une question ? Besoin d'aide ? Notre équipe est là pour vous accompagner
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
                <h2 className="text-4xl font-light text-[#1e4029] mb-8 tracking-tight">Envoyez-nous un message</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-transparent mb-10 rounded-full"></div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-light mb-3 text-lg">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors font-light text-lg"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-light mb-3 text-lg">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors font-light text-lg"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-light mb-3 text-lg">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors font-light text-lg"
                      placeholder="Objet de votre message"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-light mb-3 text-lg">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5f3f] transition-colors resize-none font-light text-lg"
                      placeholder="Décrivez votre demande..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-[#2d5f3f] text-white py-5 rounded-xl font-light text-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-4xl font-light text-[#1e4029] mb-8 tracking-tight">Informations de contact</h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-transparent mb-10 rounded-full"></div>
              
              <p className="text-gray-700 mb-12 leading-relaxed text-lg font-light">
                Notre équipe est disponible du lundi au vendredi de 9h à 18h pour répondre à 
                toutes vos questions et vous accompagner dans vos démarches.
              </p>

              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start gap-6 group">
                  <div className="bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <FaEnvelope className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-light text-[#1e4029] mb-2 text-xl">Email</h3>
                    <a href="mailto:contact@genevawealth.com" className="text-[#2d5f3f] hover:text-[#5a8f6f] text-lg transition-colors">
                      contact@genevawealth.com
                    </a>
                    <p className="text-gray-600 text-base mt-2 font-light">Réponse sous 24h</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-6 group">
                  <div className="bg-gradient-to-br from-[#5a8f6f] to-[#2d5f3f] w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <FaPhone className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-light text-[#1e4029] mb-2 text-xl">Téléphone</h3>
                    <a href="tel:+41223456789" className="text-[#2d5f3f] hover:text-[#5a8f6f] text-lg transition-colors">
                      +41 22 345 67 89
                    </a>
                    <p className="text-gray-600 text-base mt-2 font-light">Lun-Ven 9h-18h</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-6 group">
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
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-16">
                <h3 className="font-light text-[#1e4029] mb-6 text-2xl">Suivez-nous</h3>
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
                <p className="text-gray-500 font-light text-lg">Carte interactive (Google Maps)</p>
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
              Questions Fréquentes
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-transparent via-[#2d5f3f] to-transparent mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-700 font-light">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                category: "NOTRE APPROCHE",
                questions: [
                  {
                    question: "En quoi votre approche est-elle différente de celle de mon banquier?",
                    answer: "Contrairement à un banquier qui propose principalement ses produits, nous sommes indépendants et vous conseillons de manière neutre. Nous élaborons une stratégie patrimoniale globale qui intègre tous vos actifs, y compris ceux détenus ailleurs, avec un seul objectif : servir exclusivement vos intérêts."
                  },
                  {
                    question: "À partir de quel patrimoine est-il pertinent de faire une analyse patrimoniale?",
                    answer: "Dès que vous commencez à accumuler des actifs ou avez des objectifs financiers spécifiques (transmission, création de société, ouverture de compte, structuration patrimoniale, optimisation fiscale). Il n'y a pas de montant minimum. Mieux vaut anticiper que devoir corriger une situation."
                  }
                ]
              },
              {
                category: "NOS SERVICES",
                questions: [
                  {
                    question: "Quelle est la différence entre une SCI et une holding?",
                    answer: "Une SCI est généralement utilisée pour gérer un patrimoine immobilier familial. Une holding sert à détenir des parts de sociétés et à optimiser la transmission d'un ensemble d'entreprises. Le choix dépend de votre situation et de vos objectifs ; nous vous aidons à déterminer la structure la plus adaptée."
                  },
                  {
                    question: "Quelle est la différence entre l'évasion fiscale et l'optimisation fiscale?",
                    answer: "Nous pratiquons l'optimisation fiscale, qui consiste à utiliser les dispositifs prévus par la loi (investissements défiscalisants, choix de régimes fiscaux avantageux, conventions internationales) pour réduire votre charge fiscale de manière parfaitement légale. L'évasion fiscale (ou fraude fiscale) est illégale et consiste à dissimuler une partie de son patrimoine ou de ses revenus au fisc (ne pas déclarer un compte bancaire à l'étranger, facturer des dépenses personnelles en frais professionnels, utiliser des montages artificiels sans substance économique réelle)."
                  },
                  {
                    question: "Proposez-vous un premier entretien gratuit?",
                    answer: "Oui. Nous proposons un premier audit patrimonial sans engagement. Cela nous permet de comprendre vos objectifs et de vous présenter les axes d'optimisation que nous identifions, ainsi que notre méthodologie."
                  }
                ]
              },
              {
                category: "ENGAGEMENT & TARIFS",
                questions: [
                  {
                    question: "Quels sont vos honoraires?",
                    answer: "Notre modèle est transparent. Il varie selon la complexité de votre situation et l'étendue du mandat. Après le diagnostic initial, nous vous présentons une proposition commerciale détaillée et forfaitaire, afin que vous connaissiez le coût exact de notre accompagnement avant de vous engager."
                  },
                  {
                    question: "Comment garantissez-vous la confidentialité de mes données?",
                    answer: "La confidentialité est au cœur de notre métier. Toutes vos informations sont protégées par une clause de confidentialité stricte dans notre contrat et par des systèmes informatiques sécurisés. Nous sommes soumis au secret professionnel."
                  },
                  {
                    question: "Travaillez-vous avec des clients non-résident / non-Suisse / expatriés ?",
                    answer: "Oui, c'est l'une de nos expertises. La gestion d'un patrimoine à l'international ou lorsque l'on est expatrié demande une connaissance pointue des conventions fiscales. Nous accompagnons de nombreux clients dans cette situation."
                  }
                ]
              }
            ].map((section, sectionIndex) => (
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
