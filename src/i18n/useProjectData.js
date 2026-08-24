import { useMemo } from 'react';
import { useI18n } from './I18nContext';
import { PROJECT_TEXTS, applyProjectTexts } from './projectTexts';

/**
 * Возвращает данные страницы ЖК, пропатченные переводами на текущий язык.
 * Для RU возвращает оригинальные данные без изменений.
 * @param {object} data — оригинальный объект ProjectPageData
 * @returns {object} пропатченные данные
 */
export function useProjectData(data) {
  const { lang } = useI18n();
  return useMemo(() => {
    if (lang === 'RU') return data;
    const overrides = PROJECT_TEXTS[data.textsSlug ?? data.slug]?.[lang];
    return applyProjectTexts(data, overrides);
  }, [data, lang]);
}
