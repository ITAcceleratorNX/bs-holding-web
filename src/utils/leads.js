const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

/**
 * Page context attached to every lead: current URL and UTM tags when present.
 * Routing is hash-based, so tags may sit in the search string or after the hash.
 * @returns {{ pageUrl?: string, utm?: Record<string, string> }}
 */
export function collectPageContext() {
  if (typeof window === 'undefined') return {};
  const { href, search, hash } = window.location;
  const params = new URLSearchParams(search);
  const hashQuery = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '';
  if (hashQuery) {
    new URLSearchParams(hashQuery).forEach((value, key) => {
      if (!params.has(key)) params.set(key, value);
    });
  }
  const utm = {};
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) utm[key] = value;
  });
  return { pageUrl: href, ...(Object.keys(utm).length ? { utm } : {}) };
}

/**
 * Shared lead submission for project pages (mock transport for now).
 * Page URL and UTM tags are attached automatically.
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
  const full = { ...collectPageContext(), ...payload };
  return new Promise((resolve) => {
    setTimeout(() => {
      if (typeof console !== 'undefined' && console.info) {
        console.info('[lead]', full);
      }
      resolve({ ok: true, payload: full });
    }, 900);
  });
}

/**
 * Digits-only WhatsApp number, or '' when the project has no number yet.
 * There is deliberately no shared fallback: a project without its own manager
 * number must show no link at all rather than route to someone else's chat.
 * Each page declares `whatsappPhone` in its data file (digits + country code).
 * @param {string|undefined|null} phone
 * @returns {string}
 */
export function normalizeWhatsAppPhone(phone) {
  return String(phone ?? '').replace(/\D/g, '');
}

/**
 * @param {string|undefined|null} phone
 * @param {string} [text]
 * @returns {boolean} false when no number is configured (nothing was opened)
 */
export function openWhatsApp(phone, text = '') {
  const n = normalizeWhatsAppPhone(phone);
  if (!n) return false;
  const url = text
    ? `https://wa.me/${n}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${n}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

export const AREA_RANGES = [
  { value: '1-комнатная — 40–55 м²', label: '1-комнатная — 40–55 м²' },
  { value: '2-комнатная — 60–80 м²', label: '2-комнатная — 60–80 м²' },
  { value: '3-комнатная — 90–115 м²', label: '3-комнатная — 90–115 м²' },
  { value: '4-комнатная — 120–140 м²', label: '4-комнатная — 120–140 м²' },
];

export const LEAD_SOURCES = {
  CALC: 'Получить расчет',
  INSTALLMENT_CALC: 'Калькулятор рассрочки',
  QUIZ: 'Квиз подборки',
  CATALOG: 'Скачать каталог',
  CONSULT: 'Нижняя форма',
};
