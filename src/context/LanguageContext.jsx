import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translations } from "../i18n/translations";

const STORAGE_KEY = "arab-site-lang";

function getNested(obj, path) {
  return path.split(".").reduce((o, k) => {
    if (o == null || typeof o !== "object") return undefined;
    return o[k];
  }, obj);
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "ar") return stored;
    } catch {
      /* private mode / SSR */
    }
    return "ar";
  });

  const setLang = useCallback((next) => {
    if (next !== "ar" && next !== "en") return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "ar" ? "en" : "ar");
  }, [lang, setLang]);

  useEffect(() => {
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = useCallback((key) => {
    const node = getNested(translations[lang], key);
    return typeof node === "string" ? node : key;
  }, [lang]);

  const dir = lang === "ar" ? "rtl" : "ltr";
  /** For mixed content: descriptive text inherits page dir */
  const textDir = dir;
  const placeholderTextAlignClass =
    dir === "rtl" ? "placeholder:text-right" : "placeholder:text-left";

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t,
      dir,
      textDir,
      placeholderTextAlignClass,
      isArabic: lang === "ar",
    }),
    [lang, setLang, toggleLang, t, dir, textDir, placeholderTextAlignClass],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
