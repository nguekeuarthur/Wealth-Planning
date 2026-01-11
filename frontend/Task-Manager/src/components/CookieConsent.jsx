import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "cookie_consent";
const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_MONTH = 30 * ONE_DAY;

const CookieConsent = () => {
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
  }, []);

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
      aria-label="Consentement aux cookies"
      className="fixed bottom-6 right-6 left-6 sm:left-auto sm:right-6 z-50 max-w-sm mx-auto sm:mx-0 w-auto sm:w-[360px] bg-white rounded-lg shadow-2xl p-4 flex items-start gap-3 transition-transform"
    >
      <div className="flex-shrink-0 mt-1 text-2xl">🍪</div>
      <div className="flex-1">
        <p className="text-sm text-gray-800 font-medium">Nous utilisons des cookies</p>
        <p className="text-xs text-gray-600 mt-1">Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic. Vous pouvez accepter ou gérer vos préférences.</p>
        {/* <p className="text-xs text-gray-500 mt-1">Si vous acceptez, nous vous redemanderons dans un mois. Si vous refusez, nous vous redemanderons dans 24 heures.</p> */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={accept}
            className="px-4 py-2 bg-[#2d5f3f] hover:bg-[#254f33] text-white rounded-md text-sm"
          >
            Accepter
          </button>

          <button
            onClick={reject}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
          >
            Refuser
          </button>

          <Link to="/privacy-policy" className="text-sm text-gray-600 hover:underline ml-2">
            Gérer les paramètres
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
