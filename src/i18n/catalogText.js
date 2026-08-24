import { CITY_I18N_KEY, cityLabel } from '../data/cities';

const KLASS_KEY = {
  Премиум: 'klass.premium',
  Бизнес: 'klass.business',
  'Бизнес+': 'klass.businessPlus',
  Комфорт: 'klass.comfort',
  'Комфорт+': 'klass.comfortPlus',
};

const CLASS_FULL_KEY = {
  'Бизнес-класс': 'klass.businessClass',
  'Бизнес +': 'klass.businessPlusShort',
  'Комфорт+-класс': 'klass.comfortPlusClass',
  'Премиум-класс': 'klass.premiumClass',
};

const TERM_BADGE_KEY = {
  Сдан: 'filter.delivered',
  '2026 год': 'filter.year2026',
  '2027 год': 'term.year2027',
  'I квартал 2026': 'term.q1_2026',
  'I квартал 2028': 'term.q1_2028',
  'IV квартал 2026': 'term.q4_2026',
  'Август 2027': 'term.aug2027',
};

/** @param {Function} t */
export function klassLabel(t, klass) {
  const key = KLASS_KEY[klass];
  return key ? t(key) : klass;
}

/** @param {Function} t */
export function classFullLabel(t, classFull) {
  const key = CLASS_FULL_KEY[classFull];
  return key ? t(key) : classFull;
}

/** @param {Function} t */
export function termBadgeLabel(t, termBadge) {
  const key = TERM_BADGE_KEY[termBadge];
  return key ? t(key) : termBadge;
}

/** Ориентиры и характеристики в meta-чипах карточек. */
const META_KEY = {
  Море: 'meta.sea',
  '8 мин': 'meta.8min',
  '40-й микрорайон': 'meta.district40',
  '40 МКР': 'meta.district40short',
  '9 мкр': 'meta.district9',
  Парк: 'meta.park',
  'Президентский парк': 'meta.presidentPark',
  'Парк Первого Президента': 'meta.firstPresidentPark',
  Центр: 'meta.centre',
  Есенберлина: 'meta.yesenberlin',
  'Алтын Орда': 'meta.altynOrda',
  'Ораза Татеулы': 'meta.orazaTateuly',
  электрозарядка: 'meta.charging',
  огнезащита: 'meta.fireproof',
  'отдельный вход': 'meta.ownEntrance',
};

/** Переводит элемент meta: город, известный ориентир или площадь «от N кв.м.». */
export function metaLabel(t, item) {
  if (CITY_I18N_KEY[item]) return cityLabel(t, item);
  if (META_KEY[item]) return t(META_KEY[item]);
  const area = item.match(/^от\s+(\d+)\s*кв\.м\.?$/);
  if (area) return t('meta.areaFrom', { n: area[1] });
  return item;
}
