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

export function phoneOk(p) {
  return String(p).replace(/\D/g, '').length >= 10;
}

export function nameOk(n) {
  return String(n).trim().length >= 2;
}

/**
 * Цифры национального номера (10 знаков) без кода страны.
 * Префикс «+7» отбрасывается до подсчёта, иначе он сам считался бы цифрой номера.
 * @param {string|null|undefined} value
 * @returns {string}
 */
function kzPhoneDigits(value) {
  const raw = String(value ?? '');
  const hasPrefix = raw.startsWith('+7');
  const body = hasPrefix ? raw.slice(2) : raw;
  let digits = body.replace(/\D/g, '');
  // Код страны отбрасываем только у «сырого» ввода. Если префикс «+7» уже стоит,
  // всё после него — национальный номер, и лишние цифры нужно обрезать с конца,
  // иначе дописанный символ сдвинул бы весь номер.
  if (!hasPrefix) {
    // 8 — междугородний префикс, кодов операторов на 8 в Казахстане нет.
    if (digits[0] === '8') digits = digits.slice(1);
    // Вставленный номер целиком: 7 707…
    if (digits.length > 10 && digits[0] === '7') digits = digits.slice(1);
  }
  return digits.slice(0, 10);
}

/**
 * Маска телефона: +7 (7XX) XXX-XX-XX. Пустой ввод возвращает пустую строку,
 * чтобы поле можно было очистить и увидеть подсказку.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function formatKzPhone(value) {
  const d = kzPhoneDigits(value);
  if (!d) return '';
  let out = `+7 (${d.slice(0, 3)}`;
  if (d.length >= 3) out += ')';
  if (d.length > 3) out += ` ${d.slice(3, 6)}`;
  if (d.length > 6) out += `-${d.slice(6, 8)}`;
  if (d.length > 8) out += `-${d.slice(8, 10)}`;
  return out;
}

/**
 * @param {string|null|undefined} value
 * @returns {boolean}
 */
export function kzPhoneOk(value) {
  return kzPhoneDigits(value).length === 10;
}

/**
 * Номер в формате +7XXXXXXXXXX для передачи в заявке.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function kzPhoneE164(value) {
  const d = kzPhoneDigits(value);
  return d.length === 10 ? `+7${d}` : '';
}

export function filterProjects(projects, filter) {
  return projects.filter((p) => {
    if (filter.city !== 'Все города' && p.city !== filter.city) return false;
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

  return {
    mainLabel: 'Ежемесячный платёж',
    mainValue: `${fmt(monthly)} ₸`,
    mainSub: 'На весь срок ипотеки',
    statValue: `${rate}%`,
    statLabel: 'Ставка вознаграждения (диапазон 18.5–22.5%)',
  };
}
