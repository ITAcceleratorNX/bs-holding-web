import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { clampNumber, formatKzPhone, kzPhoneE164, kzPhoneOk } from './format.js';

describe('маска телефона', () => {
  it('форматирует номер по мере ввода', () => {
    // Каждый шаг — значение поля после предыдущего форматирования плюс новый символ.
    let v = '';
    const type = (chars) => {
      for (const ch of chars) v = formatKzPhone(v + ch);
      return v;
    };
    assert.equal(type('7'), '+7 (7');
    assert.equal(type('0'), '+7 (70');
    assert.equal(type('7'), '+7 (707)');
    assert.equal(type('123'), '+7 (707) 123');
    assert.equal(type('45'), '+7 (707) 123-45');
    assert.equal(type('67'), '+7 (707) 123-45-67');
    assert.equal(type('8'), '+7 (707) 123-45-67', 'лишние цифры отбрасываются');
  });

  it('принимает вставку в разных форматах', () => {
    const expected = '+7 (707) 123-45-67';
    assert.equal(formatKzPhone('87071234567'), expected);
    assert.equal(formatKzPhone('77071234567'), expected);
    assert.equal(formatKzPhone('+7 707 123 45 67'), expected);
    assert.equal(formatKzPhone('7071234567'), expected);
    assert.equal(formatKzPhone('+7 (707) 123-45-67'), expected);
  });

  it('поле можно очистить', () => {
    assert.equal(formatKzPhone(''), '');
    assert.equal(formatKzPhone('+7 ('), '');
    assert.equal(formatKzPhone('+7'), '');
    assert.equal(formatKzPhone(null), '');
  });

  it('валидация требует полные 10 цифр номера', () => {
    assert.equal(kzPhoneOk('+7 (707) 123-45-67'), true);
    assert.equal(kzPhoneOk('87071234567'), true);
    assert.equal(kzPhoneOk('+7 (707) 123-45-6'), false);
    assert.equal(kzPhoneOk('+7 (707)'), false);
    assert.equal(kzPhoneOk(''), false);
  });

  it('в заявку уходит нормализованный номер', () => {
    assert.equal(kzPhoneE164('+7 (707) 123-45-67'), '+77071234567');
    assert.equal(kzPhoneE164('87071234567'), '+77071234567');
    assert.equal(kzPhoneE164('707123'), '', 'неполный номер не нормализуется');
  });
});

describe('границы полей ручного ввода', () => {
  it('значение прижимается к допустимому диапазону', () => {
    assert.equal(clampNumber(15000000, 5000000, 100000000), 15000000);
    assert.equal(clampNumber(1, 5000000, 100000000), 5000000, 'ниже минимума');
    assert.equal(clampNumber(999999999, 5000000, 100000000), 100000000, 'выше максимума');
    assert.equal(clampNumber(5000000, 5000000, 100000000), 5000000, 'нижняя граница допустима');
    assert.equal(clampNumber(100000000, 5000000, 100000000), 100000000, 'верхняя граница допустима');
  });

  it('первоначальный взнос не превышает стоимость', () => {
    const price = 15000000;
    assert.equal(clampNumber(20000000, 0, price), price);
    assert.equal(clampNumber(-1, 0, price), 0);
  });

  it('нечисловой ввод даёт минимум, а не NaN', () => {
    assert.equal(clampNumber('', 1, 25), 1);
    assert.equal(clampNumber('абв', 1, 25), 1);
    assert.equal(clampNumber(NaN, 1, 25), 1);
    assert.equal(clampNumber(Infinity, 1, 25), 1);
  });

  it('вырожденный и перевёрнутый диапазон не ломают поле', () => {
    assert.equal(clampNumber(500, 0, 0), 0, 'взнос при нулевой стоимости');
    assert.equal(clampNumber(500, 5, 0), 5, 'при max < min берётся min');
  });
});
