/**
 * Отправка заявки на сервер сайта.
 *
 * Браузер обращается только к собственному эндпоинту `/api/lead` — адрес
 * вебхука Bitrix24 в клиентский код не попадает (ТЗ 8).
 *
 * Ожидаемые ошибки не бросаются исключением, а возвращаются в результате:
 * форме нужно показать сообщение и дать повторить отправку, а не падать.
 */

/** Дольше ждать нет смысла: сервер сам ограничивает время запроса к порталу. */
const TIMEOUT_MS = 20000;

const ENDPOINT = '/api/lead';

/**
 * @typedef {Object} SubmitSuccess
 * @property {true} ok
 * @property {number} leadId
 * @property {boolean} duplicate
 *
 * @typedef {Object} SubmitFailure
 * @property {false} ok
 * @property {string} error Код ошибки для аналитики.
 * @property {string} message Текст для пользователя.
 * @property {Record<string, string>} fields Ошибки по полям, если это валидация.
 */

/**
 * @param {string} error
 * @param {string} message
 * @param {Record<string, string>} [fields]
 * @returns {SubmitFailure}
 */
function failure(error, message, fields = {}, messageKey = '') {
  /* `messageKey` — для собственных сообщений клиента: их переводит useLeadForm.
     Ответ сервера приходит готовой строкой и показывается как есть. */
  return { ok: false, error, message, fields, messageKey };
}

/**
 * @param {Record<string, unknown>} payload Заявка, собранная `useLeadForm`.
 * @returns {Promise<SubmitSuccess|SubmitFailure>}
 */
export async function postLead(payload) {
  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return failure('network', '', {}, 'lead.error.network');
  }

  /** @type {any} */
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (response.ok && body?.ok === true && Number(body.leadId) > 0) {
    return { ok: true, leadId: Number(body.leadId), duplicate: body.duplicate === true };
  }

  // Успех показываем только при подтверждённом номере лида (ТЗ 8).
  return failure(
    String(body?.error ?? `http_${response.status}`),
    body?.message ? String(body.message) : '',
    body?.fields && typeof body.fields === 'object' ? body.fields : {},
    body?.message ? '' : 'lead.error.generic',
  );
}

/**
 * Идентификатор отправки для защиты от дублей (ТЗ 8).
 * @returns {string}
 */
export function createSubmissionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
