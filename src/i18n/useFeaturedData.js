import { useMemo } from 'react';
import { FEATURED_DATA } from '../data/projects';
import { useI18n } from './I18nContext';
import { FEATURED_TEXTS } from './featuredTexts';

export function useFeaturedData(activeTab) {
  const { lang } = useI18n();
  return useMemo(() => {
    const base = FEATURED_DATA[activeTab];
    if (!base || lang === 'RU') return base;
    const overrides = FEATURED_TEXTS[activeTab]?.[lang];
    return overrides ? { ...base, ...overrides } : base;
  }, [activeTab, lang]);
}
