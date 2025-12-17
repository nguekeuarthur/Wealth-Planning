import React from 'react';
import background from '../../assets/images/legal-hero-bg.jpg';

const PrivacyPolicy = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={background}
                        alt="Geneva Wealth Partners"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-4xl md:text-5xl font-normal tracking-wide mb-4 text-white drop-shadow-2xl">Politique de confidentialité</h1>
                    <div className="w-24 h-0.5 bg-[#2d5f3f] mx-auto"></div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <p className="text-xl md://text-2xl font-normal text-[#2d5f3f] text-center max-w-3xl mx-auto mb-16 leading-relaxed hover:scale-105 hover:text-[#1e4029] transition-all duration-300 cursor-default">
                        Cette page décrit la manière dont nous collectons, utilisons, stockons et protégeons vos données personnelles.
                    </p>

                    <div className="space-y-8">
                        <section className="p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm border-l-4 border-transparent hover:border-[#2d5f3f]">
                            <h2 className="text-2xl font-light text-[#1e4029] mb-4 tracking-wide">Données collectées</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Nous collectons les informations suivantes : nom, adresse e‑mail, coordonnées de contact, données d’utilisation du site, et toute autre information que vous choisissez de nous fournir.
                            </p>
                        </section>

                        <section className="p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm border-l-4 border-transparent hover:border-[#2d5f3f]">
                            <h2 className="text-2xl font-light text-[#1e4029] mb-4 tracking-wide">Utilisation des données</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Vos données sont utilisées pour fournir nos services, améliorer l’expérience utilisateur, communiquer avec vous, et respecter nos obligations légales.
                            </p>
                        </section>

                        <section className="p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm border-l-4 border-transparent hover:border-[#2d5f3f]">
                            <h2 className="text-2xl font-light text-[#1e4029] mb-4 tracking-wide">Conservation des données</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Les données sont conservées pendant la durée nécessaire aux finalités décrites, ou conformément aux exigences légales.
                            </p>
                        </section>

                        <section className="p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm border-l-4 border-transparent hover:border-[#2d5f3f]">
                            <h2 className="text-2xl font-light text-[#1e4029] mb-4 tracking-wide">Droits des utilisateurs</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Vous avez le droit d’accéder, de rectifier, de supprimer ou de limiter le traitement de vos données. Vous pouvez également vous opposer à leur utilisation à des fins de marketing.
                            </p>
                        </section>

                        <section className="p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm border-l-4 border-transparent hover:border-[#2d5f3f]">
                            <h2 className="text-2xl font-light text-[#1e4029] mb-4 tracking-wide">Sécurité</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé.
                            </p>
                        </section>

                        <section className="p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm border-l-4 border-transparent hover:border-[#2d5f3f]">
                            <h2 className="text-2xl font-light text-[#1e4029] mb-4 tracking-wide">Contact</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Pour exercer vos droits ou pour toute question relative à la confidentialité, veuillez nous contacter à <a href="mailto:info@genevawealthpartners.ch" className="text-[#2d5f3f] font-normal hover:underline">info@genevawealthpartners.ch</a>.
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
