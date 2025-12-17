import React from 'react';
import background from '../../assets/images/legal-hero-bg.jpg';

const LegalNotice = () => {
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
                    <h1 className="text-4xl md:text-5xl font-normal tracking-wide mb-4 text-white drop-shadow-2xl">Mentions légales</h1>
                    <div className="w-24 h-0.5 bg-[#2d5f3f] mx-auto"></div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <p className="text-xl md:text-2xl font-normal text-[#2d5f3f] text-center max-w-3xl mx-auto mb-16 leading-relaxed hover:scale-105 hover:text-[#1e4029] transition-all duration-300 cursor-default">
                        Informations légales relatives à l'édition, l'hébergement et l'utilisation du site.
                    </p>

                    <div className="space-y-8">
                        <section className="p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm border-l-4 border-transparent hover:border-[#2d5f3f]">
                            <h2 className="text-2xl font-light text-[#1e4029] mb-4 tracking-wide">Éditeur du site</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Geneva Wealth Partners, 123 Rue de la Finance, 1200 Genève, Suisse.
                            </p>
                        </section>

                        <section className="p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm border-l-4 border-transparent hover:border-[#2d5f3f]">
                            <h2 className="text-2xl font-light text-[#1e4029] mb-4 tracking-wide">Hébergement</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Le site est hébergé par AWS France SAS, 8 Rue de la Ville, 75008 Paris, France.
                            </p>
                        </section>

                        <section className="p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm border-l-4 border-transparent hover:border-[#2d5f3f]">
                            <h2 className="text-2xl font-light text-[#1e4029] mb-4 tracking-wide">Propriété intellectuelle</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Tout le contenu du site (textes, images, logos, vidéos) est protégé par le droit d'auteur et les marques déposées de Geneva Wealth Partners. Toute reproduction, distribution ou utilisation non autorisée est strictement interdite.
                            </p>
                        </section>

                        <section className="p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm border-l-4 border-transparent hover:border-[#2d5f3f]">
                            <h2 className="text-2xl font-light text-[#1e4029] mb-4 tracking-wide">Responsabilité</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Geneva Wealth Partners ne saurait être tenu responsable des dommages directs ou indirects résultant de l'accès ou de l'utilisation du site.
                            </p>
                        </section>

                        <section className="p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm border-l-4 border-transparent hover:border-[#2d5f3f]">
                            <h2 className="text-2xl font-light text-[#1e4029] mb-4 tracking-wide">Contact</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Pour toute question relative aux mentions légales, veuillez nous contacter à <a href="mailto:info@genevawealthpartners.ch" className="text-[#2d5f3f] font-normal hover:underline">info@genevawealthpartners.ch</a>.
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LegalNotice;
