import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { CITY_CALCULATORS, ROOM_OPTIONS, getRoomOption } from '../data/calculator.js';
import {
  clampAreaToRoom,
  clampMonths,
  computeInstallment,
  maxMonthsForMinPayment,
} from './installment.js';

const AKTOBE = CITY_CALCULATORS['Актобе'];
const OSKEMEN = CITY_CALCULATORS['Усть-Каменогорск'];

const aktobe = (over = {}) =>
  computeInstallment({
    config: AKTOBE,
    blockId: 'block-1',
    roomId: '1',
    area: 40,
    paymentId: '30',
    months: 13,
    ...over,
  });

const oskemen = (over = {}) =>
  computeInstallment({
    config: OSKEMEN,
    roomId: '1',
    area: 40,
    paymentId: '30',
    months: 1,
    ...over,
  });

describe('связка комнатности и площади (ТЗ 3)', () => {
  it('диапазоны соответствуют утверждённой таблице', () => {
    assert.deepEqual(
      ROOM_OPTIONS.map((r) => [r.id, r.areaMin, r.areaMax]),
      [
        ['1', 40, 55],
        ['2', 60, 80],
        ['3', 90, 115],
        ['4', 120, 140],
      ],
    );
  });

  it('площадь прижимается к границам выбранной комнатности', () => {
    assert.equal(clampAreaToRoom(10, '1'), 40);
    assert.equal(clampAreaToRoom(999, '1'), 55);
    assert.equal(clampAreaToRoom(40, '1'), 40, 'нижняя граница остаётся как есть');
    assert.equal(clampAreaToRoom(55, '1'), 55, 'верхняя граница остаётся как есть');
    assert.equal(clampAreaToRoom(100, '3'), 100);
    assert.equal(clampAreaToRoom(NaN, '2'), 60);
  });

  it('расчёт использует прижатую площадь, а не введённую', () => {
    const r = aktobe({ roomId: '4', area: 1000 });
    assert.equal(r.area, 140);
    assert.equal(r.total, 140 * 590000);
  });
});

describe('срок рассрочки', () => {
  it('прижимается к границам города', () => {
    assert.equal(clampMonths(0, AKTOBE.term), 1);
    assert.equal(clampMonths(99, AKTOBE.term), 13);
    assert.equal(clampMonths(99, OSKEMEN.term), 23);
    assert.equal(clampMonths(NaN, OSKEMEN.term), 1);
  });

  it('границы городов соответствуют ТЗ', () => {
    assert.deepEqual(AKTOBE.term, { min: 1, max: 13 });
    assert.deepEqual(OSKEMEN.term, { min: 1, max: 23 });
  });
});

describe('Актобе — цена за 1 м² (ТЗ 4.2)', () => {
  const table = [
    ['100', 'block-1', 550000],
    ['100', 'block-2', 530000],
    ['50', 'block-1', 570000],
    ['50', 'block-2', 550000],
    ['30', 'block-1', 590000],
    ['30', 'block-2', 570000],
  ];

  for (const [paymentId, blockId, expected] of table) {
    it(`${paymentId}% · ${blockId} → ${expected} ₸/м²`, () => {
      assert.equal(aktobe({ paymentId, blockId }).pricePerM2, expected);
    });
  }
});

