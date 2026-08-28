/**
 * Перевод подписей планировок.
 *
 * RU-строки лежат в data-файлах ЖК в свободной форме («2-комнатная · Блок 3»,
 * «Блок А-1 · этажи 9–10»), поэтому переводим их разбором шаблонов, а не
 * пословарно: новая планировка подхватывается без правки словаря.
 */

/** @param {Function} t */
export function translateRoomsCount(t, rooms) {
  if (!rooms) return rooms;
  const map = {
    '1 комната': t('rooms.count1'),
    '2 комнаты': t('rooms.count2'),
    '3 комнаты': t('rooms.count3'),
    '4 комнаты': t('rooms.count4'),
    '1 спальня': t('rooms.bedroom1'),
  };
  if (map[rooms]) return map[rooms];

  // «1–4 комнаты» — диапазон комнатности.
  const range = rooms.match(/^(\d+[–-]\d+)\s+комнат[аы]?$/);
  if (range) return t('rooms.rangeCount', { range: range[1] });

  // «2 спальни», «4 спальни».
  const beds = rooms.match(/^(\d+)\s+спал[ья]н[иья]$/);
  if (beds) return t('rooms.bedrooms', { n: beds[1] });

  return rooms;
}

/**
 * Один сегмент подписи: «Блок 2», «3 этаж», «Этажи 9–10», «Подъезд 1»,
 * «Планировка 5-A», «2-комнатная». Незнакомый текст возвращается как есть.
 * @param {Function} t
 */
function translateSegment(t, part) {
  const value = part.trim();

  const block = value.match(/^Блок\s+(.+)$/);
  if (block) return `${t('plans.block')} ${block[1]}`;

  const blocks = value.match(/^Блоки\s+(.+)$/);
  if (blocks) return `${t('plans.blocks')} ${blocks[1]}`;

  const entrance = value.match(/^Подъезд\s+(.+)$/);
  if (entrance) return `${t('plans.entrance')} ${entrance[1]}`;

  const layout = value.match(/^Планировка\s+(.+)$/);
  if (layout) return `${t('plans.layout')} ${layout[1]}`;

  // «Этажи 2, 4, 8», «этажи 9–10» — множественное число идёт первым словом.
  const floors = value.match(/^[Ээ]тажи\s+(.+)$/);
  if (floors) return `${t('plans.floors')} ${floors[1]}`;

  // «3 этаж» — номер перед словом.
  const floor = value.match(/^(\d+)\s+этаж$/);
  if (floor) return `${floor[1]} ${t('plans.floor')}`;

  const rooms = value.match(/^(\d)-комнатная$/);
  if (rooms) return t(`rooms.type.${rooms[1]}`);

  const counted = translateRoomsCount(t, value);
  if (counted !== value) return counted;

  // Свободная подпись вроде «1-комнатная — 40–55 м²»: подменяем то, что узнаём.
  return value
    .replace(/(\d)-комнатная/g, (_, n) => t(`rooms.type.${n}`))
    .replace(/м²/g, t('units.m2'));
}

/**
 * Название планировки: сегменты разделены « · ».
 * @param {Function} t
 */
export function translatePlanName(t, name) {
  if (!name) return name;
  return name
    .split('·')
    .map((part) => translateSegment(t, part))
    .join(' · ');
}

/** @param {Function} t */
export function translatePlanMeta(t, value) {
  if (!value) return value;
  return translateSegment(t, value);
}

/** @param {Function} t */
export function translatePricePending(t, price) {
  if (!price) return price;
  if (price === 'уточняется') return t('plans.pricePending');

  // «от 550 000 ₸/м² при 100% оплате» — цена за метр при полной оплате.
  const perM2 = price.match(/^от\s+(.+)\s*₸\/м²\s+при\s+100%\s+оплате$/);
  if (perM2) return t('plans.priceFullPayment', { price: `${perM2[1].trim()} ₸` });

  // «от 23 236 350 ₸».
  const from = price.match(/^от\s+(.+)$/);
  if (from) return t('plans.priceFrom', { price: from[1].trim() });

  return price;
}

/**
 * Площадь: «уточняется», «по плану блока» или число с единицей.
 * Кириллическое «м²» и запятая в дробной части подменяются по языку.
 * @param {Function} t
 */
export function translateAreaPending(t, area) {
  if (!area) return area;
  if (area === 'уточняется') return t('plans.areaPending');
  if (area === 'по плану блока') return t('plans.areaByBlock');

  const measured = area.match(/^([\d\s]+)(?:,(\d+))?\s*м²$/);
  if (measured) {
    const whole = measured[1].trim();
    const fraction = measured[2] ? `${t('units.decimal')}${measured[2]}` : '';
    return `${whole}${fraction} ${t('units.m2')}`;
  }
  return area;
}
