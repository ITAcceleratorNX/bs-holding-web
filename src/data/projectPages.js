/**
 * @typedef {Object} ProjectNavItem
 * @property {string} label
 * @property {string} href
 *
 * @typedef {Object} ProjectStat
 * @property {string} icon
 * @property {string} text
 *
 * @typedef {Object} ProjectMediaCard
 * @property {string|null} [image]
 * @property {string} [title]
 * @property {boolean} [tall]
 * @property {boolean} [solid]
 * @property {string} [icon]
 *
 * @typedef {Object} ProjectTheme
 * @property {string} [accent]
 * @property {string} [accentDark]
 *
 * @typedef {Object} ProjectPageData
 * @property {string} slug
 * @property {string} name
 * @property {string} city
 * @property {string} phone
 * @property {string} phoneHref
 * @property {ProjectTheme} [theme]
 * @property {ProjectNavItem[]} nav
 * @property {{ image: string, title: string, location: string }} hero
 * @property {{ label: string, text: string, stats: ProjectStat[] }} about
 * @property {{ label: string, title: string, text: string, cards: ProjectMediaCard[] }} standards
 * @property {{ id: string, label: string, title: string, cards: ProjectMediaCard[], notes: string[] }} location
 * @property {{ id: string, label: string, title: string, image: string, points: string[], ctaQuestion: string, ctaButton: string }} architecture
 * @property {{ label: string, title: string, image: string }} yard
 * @property {{ title: string, text: string, image: string, cta: string }} playground
 * @property {{ label: string, gallery: ProjectMediaCard[], roomLabel: string, roomTitle: string, roomText: string }} kids
 * @property {{ label: string, title: string, text1: string, text2: string, image: string, features: string[] }} hall
 * @property {{ id: string, label: string, title: string, text: string, image: string, cta: string, features: string[] }} apartments
 * @property {{ label: string, title: string, image: string, points: string[], note: string }} parking
 * @property {{ label: string, title: string, image: string, text: string }} boxroom
 * @property {{ title: string, subtitle: string, address: string, instagram: string, hours: string, policy: string }} consult
 * @property {{ cols: { title: string, items: string[] }[], policy: string, copyright: string }} footer
 */

import { EASTON } from './easton';
import { WHITE_HILL } from './whitehill';
import { ORTA } from './orta';
import { AVENUE_PARK } from './avenuePark';
import { BS_TOWERS } from './bsTowers';
import { phoneForCity } from './phones';

const E_IMG = {
  featuresMain: '/images/easton/features-main.webp',
  featuresTop: '/images/easton/features-top.webp',
  featuresBottom: '/images/easton/features-bottom.webp',
  locationTheatre: '/images/easton/location-theatre.webp',
  locationPark: '/images/easton/location-park.webp',
  architecture: '/images/easton/architecture.webp',
  yard: '/images/easton/yard.webp',
  playground: '/images/easton/playground.webp',
  kids1: '/images/easton/kids-1.webp',
  kids2: '/images/easton/kids-2.webp',
  kids3: '/images/easton/kids-3.webp',
  kids4: '/images/easton/kids-4.webp',
  hall: '/images/easton/hall.webp',
  apartments: '/images/easton/apartments.webp',
  parking: '/images/easton/parking.webp',
  boxroom: '/images/easton/boxroom.webp',
  iconKey: '/images/easton/icon-key.svg',
  iconBuilding: '/images/easton/icon-building.svg',
  iconCar: '/images/easton/icon-car.webp',
  iconTheatre: '/images/easton/icon-theatre.webp',
  iconPark: '/images/easton/icon-park.webp',
};

const SHARED_FOOTER = {
  cols: [
    { title: 'Проекты', items: ['Central Park', 'Avenue Park', 'Adal Town', 'Easton', 'White Hill', 'ORTA', 'BS Towers'] },
    { title: 'Компания', items: ['О Компании', 'Инвесторам', 'Карьера', 'Коммерческие помещения', 'BS Пайда'] },
    { title: 'Поддержка', items: ['Контакты'] },
    { title: 'Общее', items: ['График работы:\nЕжедневно с 09:00 по 19:00'] },
  ],
  policy: 'Используя данный сайт вы соглашаетесь с нашей политикой обработки конфиденциальных данных.',
  copyright: 'ТОО TengizStroy, Все права на данном сайте защищены авторским правом.',
};

