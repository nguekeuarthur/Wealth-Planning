import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useLanguage } from '../../context/languageContext';

const translations = {
    FR: {
        title: "Bienvenue sur Geneva Wealth Partners",
        subtitle: "Votre espace est prêt.",
        instruction: "Pour profiter pleinement de tous nos services et de l'accompagnement sur mesure, veuillez compléter votre profil.",
        action: "Cliquez sur la cloche de notification en haut à droite pour voir les étapes restantes.",
        button: "Aller aux notifications" // Fallback button just in case
    },
    EN: {
        title: "Welcome to Geneva Wealth Partners",
        subtitle: "Your client area is ready.",
        instruction: "To fully benefit from our services and tailored support, please complete your profile.",
        action: "Click the notification bell at the top right to see remaining steps.",
        button: "Go to notifications"
    },
    DE: {
        title: "Willkommen bei Geneva Wealth Partners",
        subtitle: "Ihr Kundenbereich ist bereit.",
        instruction: "Um unsere Dienste und maßgeschneiderte Unterstützung voll nutzen zu können, vervollständigen Sie bitte Ihr Profil.",
        action: "Klicken Sie oben rechts auf die Benachrichtigungsglocke, um die verbleibenden Schritte zu sehen.",
        button: "Zu den Benachrichtigungen"
    },
    IT: {
        title: "Benvenuto in Geneva Wealth Partners",
        subtitle: "La tua area clienti è pronta.",
        instruction: "Per beneficiare appieno dei nostri servizi e del supporto su misura, completa il tuo profilo.",
        action: "Clicca sulla campanella delle notifiche in alto a destra per vedere i passaggi rimanenti.",
        button: "Vai alle notifiche"
    }
};

const UserWelcome = () => {
    const { lang } = useLanguage();
    const copy = translations[lang] ?? translations.FR;
    const navigate = useNavigate();

    // Setup animation states
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <DashboardLayout role="user">
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 relative overflow-hidden">

                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-[#2d5f3f]/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-[#2d5f3f]/10 rounded-full blur-3xl"></div>
                </div>

                {/* Main Card */}
                <div
                    className={`relative z-10 max-w-2xl w-full bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 transform transition-all duration-1000 ease-out mt-12 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                >
                    <div className="text-center space-y-8">

                        {/* Icon */}
                        <div className="w-24 h-24 bg-[#2d5f3f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#2d5f3f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>

                        {/* Text Content */}
                        <h1 className="text-4xl md:text-5xl font-light text-[#1e4029] tracking-tight">
                            {copy.title}
                        </h1>

                        <p className="text-xl text-[#2d5f3f] font-light">
                            {copy.subtitle}
                        </p>

                        <div className="w-24 h-0.5 bg-[#2d5f3f] mx-auto opacity-50"></div>

                        <div className="space-y-4">
                            <p className="text-lg text-gray-600 leading-relaxed font-light">
                                {copy.instruction}
                            </p>

                            <div className="bg-[#2d5f3f]/5 p-6 rounded-xl border border-[#2d5f3f]/10 animate-pulse">
                                <p className="text-[#2d5f3f] font-medium flex items-center justify-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {copy.action}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default UserWelcome;
