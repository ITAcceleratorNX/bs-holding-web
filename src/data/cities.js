/** Стабильные значения городов (фильтры, телефоны, CRM). */
export const CITY_LIST = ['Актау', 'Актобе', 'Усть-Каменогорск'];

/** @type {Record<string, string>} */
export const CITY_I18N_KEY = {
  Актау: 'city.aktau',
  Актобе: 'city.aktobe',
  'Усть-Каменогорск': 'city.oskemen',
};

/** @param {Function} t */
export function cityLabel(t, city) {
  const key = CITY_I18N_KEY[city];
  return key ? t(key) : city;
}
