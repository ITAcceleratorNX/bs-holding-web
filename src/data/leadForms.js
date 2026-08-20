/**
 * Тексты всплывающих форм страниц ЖК.
 * Все строки берутся через t() для поддержки мультиязычности.
 */

/**
 * @typedef {Object} LeadFormPreset
 * @property {string} title
 * @property {(project: string) => string} subtitle
 * @property {string} submitLabel
 * @property {string} successTitle
 * @property {string} successText
 */

const PRESET_KEYS = {
  zhk_hero_application: {
    titleKey: 'lead.hero.title',
    subtitleKey: 'lead.hero.subtitle',
    submitKey: 'lead.hero.submit',
    successTitleKey: 'lead.success.title',
    successTextKey: 'lead.success.sub',
  },
  zhk_calculation: {
    titleKey: 'lead.calc.title',
    subtitleKey: 'lead.calc.subtitle',
    submitKey: 'lead.calc.submit',
    successTitleKey: 'lead.success.title',
    successTextKey: 'lead.success.sub.calc',
  },
  tour_booking: {
    titleKey: 'lead.tour.title',
    subtitleKey: 'lead.tour.subtitle',
    submitKey: 'lead.tour.submit',
    successTitleKey: 'lead.success.title',
    successTextKey: 'lead.success.sub.tour',
  },
  zhk_consultation: {
    titleKey: 'lead.consult.title',
    subtitleKey: 'lead.consult.subtitle',
    submitKey: 'lead.consult.submit',
    successTitleKey: 'lead.success.title',
    successTextKey: 'lead.success.sub',
  },
  layout_application: {
    titleKey: 'lead.layout.title',
    subtitleKey: 'lead.layout.subtitle',
    submitKey: 'lead.layout.submit',
    successTitleKey: 'lead.success.title',
    successTextKey: 'lead.success.sub.layout',
  },
  catalog_download: {
    titleKey: 'lead.catalog.title',
    subtitleKey: 'lead.catalog.subtitle',
    submitKey: 'lead.catalog.submit',
    successTitleKey: 'lead.success.title',
    successTextKey: 'lead.success.sub.whatsapp',
  },
  presentation_download: {
    titleKey: 'lead.presentation.title',
    subtitleKey: 'lead.presentation.subtitle',
    submitKey: 'lead.presentation.submit',
    successTitleKey: 'lead.success.title',
    successTextKey: 'lead.success.sub.whatsapp.pres',
  },
  easton_quiz_landing_presentation: {
    titleKey: 'lead.presentation.title',
    subtitleKey: 'lead.layout.subtitle',
    submitKey: 'lead.presentation.submit',
    successTitleKey: 'lead.success.title',
    successTextKey: 'lead.success.sub.whatsapp.pres',
  },
};

/**
 * @param {string} formCode
 * @param {(key: string, vars?: Record<string, string>) => string} t
 * @returns {LeadFormPreset|null}
 */
export function getLeadPreset(formCode, t) {
  const keys = PRESET_KEYS[formCode];
  if (!keys || !t) return null;
  return {
    title: t(keys.titleKey),
    subtitle: (project) => t(keys.subtitleKey, { project }),
    submitLabel: t(keys.submitKey),
    successTitle: t(keys.successTitleKey),
    successText: t(keys.successTextKey),
  };
}
