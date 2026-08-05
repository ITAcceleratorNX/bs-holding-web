/**
 * Защита от дублей по идентификатору отправки (ТЗ 8).
 *
 * Браузер присваивает каждой заполненной форме `submissionId` и сохраняет его
 * при повторе после ошибки. Поэтому:
 *   - повторный быстрый клик приходит с тем же id и не создаёт второй лид;
 *   - повтор после ошибки приходит с тем же id, но лид ещё не создан, и заявка
 *     уходит в CRM как обычно.
 *
 * Запросы с одинаковым id, пришедшие одновременно, разруливаются хранением
 * самого промиса: второй запрос дожидается первого и возвращает тот же лид,
 * вместо того чтобы завести дубль параллельным вызовом Bitrix24.
 */

import { TtlMap } from './ttl-map.js';

/** Дольше держать не нужно: столько живёт открытая вкладка с одной формой. */
const TTL_MS = 30 * 60 * 1000;

const store = new TtlMap({ ttlMs: TTL_MS, maxSize: 5000 });

/**
 * Выполняет создание лида не более одного раза на `submissionId`.
 *
 * @template T
 * @param {string} submissionId
 * @param {() => Promise<T>} create
 * @returns {Promise<{ result: T, duplicate: boolean }>}
 */
export async function onceBySubmissionId(submissionId, create) {
  const pending = /** @type {Promise<T>|undefined} */ (store.get(submissionId));
  if (pending) {
    return { result: await pending, duplicate: true };
  }

  const promise = create();
  store.set(submissionId, promise);

  try {
    return { result: await promise, duplicate: false };
  } catch (error) {
    // Неудачную попытку не запоминаем: ТЗ требует дать пользователю повторить
    // отправку, а закешированная ошибка навсегда заблокировала бы эту заявку.
    store.delete(submissionId);
    throw error;
  }
}

/** Очищает хранилище. Нужен только тестам. */
export function resetDedupe() {
  store.entries.clear();
}
