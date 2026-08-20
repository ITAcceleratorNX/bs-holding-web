import { useMemo } from 'react';
import { PROMOTIONS } from '../data/promotions';
import { useI18n } from './I18nContext';
import { applyPromotionTexts } from './promotionTexts';

export function usePromotions() {
  const { lang } = useI18n();
  return useMemo(
    () => (lang === 'RU' ? PROMOTIONS : PROMOTIONS.map((o) => applyPromotionTexts(o, lang))),
    [lang],
  );
}

export function usePromotion(offer) {
  const { lang } = useI18n();
  return useMemo(() => {
    if (!offer || lang === 'RU') return offer;
    return applyPromotionTexts(offer, lang);
  }, [offer, lang]);
}
