export const PROJECTS = [
  {
    id: 1,
    name: 'Central Park',
    slug: 'central-park',
    city: 'Актау',
    klass: 'Бизнес',
    classFull: 'Бизнес-класс',
    term: 'Сдан',
    termBadge: 'Сдан',
    rooms: [2, 3],
    floors: 12,
    price: 22534000,
    image: '/images/project-central-park.webp',
    meta: ['Актау', 'Море', '8 мин'],
    href: '#/central-park',
  },
  {
    id: 2,
    name: 'Avenue Park',
    slug: 'avenue-park',
    city: 'Актау',
    klass: 'Бизнес+',
    classFull: 'Бизнес +',
    term: 'I квартал 2026 года',
    termBadge: 'I квартал 2026',
    rooms: [1, 2, 3, 4],
    floors: 9,
    price: 17001000,
    image: '/images/project-avenue-park.webp',
    meta: ['Актау', '40-й микрорайон', 'Парк'],
    href: '#/avenue-park',
  },
  {
    id: 3,
    name: 'MURA',
    slug: 'mura',
    city: 'Актау',
    klass: 'Комфорт+',
    classFull: 'Комфорт+-класс',
    term: 'I квартал 2028 года',
    termBadge: 'I квартал 2028',
    rooms: [1, 2, 3, 4],
    floors: 7,
    price: 0,
    image: '/images/mura/renders/7.jpg',
    meta: ['Актау', '40 МКР', 'Президентский парк'],
    href: '#/mura',
  },
  {
    id: 4,
    name: 'Easton',
    slug: 'easton',
    city: 'Усть-Каменогорск',
    klass: 'Бизнес',
    classFull: 'Бизнес-класс',
    term: '2027 год',
    termBadge: '2027 год',
    rooms: [1, 2, 3],
    floors: 9,
    price: 18500000,
    image: '/images/project-easton.webp',
    meta: ['Усть-Каменогорск', 'Центр', 'Есенберлина'],
    href: '#/easton',
  },
  {
    id: 5,
    name: 'White Hill',
    slug: 'white-hill',
    city: 'Актобе',
    klass: 'Бизнес',
    classFull: 'Бизнес-класс',
    term: 'Август 2027 года',
    termBadge: 'Август 2027',
    rooms: [1, 2, 3, 4],
    floors: 10,
    image: '/images/project-white-hill.webp',
    meta: ['Актобе', 'Алтын Орда', 'Ораза Татеулы'],
    href: '#/white-hill',
  },
  {
    id: 6,
    name: 'ORTA',
    slug: 'orta',
    city: 'Актау',
    klass: 'Бизнес',
    classFull: 'Бизнес-класс',
    term: 'IV квартал 2026 года',
    termBadge: 'IV квартал 2026',
    rooms: [1, 2, 3],
    floors: 7,
    image: '/images/project-orta.webp',
    meta: ['Актау', '9 мкр', 'Море'],
    href: '#/orta',
  },
  {
    id: 7,
    name: 'BS Towers',
    slug: 'bs-towers',
    city: 'Актау',
    klass: 'Премиум',
    classFull: 'Премиум-класс',
    // Срок сдачи и цена не предоставлены — поля намеренно отсутствуют.
    rooms: [1, 2, 3, 4],
    floors: 18,
    image: '/images/project-bs-towers.webp',
    meta: ['Актау', '40-й микрорайон', 'Парк Первого Президента'],
    href: '#/bs-towers',
  },
];

