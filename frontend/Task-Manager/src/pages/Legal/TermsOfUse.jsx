import React from 'react';
import background from '../../assets/images/legal-hero-bg.jpg';

const TermsOfUse = () => {
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
                        Conditions d'utilisation
                    </h1>
                    <div className="w-32 h-1 bg-white/60 mx-auto mb-6"></div>
                    <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto">
                        Cadre légal de nos services
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
                            Les présentes conditions régissent l'utilisation du site et des services proposés par Geneva Wealth Partners.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Accès au service</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    L'accès au site est réservé aux utilisateurs disposant d'un compte valide. Nous nous réservons le droit de suspendre ou de résilier tout compte en cas de non‑respect des présentes conditions.
                                </p>
                            </div>
                        </section>

                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Compte utilisateur</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités réalisées avec votre compte. Toute utilisation non autorisée doit être immédiatement signalée.
                                </p>
                            </div>
                        </section>

                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Utilisation acceptable</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    Vous vous engagez à utiliser le site de manière légale et conforme aux présentes conditions. Toute activité frauduleuse, illégale ou nuisible est strictement interdite.
                                </p>
                            </div>
                        </section>

                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Responsabilités</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    Geneva Wealth Partners ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site, y compris les pertes de données ou de profits.
                                </p>
                            </div>
                        </section>

                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Propriété intellectuelle</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    Tous les contenus présents sur le site, y compris les textes, images, logos et graphismes, sont la propriété de Geneva Wealth Partners et protégés par les lois sur la propriété intellectuelle.
                                </p>
                            </div>
                        </section>

                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Modifications</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    Nous nous réservons le droit de modifier à tout moment les présentes conditions. Les modifications seront effectives dès leur publication sur le site. Il est de votre responsabilité de consulter régulièrement cette page.
                                </p>
                            </div>
                        </section>

                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Sécurité</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    Nous mettons en œuvre des mesures de sécurité raisonnables pour protéger les données, mais nous ne pouvons garantir une sécurité absolue. La transmission de données via Internet comporte toujours des risques.
                                </p>
                            </div>
                        </section>

                        <section className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-[#2d5f3f] via-[#5a8f6f] to-[#1e4029] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#2d5f3f] transform group-hover:scale-[1.02]">
                                <h2 className="text-3xl font-light text-[#1e4029] mb-4 tracking-tight">Contact</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#2d5f3f] to-[#5a8f6f] mb-4 rounded-full"></div>
                                <p className="text-gray-700 font-light leading-relaxed text-lg">
                                    Pour toute question relative aux conditions d'utilisation, veuillez nous contacter à <a href="mailto:info@genevawealthpartners.ch" className="text-[#2d5f3f] font-medium hover:text-[#1e4029] underline decoration-2 underline-offset-4 transition-colors">info@genevawealthpartners.ch</a>.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsOfUse;
