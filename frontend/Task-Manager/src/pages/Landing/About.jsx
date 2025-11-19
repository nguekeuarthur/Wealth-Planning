import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1e4029] via-[#2d5f3f] to-[#1e4029]">
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
            À Propos de Nous
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed max-w-4xl mx-auto">
            Chez <span className="font-normal border-b-2 border-white/40">Geneva Wealth Partners</span>, nous mettons notre expertise au service des entrepreneurs, investisseurs et particuliers du monde entier souhaitant établir leur présence en Suisse et à l'étranger.
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
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-[#2d5f3f] rounded-3xl opacity-75 group-hover:opacity-100 blur-lg group-hover:blur-xl transition-all duration-700 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-white to-[#f8faf9] p-14 rounded-3xl shadow-2xl border-2 border-[#2d5f3f]/20 transform group-hover:scale-[1.02] transition-all duration-500">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#2d5f3f] flex items-center justify-center mb-8 shadow-2xl transform group-hover:rotate-6 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-5xl font-light text-[#1e4029] mb-6 tracking-tight">Notre Expertise</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-transparent mb-8 rounded-full"></div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Nous mettons à votre disposition notre expertise approfondie dans la structuration patrimoniale et fiscale, ainsi que dans toutes les démarches administratives et bancaires tant nationales qu'internationales. Nous vous accompagnons dans la prise de décisions avisées pour optimiser votre situation financière et patrimoniale.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-l from-[#5a8f6f] via-[#2d5f3f] to-[#5a8f6f] rounded-3xl opacity-75 group-hover:opacity-100 blur-lg group-hover:blur-xl transition-all duration-700 animate-pulse"></div>
              <div className="relative bg-gradient-to-bl from-white to-[#f8faf9] p-14 rounded-3xl shadow-2xl border-2 border-[#5a8f6f]/20 transform group-hover:scale-[1.02] transition-all duration-500">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5a8f6f] via-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center mb-8 shadow-2xl transform group-hover:-rotate-6 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-5xl font-light text-[#1e4029] mb-6 tracking-tight">Notre Philosophie</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#5a8f6f] via-[#2d5f3f] to-transparent mb-8 rounded-full"></div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Notre philosophie repose sur une approche personnalisée, transparente et éthique. Nous croyons en l'importance de bâtir des relations de confiance avec nos clients, en fournissant des conseils fiables et en agissant dans leur intérêt supérieur.
                </p>
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
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition duration-700 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-white via-[#f8fdf9] to-white rounded-3xl shadow-2xl overflow-hidden transform hover:-translate-y-4 hover:rotate-1 transition-all duration-700 border-t-4 border-[#2d5f3f]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2d5f3f]/10 via-[#5a8f6f]/5 to-transparent rounded-full -mr-32 -mt-32"></div>
                <div className="p-14 relative">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] flex items-center justify-center mb-10 shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-light text-[#1e4029] mb-6 tracking-tight leading-tight">
                    Notre Engagement envers les Résultats
                  </h3>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-[#2d5f3f] via-[#5a8f6f] to-transparent mb-8 rounded-full"></div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Nous nous engageons à atteindre des résultats concrets et durables pour nos clients. Notre approche proactive et notre recherche constante de solutions innovantes nous permettent de répondre aux besoins spécifiques de chaque client avec efficacité.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-bl from-[#5a8f6f] via-[#2d5f3f] to-[#1e4029] rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition duration-700 animate-pulse"></div>
              <div className="relative bg-gradient-to-bl from-white via-[#f8fdf9] to-white rounded-3xl shadow-2xl overflow-hidden transform hover:-translate-y-4 hover:-rotate-1 transition-all duration-700 border-t-4 border-[#5a8f6f]">
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-bl from-[#5a8f6f]/10 via-[#2d5f3f]/5 to-transparent rounded-full -ml-32 -mt-32"></div>
                <div className="p-14 relative">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#5a8f6f] via-[#2d5f3f] to-[#1e4029] flex items-center justify-center mb-10 shadow-2xl transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-light text-[#1e4029] mb-6 tracking-tight leading-tight">
                    Notre Expérience
                  </h3>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-[#5a8f6f] via-[#2d5f3f] to-transparent mb-8 rounded-full"></div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Fort de nombreuses années d'expérience, notre équipe a accompagné avec succès de nombreux entrepreneurs, investisseurs et particuliers dans la structuration et la gestion de leur patrimoine. Nous sommes fiers de notre parcours et des réussites de nos clients.
                  </p>
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
                <span className="uppercase tracking-widest text-sm font-light text-white/70">Excellence Suisse</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-light mb-10 tracking-wide">
                Nos Services
              </h2>
              
              <p className="text-xl font-light leading-relaxed text-white/90 mb-6">
                Notre équipe est composée de professionnels ayant une solide expérience en banque privée suisse.
              </p>
              <p className="text-lg font-light leading-relaxed text-white/80">
                Ce savoir-faire nous permet d'offrir des solutions haut de gamme, dans un cadre sécurisé, rigoureux et conforme aux standards les plus exigeants.
              </p>
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
              Nos Valeurs
            </h2>
            <div className="w-32 h-2 bg-gradient-to-r from-transparent via-[#2d5f3f] to-transparent mx-auto mb-6 rounded-full"></div>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Les principes fondamentaux qui guident notre excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { 
                title: "Transparence", 
                icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                text: "Chez Geneva Wealth Partners, nous croyons que la confiance naît de la clarté. Nous nous engageons à fournir à nos clients une information claire, loyale et accessible à chaque étape du processus. Aucune surprise, tout est expliqué, documenté et justifié."
              },
              { 
                title: "Accompagnement sur mesure", 
                icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
                text: "Nous plaçons l'humain au cœur de notre démarche. Chaque client bénéficie d'un accompagnement personnalisé, de la création d'entreprise à l'ouverture de comptes bancaires, en passant par la domiciliation et la gestion administrative."
              },
              { 
                title: "Excellence du service", 
                icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
                text: "Notre mission est de simplifier vos démarches tout en vous garantissant un service de qualité suisse. Réactivité, efficacité et sens du détail sont les piliers de notre engagement quotidien."
              },
              { 
                title: "Discrétion absolue", 
                icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                text: "Nous traitons chaque dossier avec la plus grande confidentialité. Qu'il s'agisse de structures offshore, de courriers sensibles ou d'actifs patrimoniaux, nous garantissons une discrétion irréprochable, dans le respect des normes en vigueur."
              },
              { 
                title: "Fiabilité", 
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                text: "Notre logo, marqué par la clé et l'écusson, symbolise la confiance et la protection. En choisissant Geneva Wealth Partners, vous choisissez un partenaire fiable, intègre et rigoureux, capable de vous représenter durablement en Suisse et à l'étranger."
              }
            ].map((value, index) => (
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
