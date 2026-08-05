/**
 * Ограничение частоты отправок с одного адреса.
 *
 * Формы сайта открыты без авторизации, поэтому единственная защита от потока
 * мусорных лидов — лимит на стороне сервера. Он не входит в ТЗ явно, но без него
 * критерий «ошибки обрабатываются корректно» не выполняется при простейшем
 * скрипте, долбящем в форму.
 */

import { TtlMap } from './ttl-map.js';

/** @type {TtlMap|null} */
let buckets = null;

/**
 * Скользящее окно по количеству запросов.
 * @param {string} key Обычно IP-адрес отправителя.
 * @param {{ max: number, windowMs: number }} limit
 * @param {number} [now]
 * @returns {{ allowed: boolean, retryAfterSec: number }}
 */
export function checkRateLimit(key, limit, now = Date.now()) {
  if (!limit.max || !limit.windowMs) return { allowed: true, retryAfterSec: 0 };
  if (!buckets || buckets.ttlMs !== limit.windowMs) {
    buckets = new TtlMap({ ttlMs: limit.windowMs, maxSize: 10000 });
  }

  const hits = /** @type {number[]|undefined} */ (buckets.get(key, now)) ?? [];
  const fresh = hits.filter((at) => now - at < limit.windowMs);

  if (fresh.length >= limit.max) {
    const retryAfterSec = Math.max(1, Math.ceil((limit.windowMs - (now - fresh[0])) / 1000));
    return { allowed: false, retryAfterSec };
  }

  fresh.push(now);
  buckets.set(key, fresh, now);
  return { allowed: true, retryAfterSec: 0 };
}

/** Сбрасывает счётчики. Нужен только тестам. */
export function resetRateLimit() {
  buckets = null;
}
