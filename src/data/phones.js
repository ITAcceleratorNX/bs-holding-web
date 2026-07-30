/** Городские номера для шапки и страниц ЖК. */
export const CITY_PHONES = {
  Актау: {
    display: '+7 701 083-66-06',
    href: 'tel:+77010836606',
  },
  Актобе: {
    display: '+7 702 111-80-70',
    href: 'tel:+77021118070',
  },
  'Усть-Каменогорск': {
    display: '+7 700 038-66-06',
    href: 'tel:+77000386606',
  },
};

/**
 * @param {string} city
 * @returns {{ display: string, href: string }}
 */
export function phoneForCity(city) {
  return CITY_PHONES[city] ?? CITY_PHONES['Актау'];
}
