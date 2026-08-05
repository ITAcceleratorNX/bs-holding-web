/**
 * Казахстанский номер телефона: разбор, маска, валидация, формат передачи.
 *
 * Единственный источник правды для номера. Модуль изоморфный — его импортируют
 * и браузер (маска в полях), и сервер (проверка перед отправкой в Bitrix24),
 * поэтому здесь нет обращений к DOM и к API Node.
 */

/**
 * Цифры национального номера (10 знаков) без кода страны.
 * Префикс «+7» отбрасывается до подсчёта, иначе он сам считался бы цифрой номера.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function kzPhoneDigits(value) {
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
 * Номер полон и начинается с кода мобильного оператора (7XX).
 * Городские номера в заявках не принимаем — обратная связь идёт звонком на мобильный.
 * @param {string|null|undefined} value
 * @returns {boolean}
 */
export function kzPhoneOk(value) {
  const d = kzPhoneDigits(value);
  return d.length === 10 && d[0] === '7';
}

/**
 * Номер в формате +7XXXXXXXXXX для передачи в заявке. Пустая строка — номер неполон.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function kzPhoneE164(value) {
  return kzPhoneOk(value) ? `+7${kzPhoneDigits(value)}` : '';
}
