import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/languageContext";

const STORAGE_KEY = "cookie_consent";
const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_MONTH = 30 * ONE_DAY;

const MESSAGES = {
  FR: {
    title: "Nous utilisons des cookies",
    description:
      "Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic. Vous pouvez accepter ou gérer vos préférences.",
    hint: "Si vous acceptez, nous vous redemanderons dans un mois. Si vous refusez, nous vous redemanderons dans 24 heures.",
    accept: "Accepter",
    reject: "Refuser",
    manage: "Gérer les paramètres",
    manageModalTitle: "Contrôlez l'utilisation de vos données personnelles",
    manageModalDescription:
      "Choisissez quelles familles de cookies vous autorisez. Les cookies strictement nécessaires resteront actifs.",
    modalAcceptAll: "Tout accepter",
    modalRejectAll: "Tout refuser",
    modalSave: "Enregistrer",
    technicalTitle: "Les cookies techniques",
    analyticsTitle: "Les cookies de mesure d'audience",
    personalizationTitle: "Les cookies de personnalisation de contenu",
    advertisingTitle: "Les cookies de diffusion de publicité ciblée",
    privacyPolicy: "politique de confidentialité",
  },
  EN: {
    title: "We use cookies",
    description:
      "We use cookies to improve your experience and analyze traffic. You can accept or manage your preferences.",
    hint: "If you accept, we'll ask again in one month. If you decline, we'll ask again in 24 hours.",
    accept: "Accept",
    reject: "Decline",
    manage: "Manage settings",
    manageModalTitle: "Control your personal data settings",
    manageModalDescription:
      "Choose which groups of cookies you allow. Strictly necessary cookies remain active.",
    modalAcceptAll: "Accept all",
    modalRejectAll: "Reject all",
    modalSave: "Save preferences",
    technicalTitle: "Technical cookies",
    analyticsTitle: "Analytics cookies",
    personalizationTitle: "Content personalization cookies",
    advertisingTitle: "Advertising cookies",
    privacyPolicy: "privacy policy",
  },
  DE: {
    title: "Wir verwenden Cookies",
    description:
      "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und den Traffic zu analysieren. Sie können akzeptieren oder Ihre Einstellungen verwalten.",
    hint: "Wenn Sie zustimmen, fragen wir in einem Monat erneut. Wenn Sie ablehnen, fragen wir in 24 Stunden erneut.",
    accept: "Akzeptieren",
    reject: "Ablehnen",
    manage: "Einstellungen verwalten",
    manageModalTitle: "Kontrollieren Sie Ihre Datenschutzeinstellungen",
    manageModalDescription: "Wählen Sie, welche Cookie-Gruppen Sie zulassen möchten.",
    modalAcceptAll: "Alle akzeptieren",
    modalRejectAll: "Alle ablehnen",
    modalSave: "Speichern",
    technicalTitle: "Technische Cookies",
    analyticsTitle: "Analyse-Cookies",
    personalizationTitle: "Personalisierungs-Cookies",
    advertisingTitle: "Werbe-Cookies",
    privacyPolicy: "Datenschutzrichtlinie",
  },
  IT: {
    title: "Utilizziamo i cookie",
    description:
      "Utilizziamo i cookie per migliorare la tua esperienza e analizzare il traffico. Puoi accettare o gestire le tue preferenze.",
    hint: "Se accetti, ti chiederemo di nuovo tra un mese. Se rifiuti, ti chiederemo di nuovo tra 24 ore.",
    accept: "Accetta",
    reject: "Rifiuta",
    manage: "Gestisci le impostazioni",
    manageModalTitle: "Controlla le impostazioni dei tuoi dati personali",
    manageModalDescription: "Scegli quali gruppi di cookie autorizzare. I cookie strettamente necessari restano attivi.",
    modalAcceptAll: "Accetta tutto",
    modalRejectAll: "Rifiuta tutto",
    modalSave: "Salva",
    technicalTitle: "Cookie tecnici",
    analyticsTitle: "Cookie di analisi",
    personalizationTitle: "Cookie di personalizzazione",
    advertisingTitle: "Cookie pubblicitari",
    privacyPolicy: "informativa sulla privacy",
  },
};