const SHARED_CONSULT = {
  title: 'Заполните контакты — мы зафиксируем для вас выгодную цену за м²',
  subtitle:
    'Менеджер отправит каталог, актуальные цены и условия рассрочки 0%.',
  hours: 'Ежедневно с 9:00 до 19:00',
  policy: 'Оставляя заявку, вы соглашаетесь с нашей политикой обработки конфиденциальных данных',
};

const NAME_TO_SLUG = {
  'Central Park': 'central-park',
  'Avenue Park': 'avenue-park',
  'Adal Town': 'adal-town',
  Easton: 'easton',
  'White Hill': 'white-hill',
  ORTA: 'orta',
  'BS Towers': 'bs-towers',
};

/**
 * @param {string} name
 * @returns {string|null}
 */
export function projectSlugFromName(name) {
  return NAME_TO_SLUG[name] ?? null;
}

/**
 * @param {string} slug
 * @returns {string}
 */
export function projectHash(slug) {
  return `#/${slug}`;
}

/**
 * @param {string} slug
 * @param {string} name
 * @param {string} heroImage
 * @param {Array<{ name: string, rooms: string, area: string, price: string, image?: string }>} specs
 */
function mockFloorPlans(slug, name, heroImage, specs) {
  const plansId = `${slug}-plans`;
  return {
    id: plansId,
    label: 'Планировки',
    title: `Планировки ${name}`,
    text: 'Подберите планировку и оставьте заявку на консультацию.',
    items: specs.map((p, i) => ({
      id: `${slug}-plan-${i}`,
      name: p.name,
      rooms: p.rooms,
      area: p.area,
      price: p.price,
      image: p.image ?? heroImage,
      featured: i < 4,
    })),
  };
}

/**
 * Build a full project page dataset from catalog-level inputs (mock content).
 * @param {object} opts
 * @returns {ProjectPageData}
 */
