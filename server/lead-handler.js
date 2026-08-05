/**
 * Единый серверный модуль отправки заявок (ТЗ 8).
 *
 * Все формы сайта приходят сюда. Модуль не зависит от фреймворка: на входе
 * обычный объект запроса, на выходе — объект ответа, поэтому один и тот же код
 * работает и как функция Vercel, и как обработчик Node-сервера, и как
 * middleware дев-сервера Vite.
 *
 * Порядок проверок — от самых дешёвых к самым дорогим, чтобы мусорный трафик
 * отсеивался до обращения к Bitrix24.
 */

import { normalizeLead } from '../src/lead/contract.js';
import { getConfig } from './env.js';
import { logger } from './logger.js';
import { checkRateLimit } from './rate-limit.js';
import { onceBySubmissionId } from './dedupe.js';
import { addLead, BitrixError } from './bitrix/client.js';
import { buildLeadFields } from './bitrix/mapper.js';

/** Заявка со всеми полями укладывается в единицы килобайт. */
const MAX_BODY_BYTES = 32 * 1024;

/**
 * Минимальное время от показа формы до отправки. Человек не успевает заполнить
 * имя и телефон быстрее, а простейшие боты отправляют форму мгновенно.
 */
const MIN_FILL_MS = 1000;

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

/**
 * @param {number} status
 * @param {Record<string, unknown>} body
 * @param {Record<string, string>} [headers]
 */
function reply(status, body, headers = {}) {
  return { status, headers: { ...JSON_HEADERS, ...headers }, body };
}

/**
 * Адрес отправителя для лимита частоты. За прокси Vercel настоящий адрес —
 * первый в `x-forwarded-for`.
 * @param {Record<string, string|string[]|undefined>} headers
 * @returns {string}
 */
function clientIp(headers) {
  const forwarded = headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const first = String(raw ?? '').split(',')[0].trim();
  return first || String(headers['x-real-ip'] ?? '').trim() || 'unknown';
}

/**
 * Запрос пришёл с нашего сайта.
 *
 * Если список источников задан явно — работает он. Если нет, требуем совпадения
 * `Origin` и `Host`: так проверка работает «из коробки» на любом домене, включая
 * превью-деплои, и при этом эндпоинт нельзя дёргать со стороннего сайта.
 * @param {Record<string, string|string[]|undefined>} headers
 * @param {string[]} allowedOrigins
 * @returns {boolean}
 */
