/**
 * Map с временем жизни записей и ограничением размера.
 *
 * Общая основа для защиты от дублей и лимита запросов. Хранилище — в памяти
 * процесса, поэтому на serverless оно живёт в пределах одного экземпляра
 * функции: этого достаточно против быстрых повторных кликов (все они попадают
 * в один «тёплый» экземпляр), но не даёт глобальной гарантии. Если понадобится
 * общий счётчик на все экземпляры, сюда подставляется внешнее хранилище —
 * интерфейс `get/set/delete` для этого и выделен.
 */

export class TtlMap {
  /**
   * @param {{ ttlMs: number, maxSize?: number }} options
   */
  constructor({ ttlMs, maxSize = 5000 }) {
    this.ttlMs = ttlMs;
    this.maxSize = maxSize;
    /** @type {Map<string, { value: unknown, expiresAt: number }>} */
    this.entries = new Map();
  }

  /**
   * Удаляет просроченные записи. Вызывается при записи, отдельного таймера нет:
   * на serverless процесс засыпает между запросами и таймер всё равно не сработал бы.
   * @param {number} now
   */
  sweep(now) {
    for (const [key, entry] of this.entries) {
      if (entry.expiresAt <= now) this.entries.delete(key);
    }
    // Аварийный предохранитель против роста памяти под нагрузкой: вытесняем
    // самые старые записи (Map хранит порядок вставки).
    while (this.entries.size > this.maxSize) {
      const oldest = this.entries.keys().next();
      if (oldest.done) break;
      this.entries.delete(oldest.value);
    }
  }

  /**
   * @param {string} key
   * @param {number} [now]
   * @returns {unknown}
   */
  get(key, now = Date.now()) {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= now) {
      this.entries.delete(key);
      return undefined;
    }
    return entry.value;
  }

  /**
   * @param {string} key
   * @param {unknown} value
   * @param {number} [now]
   */
  set(key, value, now = Date.now()) {
    this.sweep(now);
    this.entries.set(key, { value, expiresAt: now + this.ttlMs });
  }

  /** @param {string} key */
  delete(key) {
    this.entries.delete(key);
  }
}
