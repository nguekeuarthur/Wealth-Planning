import React from 'react';
import background from '../../assets/images/legal-hero-bg.jpg';

const TermsOfUse = () => {
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div className="h-px w-12 bg-white/40"></div>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white mb-6 tracking-wide">
                        Conditions d'utilisation
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
                        Cadre légal de nos services
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
                                Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'accès et l'utilisation du site internet <a href="https://www.genevawealthpartners.ch" className="text-[#2d5f3f] hover:text-[#1e4029] font-medium transition-colors border-b border-[#2d5f3f]/30 hover:border-[#2d5f3f]">www.genevawealthpartners.ch</a> (ci-après "le Site"), édité par <span className="font-medium text-[#2d5f3f]">Geneva Wealth Partners</span>, dont son siège social se trouve à Tallinn, Estonie. Numéro d'identification : 17395267 (ci-après "nous", "notre", "nos", "Éditeur"). Hébergement : Infomaniak, Rue Eugène-Marziano 25, 1227 Genève.
                            </p>
                            <p className="text-base text-gray-500 leading-relaxed">
                                En accédant au Site, vous acceptez sans réserve les présentes CGU. Ces CGU prévalent sur toute autre communication précontractuelle via le Site. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre Site.
                            </p>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-12">
                        {/* Section Activité */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Activité</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-gray-600 leading-relaxed">
                                    Les prestations proposées relèvent du conseil en structuration patrimoniale, optimisation fiscale internationale et planification successorale. Ces services sont fournis à titre informatif et stratégique dans le cadre de consultations préalables. Ils ne constituent pas un conseil en investissement réglementé au sens de la loi Européenne sur les services financiers, ni un conseil juridique ou fiscal engageant notre responsabilité.
                                </p>
                            </div>
                        </div>

                        {/* Section Accès au Site */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Accès au site</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    L'accès au Site est gratuit, à l'exception des éventuels frais de connexion facturés par votre fournisseur d'accès à internet. Nous mettons en œuvre toutes les solutions techniques à notre disposition pour permettre l'accès au site 24h sur 24h et 7 jours sur 7.
                                </p>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Néanmoins nous nous réservons le droit de :
                                </p>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Suspendre, interrompre ou limiter l'accès au Site pour maintenance ou mise à jour</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Modifier les contenus à tout moment</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Restreindre l'accès à certaines parties du Site</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm italic">
                                    Les présentes CGU s'appliquent à toute déclinaison ou extension du site sur les réseaux sociaux existants ou à venir.
                                </p>

                                {/* Sous-sections */}
                                <div className="mt-6 space-y-6">
                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Accès et utilisation de l'espace client</h3>
                                        <p className="text-gray-600 mb-3">
                                            Pour y accéder, le client doit accepter les présentes Conditions Générales d'Utilisation pour créer un compte personnel sur le site https://www.genevawealthpartners.ch.
                                        </p>
                                        <p className="text-gray-600 mb-3">Le client s'engage à :</p>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600">Conserver la confidentialité de ses d'accès et à ne les divulguer à aucun tiers.</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600">Être l'unique responsable de toute utilisation faite à l'aide de ses identifiants et de l'accès à son espace client, sauf preuve d'une utilisation frauduleuse qui ne pourrait raisonnablement lui être imputée.</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600">Notifier immédiatement par écrit à Geneva Wealth Partners de toute utilisation non autorisée, perte ou vol de ses d'accès dont il aurait connaissance.</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">L'espace client</h3>
                                        <p className="text-gray-600">
                                            Nous proposons un espace client ou personnel, l'utilisateur s'engage à fournir des informations exactes lors de son inscription. L'identifiant et le mot de passe sont personnels et confidentiels. L'utilisateur est seul responsable de l'usage de son compte et s'engage à prendre toutes les précautions nécessaires pour assurer la sécurité de ses identifiants.
                                        </p>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Protection des données</h3>
                                        <p className="text-gray-600">
                                            Nous nous engageons à respecter les dispositions légales relatives à la protection des données personnelles. Les modalités de collecte et de traitement des données de l'utilisateur sont détaillées dans la Politique de Confidentialité du notre Site, qui fait partie intégrante des présentes CGU et que l'utilisateur est invité à consulter.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section Contenu et Informations */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Contenu et informations</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Les informations et contenus diffusés sur le site (articles, études de cas, outils de simulation, documents téléchargeables, etc.) sont fournis à titre strictement informatif. Ils ne constituent pas un conseil personnalisé, juridique, fiscal ou financier. Il est destiné à présenter l'activité de l'Éditeur et à éduquer les utilisateurs sur des thématiques patrimoniales, financières, juridiques et fiscales.
                                </p>
                                <div className="bg-[#f0f7f4] border-l-4 border-[#2d5f3f] p-4 rounded-r mb-6">
                                    <p className="text-gray-700 text-sm font-medium">
                                        Toute décision prise sur la base des informations présentées relève de la seule responsabilité de l'utilisateur.
                                    </p>
                                </div>

                                {/* Sous-sections */}
                                <div className="space-y-6">
                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Nature des informations</h3>
                                        <p className="text-gray-600 mb-3">Les informations présentes sur le Site ont un caractère :</p>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600"><strong className="text-[#2d5f3f]">Général et informatif :</strong> elles ne constituent pas un conseil personnalisé</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600"><strong className="text-[#2d5f3f]">Non contractuel :</strong> elles ne créent aucun engagement de notre part</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600"><strong className="text-[#2d5f3f]">Évolutif :</strong> nous nous réservons le droit de les modifier</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Limitation du service et de responsabilité</h3>
                                        <p className="text-gray-600 mb-3">Nous déclinons toute responsabilité pour :</p>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600">Les décisions prises sur la base des informations du Site</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600">Les erreurs ou omissions dans les contenus</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600">Les dommages résultant de l'utilisation du Site</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600">Les évolutions législatives, réglementaires ou jurisprudentielles postérieures à la publication des contenus qui en affecteraient la validité ou l'applicabilité.</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600">L'exactitude, l'exhaustivité ou la mise à jour des informations fournies par des sites tiers liés depuis notre Site.</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Responsabilité de l'utilisateur</h3>
                                        <p className="text-gray-600 mb-3">
                                            L'utilisateur est seul responsable de l'interprétation, de l'usage et des conséquences des décisions prises sur la base des informations consultées sur le Site. L'Éditeur ne pourra être tenu responsable :
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600">Des pertes,</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600">Dommages directs ou indirects découlant de l'utilisation non encadrée de ces informations,</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#5a8f6f] mt-2"></div>
                                                <span className="text-gray-600">Des erreurs ou omissions présentes sur le site,</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Exclusion de conseil</h3>
                                        <p className="text-gray-600 mb-3">
                                            Les informations diffusées sur notre Site ne constituent en aucun cas :
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            <strong className="text-[#2d5f3f]">Un conseil personnalisé :</strong> Elles ne sauraient se substituer à une consultation professionnelle spécifique, nécessitant une analyse approfondie de la situation fiscale et patrimoniale du client.
                                        </p>
                                        <p className="text-gray-600">
                                            Toute prestation de conseil en structuration patrimoniale et fiscale dispensée par l'Éditeur ne pourra se matérialiser qu'à la suite d'un entretien formel et de la signature obligatoire d'un document contractuel spécifique (contrat).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section Restrictions */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Restrictions sectorielles et géographiques</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Les informations du Site ne s'adressent pas aux personnes résidant dans des juridictions où leur diffusion ou l'offre de nos services serait contraire à la réglementation locale. En particulier :
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Les résidents américains (« US Persons ») sont informés que nos services ne sont pas destinés à être sollicités depuis les États-Unis et que ce Site n'est pas une offre de services sur ce territoire.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">Les références à des avantages fiscaux, juridiques ou réglementaires spécifiques s'entendent sous réserve des dispositions légales en vigueur dans le pays de résidence fiscale de l'utilisateur et sont susceptibles d'être modifiées sans préavis.</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#5a8f6f] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">L'accès à certaines analyses, outils ou contenus peut être restreint en fonction du profil déclaré de l'utilisateur.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section Propriété Intellectuelle */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Propriété intellectuelle</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <div className="space-y-6">
                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Droit d'auteur et droits voisins</h3>
                                        <p className="text-gray-600">
                                            L'ensemble des éléments du Site (textes, graphismes, logos, images, vidéos, bases de données, etc.) sont la propriété exclusive de Geneva Wealth Partners ou de ses concédants de licence et sont protégés par les lois suisses et internationales sur la propriété intellectuelle.
                                        </p>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Interdiction d'utilisation</h3>
                                        <p className="text-gray-600">
                                            Toute reproduction, représentation, modification, publication, adaptation, traduction de tout ou partie des éléments du Site, quel que soit le support ou le procédé, est strictement interdite sans l'autorisation écrite préalable de l'Éditeur.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section Modification des CGU */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Modification des CGU</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Nous nous réservons le droit de modifier les présentes CGU à tout moment, pour des raisons techniques, juridiques ou commerciales.
                                </p>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    La version mise à jour des CGU prendra effet dès sa publication sur le Site. Il est de votre responsabilité de consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
                                </p>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Pour les modifications substantielles affectant vos droits, nous vous informerons par email si vous êtes inscrit à notre newsletter ou si vous avez un compte client actif.
                                </p>
                                <div className="bg-[#f0f7f4] border-l-4 border-[#2d5f3f] p-4 rounded-r">
                                    <p className="text-gray-700 text-sm font-medium">
                                        Votre utilisation continue du Site après la publication des CGU révisées vaut acceptation de ces modifications.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section Dispositions Diverses */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Dispositions diverses</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <div className="space-y-6">
                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Intégralité</h3>
                                        <p className="text-gray-600">
                                            Les présentes CGU, combinées à notre Politique de Confidentialité et à notre Politique en matière de Cookies, constituent l'intégralité de l'accord entre vous et Geneva Wealth Partners concernant l'utilisation du Site.
                                        </p>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Divisibilité</h3>
                                        <p className="text-gray-600">
                                            Si une disposition des CGU est jugée invalide, nulle ou inapplicable par une juridiction compétente, cette disposition sera réputée séparable et n'affectera pas la validité et l'applicabilité des dispositions restantes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section Droit Applicable */}
                        <div className="group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5f3f] to-[#5a8f6f] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">Droit applicable et règlement des litiges</h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-[#2d5f3f] to-transparent"></div>
                                </div>
                            </div>
                            <div className="pl-16">
                                <div className="space-y-6">
                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Droit applicable</h3>
                                        <p className="text-gray-600">
                                            Les présentes Conditions Générales d'Utilisation sont régies et interprétées selon le droit de la Cour Européenne, à l'exclusion de ses règles de conflit de lois.
                                        </p>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Juridiction compétente</h3>
                                        <p className="text-gray-600">
                                            Sous réserve des dispositions impératives à la protection des consommateurs énoncées ci-dessous, tout litige découlant des présentes CGU sera de la compétence exclusive des Tribunaux Européens.
                                        </p>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Protection des consommateurs (clients particuliers)</h3>
                                        <p className="text-gray-600">
                                            Si vous agissez en tant que consommateur (un particulier agissant à des fins non professionnelles) et que votre résidence habituelle est dans un État membre de l'Union Européenne ou de l'AELE, vous bénéficiez également de la protection des dispositions impératives de votre pays de résidence. Vous avez le choix d'introduire une action soit devant les tribunaux européens, soit devant ceux de votre lieu de résidence, conformément au Règlement (UE) n° 1215/2012 (Bruxelles I bis).
                                        </p>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Médiation</h3>
                                        <p className="text-gray-600">
                                            Avant toute action judiciaire, les parties s'engagent à rechercher une solution amiable. À défaut d'accord dans un délai de 60 jours à compter de la notification du litige, celui-ci sera soumis à la juridiction compétente désignée ci-dessus.
                                        </p>
                                    </div>

                                    <div className="border-l-2 border-[#2d5f3f]/20 pl-6 py-2">
                                        <h3 className="text-lg font-medium text-[#2d5f3f] mb-3">Langue</h3>
                                        <p className="text-gray-600">
                                            Les présentes CGU sont rédigées en langue française pour la commodité de nos clients francophones. La version juridiquement contraignante est la version anglaise.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 pt-8 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-500">
                            Dernière mise à jour : <span className="font-medium text-gray-700">Version Décembre 2025</span>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsOfUse;