describe('Актобе — формулы 30% и 50% (ТЗ 4.3)', () => {
  it('30%, блок 1, 55 м², 13 мес.', () => {
    const r = aktobe({ roomId: '1', area: 55, paymentId: '30', blockId: 'block-1', months: 13 });
    const total = 55 * 590000; // 32 450 000
    const down = total * 0.3; // 9 735 000
    const remainder = total - down; // 22 715 000
    assert.equal(r.total, total);
    assert.equal(r.down, down);
    assert.equal(r.remainder, remainder);
    assert.equal(r.monthly, Math.round(remainder / 13));
    assert.equal(r.surcharge, null, 'надбавка для Актобе не применяется');
    assert.equal(r.installmentSum, remainder, 'рассрочка беспроцентная');
  });

  it('50%, блок 2, 120 м², 1 мес. — остаток гасится одним платежом', () => {
    const r = aktobe({ roomId: '4', area: 120, paymentId: '50', blockId: 'block-2', months: 1 });
    const total = 120 * 550000; // 66 000 000
    assert.equal(r.total, total);
    assert.equal(r.down, total / 2);
    assert.equal(r.remainder, total / 2);
    assert.equal(r.monthly, total / 2);
  });

  it('ежемесячный платёж уменьшается с ростом срока', () => {
    const short = aktobe({ months: 1 }).monthly;
    const long = aktobe({ months: 13 }).monthly;
    assert.ok(long < short);
    assert.equal(long, Math.round(aktobe({ months: 13 }).remainder / 13));
  });

  it('срок за пределами 1–13 прижимается к границе', () => {
    assert.equal(aktobe({ months: 40 }).months, 13);
    assert.equal(aktobe({ months: 0 }).months, 1);
  });
});

describe('Актобе — 100% оплата (ТЗ 4.4)', () => {
  it('срок и ежемесячный платёж не рассчитываются', () => {
    const r = aktobe({ paymentId: '100', months: 13 });
    assert.equal(r.isFullPayment, true);
    assert.equal(r.months, null);
    assert.equal(r.monthly, null);
    assert.equal(r.down, null);
    assert.equal(r.remainder, null);
  });

  it('показывается цена за м² и полная стоимость', () => {
    const r = aktobe({ roomId: '3', area: 90, paymentId: '100', blockId: 'block-2' });
    assert.equal(r.pricePerM2, 530000);
    assert.equal(r.total, 90 * 530000); // 47 700 000
  });

  it('всегда доступна к отправке', () => {
    assert.equal(aktobe({ paymentId: '100' }).canSubmit, true);
  });
});

describe('Усть-Каменогорск — диапазон и надбавки (ТЗ 5.2, 5.3)', () => {
  it('надбавки соответствуют таблице', () => {
    assert.deepEqual(
      OSKEMEN.payments.map((p) => [p.downPercent, p.surchargePercent]),
      [
        [30, 15],
        [50, 10],
        [70, 5],
      ],
    );
  });

  it('границы цены — 485 000 и 570 000 ₸/м²', () => {
    const r = oskemen();
    assert.deepEqual(r.pricePerM2, { min: 485000, max: 570000 });
    assert.equal(r.total.min, 40 * 485000); // 19 400 000
    assert.equal(r.total.max, 40 * 570000); // 22 800 000
  });

  it('ПВ 30% + надбавка 15%, 40 м², 1 мес.', () => {
    const r = oskemen({ paymentId: '30', area: 40, months: 1 });
    const totalMin = 40 * 485000; // 19 400 000
    const downMin = totalMin * 0.3; // 5 820 000
    const remainderMin = totalMin - downMin; // 13 580 000
    const surchargeMin = remainderMin * 0.15; // 2 037 000
    assert.equal(r.down.min, downMin);
    assert.equal(r.remainder.min, remainderMin);
    assert.equal(r.surcharge.min, surchargeMin);
    assert.equal(r.installmentSum.min, remainderMin + surchargeMin); // 15 617 000
    assert.equal(r.monthly.min, remainderMin + surchargeMin);
  });

  it('ПВ 70% + надбавка 5% — верхняя граница', () => {
    const r = oskemen({ paymentId: '70', area: 55, months: 1 });
    const totalMax = 55 * 570000; // 31 350 000
    const downMax = totalMax * 0.7; // 21 945 000
    const remainderMax = totalMax - downMax; // 9 405 000
    const surchargeMax = remainderMax * 0.05; // 470 250
    assert.equal(r.down.max, downMax);
    assert.equal(r.remainder.max, remainderMax);
    assert.equal(r.surcharge.max, surchargeMax);
    assert.equal(r.installmentSum.max, remainderMax + surchargeMax);
  });

  it('нижняя граница всегда не больше верхней', () => {
    for (const payment of OSKEMEN.payments) {
      for (const room of ROOM_OPTIONS) {
        for (const area of [room.areaMin, room.areaMax]) {
          const r = oskemen({ paymentId: payment.id, roomId: room.id, area, months: 12 });
          for (const key of ['total', 'down', 'remainder', 'surcharge', 'installmentSum', 'monthly']) {
            assert.ok(r[key].min <= r[key].max, `${key} min <= max при ${payment.id}%/${area} м²`);
          }
        }
      }
    }
  });

  it('надбавка применяется один раз, а не помесячно', () => {
    const one = oskemen({ months: 1 });
    const twelve = oskemen({ months: 12 });
    assert.equal(one.surcharge.min, twelve.surcharge.min);
    assert.equal(one.installmentSum.min, twelve.installmentSum.min);
  });
});

