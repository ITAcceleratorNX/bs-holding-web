/**
 * События для системы аналитики (ТЗ 10).
 *
 * Точка интеграции одна — `dataLayer`. Через него Google Tag Manager
 * раздаёт события в GA4, Яндекс.Метрику и рекламные кабинеты, поэтому
 * подключение нового счётчика не требует правок в коде сайта. Если GA4
 * подключён напрямую, без GTM, событие дублируется в `gtag`.
 *
 * Персональные данные в аналитику не уходят: имя и телефон не попадают в
 * событие даже случайно — параметры проходят через белый список ключей.
 */

/** Имена событий. Совпадают с ТЗ 10 и менять их после запуска нельзя. */
export const LEAD_EVENTS = {
  FORM_OPEN: 'form_open',
  FORM_SUBMIT: 'form_submit',
  FORM_SUCCESS: 'form_success',
  FORM_ERROR: 'form_error',
  PHONE_CLICK: 'phone_click',
  WHATSAPP_CLICK: 'whatsapp_click',
  QUIZ_COMPLETE: 'quiz_complete',
  CALCULATOR_SUBMIT: 'calculator_submit',
};

/**
 * Разрешённые параметры события. Всё остальное отбрасывается — это защита от
 * того, чтобы имя или телефон утекли в аналитику вместе с полями формы.
 */
const ALLOWED_PARAMS = new Set([
  'form_code',
  'city',
  'zhk',
  'page',
  'cta_location',
  'error_code',
  'lead_id',
]);

/**
 * @param {Record<string, unknown>} params
 * @returns {Record<string, string|number>}
 */
function safeParams(params) {
  /** @type {Record<string, string|number>} */
  const out = {};
  for (const [key, value] of Object.entries(params ?? {})) {
    if (!ALLOWED_PARAMS.has(key)) continue;
    if (value == null || value === '') continue;
    out[key] = typeof value === 'number' ? value : String(value).slice(0, 200);
  }
  return out;
}

/**
 * Отправляет событие в аналитику. Ошибки счётчиков намеренно проглатываются:
 * сломанный тег не должен мешать отправке заявки.
 * @param {string} event Одно из значений `LEAD_EVENTS`.
 * @param {Record<string, unknown>} [params]
 */
export function trackEvent(event, params = {}) {
  if (typeof window === 'undefined') return;

  const payload = safeParams(params);
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...payload });
    if (typeof window.gtag === 'function') window.gtag('event', event, payload);
  } catch {
    // Аналитика — вспомогательная функция, её сбой заявку не ломает.
  }
}

/**
 * Общие параметры формы для события.
 * @param {{ formCode: string, city?: string, project?: string, ctaLocation?: string }} context
 * @returns {Record<string, string>}
 */
export function formEventParams({ formCode, city, project, ctaLocation }) {
  return {
    form_code: formCode,
    city: city ?? '',
    zhk: project ?? '',
    page: typeof window === 'undefined' ? '' : window.location.href,
    cta_location: ctaLocation ?? '',
  };
}
