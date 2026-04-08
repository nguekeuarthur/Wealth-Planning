import React from 'react';
import background from '../../assets/images/legal-hero-bg.jpg';


const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Minimal and Elegant */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={background}
                        alt="Geneva Wealth Partners"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2d5f3f]/85 via-[#3d6f4f]/80 to-[#4d7f5f]/85"></div>
                </div>
                
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-block mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-px w-12 bg-white/40"></div>
                            <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <div className="h-px w-12 bg-white/40"></div>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white mb-6 tracking-wide">
                        Politique de confidentialité
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
                        Votre confiance est notre priorité. Nous nous engageons à protéger vos données personnelles.
                    </p>
                </div>
            </section>

            {/* Content Section - Clean and Spacious */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Introduction */}
                    <div className="mb-16">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                La présente politique de confidentialité a pour objectif d'informer les utilisateurs, clients, partenaires et prospects (ci‑après « vous ») de la manière dont <span className="font-medium text-[#2d5f3f]">Geneva Wealth Partners</span> (ci‑après « nous ») collecte, utilise, conserve et protège vos données à caractère personnel dans le cadre de ses activités de conseil en structuration patrimoniale et d'optimisation fiscale.
                            </p>
                            <p className="text-base text-gray-500 leading-relaxed">
                                Nous accordons une importance particulière à la confidentialité, à la sécurité et au respect de la réglementation applicable, notamment le Règlement Général sur la Protection des Données (RGPD – UE 2016/679) et la Loi fédérale sur la protection des données (LPD – nLPD).
                            </p>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-12">
                        {/* Section 1 */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Responsable du traitement</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-gray-600 leading-relaxed">
                                    Le traitement de vos données personnelles est de la responsabilité de Geneva Wealth Partners (« nous »). En fonction de la nature du traitement, nous pouvons également collaborer avec des tiers, tels que des prestataires de services ou des partenaires commerciaux, pour assurer une gestion optimale de vos données. Si vous avez des questions, vous pouvez nous contacter à <a href="mailto:info@genevawealthpartners.ch" className="text-[#2d5f3f] hover:text-[#1e4029] font-medium transition-colors border-b border-[#2d5f3f]/30 hover:border-[#2d5f3f]">info@genevawealthpartners.ch</a>
                                </p>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Données personnelles collectées</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Dans le cadre de nos missions de conseil financier, patrimonial et fiscal, nous pouvons être amenés à collecter les catégories de données suivantes :
                                </p>
                                
                                <div className="space-y-6">
                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Données d'identification</h3>
                                        <div className="grid md:grid-cols-2 gap-2 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Nom, prénom</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Date et lieu de naissance</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Adresse postale</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Adresse email</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Numéro de téléphone</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Situation familiale</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Données professionnelles</h3>
                                        <div className="grid md:grid-cols-2 gap-2 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Profession</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Situation professionnelle</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Revenus et sources de revenus</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Données patrimoniales et financières</h3>
                                        <div className="grid md:grid-cols-2 gap-2 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Composition du patrimoine</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Montants des actifs et passifs</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Informations bancaires</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Objectifs patrimoniaux et fiscaux</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Données fiscales</h3>
                                        <div className="grid md:grid-cols-2 gap-2 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Situation fiscale</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Résidence fiscale</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Taux d'imposition</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Données d'optimisation fiscale</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Données de navigation</h3>
                                        <div className="grid md:grid-cols-2 gap-2 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Adresse IP</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Données de connexion</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f]"></div>
                                                <span>Cookies et traceurs</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Finalités du traitement</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Vos données personnelles sont collectées et traitées pour les finalités suivantes :
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Fourniture de prestations de conseil en structuration patrimoniale</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Analyse et optimisation de la situation fiscale</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Élaboration de stratégies patrimoniales personnalisées</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Respect des obligations légales, réglementaires et déontologiques</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Gestion de la relation client et du suivi des dossiers</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Communication d'informations relatives à nos services</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Prévention de la fraude et gestion des risques</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4 */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Base légale des traitements</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Les traitements réalisés reposent sur les bases légales suivantes :
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Exécution d'un contrat ou de mesures précontractuelles, comme lors de la gestion de l'offre de service ou de demandes d'information.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Obligations légales et réglementaires applicables aux activités de conseil financier et patrimonial, que ce soit au niveau national ou international.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Consentement de la personne concernée, que vous nous donnez de manière explicite pour certaines actions spécifiques, comme l'inscription à des newsletters ou de manière implicite pour les communications marketing.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Intérêt légitime, dans le respect de vos droits et libertés, notamment lorsque le traitement des données est essentiel à la gestion de notre site internet, à l'amélioration continue des services proposés, ou à la sécurisation de vos différentes actions.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 5 */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Destinataires des données</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Vos données personnelles sont strictement confidentielles et destinées uniquement :
                                </p>
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Aux membres habilités de Geneva Wealth Partners.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Aux partenaires professionnels nécessaires à la réalisation des missions (experts-comptables, fiduciaire, notaires, avocats, établissements financiers), dans le respect des obligations de confidentialité.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Aux autorités administratives ou judiciaires lorsque la loi l'exige (FINMA, organes fiscaux)</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Sous-traitants techniques (hébergeurs certifiés).</span>
                                    </div>
                                </div>
                                <div className="bg-[#f0f7f4] border-l-4 border-[#2d5f3f] p-4 rounded-r">
                                    <p className="text-gray-700 text-sm">
                                        Aucune donnée n'est vendue ou cédée à des tiers à des fins commerciales.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 6 */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Durée de conservation</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Nous conservons vos données personnelles aussi longtemps que nécessaire pour atteindre les objectifs pour lesquels elles ont été collectées. Voici quelques exemples des périodes de conservation :
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <div>
                                            <span className="font-medium text-[#2d5f3f]">Données clients : </span>
                                            <span className="text-gray-600">durée de la relation contractuelle + obligations légales de conservation. Vos données sont conservées aussi longtemps que vous maintenez un compte actif sur notre site internet. Si vous demandez la suppression de votre compte, vos données seront supprimées sous 30 jours, sous réserve des créances ou obligations légales en cours.</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <div>
                                            <span className="font-medium text-[#2d5f3f]">Données prospects : </span>
                                            <span className="text-gray-600">jusqu'à 3 ans à compter du dernier contact</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <div>
                                            <span className="font-medium text-[#2d5f3f]">Données fiscales et patrimoniales : </span>
                                            <span className="text-gray-600">selon les durées légales (10 ans prescription fiscale) et réglementaires en vigueur.</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <div>
                                            <span className="font-medium text-[#2d5f3f]">Données techniques : </span>
                                            <span className="text-gray-600">Les cookies sont généralement conservés entre quelques jours et deux ans, selon leur usage.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 7 */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Sécurité des données</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées afin de garantir la sécurité, l'intégrité et la confidentialité de vos données, notamment :
                                </p>
                                <div className="grid md:grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center gap-3 bg-[#f0f7f4] px-4 py-3 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm">Accès restreint aux données</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#f0f7f4] px-4 py-3 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm">Stockage sécurisé</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#f0f7f4] px-4 py-3 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm">Serveurs sécurisés Suisse/UE</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#f0f7f4] px-4 py-3 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm">Authentification à deux facteurs</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#f0f7f4] px-4 py-3 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm">Sauvegardes cryptées quotidiennes</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#f0f7f4] px-4 py-3 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm">Sensibilisation continue</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm italic">
                                    Toutefois, même avec ces mesures, des risques résiduels de violation de la protection des données peuvent subsister, comme pour toute entreprise.
                                </p>
                            </div>
                        </div>

                        {/* Section 8 */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Droits des personnes concernées</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Conformément à la réglementation applicable, vous disposez des droits suivants :
                                </p>
                                <div className="grid md:grid-cols-2 gap-3 mb-6">
                                    <div className="flex items-center gap-3 bg-[#f0f7f4] px-4 py-3 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm">Droit d'accès à vos données</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#f0f7f4] px-4 py-3 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm">Droit de rectification</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#f0f7f4] px-4 py-3 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm">Droit à l'effacement</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#f0f7f4] px-4 py-3 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm">Droit à la limitation du traitement</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#f0f7f4] px-4 py-3 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm">Droit d'opposition</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#f0f7f4] px-4 py-3 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm">Droit à la portabilité</span>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] text-white p-6 rounded-xl">
                                    <p className="mb-3">
                                        Vous pouvez exercer ces droits en nous contactant à l'adresse suivante :
                                    </p>
                                    <a href="mailto:info@genevawealthpartners.ch" className="inline-flex items-center gap-2 text-white font-medium hover:underline">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        info@genevawealthpartners.ch
                                    </a>
                                </div>
                                <p className="text-gray-500 text-sm mt-4">
                                    Conformément au RGPD, vous avez le droit d'introduire une réclamation concernant le traitement de vos données personnelles auprès de l'autorité de protection des données de votre pays de résidence ou auprès du Comité européen de la protection des données (CEPD).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
