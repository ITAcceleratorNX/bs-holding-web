/** @param {Function} t */
export function translateRoomsCount(t, rooms) {
  if (!rooms) return rooms;
  const map = {
    '1 комната': t('rooms.count1'),
    '2 комнаты': t('rooms.count2'),
    '3 комнаты': t('rooms.count3'),
    '4 комнаты': t('rooms.count4'),
  };
  return map[rooms] ?? rooms;
}

/** @param {Function} t */
export function translatePlanName(t, name) {
  if (!name) return name;
  return name.replace(/(\d)-комнатная/g, (_, n) => t(`rooms.type.${n}`));
}

/** @param {Function} t */
export function translatePlanMeta(t, value) {
  if (!value) return value;
  if (value.startsWith('Блок ')) {
    return `${t('plans.block')} ${value.replace('Блок ', '')}`;
  }
  return translateRoomsCount(t, value) ?? value;
}

/** @param {Function} t */
export function translatePricePending(t, price) {
  if (price === 'уточняется') return t('plans.pricePending');
  return price;
}

/** @param {Function} t */
export function translateAreaPending(t, area) {
  if (area === 'уточняется') return t('plans.areaPending');
  return area;
}