function originAllowed(headers, allowedOrigins) {
  const origin = String(headers.origin ?? '').replace(/\/$/, '');
  // Запрос без Origin — не браузерная отправка (curl, серверный вызов).
  // Отсекать его нет смысла: заголовок всё равно подделывается тривиально.
  if (!origin) return true;

  if (allowedOrigins.length > 0) return allowedOrigins.includes(origin);

  const host = String(headers.host ?? '');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Разбирает тело запроса. Адаптер может передать уже разобранный объект
 * (так делает Vercel) или сырую строку.
 * @param {unknown} body
 * @returns {{ ok: true, value: unknown } | { ok: false, reason: 'too_large'|'invalid_json' }}
 */
function parseBody(body) {
  if (body && typeof body === 'object') return { ok: true, value: body };

  const raw = typeof body === 'string' ? body : '';
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return { ok: false, reason: 'too_large' };
  try {
    return { ok: true, value: raw ? JSON.parse(raw) : {} };
  } catch {
    return { ok: false, reason: 'invalid_json' };
  }
}

/**
 * @typedef {Object} LeadRequest
 * @property {string} method
 * @property {Record<string, string|string[]|undefined>} headers
 * @property {unknown} body Разобранный объект или строка JSON.
 */

/**
 * Обрабатывает отправку формы.
 * @param {LeadRequest} request
 * @returns {Promise<{ status: number, headers: Record<string, string>, body: Record<string, unknown> }>}
 */
export async function handleLeadRequest(request) {
  const startedAt = Date.now();
  const headers = request.headers ?? {};

  if (String(request.method ?? '').toUpperCase() !== 'POST') {
    return reply(405, { ok: false, error: 'method_not_allowed' }, { Allow: 'POST' });
  }

  /** @type {import('./env.js').LeadConfig} */
  let config;
  try {
    config = getConfig();
  } catch (error) {
    // Интеграция не настроена: пользователю показываем нейтральную ошибку,
    // подробности — только в журнал сервера.
    logger.error('config_invalid', { message: error?.message });
    return reply(500, {
      ok: false,
      error: 'not_configured',
      message: 'Отправка заявок временно недоступна. Позвоните нам — мы примем заявку по телефону.',
    });
  }

  if (!originAllowed(headers, config.allowedOrigins)) {
    logger.warn('origin_rejected', { origin: String(headers.origin ?? '') });
    return reply(403, { ok: false, error: 'forbidden_origin' });
  }

  const parsed = parseBody(request.body);
  if (!parsed.ok) {
    return reply(parsed.reason === 'too_large' ? 413 : 400, { ok: false, error: parsed.reason });
  }

  const payload = /** @type {Record<string, unknown>} */ (parsed.value ?? {});

  // Ловушка для ботов: поле скрыто от пользователя и должно остаться пустым.
  if (typeof payload.hp === 'string' && payload.hp.trim() !== '') {
    logger.warn('bot_honeypot', { formCode: String(payload.formCode ?? '') });
    return reply(400, { ok: false, error: 'rejected' });
  }

  const renderedAt = Number(payload.renderedAt);
  if (Number.isFinite(renderedAt) && renderedAt > 0 && startedAt - renderedAt < MIN_FILL_MS) {
    logger.warn('bot_too_fast', { formCode: String(payload.formCode ?? ''), elapsedMs: startedAt - renderedAt });
    return reply(400, { ok: false, error: 'rejected' });
  }

  const ip = clientIp(headers);
  const limit = checkRateLimit(ip, config.rateLimit, startedAt);
  if (!limit.allowed) {
    logger.warn('rate_limited', { ip, formCode: String(payload.formCode ?? '') });
    return reply(
      429,
      {
        ok: false,
        error: 'rate_limited',
        message: 'Слишком много заявок подряд. Попробуйте через минуту.',
      },
      { 'Retry-After': String(limit.retryAfterSec) },
    );
  }

  // Клиентская проверка — только удобство. Решает эта.
  const { ok, errors, lead } = normalizeLead(payload);
  if (!ok) {
    logger.warn('validation_failed', {
      formCode: lead.formCode,
      fields: Object.keys(errors).join(','),
    });
    return reply(400, {
      ok: false,
      error: 'validation',
      message: 'Проверьте заполнение формы.',
      fields: errors,
    });
  }

  /** Общие для журнала поля: персональных данных среди них нет (ТЗ 10). */
  const context = {
    submissionId: lead.submissionId,
    formCode: lead.formCode,
    city: lead.city,
    project: lead.project,
  };

  try {
    const { result: leadId, duplicate } = await onceBySubmissionId(lead.submissionId, () =>
      addLead(buildLeadFields(lead, config), config),
    );

    logger.info(duplicate ? 'lead_duplicate_ignored' : 'lead_created', {
      ...context,
      leadId,
      durationMs: Date.now() - startedAt,
    });

    return reply(200, { ok: true, leadId, submissionId: lead.submissionId, duplicate });
  } catch (error) {
    const code = error instanceof BitrixError ? error.code : 'UNEXPECTED';
    logger.error('lead_failed', {
      ...context,
      code,
      message: error?.message,
      durationMs: Date.now() - startedAt,
    });

    // Успех без подтверждённого лида показывать нельзя (ТЗ 8), поэтому здесь
    // всегда ошибка — пользователь увидит предложение повторить отправку.
    return reply(502, {
      ok: false,
      error: 'crm_unavailable',
      message: 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.',
    });
  }
}
