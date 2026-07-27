/**
 * Shared lead submission for project pages (mock transport for now).
 * @param {{
 *   project: string,
 *   source: string,
 *   name: string,
 *   phone: string,
 *   [key: string]: unknown,
 * }} payload
 * @returns {Promise<{ ok: true, payload: object }>}
 */
export function submitLead(payload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (typeof console !== 'undefined' && console.info) {
        console.info('[lead]', payload);
      }
      resolve({ ok: true, payload });
    }, 900);
  });
}

/** Default manager WhatsApp (replace without touching layout). Digits only, country code. */
export const DEFAULT_WHATSAPP_PHONE = '77753864010';

/**
 * @param {string|undefined|null} phone
 * @returns {string}
 */
export function normalizeWhatsAppPhone(phone) {
  const digits = String(phone || DEFAULT_WHATSAPP_PHONE).replace(/\D/g, '');
  return digits || DEFAULT_WHATSAPP_PHONE;
}

/**
 * @param {string|undefined|null} phone
 * @param {string} [text]
 */
export function openWhatsApp(phone, text = '') {
  const n = normalizeWhatsAppPhone(phone);
  const url = text
    ? `https://wa.me/${n}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${n}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export const AREA_RANGES = [
  { value: '1-комнатная — 40–55 м²', label: '1-комнатная — 40–55 м²' },
  { value: '2-комнатная — 60–80 м²', label: '2-комнатная — 60–80 м²' },
  { value: '3-комнатная — 90–115 м²', label: '3-комнатная — 90–115 м²' },
  { value: '4-комнатная — 120–140 м²', label: '4-комнатная — 120–140 м²' },
];

export const LEAD_SOURCES = {
  CALC: 'Получить расчет',
  QUIZ: 'Квиз подборки',
  CATALOG: 'Скачать каталог',
  CONSULT: 'Нижняя форма',
};
