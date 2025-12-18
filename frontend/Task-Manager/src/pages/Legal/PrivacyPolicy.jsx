import React from 'react';
import background from '../../assets/images/legal-hero-bg.jpg';

const PrivacyPolicy = () => {
    return (
        <div className="bg-gradient-to-b from-white via-[#f8faf9] to-white min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={background}
                        alt="Geneva Wealth Partners"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1e4029]/80 via-[#2d5f3f]/75 to-[#1e4029]/80"></div>
                </div>

                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6 text-white drop-shadow-2xl">
                        Politique de confidentialité
                    </h1>
                    <div className="w-32 h-1 bg-white/60 mx-auto mb-6"></div>
                    <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto">
                        Votre confiance est notre priorité
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 px-6 relative">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2d5f3f] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5a8f6f] rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 md:p-16 mb-12 border border-[#2d5f3f]/10">
                        <p className="text-xl md:text-2xl font-light text-[#1e4029] text-center leading-relaxed">
                            Cette page décrit la manière dont nous collectons, utilisons, stockons et protégeons vos données personnelles.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Données collectées</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    Nous collectons les informations suivantes : nom, adresse e‑mail, coordonnées de contact, données d'utilisation du site, et toute autre information que vous choisissez de nous fournir.
                                </p>
                            </div>
                        </section>

                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Utilisation des données</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    Vos données sont utilisées pour fournir nos services, améliorer l'expérience utilisateur, communiquer avec vous, et respecter nos obligations légales.
                                </p>
                            </div>
                        </section>

                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Conservation des données</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    Les données sont conservées pendant la durée nécessaire aux finalités décrites, ou conformément aux exigences légales.
                                </p>
                            </div>
                        </section>

                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Droits des utilisateurs</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    Vous avez le droit d'accéder, de rectifier, de supprimer ou de limiter le traitement de vos données. Vous pouvez également vous opposer à leur utilisation à des fins de marketing.
                                </p>
                            </div>
                        </section>

                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Sécurité</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé.
                                </p>
                            </div>
                        </section>

                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Contact</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    Pour exercer vos droits ou pour toute question relative à la confidentialité, veuillez nous contacter à <a href="mailto:info@genevawealthpartners.ch" className="text-[#2d5f3f] font-medium hover:text-[#1e4029] underline decoration-2 underline-offset-4 transition-colors">info@genevawealthpartners.ch</a>.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