function buildMockPage({
  slug,
  name,
  city,
  heroImage,
  aboutText,
  termText,
  apartmentsCount,
  locationTitle,
  locationCards,
  locationNotes,
  address,
  instagram,
  classLabel,
  phoneCity,
  floorPlans,
}) {
  const titleUpper = name.toUpperCase();
  const cityPhone = phoneForCity(phoneCity ?? city);
  const plansId = `${slug}-plans`;
  return {
    slug,
    name,
    city,
    phone: cityPhone.full,
    phoneHref: cityPhone.href,
    theme: {
      accent: '#61D0C5',
      accentDark: '#1F6059',
    },
    nav: floorPlans
      ? [
          { label: 'Расположение', href: `#${slug}-location` },
          { label: 'Архитектура', href: `#${slug}-architecture` },
          { label: 'Планировки', href: `#${plansId}` },
        ]
      : [
          { label: 'Расположение', href: `#${slug}-location` },
          { label: 'Архитектура', href: `#${slug}-architecture` },
          { label: 'Планировки', href: `#${slug}-quiz` },
        ],
    hero: {
      image: heroImage,
      title: titleUpper,
      location: `г. ${city}`,
    },
    about: {
      label: 'О жилом комплексе',
      text: aboutText,
      stats: [
        { icon: E_IMG.iconKey, text: termText },
        { icon: E_IMG.iconBuilding, text: apartmentsCount },
      ],
    },
    standards: {
      label: name,
      title: 'Созданный по стандартам BS, комплекс объединяет:',
      text: `${name} — пространство, где комфорт, эстетика и надёжность формируют современную городскую среду.`,
      cards: [
        { image: heroImage, title: 'Современный архитектурный дизайн', tall: true },
        { image: heroImage, title: 'Продуманную инфраструктуру' },
        { image: heroImage, title: 'Высокое качество строительства' },
      ],
    },
    location: {
      id: `${slug}-location`,
      label: 'Локация',
      title: locationTitle,
      cards: locationCards,
      notes: locationNotes,
    },
    architecture: {
      id: `${slug}-architecture`,
      label: 'Архитектура и материалы',
      title: `Архитектура ${name} отражает индивидуальность и современное видение`,
      image: heroImage,
      points: [
        'Монолитный каркас обеспечивает прочность и долговечность всего жилого здания.',
        'Фасады выполнены с вниманием к деталям: качественные материалы и продуманная композиция.',
        `Класс объекта — ${classLabel}: баланс эстетики, комфорта и практичности.`,
      ],
      ctaQuestion: `Желаете лично оценить качество материалов ${name}?`,
      ctaButton: 'Записаться на экскурсию',
    },
    yard: {
      label: 'Дворовое пространство',
      title:
        'Двор спроектирован с приоритетом безопасности и комфорта: зоны отдыха, озеленение и пространство для семьи',
      image: heroImage,
    },
    playground: {
      title: 'Современная игровая площадка',
      text: 'Двор — гармоничная среда для отдыха, общения и прогулок всей семьёй. Каждая деталь создана с учётом безопасности и комфорта.',
      image: heroImage,
      cta: 'Получить консультацию',
    },
    kids: {
      label: 'Особое внимание - детям',
      gallery: [
        { image: heroImage, title: 'Безопасные\nматериалы' },
        { image: heroImage, title: 'Зона активных\nигр' },
        { image: heroImage, title: 'Место для творчества\nи отдыха' },
      ],
      roomLabel: 'Kids Room',
      roomTitle: `Kids Room ${name} — уютное пространство для детей`,
      roomText: 'Даже в непогоду дети смогут играть, фантазировать и весело проводить время.',
    },
    hall: {
      label: 'Холлы',
      title: 'Холлы комплекса — сочетание элегантности и современного стиля',
      text1: 'Оформление выполнено с вниманием к свету и пропорциям, создавая атмосферу уюта и комфорта.',
      text2: 'Холлы становятся не просто зоной ожидания, а пространством эстетического и эмоционального комфорта.',
      image: heroImage,
      features: [
        'Дизайнерские входные группы',
        'Просторные холлы',
        'Продуманные планировки общественных зон',
        'Современные лифты',
      ],
    },
    apartments: {
      id: `${slug}-apartments`,
      label: 'Квартиры',
      title: 'Каждая квартира — пространство комфорта, функциональности и современного стиля',
      text: 'Планировки позволяют использовать каждый метр максимально эффективно, сохраняя ощущение света и простора.',
      image: heroImage,
      cta: 'Получить консультацию',
      features: [
        'Продуманные планировки под разный сценарий жизни',
        'Качественная тепло- и шумоизоляция',
        'Современные входные группы и системы безопасности',
        'Готовность к индивидуальному дизайну интерьера',
      ],
    },
    floorPlans,
    parking: {
      label: 'Паркинг',
      title: `Паркинг ${name} — сочетание удобства, безопасности и продуманной организации`,
      image: heroImage,
      points: [
        'Парковочные места организованы с учётом удобного въезда и навигации.',
        'Контроль доступа снижает риск попадания посторонних.',
        'Продуманная связь паркинга с жилой частью комплекса.',
      ],
      note: 'Просторные места, понятная навигация и освещение делают использование паркинга комфортным.',
    },
    boxroom: {
      label: 'BoxRoom',
      title: 'Boxroom — персональные кладовые помещения для хранения',
      image: heroImage,
      text: 'Решение для велосипедов, колясок, сезонных вещей и спортинвентаря. Всё, что создаёт порядок в квартире, имеет своё место.',
    },
    consult: {
      ...SHARED_CONSULT,
      address,
      instagram,
    },
    footer: SHARED_FOOTER,
  };
}

/** @type {ProjectPageData} */
const EASTON_PAGE = {
  ...EASTON,
  slug: 'easton',
  theme: {
    accent: '#61D0C5',
    accentDark: '#1F6059',
  },
};

