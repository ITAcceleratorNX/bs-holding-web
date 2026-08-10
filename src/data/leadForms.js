/**
 * Тексты всплывающих форм страниц ЖК.
 *
 * Вынесены из компонентов, чтобы формулировки правились без захода в разметку,
 * а новая форма добавлялась одной записью. Ключ — код формы из `FORM_CODES`.
 */

/** Согласие фиксируется по факту отправки — текст обязателен рядом с кнопкой (ТЗ 4). */
export const CONSENT_POLICY =
  'Оставляя заявку, вы соглашаетесь с политикой обработки персональных данных.';

/**
 * @typedef {Object} LeadFormPreset
 * @property {string} title
 * @property {(project: string) => string} subtitle
 * @property {string} submitLabel
 * @property {string} successTitle
 * @property {string} successText
 * @property {string} [successHours]
 */

/** @type {Record<string, LeadFormPreset>} */
export const LEAD_FORM_PRESETS = {
  sales_phone_reveal: {
    title: 'Получить номер отдела продаж',
    subtitle: () => 'Оставьте свой номер — покажем прямой номер отдела продаж.',
    submitLabel: 'Показать номер',
    successTitle: 'Номер отдела продаж',
    successText: 'Менеджер ответит на вопросы по квартирам и оплате.',
    /** График по умолчанию. Точка показа со своим графиком передаёт `hours`. */
    successHours: 'Звоните ежедневно с 09:00 до 18:00',
  },
  zhk_hero_application: {
    title: 'Оставить заявку',
    subtitle: (project) => `Оставьте контакты — менеджер расскажет об актуальных квартирах и ценах ${project}.`,
    submitLabel: 'Оставить заявку',
    successTitle: 'Спасибо! Заявка принята.',
    successText: 'Менеджер свяжется с вами в течение 10 минут.',
  },
  zhk_calculation: {
    title: 'Получить расчет',
    subtitle: (project) => `Оставьте контакты и выберите квадратуру — подготовим расчёт по ${project}.`,
    submitLabel: 'Получить расчет',
    successTitle: 'Спасибо! Заявка принята.',
    successText: 'Мы рассчитаем стоимость и свяжемся с вами в ближайшее время.',
  },
  tour_booking: {
    title: 'Записаться на экскурсию',
    subtitle: (project) => `Покажем ${project} вживую: материалы, отделку и ход строительства.`,
    submitLabel: 'Записаться на экскурсию',
    successTitle: 'Спасибо! Заявка принята.',
    successText: 'Менеджер свяжется с вами и согласует удобное время визита.',
  },
  zhk_consultation: {
    title: 'Получить консультацию',
    subtitle: (project) => `Ответим на вопросы по ${project}: планировки, цены и способы оплаты.`,
    submitLabel: 'Получить консультацию',
    successTitle: 'Спасибо! Заявка принята.',
    successText: 'Менеджер свяжется с вами в течение 10 минут.',
  },
  layout_application: {
    title: 'Оставить заявку',
    subtitle: () => 'Оставьте контакты — менеджер пришлёт подробности по выбранной планировке.',
    submitLabel: 'Оставить заявку',
    successTitle: 'Заявка принята',
    successText: 'Мы свяжемся с вами в течение дня.',
  },
  catalog_download: {
    title: 'Получить каталог',
    subtitle: (project) => `Отправим каталог ${project} с планировками и ценами в WhatsApp.`,
    submitLabel: 'Получить каталог',
    successTitle: 'Спасибо! Заявка принята.',
    successText: 'Открываем WhatsApp — менеджер отправит каталог в переписке.',
  },
  presentation_download: {
    title: 'Получить презентацию',
    subtitle: (project) => `Отправим презентацию ${project} с архитектурой и инфраструктурой в WhatsApp.`,
    submitLabel: 'Получить презентацию',
    successTitle: 'Спасибо! Заявка принята.',
    successText: 'Открываем WhatsApp — менеджер отправит презентацию в переписке.',
  },
  easton_quiz_landing_presentation: {
    title: 'Скачать презентацию',
    subtitle: () => 'Оставьте контакты — откроется WhatsApp, менеджер отправит презентацию Easton.',
    submitLabel: 'Скачать презентацию',
    successTitle: 'Спасибо! Заявка принята.',
    successText: 'Открываем WhatsApp — менеджер отправит презентацию в переписке.',
  },
};

/**
 * @param {string} formCode
 * @returns {LeadFormPreset|null}
 */
export function getLeadPreset(formCode) {
  return LEAD_FORM_PRESETS[formCode] ?? null;
}