const CookieConsent = () => {
  const { lang } = useLanguage();
  const copy = MESSAGES[lang] ?? MESSAGES.FR;

  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [categories, setCategories] = useState({
    technical: true,
    analytics: false,
    personalization: false,
    advertising: false,
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    let shouldShow = false;

    if (!raw) {
      shouldShow = true;
    } else {
      try {
        const parsed = JSON.parse(raw);
        const { status, ts, categories: savedCats } = parsed;
        const age = Date.now() - (Number(ts) || 0);

        if (savedCats) setCategories({ ...categories, ...savedCats });

        if (status === "accepted") {
          if (age >= ONE_MONTH) shouldShow = true;
        } else if (status === "rejected") {
          if (age >= ONE_DAY) shouldShow = true;
        } else {
          // unknown or 'custom' — show the banner
          shouldShow = true;
        }
      } catch (e) {
        // corrupted data — show the banner and overwrite on next choice
        shouldShow = true;
      }
    }

    if (shouldShow) {
      // small delay so it doesn't jump on page load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [lang]);

  const accept = () => {
    const payload = JSON.stringify({ status: "accepted", ts: Date.now(), categories: { technical: true, analytics: true, personalization: true, advertising: true } });
    localStorage.setItem(STORAGE_KEY, payload);
    setVisible(false);
  };

  const reject = () => {
    const payload = JSON.stringify({ status: "rejected", ts: Date.now(), categories: { technical: true, analytics: false, personalization: false, advertising: false } });
    localStorage.setItem(STORAGE_KEY, payload);
    setVisible(false);
  };

  const openManage = () => setShowManage(true);

  const setCategory = (key, value) => setCategories(prev => ({ ...prev, [key]: value }));

  const savePreferences = (asStatus) => {
    let status = "custom";
    if (asStatus === "acceptAll") status = "accepted";
    if (asStatus === "rejectAll") status = "rejected";
    const payload = JSON.stringify({ status, ts: Date.now(), categories });
    localStorage.setItem(STORAGE_KEY, payload);
    setShowManage(false);
    setVisible(false);
  };

  if (!visible) return null; 

  return (
    <div
      role="dialog"
      aria-label={copy.title}
      className="fixed bottom-6 right-6 left-6 sm:left-auto sm:right-6 z-50 max-w-sm mx-auto sm:mx-0 w-auto sm:w-[360px] bg-white rounded-lg shadow-2xl p-4 flex items-start gap-3 transition-transform"
    >
      <div className="flex-shrink-0 mt-1 text-2xl">🍪</div>
      <div className="flex-1">
        <p className="text-sm text-gray-800 font-medium">{copy.title}</p>
        <p className="text-xs text-gray-600 mt-1">{copy.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={accept}
            className="px-4 py-2 bg-[#2d5f3f] hover:bg-[#254f33] text-white rounded-md text-sm"
          >
            {copy.accept}
          </button>

          <button
            onClick={reject}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
          >
            {copy.reject}
          </button>

          <button onClick={openManage} className="text-sm text-gray-600 hover:underline ml-2">
            {copy.manage}
          </button> 
        </div>
      </div>

      {showManage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-auto max-h-[90vh]">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-medium">{copy.manageModalTitle ?? copy.title}</h2>
                <button onClick={() => setShowManage(false)} aria-label="Fermer" className="text-gray-500 hover:text-gray-700">✕</button>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                <p className="mb-4">{copy.manageModalDescription ?? copy.description}</p>

                <div className="space-y-4">
                  {[
                    { key: "technical", title: copy.technicalTitle },
                    { key: "analytics", title: copy.analyticsTitle },
                    { key: "personalization", title: copy.personalizationTitle },
                    { key: "advertising", title: copy.advertisingTitle },
                  ].map((cat) => (
                    <div key={cat.key} className="flex items-center justify-between border p-4 rounded-md">
                      <div>
                        <div className="font-medium">{cat.title}</div>
                        <div className="text-xs text-gray-500">{copy[cat.key + 'Description'] ?? ''}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCategory(cat.key, false)} className={`px-3 py-1 text-sm rounded ${!categories[cat.key] ? 'bg-gray-200' : 'bg-white border'}`}>Refuser</button>
                        <button onClick={() => setCategory(cat.key, true)} className={`px-3 py-1 text-sm rounded ${categories[cat.key] ? 'bg-[#2d5f3f] text-white' : 'bg-white border'}`}>Accepter</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => { setCategories({ technical: true, analytics: true, personalization: true, advertising: true }); }} className="px-4 py-2 bg-gray-100 rounded">{copy.modalAcceptAll ?? 'Tout accepter'}</button>
                    <button onClick={() => { setCategories({ technical: true, analytics: false, personalization: false, advertising: false }); }} className="px-4 py-2 bg-gray-100 rounded">{copy.modalRejectAll ?? 'Tout refuser'}</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <a href="/privacy-policy" className="text-sm text-gray-600 hover:underline">{copy.privacyPolicy ?? 'politique de confidentialité'}</a>
                    <button onClick={() => savePreferences()} className="px-4 py-2 bg-[#2d5f3f] text-white rounded">{copy.modalSave ?? 'Enregistrer'}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CookieConsent;
