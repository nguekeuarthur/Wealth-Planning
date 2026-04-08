import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext({
  lang: "FR",
  setLang: () => {},
});

const LOCAL_STORAGE_KEY = "gw_selected_lang";

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") {
      return "FR";
    }
    return window.localStorage.getItem(LOCAL_STORAGE_KEY) || "FR";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, lang);
    }
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageProvider;

