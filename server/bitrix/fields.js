/**
 * Таблица соответствия данных сайта и полей Bitrix24 (ТЗ 9).
 *
 * Здесь описано, что и куда уходит. Порядок работы такой:
 *   1. Пока пользовательского поля в CRM нет, значение попадает в
 *      структурированный комментарий карточки — ни один факт не теряется.
 *   2. Когда поле создали, его код добавляют в переменные окружения
 *      (`BITRIX_UF_<SLOT>=UF_CRM_...`), и значение начинает уходить ещё и в поле.
 *
 * Код при этом не меняется — поэтому подключать поля можно постепенно,
 * не трогая деплой сайта.
 */

/** Человеческие названия групп для комментария в карточке лида (ТЗ 4). */
export const GROUP_LABELS = {
  context: 'Контекст обращения',
  quiz: 'Квиз',
  layout: 'Планировка',
  calculator: 'Расчёт',
  page: 'Страница',
  ad: 'Реклама',
  tech: 'Техническое',
  other: 'Дополнительно',
};

/** Порядок групп в комментарии: от сути обращения к техническим деталям. */
export const GROUP_ORDER = ['context', 'quiz', 'layout', 'calculator', 'page', 'ad', 'tech', 'other'];

/**
 * Слоты пользовательских полей верхнего уровня.
 *
 * `slot` — суффикс переменной окружения: слот `form_code` настраивается
 * переменной `BITRIX_UF_FORM_CODE`.
 *
 * @type {{ slot: string, label: string, value: (lead: import('../../src/lead/contract.js').NormalizedLead) => string }[]}
 */
export const UF_SLOTS = [
  { slot: 'form_code', label: 'Код формы', value: (lead) => lead.formCode },
  { slot: 'form_title', label: 'Название формы', value: (lead) => lead.formTitle },
  { slot: 'city', label: 'Город', value: (lead) => lead.city },
  { slot: 'project', label: 'ЖК', value: (lead) => lead.project },
  { slot: 'cta_location', label: 'Расположение CTA', value: (lead) => lead.ctaLocation },
  { slot: 'page_url', label: 'URL страницы', value: (lead) => lead.page.url },
  { slot: 'page_title', label: 'Название страницы', value: (lead) => lead.page.title },
  { slot: 'lang', label: 'Язык сайта', value: (lead) => lead.page.lang },
  { slot: 'submission_id', label: 'ID отправки', value: (lead) => lead.submissionId },
  { slot: 'first_source', label: 'Первый источник', value: (lead) => formatTouch(lead.attribution.first) },
  { slot: 'last_source', label: 'Последний источник', value: (lead) => formatTouch(lead.attribution.last) },
];

/**
 * Источник одной строкой — для пользовательского поля и для комментария.
 * @param {Record<string, string>} touch
 * @returns {string}
 */
export function formatTouch(touch) {
  const entries = Object.entries(touch ?? {}).filter(([key]) => key !== 'ts');
  if (entries.length === 0) return '';
  return entries.map(([key, value]) => `${key}=${value}`).join('; ');
}

/**
 * Код пользовательского поля для слота, если он настроен.
 * @param {string} slot
 * @param {Record<string, string>} userFields
 * @returns {string|null}
 */
export function fieldForSlot(slot, userFields) {
  return userFields[slot] ?? null;
}

/**
 * Код пользовательского поля для отдельного значения формы (квиз, планировка,
 * расчёт). Слот собирается как `detail_<key>`: значение с ключом `quiz_rooms`
 * настраивается переменной `BITRIX_UF_DETAIL_QUIZ_ROOMS`.
 * @param {string} key
 * @param {Record<string, string>} userFields
 * @returns {string|null}
 */
export function fieldForDetail(key, userFields) {
  const slot = `detail_${key}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  return userFields[slot] ?? null;
}
