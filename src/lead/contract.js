/**
 * Контракт заявки: нормализация и проверка полей (ТЗ 8).
 *
 * Модуль изоморфный и не имеет зависимостей: браузер использует его, чтобы
 * не отправлять заведомо неполную форму, сервер — чтобы не доверять браузеру.
 * Проверка на сервере обязательна и выполняется повторно: клиентскую можно обойти.
 *
 * Всё, что уходит в Bitrix24, проходит через `text()` — обрезается по длине и
 * очищается от управляющих символов. Это защищает и карточку лида от «поехавшей»
 * вёрстки, и журнал сервера от подделанных строк.
 */

import { getFormMeta } from './formCodes.js';
import { kzPhoneE164, kzPhoneOk } from './phone.js';

/** Города присутствия. Первый — значение по умолчанию (ТЗ 2). */
export const CITIES = ['Актау', 'Актобе', 'Усть-Каменогорск'];
export const DEFAULT_CITY = CITIES[0];

/** Границы полей. Держим их здесь, чтобы клиент и сервер обрезали одинаково. */
export const LIMITS = {
  name: { min: 2, max: 80 },
  city: 60,
  project: 120,
  ctaLocation: 120,
  pageUrl: 2000,
  pageTitle: 200,
  lang: 10,
  submissionId: 64,
  attributionValue: 300,
  detailKey: 60,
  detailLabel: 120,
  detailValue: 500,
  detailsCount: 40,
};

/** Ключи рекламных меток, которые собираем и передаём (ТЗ 5). */
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
export const CLICK_ID_KEYS = ['gclid', 'yclid', 'fbclid'];

/**
 * Строка, пригодная для передачи в CRM: без управляющих символов, схлопнутыми
 * пробелами и обрезанная по длине.
 * @param {unknown} value
 * @param {number} max
 * @returns {string}
 */
export function text(value, max) {
  if (value == null || typeof value === 'object') return '';
  return String(value)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/**
 * Город: известные названия приводятся к каноническому написанию, неизвестные
 * пропускаются очищенными — добавление города не должно требовать правок сервера.
 * Пустое значение заменяется на Актау (ТЗ 2).
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeCity(value) {
  const raw = text(value, LIMITS.city);
  if (!raw) return DEFAULT_CITY;
  const known = CITIES.find((c) => c.toLowerCase() === raw.toLowerCase());
  return known ?? raw;
}

/**
 * Адрес страницы. Принимаем только http(s): иначе в карточку лида можно было бы
 * подложить `javascript:`-ссылку, по которой кликнет менеджер.
 * @param {unknown} value
 * @returns {string}
 */
function normalizeUrl(value) {
  const raw = text(value, LIMITS.pageUrl);
  if (!raw) return '';
  try {
    const url = new URL(raw);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString().slice(0, LIMITS.pageUrl) : '';
  } catch {
    return '';
  }
}

/**
 * Один снимок источника: метки, referrer и страница входа (ТЗ 5).
 * @param {unknown} value
 * @returns {Record<string, string>}
 */
function normalizeTouch(value) {
  if (!value || typeof value !== 'object') return {};
  /** @type {Record<string, string>} */
  const out = {};
  for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const v = text(value[key], LIMITS.attributionValue);
    if (v) out[key] = v;
  }
  const referrer = normalizeUrl(value.referrer);
  if (referrer) out.referrer = referrer;
  const landing = normalizeUrl(value.landing);
  if (landing) out.landing = landing;
  const ts = text(value.ts, 40);
  if (ts) out.ts = ts;
  return out;
}

/**
 * Дополнительные данные формы: квиз, планировка, расчёт (ТЗ 6).
 *
 * Плоский список вместо схемы под каждую форму — так новая форма не требует
 * изменений на сервере, а `key` остаётся стабильным якорем для маппинга в
 * пользовательское поле Bitrix24, когда его создадут.
 * @param {unknown} value
 * @returns {{ key: string, label: string, value: string, group: string }[]}
 */
function normalizeDetails(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const out = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const key = text(item.key, LIMITS.detailKey).replace(/[^a-zA-Z0-9_.-]/g, '');
    const label = text(item.label, LIMITS.detailLabel);
    const val = text(item.value, LIMITS.detailValue);
    if (!key || !val || seen.has(key)) continue;
    seen.add(key);
    out.push({ key, label: label || key, value: val, group: text(item.group, 40) || 'other' });
    if (out.length >= LIMITS.detailsCount) break;
  }
  return out;
}

/**
 * @typedef {Object} NormalizedLead
 * @property {string} formCode
 * @property {string} formTitle
 * @property {string} name
 * @property {string} phone Формат +7XXXXXXXXXX.
 * @property {string} city
 * @property {string} project
 * @property {string} ctaLocation
 * @property {boolean} consent
 * @property {{ url: string, title: string, lang: string }} page
 * @property {{ first: Record<string, string>, last: Record<string, string> }} attribution
 * @property {{ key: string, label: string, value: string, group: string }[]} details
 * @property {string} submissionId
 */

/**
 * Приводит присланную форму к нормализованному виду и проверяет обязательные поля.
 *
 * Возвращает и ошибки, и уже нормализованную заявку: браузеру нужны ошибки по
 * полям для подсветки, серверу — готовый объект.
 * @param {unknown} raw
 * @returns {{ ok: boolean, errors: Record<string, string>, lead: NormalizedLead }}
 */
export function normalizeLead(raw) {
  const input = raw && typeof raw === 'object' ? raw : {};
  /** @type {Record<string, string>} */
  const errors = {};

  const formCode = text(input.formCode, LIMITS.detailKey);
  const meta = getFormMeta(formCode);
  if (!meta) errors.formCode = 'Неизвестный код формы';

  const name = text(input.name, LIMITS.name.max);
  if (name.length < LIMITS.name.min) errors.name = 'Укажите имя';

  const rawPhone = text(input.phone, 40);
  if (!kzPhoneOk(rawPhone)) errors.phone = 'Укажите номер в формате +7 (7XX) XXX-XX-XX';

  // Согласие на обработку персональных данных обязательно (ТЗ 4).
  const consent = input.consent === true;
  if (!consent) errors.consent = 'Необходимо согласие на обработку персональных данных';

  const submissionId = text(input.submissionId, LIMITS.submissionId).replace(/[^a-zA-Z0-9_-]/g, '');
  if (!submissionId) errors.submissionId = 'Отсутствует идентификатор отправки';

  const pageInput = input.page && typeof input.page === 'object' ? input.page : {};
  const attributionInput = input.attribution && typeof input.attribution === 'object' ? input.attribution : {};

  /** @type {NormalizedLead} */
  const lead = {
    formCode,
    formTitle: meta?.title ?? '',
    name,
    phone: kzPhoneE164(rawPhone),
    city: normalizeCity(input.city),
    project: text(input.project, LIMITS.project),
    ctaLocation: text(input.ctaLocation, LIMITS.ctaLocation),
    consent,
    page: {
      url: normalizeUrl(pageInput.url),
      title: text(pageInput.title, LIMITS.pageTitle),
      lang: text(pageInput.lang, LIMITS.lang),
    },
    attribution: {
      first: normalizeTouch(attributionInput.first),
      last: normalizeTouch(attributionInput.last),
    },
    details: normalizeDetails(input.details),
    submissionId,
  };

  return { ok: Object.keys(errors).length === 0, errors, lead };
}
