/**
 * Дополнительные данные заявки: квиз, планировка, расчёт (ТЗ 6).
 *
 * Каждое значение — запись `{ key, label, value, group }`:
 *   - `key` стабилен и служит якорем для пользовательского поля Bitrix24;
 *   - `label` читает менеджер в карточке лида;
 *   - `group` определяет раздел комментария.
 *
 * Плоский список вместо схемы под каждую форму: новое поле добавляется одной
 * строкой и сразу доходит до CRM, а сервер и контракт менять не нужно.
 */

/** Диапазоны площади по умолчанию для формы «Получить расчет». */
export const AREA_RANGES = [
  { value: '1-комнатная — 40–55 м²', label: '1-комнатная — 40–55 м²' },
  { value: '2-комнатная — 60–80 м²', label: '2-комнатная — 60–80 м²' },
  { value: '3-комнатная — 90–115 м²', label: '3-комнатная — 90–115 м²' },
  { value: '4-комнатная — 120–140 м²', label: '4-комнатная — 120–140 м²' },
];

/**
 * Собирает список значений, отбрасывая пустые.
 *
 * @param {string} group Раздел карточки: `quiz`, `layout`, `calculator`, `context`.
 * @param {Array<[string, string, unknown]>} rows Тройки «ключ, подпись, значение».
 * @returns {{ key: string, label: string, value: string, group: string }[]}
 */
export function buildDetails(group, rows) {
  const out = [];
  for (const [key, label, value] of rows) {
    if (value == null || value === '' || value === false) continue;
    out.push({ key, label, value: String(value), group });
  }
  return out;
}
