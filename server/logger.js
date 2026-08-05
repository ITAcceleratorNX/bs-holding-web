/**
 * Журнал интеграции (ТЗ 8: «записывать технические ошибки без сохранения
 * секретных данных»).
 *
 * В журнал попадает только то, что нужно для разбора инцидента: идентификатор
 * отправки, код формы, город, ЖК, код ошибки и длительность. Имя, телефон и
 * вебхук не логируются никогда — ни в обычной записи, ни в тексте исключения,
 * поэтому всякое сообщение проходит через `redact()`.
 */

/** Токен вебхука в любой строке: /rest/1/abcdef123/ */
const WEBHOOK_TOKEN_RE = /(\/rest\/\d+\/)[a-z0-9]+/gi;
/** Телефон в международном или национальном формате. */
const PHONE_RE = /\+?\d[\d\s()-]{8,}\d/g;

/**
 * Убирает из строки секреты и персональные данные.
 * @param {unknown} value
 * @returns {string}
 */
export function redact(value) {
  return String(value ?? '')
    .replace(WEBHOOK_TOKEN_RE, '$1***')
    .replace(PHONE_RE, '***');
}

/**
 * Оставляет в объекте только безопасные для журнала поля.
 * @param {Record<string, unknown>} fields
 * @returns {Record<string, unknown>}
 */
function safeFields(fields) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value == null || value === '') continue;
    out[key] = typeof value === 'string' ? redact(value) : value;
  }
  return out;
}

/**
 * @param {'info'|'warn'|'error'} level
 * @param {string} event
 * @param {Record<string, unknown>} [fields]
 */
function write(level, event, fields = {}) {
  const line = JSON.stringify({
    at: new Date().toISOString(),
    level,
    scope: 'lead',
    event,
    ...safeFields(fields),
  });
  // eslint-disable-next-line no-console
  (level === 'error' ? console.error : level === 'warn' ? console.warn : console.info)(line);
}

export const logger = {
  /** @param {string} event @param {Record<string, unknown>} [fields] */
  info: (event, fields) => write('info', event, fields),
  /** @param {string} event @param {Record<string, unknown>} [fields] */
  warn: (event, fields) => write('warn', event, fields),
  /** @param {string} event @param {Record<string, unknown>} [fields] */
  error: (event, fields) => write('error', event, fields),
};
