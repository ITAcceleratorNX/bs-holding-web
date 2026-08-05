/**
 * Расчётные формулы калькулятора рассрочки (ТЗ 4.3, 4.4, 5.3, 5.4).
 *
 * Модуль чистый: не зависит от React и DOM, все условия приходят из
 * data/calculator.js. Это позволяет покрыть формулы тестами
 * (см. installment.test.js) и менять тарифы без правок логики.
 *
 * Все денежные значения возвращаются округлёнными до целых тенге.
 */

// Расширение указано явно: модуль должен импортироваться не только сборщиком,
// но и штатным тест-раннером Node (`npm test`), который не достраивает пути.
import { getRoomOption } from '../data/calculator.js';

/** @param {number} n */
const money = (n) => Math.round(n);

/**
 * Площадь, приведённая к диапазону выбранной комнатности (ТЗ 3).
 * @param {number} area
 * @param {string} roomId
 * @returns {number}
 */
export function clampAreaToRoom(area, roomId) {
  const room = getRoomOption(roomId);
  if (!room) return area;
  if (!Number.isFinite(area)) return room.areaMin;
  return Math.min(room.areaMax, Math.max(room.areaMin, area));
}

/**
 * Срок, приведённый к границам города.
 * @param {number} months
 * @param {{ min: number, max: number }} term
 * @returns {number}
 */
export function clampMonths(months, term) {
  if (!Number.isFinite(months)) return term.min;
  return Math.min(term.max, Math.max(term.min, Math.round(months)));
}

/**
 * Наибольший срок, при котором нижняя граница ежемесячного платежа не опускается
 * ниже минимально допустимой. Используется для подсказки к ползунку.
 * @param {number} installmentSum сумма рассрочки (нижняя граница)
 * @param {number} minMonthlyPayment
 * @param {{ min: number, max: number }} term
 * @returns {number}
 */
export function maxMonthsForMinPayment(installmentSum, minMonthlyPayment, term) {
  if (!minMonthlyPayment) return term.max;
  const allowed = Math.floor(installmentSum / minMonthlyPayment);
  return Math.min(term.max, Math.max(term.min, allowed));
}

/**
 * Расчёт по точной цене за 1 м² — Актобе (ТЗ 4).
 * @param {object} params
 * @returns {object}
 */
function computeExact({ config, blockId, roomId, area, paymentId, months }) {
  const payment = config.payments.find((p) => p.id === paymentId) ?? config.payments[0];
  const block = config.blocks.find((b) => b.id === blockId) ?? config.blocks[0];
  const pricePerM2 = payment.pricePerM2[block.id];
  const total = money(area * pricePerM2);

  if (payment.full) {
    // 100% — отдельный вариант оплаты, а не первоначальный взнос (ТЗ 4.4).
    return {
      kind: 'exact',
      block,
      payment,
      roomId,
      area,
      isFullPayment: true,
      pricePerM2,
      total,
      down: null,
      remainder: null,
      surcharge: null,
      installmentSum: null,
      months: null,
      monthly: null,
      error: null,
      canSubmit: true,
    };
  }

  const safeMonths = clampMonths(months, config.term);
  const down = money((total * payment.downPercent) / 100);
  const remainder = total - down;
  // Рассрочка беспроцентная: надбавка для Актобе не применяется (ТЗ 4.3).
  const monthly = money(remainder / safeMonths);

  return {
    kind: 'exact',
    block,
    payment,
    roomId,
    area,
    isFullPayment: false,
    pricePerM2,
    total,
    down,
    remainder,
    surcharge: null,
    installmentSum: remainder,
    months: safeMonths,
    monthly,
    error: null,
    canSubmit: true,
  };
}

/**
 * Одна граница диапазона (минимальная либо максимальная цена за м²).
 * @returns {{ total: number, down: number, remainder: number, surcharge: number, installmentSum: number, monthly: number }}
 */
