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

/** Переводит элемент meta, если это известный город. */
export function metaLabel(t, item) {
  if (CITY_I18N_KEY[item]) return cityLabel(t, item);
  return item;
}
