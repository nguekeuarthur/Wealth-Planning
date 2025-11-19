import React from "react";
import { Link } from "react-router-dom";
import lacLemanImage from "../../assets/images/lac-leman-alpes.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-32 md:py-48 px-6 overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <img 
            src={lacLemanImage} 
            alt="Lac Léman - Geneva Wealth Partners" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Contenu */}
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wide">
            Geneva Wealth Partners
          </h1>
          <p className="text-base md:text-lg mb-8 font-light tracking-wider uppercase">
            CONSEIL EN STRUCTURATION PATRIMONIALE ET FISCALE
          </p>
          <Link
            to="/contact"
            className="inline-block border-2 border-white text-white px-8 py-3 font-light text-sm tracking-wide hover:bg-white hover:text-gray-800 transition-all"
          >
            Rejoignez-nous
          </Link>
        </div>
      </section>

      {/* Nos Services Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-800">
            Nos Services
          </h2>
          <p className="text-gray-700 text-base mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Geneva Wealth Partners est une entreprise spécialisée dans le conseil et l'accompagnement en structuration patrimoniale et fiscale pour les entrepreneurs, investisseurs et particuliers souhaitant créer une société en Suisse ou à l'étranger.
          </p>
          <p className="text-gray-700 text-base mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Nous facilitons toutes les démarches administratives et bancaires allant de la création d'entreprise, la domiciliation, l'ouverture de compte bancaire, réception de courrier et accompagnement sur mesure.
          </p>
          <Link
            to="/services"
            className="inline-block border border-gray-800 text-gray-800 px-8 py-3 font-light text-sm tracking-wide hover:bg-gray-800 hover:text-white transition-all"
          >
            En savoir plus
          </Link>
        </div>
      </section>

      {/* Notre Fonctionnement Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-4 text-gray-800 text-center tracking-wide">
            Notre Fonctionnement
          </h2>
          <div className="w-24 h-1 bg-[#2d5f3f] mx-auto mb-20"></div>
          
          <div className="grid md:grid-cols-3 gap-0">
            {/* Étape 1 */}
            <div className="relative bg-[#5a8f6f] text-white p-10 md:p-12 group hover:bg-[#4a7f5f] transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
              <div className="mb-8">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light mb-6 tracking-wide leading-tight">
                Diagnostic Personnalisé<br/>en Ligne
              </h3>
              <p className="font-light text-sm leading-relaxed mb-6 opacity-90">
                Nous analysons votre situation patrimoniale grâce à un pré-audit :
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <span className="text-white/60 mr-3">•</span>
                  <span className="text-sm font-light leading-relaxed">Questionnaire interactif pour cerner vos objectifs.</span>
                </div>
                <div className="flex items-start">
                  <span className="text-white/60 mr-3">•</span>
                  <span className="text-sm font-light leading-relaxed">Bilan de la situation.</span>
                </div>
                <div className="flex items-start">
                  <span className="text-white/60 mr-3">•</span>
                  <span className="text-sm font-light leading-relaxed">Pré-Recommandations sous 48h.</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm font-light italic opacity-80">
                  Idéal pour une première approche sécurisée.
                </p>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="relative bg-[#2d5f3f] text-white p-10 md:p-12 group hover:bg-[#1e4029] transition-all duration-300 md:-mt-8 md:shadow-2xl z-10">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/30"></div>
              <div className="mb-8">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light mb-6 tracking-wide leading-tight">
                Bénéficiez d'un accompagnement<br/>sur mesure
              </h3>
              <p className="font-light text-sm leading-relaxed mb-6 opacity-90">
                Échanges avec votre conseiller dédié.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <span className="text-white/60 mr-3">•</span>
                  <span className="text-sm font-light leading-relaxed">Stratégies fiscales et patrimoniales clarifiées.</span>
                </div>
                <div className="flex items-start">
                  <span className="text-white/60 mr-3">•</span>
                  <span className="text-sm font-light leading-relaxed">Validation des scénarios par nos experts.</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm font-light italic opacity-80">
                  Parfait pour approfondir votre projet personnalisé.
                </p>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="relative bg-[#5a8f6f] text-white p-10 md:p-12 group hover:bg-[#4a7f5f] transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
              <div className="mb-8">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light mb-6 tracking-wide leading-tight">
                Rencontre avec<br/>votre expert
              </h3>
              <p className="font-light text-sm leading-relaxed mb-6 opacity-90">
                Pour définir les enjeux patrimoniaux :
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <span className="text-white/60 mr-3">•</span>
                  <span className="text-sm font-light leading-relaxed">Analyse approfondie en face-à-face.</span>
                </div>
                <div className="flex items-start">
                  <span className="text-white/60 mr-3">•</span>
                  <span className="text-sm font-light leading-relaxed">Montages sur-mesure (SCI/SCCV, holding, solutions internationales).</span>
                </div>
                <div className="flex items-start">
                  <span className="text-white/60 mr-3">•</span>
                  <span className="text-sm font-light leading-relaxed">Réseau d'experts (notaires, avocats) mobilisé pour vous.</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm font-light italic opacity-80">
                  L'excellence pour les patrimoines exigeants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi Nous Choisir Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-gray-800 text-center">
            Pourquoi Nous Choisir
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Avantage 1 */}
            <div>
              <h3 className="text-xl font-light mb-4 text-gray-800 border-b border-gray-300 pb-2">
                Accès privilégié à des solutions bancaires fermées
              </h3>
              <p className="text-gray-700 font-light text-sm leading-relaxed">
                Grâce à notre réseau de partenaires bancaires internationaux, nous ouvrons des comptes dans des établissements peu accessibles aux particuliers, y compris pour les profils complexes (non-résidents, secteurs sensibles, patrimoines familiaux).
              </p>
            </div>

            {/* Avantage 2 */}
            <div>
              <h3 className="text-xl font-light mb-4 text-gray-800 border-b border-gray-300 pb-2">
                Gain de temps radical
              </h3>
              <p className="text-gray-700 font-light text-sm leading-relaxed">
                Un seul interlocuteur pour gérer création d'entreprise + banque + domiciliation + optimisation fiscale, sans perdre des mois en démarches complexes.
              </p>
            </div>

            {/* Avantage 3 */}
            <div>
              <h3 className="text-xl font-light mb-4 text-gray-800 border-b border-gray-300 pb-2">
                Architectures juridiques robustes et pérennes
              </h3>
              <p className="text-gray-700 font-light text-sm leading-relaxed">
                Nous ne proposons pas de montages standards, mais des architectures sur mesure, résistantes aux audits fiscaux, conçues par des experts en droit international.
              </p>
            </div>

            {/* Avantage 4 */}
            <div>
              <h3 className="text-xl font-light mb-4 text-gray-800 border-b border-gray-300 pb-2">
                Discrétion et sécurité absolues
              </h3>
              <p className="text-gray-700 font-light text-sm leading-relaxed">
                Votre confidentialité est notre priorité. Nos solutions de domiciliation et gestion courrier garantissent anonymat et protection des données, sans papertraces inutiles.
              </p>
            </div>

            {/* Avantage 5 */}
            <div>
              <h3 className="text-xl font-light mb-4 text-gray-800 border-b border-gray-300 pb-2">
                Pas de conflits d'intérêts
              </h3>
              <p className="text-gray-700 font-light text-sm leading-relaxed">
                Contrairement aux banques ou family offices, nous ne touchons aucune commission sur vos placements. Nos conseils sont 100% impartiaux.
              </p>
            </div>

            {/* Avantage 6 */}
            <div>
              <h3 className="text-xl font-light mb-4 text-gray-800 border-b border-gray-300 pb-2">
                Approche globale et interconnectée
              </h3>
              <p className="text-gray-700 font-light text-sm leading-relaxed">
                Notre expertise duale nous permet de concevoir des stratégies sur mesure qui optimisent intelligemment les dispositifs inshore et offshore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#2d5f3f] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Réservez une Consultation Gratuite
          </h2>
          <p className="text-base mb-8 font-light leading-relaxed max-w-3xl mx-auto">
            Nous offrons des consultations gratuites pour discuter de vos besoins en matière de création d'entreprise en Suisse et offshore, domiciliation commerciale, ouverture de comptes bancaires, accompagnement administratif et patrimonial de clients internationaux.
          </p>
          <p className="text-sm mb-8 font-light">
            Cliquez ici pour réserver votre consultation dès maintenant.
          </p>
          <Link
            to="/contact"
            className="inline-block border-2 border-white text-white px-10 py-3 font-light text-sm tracking-wide hover:bg-white hover:text-[#2d5f3f] transition-all"
          >
            Rejoignez-nous
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