describe('Усть-Каменогорск — минимальный платёж 500 000 ₸ (ТЗ 5.4)', () => {
  it('срок 23 мес. на минимальной площади уходит ниже порога', () => {
    const r = oskemen({ paymentId: '70', roomId: '1', area: 40, months: 23 });
    assert.ok(r.monthly.min < 500000);
    assert.equal(r.canSubmit, false);
    assert.equal(r.error.field, 'months');
    assert.equal(r.error.message, 'Минимальный ежемесячный платеж — 500 000 ₸. Уменьшите срок рассрочки');
  });

  it('на допустимом сроке ошибки нет и отправка разрешена', () => {
    const r = oskemen({ paymentId: '70', roomId: '1', area: 40, months: 12 });
    assert.ok(r.monthly.min >= 500000);
    assert.equal(r.error, null);
    assert.equal(r.canSubmit, true);
  });

  it('граница: ровно 500 000 ₸ допустимо, на месяц больше — уже нет', () => {
    const params = { paymentId: '70', roomId: '1', area: 40 };
    const max = oskemen({ ...params, months: 1 }).maxAllowedMonths;
    const atLimit = oskemen({ ...params, months: max });
    const overLimit = oskemen({ ...params, months: max + 1 });
    assert.ok(atLimit.monthly.min >= 500000, 'на максимальном допустимом сроке платёж не ниже порога');
    assert.equal(atLimit.canSubmit, true);
    assert.ok(overLimit.monthly.min < 500000);
    assert.equal(overLimit.canSubmit, false);
  });

  it('maxMonthsForMinPayment не выходит за границы срока', () => {
    assert.equal(maxMonthsForMinPayment(100_000_000, 500000, OSKEMEN.term), 23);
    assert.equal(maxMonthsForMinPayment(1_000_000, 500000, OSKEMEN.term), 2);
    assert.equal(maxMonthsForMinPayment(100, 500000, OSKEMEN.term), 1, 'не опускается ниже min');
  });

  it('порог не применяется к Актобе', () => {
    assert.equal(AKTOBE.minMonthlyPayment, undefined);
    const r = aktobe({ paymentId: '50', roomId: '1', area: 40, months: 13 });
    assert.equal(r.canSubmit, true);
    assert.equal(r.error, null);
  });
});

describe('устойчивость входных данных', () => {
  it('неизвестный вариант оплаты и блок откатываются к первому', () => {
    const r = aktobe({ paymentId: 'нет-такого', blockId: 'нет-такого' });
    assert.equal(r.payment.id, AKTOBE.payments[0].id);
    assert.equal(r.block.id, AKTOBE.blocks[0].id);
  });

  it('без конфигурации города расчёт не выполняется', () => {
    assert.equal(computeInstallment({ config: null, roomId: '1', area: 40, paymentId: '30' }), null);
  });

  it('денежные значения — целые числа', () => {
    const r = oskemen({ paymentId: '30', roomId: '2', area: 73, months: 7 });
    for (const key of ['total', 'down', 'remainder', 'surcharge', 'installmentSum', 'monthly']) {
      assert.ok(Number.isInteger(r[key].min), `${key}.min целое`);
      assert.ok(Number.isInteger(r[key].max), `${key}.max целое`);
    }
  });

  it('getRoomOption возвращает null для неизвестной комнатности', () => {
    assert.equal(getRoomOption('7'), null);
    assert.equal(clampAreaToRoom(42, '7'), 42, 'площадь остаётся как есть');
  });
});
