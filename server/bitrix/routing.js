/**
 * Маршрутизация заявки по городам: Актау, Актобе, Усть-Каменогорск.
 *
 * Город берётся из данных выбранного ЖК (`src/data/*.js` → `useLeadForm`) и уже
 * приходит на сервер нормализованным. Здесь решается только одно: в какую
 * воронку Bitrix24 положить обращение.
 *
 * Важно понимать устройство Bitrix24: **у лидов воронок нет**. Воронка (она же
 * «направление») существует только у сделок и задаётся полем `CATEGORY_ID`.
 * Поэтому маршрутизация работает так:
 *
 *   - для города задан `BITRIX_FUNNEL_<ГОРОД>` → создаётся **сделка** в этой воронке;
 *   - переменной нет → создаётся **лид**, как и раньше.
 *
 * Такой порядок позволяет включать города по одному и не ломает портал, если
 * воронок ещё нет: заявка в любом случае доходит до CRM.
 */

/**
 * Города и суффиксы переменных окружения для них.
 *
 * Названия городов кириллические, а имена переменных — нет, поэтому связь
 * задаётся явно. Для Усть-Каменогорска принимаются оба написания: длинное и
 * привычное сокращение УКГ.
 *
 * @type {{ city: string, keys: string[] }[]}
 */
export const CITY_FUNNEL_KEYS = [
  { city: 'Актау', keys: ['AKTAU'] },
  { city: 'Актобе', keys: ['AKTOBE'] },
  { city: 'Усть-Каменогорск', keys: ['UST_KAMENOGORSK', 'UKG'] },
];

/**
 * Ключ города для сопоставления. Регистр, лишние пробелы и «ё» не должны
 * влиять на то, в какую воронку попадёт заявка.
 * @param {string} city
 * @returns {string}
 */
export function cityKey(city) {
  return String(city ?? '')
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ');
}

/**
 * @typedef {Object} Destination
 * @property {'lead'|'deal'} entity Что создаём в CRM.
 * @property {string} categoryId Воронка сделки. Для лида — пустая строка.
 */

/**
 * Куда положить заявку из указанного города.
 *
 * Город, которого нет в настройках (например, новый ЖК в новом городе),
 * уходит в `BITRIX_FUNNEL_DEFAULT`, а если и её нет — в лиды. Заявка не
 * теряется ни при каком раскладе.
 *
 * @param {string} city
 * @param {import('../env.js').LeadConfig} config
 * @returns {Destination}
 */
export function resolveDestination(city, config) {
  const categoryId = config.cityFunnels[cityKey(city)] ?? config.defaultFunnel ?? '';
  return categoryId === '' ? { entity: 'lead', categoryId: '' } : { entity: 'deal', categoryId };
}