function computeBound({ area, pricePerM2, downPercent, surchargePercent, months }) {
  const total = money(area * pricePerM2);
  const down = money((total * downPercent) / 100);
  const remainder = total - down;
  const surcharge = money((remainder * surchargePercent) / 100);
  const installmentSum = remainder + surcharge;
  const monthly = money(installmentSum / months);
  return { total, down, remainder, surcharge, installmentSum, monthly };
}

/**
 * Расчёт диапазоном по границам цены за 1 м² — Усть-Каменогорск (ТЗ 5).
 * @param {object} params
 * @returns {object}
 */
function computeRange({ config, roomId, area, paymentId, months }) {
  const payment = config.payments.find((p) => p.id === paymentId) ?? config.payments[0];
  const safeMonths = clampMonths(months, config.term);
  const shared = {
    area,
    downPercent: payment.downPercent,
    surchargePercent: payment.surchargePercent,
    months: safeMonths,
  };

  const low = computeBound({ ...shared, pricePerM2: config.pricePerM2.min });
  const high = computeBound({ ...shared, pricePerM2: config.pricePerM2.max });

  // Минимальный ежемесячный платёж проверяется по нижней границе (ТЗ 5.4).
  const minMonthly = config.minMonthlyPayment ?? 0;
  const belowMinimum = minMonthly > 0 && low.monthly < minMonthly;
  const maxAllowedMonths = maxMonthsForMinPayment(low.installmentSum, minMonthly, config.term);

  return {
    kind: 'range',
    block: null,
    payment,
    roomId,
    area,
    isFullPayment: false,
    pricePerM2: { min: config.pricePerM2.min, max: config.pricePerM2.max },
    total: { min: low.total, max: high.total },
    down: { min: low.down, max: high.down },
    remainder: { min: low.remainder, max: high.remainder },
    surcharge: { min: low.surcharge, max: high.surcharge },
    installmentSum: { min: low.installmentSum, max: high.installmentSum },
    months: safeMonths,
    monthly: { min: low.monthly, max: high.monthly },
    maxAllowedMonths,
    error: belowMinimum
      ? {
          field: 'months',
          message: 'Минимальный ежемесячный платеж — 500 000 ₸. Уменьшите срок рассрочки',
        }
      : null,
    canSubmit: !belowMinimum,
  };
}

/**
 * Единая точка расчёта. Форма результата одинакова для обоих городов, поля
 * «от–до» приходят объектами `{ min, max }`, точные значения — числами.
 *
 * @param {object} params
 * @param {object} params.config конфигурация города из data/calculator.js
 * @param {string} [params.blockId] только для kind === 'exact'
 * @param {string} params.roomId
 * @param {number} params.area
 * @param {string} params.paymentId
 * @param {number} [params.months]
 * @returns {object|null}
 */
export function computeInstallment({ config, blockId, roomId, area, paymentId, months }) {
  if (!config) return null;
  const safeArea = clampAreaToRoom(area, roomId);
  if (!Number.isFinite(safeArea) || safeArea <= 0) return null;

  return config.kind === 'exact'
    ? computeExact({ config, blockId, roomId, area: safeArea, paymentId, months })
    : computeRange({ config, roomId, area: safeArea, paymentId, months });
}

/**
 * Диапазон срока, доступный ползунку при текущих параметрах.
 *
 * Для Актобе это границы города (1–13 мес.). Для Усть-Каменогорска верхняя
 * граница дополнительно ограничена правилом минимального платежа (ТЗ 5.4):
 * ползунок физически не даёт выбрать срок, при котором платёж опустился бы
 * ниже 500 000 ₸. Значение не зависит от текущего срока — надбавка и сумма
 * рассрочки считаются до деления на месяцы.
 *
 * @param {object} params
 * @param {object} params.config
 * @param {string} params.roomId
 * @param {number} params.area
 * @param {string} params.paymentId
 * @returns {{ min: number, max: number }}
 */
export function allowedTermRange({ config, roomId, area, paymentId }) {
  const { min, max } = config.term;
  if (!config.minMonthlyPayment) return { min, max };

  const probe = computeInstallment({ config, roomId, area, paymentId, months: min });
  const allowed = probe?.maxAllowedMonths ?? max;
  return { min, max: Math.min(max, Math.max(min, allowed)) };
}
