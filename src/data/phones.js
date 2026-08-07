/**
 * Городские номера для шапки, контактов и страниц ЖК.
 *
 * `display` — номер со скрытой серединой: он показывается до заявки. Полный
 * номер (`full`) открывается только после формы «Получить номер отдела продаж»,
 * поэтому каждый показ номера превращается в лид.
 */
export const CITY_PHONES = {
  Актау: {
    full: '+7 701 083-66-06',
    display: '+7 701 ***-**-06',
    href: 'tel:+77010836606',
    /** Номер WhatsApp в формате wa.me — только цифры, без «+». */
    whatsapp: '77010836606',
  },
  Актобе: {
    full: '+7 702 111-80-70',
    display: '+7 702 ***-**-70',
    href: 'tel:+77021118070',
    whatsapp: '77021118070',
  },
  'Усть-Каменогорск': {
    full: '+7 700 038-66-06',
    display: '+7 700 ***-**-06',
    href: 'tel:+77000386606',
    whatsapp: '77000386606',
  },
};

/**
 * @param {string} city
 * @returns {{ full: string, display: string, href: string, whatsapp: string }}
 */
export function phoneForCity(city) {
  return CITY_PHONES[city] ?? CITY_PHONES['Актау'];
}

/**
 * Запись номера по ссылке `tel:`. Точки показа хранят готовую ссылку, а не
 * город (у страницы ЖК город адреса и город отдела продаж могут различаться),
 * поэтому скрытый номер сопоставляется с полным именно по ней.
 * @param {string} href
 * @returns {{ full: string, display: string, href: string, whatsapp: string }|null}
 */
export function phoneForHref(href) {
  return Object.values(CITY_PHONES).find((phone) => phone.href === href) ?? null;
}

/**
 * Номер WhatsApp города для ссылки wa.me (ТЗ 7).
 * @param {string} [city]
 * @returns {string}
 */
export function whatsappForCity(city) {
  return phoneForCity(city).whatsapp;
}
