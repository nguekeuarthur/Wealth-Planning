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
  },
  EN: {
    title: "We use cookies",
    description:
      "We use cookies to improve your experience and analyze traffic. You can accept or manage your preferences.",
    hint: "If you accept, we'll ask again in one month. If you decline, we'll ask again in 24 hours.",
    accept: "Accept",
    reject: "Decline",
    manage: "Manage settings",
  },
  DE: {
    title: "Wir verwenden Cookies",
    description:
      "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und den Traffic zu analysieren. Sie können akzeptieren oder Ihre Einstellungen verwalten.",
    hint: "Wenn Sie zustimmen, fragen wir in einem Monat erneut. Wenn Sie ablehnen, fragen wir in 24 Stunden erneut.",
    accept: "Akzeptieren",
    reject: "Ablehnen",
    manage: "Einstellungen verwalten",
  },
  IT: {
    title: "Utilizziamo i cookie",
    description:
      "Utilizziamo i cookie per migliorare la tua esperienza e analizzare il traffico. Puoi accettare o gestire le tue preferenze.",
    hint: "Se accetti, ti chiederemo di nuovo tra un mese. Se rifiuti, ti chiederemo di nuovo tra 24 ore.",
    accept: "Accetta",
    reject: "Rifiuta",
    manage: "Gestisci le impostazioni",
  },
};

const CookieConsent = () => {
  const { lang } = useLanguage();
  const copy = MESSAGES[lang] ?? MESSAGES.FR;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    let shouldShow = false;

    if (!raw) {
      shouldShow = true;
    } else {
      try {
        const { status, ts } = JSON.parse(raw);
        const age = Date.now() - (Number(ts) || 0);

        if (status === "accepted") {
          if (age >= ONE_MONTH) shouldShow = true;
        } else if (status === "rejected") {
          if (age >= ONE_DAY) shouldShow = true;
        } else {
          // unknown format — show the banner
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
    const payload = JSON.stringify({ status: "accepted", ts: Date.now() });
    localStorage.setItem(STORAGE_KEY, payload);
    setVisible(false);
  };

  const reject = () => {
    const payload = JSON.stringify({ status: "rejected", ts: Date.now() });
    localStorage.setItem(STORAGE_KEY, payload);
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

          <Link to="/privacy-policy" className="text-sm text-gray-600 hover:underline ml-2">
            {copy.manage}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