export const FEATURED_DATA = {
  'Central Park': {
    name: 'Central Park',
    klass: 'Бизнес-класс',
    termBadge: 'Сдан',
    price: 22534000,
    location: 'г. Актау · первая береговая линия',
    image: '/images/project-central-park.webp',
    desc: [
      'Жилой комплекс бизнес-класса в престижном районе Актау с видом на Каспийское море.',
      '5 минут до набережной и городского пляжа, 10 минут до центра города.',
      'Закрытый двор без машин, детские и спортивные площадки, зоны отдыха.',
      'Монолитно-каркасное строение, панорамные окна, потолки 3 метра.',
    ],
  },
  'Avenue Park': {
    name: 'Avenue Park',
    klass: 'Бизнес +',
    termBadge: 'I квартал 2026',
    price: 17001000,
    location: 'г. Актау · 40-й микрорайон',
    image: '/images/featured-avenue-park.webp',
    desc: [
      'Avenue Park — новое дыхание комфорта и надёжности в 40-м микрорайоне Актау.',
      'Рядом парк Первого Президента, музей им. А. Кекилбаева и спортивный комплекс БС Арена.',
      'Инженерная автономность: резервный дизель-генератор и водозапас 360 м³.',
      'Потолки 3–3,2 м, французские панорамные балконы, замок Xiaomi MI Magic Vein.',
    ],
  },
  MURA: {
    name: 'MURA',
    klass: 'Комфорт+-класс',
    termBadge: 'I квартал 2028',
    price: 0,
    location: 'г. Актау · 40 МКР',
    image: '/images/mura/renders/7.jpg',
    desc: [
      'МҰРА — жилой комплекс комфорт+ класса в 40 микрорайоне Актау.',
      'Комплекс из 3 блоков высотой 7 этажей, 262 квартиры.',
      'Рядом Президентский парк — крупнейший зелёный массив Актау.',
      'Фиброцементные фасады, пятикамерные окна, умные замки.',
    ],
  },
};

export const BANK_LIST = ['FREEDOM BANK', 'Altyn Bank', 'bcc.kz', 'ОТБАСЫ БАНК'];

export const COMMERCIAL = [
  {
    title: 'Парковочное место',
    from: 'от 1 500 000 ₸',
    meta: ['от 10 кв.м.', 'электрозарядка'],
    image: '/images/commercial-parking.webp',
  },
  {
    title: 'Складское помещение',
    from: 'от 800 000 ₸',
    meta: ['от 20 кв.м.', 'огнезащита'],
    image: '/images/commercial-storage.webp',
  },
  {
    title: 'Коммерческое помещение',
    from: 'от 25 000 000 ₸',
    meta: ['от 150 кв.м.', 'отдельный вход'],
    image: '/images/commercial-space.webp',
  },
];

export const FOOTER_COLS = [
    { title: 'Проекты', items: ['Central Park', 'Avenue Park', 'MURA', 'Easton', 'White Hill', 'ORTA', 'BS Towers'] },
  { title: 'Компания', items: ['О нас', 'Вакансии', 'Новости'] },
  { title: 'Поддержка', items: ['Контакты', 'График работы'] },
  { title: 'Офисы продаж', items: ['Актау', 'Актобе', 'Усть-Каменогорск'] },
  { title: 'BS Пайда', items: ['Рассрочка', 'Ипотека', 'Условия'] },
];

export const SOCIALS = ['IG', 'TG', 'FB', 'TT', 'YT'];

/** @type {Record<string, string>} */
export const SOCIAL_LINKS = {
  IG: 'https://www.instagram.com/bs_holding.aktau/',
  TG: 'https://t.me/bsholding',
  FB: 'https://www.facebook.com/bsholding',
  TT: 'https://www.tiktok.com/@bsholding',
  YT: 'https://www.youtube.com/@bsholding',
};

/**
 * Значение фильтра «город не выбран». В шапке такого пункта нет: там город —
 * это выбор пользователя «мой город» (телефон, город заявки), а в каталоге он
 * ещё и сужает подборку ЖК.
 */
export const ALL_CITIES = 'Все города';

/** Города присутствия в порядке пунктов фильтра. */
export const CITIES = ['Актау', 'Актобе', 'Усть-Каменогорск'];

export const FILTER_SPEC = [
  ['city', [ALL_CITIES, ...CITIES]],
  ['klass', ['Все классы', 'Премиум', 'Бизнес', 'Бизнес+', 'Комфорт']],
  ['term', ['Любой срок', 'Сдан', '2026 год']],
  ['floor', ['Любой этаж', 'до 5 этажей', '5–10 этажей', '10 и выше']],
  ['rooms', ['Все комнаты', '1', '2', '3', '4']],
];

export const DEFAULT_FILTER = {
  city: ALL_CITIES,
  klass: 'Все классы',
  term: 'Любой срок',
  floor: 'Любой этаж',
  rooms: 'Все комнаты',
};
