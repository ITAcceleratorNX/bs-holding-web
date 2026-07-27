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
    { title: 'Проекты', items: ['Central Park', 'Avenue Park', 'Adal Town', 'Orda Palace', 'Easton', 'White Hill', 'ORTA'] },
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
    'Менеджер отправит в WhatsApp каталог, актуальные цены и условия рассрочки 0%.',
  hours: 'Ежедневно с 9:00 до 19:00',
  policy: 'Оставляя заявку, вы соглашаетесь с нашей политикой обработки конфиденциальных данных',
};

const NAME_TO_SLUG = {
  'Central Park': 'central-park',
  'Avenue Park': 'avenue-park',
  'Adal Town': 'adal-town',
  'Orda Palace': 'orda-palace',
  Easton: 'easton',
  'White Hill': 'white-hill',
  ORTA: 'orta',
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
}) {
  const titleUpper = name.toUpperCase();
  return {
    slug,
    name,
    city,
    phone: '8 775 386 40 10',
    phoneHref: 'tel:+87753864010',
    whatsappPhone: '77753864010',
    theme: {
      accent: '#61D0C5',
      accentDark: '#1F6059',
    },
    nav: [
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
        { image: E_IMG.featuresTop, title: 'Продуманную инфраструктуру' },
        { image: E_IMG.featuresBottom, title: 'Высокое качество строительства' },
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
      image: E_IMG.architecture,
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
      image: E_IMG.yard,
    },
    playground: {
      title: 'Современная игровая площадка',
      text: 'Двор — гармоничная среда для отдыха, общения и прогулок всей семьёй. Каждая деталь создана с учётом безопасности и комфорта.',
      image: E_IMG.playground,
      cta: 'Получить консультацию',
    },
    kids: {
      label: 'Особое внимание - детям',
      gallery: [
        { image: E_IMG.kids1, title: 'Безопасные\nматериалы' },
        { image: E_IMG.kids2, title: 'Зона активных\nигр' },
        { image: E_IMG.kids3, title: 'Место для творчества\nи отдыха' },
        { image: E_IMG.kids4 },
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
      image: E_IMG.hall,
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
      image: E_IMG.apartments,
      cta: 'Получить консультацию',
      features: [
        'Продуманные планировки под разный сценарий жизни',
        'Качественная тепло- и шумоизоляция',
        'Современные входные группы и системы безопасности',
        'Готовность к индивидуальному дизайну интерьера',
      ],
    },
    parking: {
      label: 'Паркинг',
      title: `Паркинг ${name} — сочетание удобства, безопасности и продуманной организации`,
      image: E_IMG.parking,
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
      image: E_IMG.boxroom,
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
});

const ORDA_PALACE = buildMockPage({
  slug: 'orda-palace',
  name: 'Orda Palace',
  city: 'Усть-Каменогорск',
  heroImage: '/images/project-orda-palace.webp',
  aboutText:
    'Orda Palace — жилой комплекс комфорт+ в центре Усть-Каменогорска. Удобное расположение, продуманные планировки и готовый дом для жизни.',
  termText: 'Срок сдачи: сдан',
  apartmentsCount: 'Комфорт+ · центр города',
  locationTitle: 'Центр Усть-Каменогорска\nв пешей доступности от ключевых точек',
  locationCards: [
    { image: null, title: 'Центр', solid: true, icon: E_IMG.iconCar },
    { image: E_IMG.locationTheatre, title: 'Культура', icon: E_IMG.iconTheatre },
    { image: E_IMG.locationPark, title: 'Парки', icon: E_IMG.iconPark },
  ],
  locationNotes: [
    'Расположение в центре города обеспечивает быстрый доступ к работе, учёбе и отдыху.',
    'Благоустроенные улицы и транспортная доступность — комфорт ежедневных маршрутов.',
  ],
  address: 'г. Усть-Каменогорск, центральный район',
  instagram: 'bs_holding.oskemen',
  classLabel: 'комфорт+',
});

/** @type {Record<string, ProjectPageData>} */
export const PROJECT_PAGES = {
  easton: EASTON_PAGE,
  'central-park': CENTRAL_PARK,
  'avenue-park': AVENUE_PARK,
  'adal-town': ADAL_TOWN,
  'orda-palace': ORDA_PALACE,
  'white-hill': WHITE_HILL,
  orta: ORTA,
};

/**
 * @param {string} slug
 * @returns {ProjectPageData|null}
 */
export function getProjectPage(slug) {
  return PROJECT_PAGES[slug] ?? null;
}
