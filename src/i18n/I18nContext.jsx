import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { LANG_STORAGE_KEY, langToHtml, readStoredLang, TRANSLATIONS } from './translations';

/** @typedef {import('./translations').LangCode} LangCode */

/** @type {React.Context<{ lang: LangCode, setLang: (l: LangCode) => void, t: (key: string, vars?: Record<string, string>) => string } | null>} */
const I18nContext = createContext(null);

/**
 * @param {{ children: React.ReactNode, lang: LangCode, setLang: (l: LangCode) => void }} props
 */
export function I18nProvider({ children, lang, setLang }) {
  useEffect(() => {
    document.documentElement.lang = langToHtml(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const t = useCallback(
    (key, vars = {}) => {
      let text = TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.RU[key] ?? key;
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{${k}}`, v);
      }
      return text;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n requires I18nProvider');
  return ctx;
}

/** @returns {LangCode} */
export function useInitialLang() {
  return readStoredLang();
}
