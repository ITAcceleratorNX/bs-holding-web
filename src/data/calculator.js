/**
 * Коммерческие условия калькулятора рассрочки.
 *
 * Здесь и только здесь хранятся тарифы, сроки, диапазоны и коэффициенты (ТЗ 10).
 * Чтобы обновить условия, достаточно поправить значения в этом файле — интерфейс
 * и формулы (utils/installment.js) менять не нужно.
 */

/**
 * Связка комнатности и допустимого диапазона площади (ТЗ 3).
 * Общая для всех городов. После получения точных планировок обновляются границы.
 * @typedef {{ id: string, label: string, areaMin: number, areaMax: number }} RoomOption
 * @type {RoomOption[]}
 */
export const ROOM_OPTIONS = [
  { id: '1', labelKey: 'rooms.type.1', label: '1-комнатная', areaMin: 40, areaMax: 55 },
  { id: '2', labelKey: 'rooms.type.2', label: '2-комнатная', areaMin: 60, areaMax: 80 },
  { id: '3', labelKey: 'rooms.type.3', label: '3-комнатная', areaMin: 90, areaMax: 115 },
  { id: '4', labelKey: 'rooms.type.4', label: '4-комнатная', areaMin: 120, areaMax: 140 },
];

/** @param {string} id @returns {RoomOption|null} */
export function getRoomOption(id) {
  return ROOM_OPTIONS.find((r) => r.id === id) ?? null;
}

/** Шаг ползунка площади, м². */
export const AREA_STEP = 1;

/**
 * Конфигурация калькулятора по городам.
 *
 * kind: 'exact' — цена за м² известна точно (определяется блоком и вариантом оплаты);
 * kind: 'range' — известен только диапазон цены, результат считается «от–до».
 *
 * Города, которых здесь нет (например, Актау), используют прежний общий
 * калькулятор — условия рассрочки для них не предоставлены (ТЗ 9).
 */
export const CITY_CALCULATORS = {
  Актобе: {
    city: 'Актобе',
    kind: 'exact',
    titleKey: 'calc.title.installment',
    subtitleKey: 'calc.subtitle.aktobe',
    /** Блоки жилого комплекса — влияют на цену за м². */
    blocks: [
      { id: 'block-1', labelKey: 'plans.block', labelSuffix: '1', label: 'Блок 1' },
      { id: 'block-2', labelKey: 'plans.block', labelSuffix: '2', label: 'Блок 2' },
    ],
    /**
     * Варианты оплаты. `pricePerM2` — цена за 1 м² по блокам (ТЗ 4.2).
     * `full: true` — единовременная оплата: срок и ежемесячный платёж не применяются.
     * Рассрочка беспроцентная, надбавка на остаток для Актобе не применяется (ТЗ 4.3).
     */
    payments: [
      {
        id: '30',
        label: '30%',
        titleKey: 'calc.payment.down',
        title: 'Первоначальный взнос 30%',
        downPercent: 30,
        full: false,
        pricePerM2: { 'block-1': 590000, 'block-2': 570000 },
      },
      {
        id: '50',
        label: '50%',
        titleKey: 'calc.payment.down',
        title: 'Первоначальный взнос 50%',
        downPercent: 50,
        full: false,
        pricePerM2: { 'block-1': 570000, 'block-2': 550000 },
      },
      {
        id: '100',
        label: '100%',
        titleKey: 'calc.payment.full',
        title: 'Полная оплата',
        downPercent: 100,
        full: true,
        pricePerM2: { 'block-1': 550000, 'block-2': 530000 },
      },
    ],
    term: { min: 1, max: 13 },
  },

  'Усть-Каменогорск': {
    city: 'Усть-Каменогорск',
    kind: 'range',
    titleKey: 'calc.title.installment',
    subtitleKey: 'calc.subtitle.oskemen',
    /** Известный диапазон цены за 1 м² (ТЗ 5). */
    pricePerM2: { min: 485000, max: 570000 },
    /**
     * Первоначальный взнос и разовая надбавка на остаток (ТЗ 5.2).
     * Надбавка применяется один раз к остатку — это не годовая ставка.
     */
    payments: [
      { id: '30', label: '30%', titleKey: 'calc.payment.down', title: 'Первоначальный взнос 30%', downPercent: 30, surchargePercent: 15, full: false },
      { id: '50', label: '50%', titleKey: 'calc.payment.down', title: 'Первоначальный взнос 50%', downPercent: 50, surchargePercent: 10, full: false },
      { id: '70', label: '70%', titleKey: 'calc.payment.down', title: 'Первоначальный взнос 70%', downPercent: 70, surchargePercent: 5, full: false },
    ],
    term: { min: 1, max: 23 },
    /** Правило действует только для Усть-Каменогорска (ТЗ 5.4). */
    minMonthlyPayment: 500000,
  },
};

/**
 * Города с утверждёнными условиями рассрочки. Порядок задаёт порядок кнопок
 * в переключателе города внутри калькулятора.
 */
export const INSTALLMENT_CITIES = Object.values(CITY_CALCULATORS);

/** Опции для переключателя города внутри калькулятора. */
export const INSTALLMENT_CITY_OPTIONS = INSTALLMENT_CITIES.map((c) => ({ id: c.city, cityLabel: c.city, label: c.city }));

/**
 * Город калькулятора по умолчанию — используется, когда в шапке выбран город
 * без утверждённых условий рассрочки (например, Актау).
 */
export const DEFAULT_INSTALLMENT_CITY = INSTALLMENT_CITIES[0].city;

/**
 * @param {string} city
 * @returns {typeof CITY_CALCULATORS[keyof typeof CITY_CALCULATORS] | null}
 */
export function getCityCalculator(city) {
  return CITY_CALCULATORS[city] ?? null;
}

/**
 * Конфигурация рассрочки с гарантированным результатом: неизвестный город
 * заменяется городом по умолчанию, чтобы вкладка «Рассрочка» работала всегда.
 * @param {string} city
 * @returns {typeof CITY_CALCULATORS[keyof typeof CITY_CALCULATORS]}
 */
export function getInstallmentConfig(city) {
  return getCityCalculator(city) ?? CITY_CALCULATORS[DEFAULT_INSTALLMENT_CITY];
}
