import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem("gg_lang");
    return saved === "en" || saved === "it" ? saved : "it";
  });

  const setLang = useCallback((l) => {
    localStorage.setItem("gg_lang", l);
    setLangState(l);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];
  const pick = useCallback((obj) => (obj && typeof obj === "object" ? obj[lang] ?? obj.it ?? "" : obj ?? ""), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, pick }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
