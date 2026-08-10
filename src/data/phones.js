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
 * Номера колл-центров отдельных ЖК.
 *
 * У ЖК может быть своя линия сверх городской: звонки принимает колл-центр
 * проекта, и клиенту показывают все его номера сразу. Набор хранится отдельно
 * от `CITY_PHONES`, потому что городской номер стоит в шапке сайта и в блоке
 * «Поддержка» — расширять его линиями одного ЖК там нечего.
 *
 * Ключ — слаг страницы ЖК.
 */
export const PROJECT_PHONES = {
  'white-hill': {
    full: '+7 702 111-80-70',
    display: '+7 702 ***-**-70',
    href: 'tel:+77021118070',
    whatsapp: '77021118070',
    numbers: [
      { full: '+7 702 111-80-70', display: '+7 702 ***-**-70', href: 'tel:+77021118070' },
      { full: '+7 778 111-80-70', display: '+7 778 ***-**-70', href: 'tel:+77781118070' },
    ],
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
 * Номера колл-центра ЖК. `null` — у проекта своей линии нет, точка показа
 * возьмёт городской номер.
 * @param {string} slug
 * @returns {{ full: string, display: string, href: string, whatsapp: string, numbers: Array<{ full: string, display: string, href: string }> }|null}
 */
export function phoneForProject(slug) {
  return PROJECT_PHONES[slug] ?? null;
}

/**
 * Все линии точки показа. У городского номера линия одна, у колл-центра ЖК их
 * несколько — форма показа открывает сразу все, поэтому обходить их удобнее
 * одним списком, не разбирая, откуда пришёл номер.
 * @param {{ full: string, display: string, href: string, numbers?: Array<{ full: string, display: string, href: string }> }|null} phone
 * @returns {Array<{ full: string, display: string, href: string }>}
 */
export function phoneNumbers(phone) {
  if (!phone) return [];
  return phone.numbers ?? [{ full: phone.full, display: phone.display, href: phone.href }];
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
