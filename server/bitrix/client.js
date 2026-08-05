/**
 * Транспорт к REST API Bitrix24 через вебхук входящего запроса.
 *
 * Единственное место, где известен адрес вебхука. Наружу он не отдаётся:
 * в исключение попадает только код ошибки и очищенное описание, поэтому текст
 * ошибки можно безопасно писать в журнал (ТЗ 8).
 */

import { redact } from '../logger.js';

/** Ошибка вызова Bitrix24 с признаком «имеет смысл повторить». */
export class BitrixError extends Error {
  /**
   * @param {string} code
   * @param {string} description
   * @param {{ retryable?: boolean, status?: number }} [options]
   */
  constructor(code, description, options = {}) {
    super(redact(description || code));
    this.name = 'BitrixError';
    this.code = code;
    this.retryable = options.retryable ?? false;
    this.status = options.status ?? 0;
  }
}

/**
 * Коды, при которых повтор осмысленен: портал временно недоступен или
 * сработало ограничение частоты вызовов на стороне Bitrix24.
 */
const RETRYABLE_CODES = new Set(['QUERY_LIMIT_EXCEEDED', 'OPERATION_TIME_LIMIT', 'INTERNAL_SERVER_ERROR']);

/** @param {number} ms */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Один вызов метода REST без повторов.
 * @param {string} method
 * @param {Record<string, unknown>} params
 * @param {import('../env.js').LeadConfig} config
 * @returns {Promise<unknown>}
 */
async function callOnce(method, params, config) {
  let response;
  try {
    response = await fetch(`${config.webhookUrl}${method}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(config.timeoutMs),
    });
  } catch (error) {
    // Сетевая ошибка и таймаут одинаково лечатся повтором.
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    throw new BitrixError(
      timedOut ? 'TIMEOUT' : 'NETWORK_ERROR',
      timedOut ? `Портал не ответил за ${config.timeoutMs} мс` : String(error?.message ?? error),
      { retryable: true },
    );
  }

  const raw = await response.text();
  /** @type {any} */
  let body;
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    // HTML вместо JSON — обычно заглушка портала или неверный адрес вебхука.
    throw new BitrixError('BAD_RESPONSE', `Портал вернул не JSON (HTTP ${response.status})`, {
      retryable: response.status >= 500,
      status: response.status,
    });
  }

  if (body?.error) {
    const code = String(body.error);
    throw new BitrixError(code, String(body.error_description ?? ''), {
      retryable: RETRYABLE_CODES.has(code) || response.status >= 500,
      status: response.status,
    });
  }

  if (!response.ok) {
    throw new BitrixError(`HTTP_${response.status}`, `Портал вернул HTTP ${response.status}`, {
      retryable: response.status >= 500 || response.status === 429,
      status: response.status,
    });
  }

  return body?.result;
}

/**
 * Вызов метода REST с повторами при временных сбоях.
 * @param {string} method Например, `crm.lead.add`.
 * @param {Record<string, unknown>} params
 * @param {import('../env.js').LeadConfig} config
 * @returns {Promise<unknown>}
 */
export async function callBitrix(method, params, config) {
  let lastError;
  for (let attempt = 0; attempt <= config.retries; attempt += 1) {
    try {
      return await callOnce(method, params, config);
    } catch (error) {
      lastError = error;
      if (!(error instanceof BitrixError) || !error.retryable || attempt === config.retries) break;
      // Нарастающая пауза: 300 мс, 600 мс, 1200 мс.
      await sleep(300 * 2 ** attempt);
    }
  }
  throw lastError;
}

/**
 * Создаёт лид и возвращает его идентификатор.
 * @param {Record<string, unknown>} fields Поля лида.
 * @param {import('../env.js').LeadConfig} config
 * @returns {Promise<number>}
 */
export async function addLead(fields, config) {
  const result = await callBitrix(
    'crm.lead.add',
    {
      fields,
      // Лид проходит стандартную обработку портала: роботы, уведомления,
      // распределение по ответственным (ТЗ 9 — настройка на стороне Bitrix24).
      params: { REGISTER_SONET_EVENT: 'Y' },
    },
    config,
  );

  const leadId = Number(result);
  if (!Number.isInteger(leadId) || leadId <= 0) {
    // Без подтверждённого номера лида успех показывать нельзя (ТЗ 8).
    throw new BitrixError('NO_LEAD_ID', 'Портал не вернул идентификатор лида');
  }
  return leadId;
}
