import { ALL_CITIES } from '../data/projects.js';

export function fmt(n) {
  if (n == null || isNaN(n) || !isFinite(n)) n = 0;
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function onlyDigits(v) {
  return Number(String(v).replace(/\D/g, '')) || 0;
}

/**
 * Число, приведённое к границам поля. Ручной ввод не должен давать значение
 * вне допустимого диапазона (стоимость, взнос, срок, ставка).
 * @param {unknown} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clampNumber(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  if (max < min) return min;
  return Math.min(max, Math.max(min, n));
}

// Работа с телефоном живёт в src/lead/phone.js — там же, где ей пользуется
// сервер. Реэкспорт оставлен, чтобы компоненты и тесты продолжали брать эти
// функции из привычного места.
export { formatKzPhone, kzPhoneE164, kzPhoneOk } from '../lead/phone.js';

export function filterProjects(projects, filter) {
  return projects.filter((p) => {
    if (filter.city !== ALL_CITIES && p.city !== filter.city) return false;
    if (filter.klass !== 'Все классы' && p.klass !== filter.klass) return false;
    if (filter.term === 'Сдан' && p.term !== 'Сдан') return false;
    if (filter.term === '2026 год' && !/2026/.test(p.term)) return false;
    if (filter.rooms !== 'Все комнаты') {
      const n = Number(filter.rooms);
      if (!p.rooms.includes(n)) return false;
    }
    if (filter.floor !== 'Любой этаж') {
      const fl = p.floors;
      if (filter.floor === 'до 5 этажей' && !(fl <= 5)) return false;
      if (filter.floor === '5–10 этажей' && !(fl >= 5 && fl <= 10)) return false;
      if (filter.floor === '10 и выше' && !(fl > 10)) return false;
    }
    return true;
  });
}

/**
 * Ипотечный расчёт: аннуитетный платёж по стоимости, взносу, сроку и ставке.
 * Рассрочка считается отдельно — по условиям города (utils/installment.js).
 */
export function computeCalc({ price, down, termY, rate }) {
  const loan = Math.max(price - down, 0);
  const r = rate / 100 / 12;
  const n = termY * 12;
  const monthly = r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;

  /* Подписи отдаём ключами: значение форматируем здесь, перевод — в компоненте. */
  return {
    mainLabelKey: 'calc.result.mainLabel',
    mainValue: `${fmt(monthly)} ₸`,
    mainSubKey: 'calc.result.mainSub',
    statValue: `${rate}%`,
    statLabelKey: 'calc.result.statLabel',
  };
}
