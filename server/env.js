/**
 * Конфигурация серверного модуля из переменных окружения (ТЗ 8).
 *
 * Вебхук Bitrix24 существует только здесь и никогда не попадает ни в браузерный
 * код, ни в журнал, ни в ответ API. В репозитории его тоже нет — см. `.env.example`.
 *
 * Конфигурация читается один раз и проверяется на старте: неверный вебхук должен
 * ломать деплой сразу, а не превращаться в молча теряемые заявки.
 */

import { logger } from './logger.js';
import { CITY_FUNNEL_KEYS, cityKey } from './bitrix/routing.js';

/** Адрес вебхука: https://portal.bitrix24.kz/rest/<id>/<token>/ */
const WEBHOOK_RE = /^https:\/\/[a-z0-9-]+\.bitrix24\.[a-z]{2,3}\/rest\/\d+\/[a-z0-9]+\/?$/i;

/**
 * @param {string|undefined} value
 * @param {number} fallback
 * @returns {number}
 */
function int(value, fallback) {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/**
 * Лимит запросов в формате «количество/секунды», например `10/60`.
 * @param {string|undefined} value
 * @returns {{ max: number, windowMs: number }}
 */
function rateLimit(value) {
  const [max, seconds] = String(value ?? '').split('/');
  return {
    max: int(max, 10),
    windowMs: int(seconds, 60) * 1000,
  };
}

/**
 * Пользовательские поля Bitrix24: `BITRIX_UF_<SLOT>=UF_CRM_1712345678`.
 *
 * Пока поле в CRM не создано, переменной просто нет — значение уйдёт в
 * структурированный комментарий (ТЗ 5, 9). Создали поле — добавили переменную,
 * код менять не нужно.
 * @param {Record<string, string|undefined>} source
 * @returns {Record<string, string>}
 */
function userFields(source) {
  /** @type {Record<string, string>} */
  const map = {};
  for (const [key, value] of Object.entries(source)) {
    if (!key.startsWith('BITRIX_UF_')) continue;
    const field = String(value ?? '').trim();
    // Принимаем только настоящие коды пользовательских полей: опечатка в .env
    // не должна превратиться в мусорный ключ в запросе к CRM.
    if (/^UF_CRM_[A-Z0-9_]+$/i.test(field)) {
      map[key.slice('BITRIX_UF_'.length).toLowerCase()] = field.toUpperCase();
    }
  }
  return map;
}

/**
 * Идентификатор воронки: неотрицательное целое (0 — общая воронка портала).
 *
 * Опечатка не должна уронить приём заявок, поэтому неверное значение не
 * бросает исключение, а игнорируется: заявка уйдёт в лиды и точно не потеряется.
 * В журнал при этом пишется явная ошибка — её видно в Runtime Logs.
 * @param {string|undefined} value
 * @param {string} envKey
 * @returns {string}
 */
function funnelId(value, envKey) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (!/^\d+$/.test(raw)) {
    logger.error('funnel_config_invalid', {
      key: envKey,
      message: 'Ожидается номер воронки (целое число). Значение проигнорировано, заявки уйдут в лиды.',
    });
    return '';
  }
  return raw;
}

/**
 * Воронки городов: `BITRIX_FUNNEL_AKTAU=1`, `BITRIX_FUNNEL_AKTOBE=2`, …
 *
 * Пока переменной для города нет, его заявки создаются лидами — как до
 * подключения воронок. Города можно включать по одному.
 * @param {Record<string, string|undefined>} source
 * @returns {Record<string, string>}
 */
function cityFunnels(source) {
  /** @type {Record<string, string>} */
  const map = {};
  for (const { city, keys } of CITY_FUNNEL_KEYS) {
    for (const key of keys) {
      const envKey = `BITRIX_FUNNEL_${key}`;
      const id = funnelId(source[envKey], envKey);
      if (id === '') continue;
      map[cityKey(city)] = id;
      break;
    }
  }
  return map;
}

/**
 * @typedef {Object} LeadConfig
 * @property {string} webhookUrl
 * @property {string} sourceId
 * @property {string} assignedById
 * @property {number} timeoutMs
 * @property {number} retries
 * @property {string[]} allowedOrigins
 * @property {{ max: number, windowMs: number }} rateLimit
 * @property {'first'|'last'} utmPriority
 * @property {Record<string, string>} userFields
 * @property {Record<string, string>} cityFunnels Ключ — город в нижнем регистре, значение — CATEGORY_ID.
 * @property {string} defaultFunnel Воронка для городов без своей настройки. Пусто — лид.
 * @property {boolean} debug
 */

/**
 * Читает и проверяет конфигурацию. Бросает исключение с понятным текстом,
 * если вебхук не задан или задан неверно.
 * @param {Record<string, string|undefined>} [source]
 * @returns {LeadConfig}
 */
export function readConfig(source = process.env) {
  const webhookUrl = String(source.BITRIX_WEBHOOK_URL ?? '').trim();

  if (!webhookUrl) {
    throw new Error(
      'BITRIX_WEBHOOK_URL не задан. Добавьте вебхук входящего запроса Bitrix24 в переменные окружения — см. docs/bitrix24.md.',
    );
  }
  if (!WEBHOOK_RE.test(webhookUrl)) {
    // В тексте ошибки самого значения нет: сообщение попадёт в журнал сборки.
    throw new Error(
      'BITRIX_WEBHOOK_URL имеет неверный формат. Ожидается https://<портал>.bitrix24.kz/rest/<id>/<токен>/',
    );
  }

  return {
    webhookUrl: webhookUrl.endsWith('/') ? webhookUrl : `${webhookUrl}/`,
    sourceId: String(source.BITRIX_SOURCE_ID ?? 'WEB').trim() || 'WEB',
    assignedById: String(source.BITRIX_ASSIGNED_BY_ID ?? '').trim(),
    timeoutMs: int(source.BITRIX_TIMEOUT_MS, 8000),
    retries: int(source.BITRIX_RETRIES, 2),
    allowedOrigins: String(source.LEAD_ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((o) => o.trim().replace(/\/$/, ''))
      .filter(Boolean),
    rateLimit: rateLimit(source.LEAD_RATE_LIMIT),
    // Какой источник уходит в стандартные UTM-поля. По умолчанию первый: именно
    // он сохраняется при первом входе и живёт 30 дней (ТЗ 5).
    utmPriority: String(source.BITRIX_UTM_PRIORITY ?? '').trim() === 'last' ? 'last' : 'first',
    userFields: userFields(source),
    cityFunnels: cityFunnels(source),
    defaultFunnel: funnelId(source.BITRIX_FUNNEL_DEFAULT, 'BITRIX_FUNNEL_DEFAULT'),
    debug: String(source.LEAD_DEBUG ?? '') === '1',
  };
}

/** @type {LeadConfig|null} */
let cached = null;

/**
 * Конфигурация процесса. Между вызовами не перечитывается: на serverless это
 * экономит разбор на каждый запрос, а сменить значение всё равно можно только
 * передеплоем.
 * @returns {LeadConfig}
 */
export function getConfig() {
  if (!cached) cached = readConfig();
  return cached;
}

/** Сбрасывает кеш конфигурации. Нужен только тестам. */
export function resetConfig() {
  cached = null;
}
