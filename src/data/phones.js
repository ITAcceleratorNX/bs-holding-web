/** Городские номера для шапки, контактов и страниц ЖК. */
export const CITY_PHONES = {
  Актау: {
    display: '+7 701 ***-**-06',
    href: 'tel:+77010836606',
    /** Номер WhatsApp в формате wa.me — только цифры, без «+». */
    whatsapp: '77010836606',
  },
  Актобе: {
    display: '+7 702 ***-**-70',
    href: 'tel:+77021118070',
    whatsapp: '77021118070',
  },
  'Усть-Каменогорск': {
    display: '+7 700 ***-**-06',
    href: 'tel:+77000386606',
    whatsapp: '77000386606',
  },
};

/**
 * @param {string} city
 * @returns {{ display: string, href: string, whatsapp: string }}
 */
export function phoneForCity(city) {
  return CITY_PHONES[city] ?? CITY_PHONES['Актау'];
}

/**
 * Номер WhatsApp города для ссылки wa.me (ТЗ 7).
 * @param {string} [city]
 * @returns {string}
 */
export function whatsappForCity(city) {
  return phoneForCity(city).whatsapp;
}