const CENTRAL_PARK = buildMockPage({
  slug: 'central-park',
  name: 'Central Park',
  city: 'Актау',
  heroImage: '/images/project-central-park.webp',
  aboutText:
    'Central Park — жилой комплекс бизнес-класса в престижном районе Актау с видом на Каспийское море. Современный символ комфортной жизни у первой береговой линии.',
  termText: 'Срок сдачи: сдан',
  apartmentsCount: 'Бизнес-класс · вид на море',
  locationTitle: 'Первая береговая линия\nАктау — рядом с морем и городом',
  locationCards: [
    { image: null, title: 'Набережная', solid: true, icon: E_IMG.iconCar },
    { image: E_IMG.locationTheatre, title: 'Центр города', icon: E_IMG.iconTheatre },
    { image: E_IMG.locationPark, title: 'Пляж', icon: E_IMG.iconPark },
  ],
  locationNotes: [
    '5 минут до набережной и городского пляжа, 10 минут до центра города.',
    'Закрытый двор без машин, детские и спортивные площадки, зоны отдыха.',
  ],
  address: 'г. Актау, первая береговая линия',
  instagram: 'bs_holding.aktau',
  classLabel: 'бизнес-класс',
  floorPlans: mockFloorPlans('central-park', 'Central Park', '/images/project-central-park.webp', [
    {
      name: '2-комнатная',
      rooms: '2 комнаты',
      area: 'от 55 м²',
      price: 'от 22 534 000 ₸',
      image: '/images/bs-towers/plans/plan-2r.svg',
    },
    {
      name: '3-комнатная',
      rooms: '3 комнаты',
      area: 'от 75 м²',
      price: 'от 28 000 000 ₸',
      image: '/images/bs-towers/plans/plan-3r.svg',
    },
  ]),
});

const ADAL_TOWN = buildMockPage({
  slug: 'adal-town',
  name: 'Adal Town',
  city: 'Актау',
  heroImage: '/images/project-adal-town.webp',
  aboutText:
    'Adal Town — современный комфортный жилой комплекс для молодых семей в развивающемся районе Актау. Доступные цены и продуманная среда для жизни.',
  termText: 'Срок сдачи: II квартал 2026 года',
  apartmentsCount: 'Комфорт-класс · для семей',
  locationTitle: 'Развивающийся район Актау\nс инфраструктурой рядом',
  locationCards: [
    { image: null, title: 'Школы', solid: true, icon: E_IMG.iconBuilding },
    { image: E_IMG.locationTheatre, title: 'Детские сады', icon: E_IMG.iconTheatre },
    { image: E_IMG.locationPark, title: 'ТЦ рядом', icon: E_IMG.iconPark },
  ],
  locationNotes: [
    'Школы, детские сады и торговые центры в шаговой доступности.',
    'Благоустроенная территория, спортивные и игровые площадки.',
  ],
  address: 'г. Актау, развивающийся район',
  instagram: 'bs_holding.aktau',
  classLabel: 'комфорт-класс',
  floorPlans: mockFloorPlans('adal-town', 'Adal Town', '/images/project-adal-town.webp', [
    {
      name: '1-комнатная',
      rooms: '1 комната',
      area: 'от 40 м²',
      price: 'от 8 316 000 ₸',
      image: '/images/bs-towers/plans/plan-1r.svg',
    },
    {
      name: '2-комнатная',
      rooms: '2 комнаты',
      area: 'от 55 м²',
      price: 'от 10 500 000 ₸',
      image: '/images/bs-towers/plans/plan-2r.svg',
    },
  ]),
});

/** @type {Record<string, ProjectPageData>} */
export const PROJECT_PAGES = {
  easton: EASTON_PAGE,
  'central-park': CENTRAL_PARK,
  'avenue-park': AVENUE_PARK,
  'adal-town': ADAL_TOWN,
  'white-hill': WHITE_HILL,
  orta: ORTA,
  'bs-towers': BS_TOWERS,
};

/**
 * @param {string} slug
 * @returns {ProjectPageData|null}
 */
export function getProjectPage(slug) {
  return PROJECT_PAGES[slug] ?? null;
}
