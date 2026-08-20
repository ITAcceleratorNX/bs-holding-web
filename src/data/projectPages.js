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
    { title: 'Проекты', items: ['Central Park', 'Avenue Park', 'MURA', 'Easton', 'White Hill', 'ORTA', 'BS Towers'] },
    { title: 'Компания', items: ['О Компании', 'Инвесторам', 'Карьера', 'Коммерческие помещения', 'BS Пайда'] },
    { title: 'Поддержка', items: ['Контакты'] },
    { title: 'Общее', items: ['График работы:\nЕжедневно с 09:00 по 19:00'] },
  ],
  policy: 'Используя данный сайт вы соглашаетесь с нашей политикой обработки конфиденциальных данных.',
  copyright: 'ТОО TengizStroy, Все права на данном сайте защищены авторским правом.',
};


const NAME_TO_SLUG = {
  'Central Park': 'central-park',
  'Avenue Park': 'avenue-park',
  MURA: 'mura',
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

/** @type {ProjectPageData} */
const EASTON_PAGE = {
  ...EASTON,
  slug: 'easton',
  theme: {
    accent: '#61D0C5',
    accentDark: '#1F6059',
  },
};

const CP = '/images/central-park';
const R1 = `${CP}/renders1`;
const R2 = `${CP}/renders2`;
const MOP = `${CP}/mop`;

const CENTRAL_PARK = (() => {
  const slug = 'central-park';
  const cityPhone = phoneForCity('Актау');
  return {
    slug,
    name: 'Central Park',
    city: 'Актау',
    phone: cityPhone.full,
    phoneHref: cityPhone.href,
    showQuiz: false,
    theme: {
      accent: '#61D0C5',
      accentDark: '#1F6059',
    },
    nav: [
      { labelKey: 'project.nav.location', label: 'Расположение', href: `#${slug}-location` },
      { labelKey: 'project.nav.architecture', label: 'Архитектура', href: `#${slug}-architecture` },
      { labelKey: 'project.nav.halls', label: 'Холлы', href: `#${slug}-hall` },
    ],
    hero: {
      image: `${R1}/Aktau_40mkr (1).jpg`,
      imageMobile: `${R1}/Aktau_40mkr (3).jpg`,
      title: 'CENTRAL PARK',
      location: 'г. Актау / 40 МКР 2 ДОМ',
      tagline: 'Central Park — это комплекс, в котором соединились эстетика, комфорт и высокий стандарт строительства.',
    },
    about: {
      label: 'О жилом комплексе',
      text: 'Central Park - Проект для тех, кто ценит гармонию личной жизни, респектабельную архитектуру и продуманный городской образ жизни',
      stats: [
        { icon: E_IMG.iconKey, text: 'Сдан в 2024 году' },
        { icon: E_IMG.iconBuilding, text: '435 квартир · 14 подъездов' },
      ],
    },
    standards: {
      label: 'Central Park',
      title: 'Central Park — современный жилой комплекс, созданный для комфортной городской жизни.',
      text: 'В составе комплекса 435 квартир и 14 подъездов, объединённых продуманной архитектурой, благоустроенной территорией и развитой инфраструктурой. Жилой комплекс сдан в эксплуатацию в 2024 году и уже стал частью городской среды Актау.',
      cards: [
        { image: `${R1}/Aktau_40mkr (2).jpg`, title: '435 квартир', tall: true },
        { image: `${R1}/Aktau_40mkr (4).jpg`, title: '14 подъездов' },
        { image: `${R1}/iz_parka.jpg`, title: 'Сдан в 2024 году' },
      ],
    },
    location: {
      id: `${slug}-location`,
      label: 'Локация',
      title: 'Перспективный 40-й микрорайон\nАктау — рядом с Парком Первого Президента',
      text: 'Жилой комплекс Central Park расположен в перспективном 40-м микрорайоне Актау — в динамично развивающейся части города, где сочетаются современные стандарты комфорта и гармоничное окружение. Главный акцент локации — близость Парку Первого Президента, крупнейшему зелёному массиву города.',
      cards: [
        { image: `${R2}/DJI_20250710091110_0765_D-2.jpg`, title: 'Гипермаркет Dina', text: 'Гипермаркет Dina — один из крупнейших современных гипермаркетов Актау, где представлен широкий выбор продуктов, товаров для дома и готовой продукции собственной кулинарии.' },
        { image: `${R2}/DJI_20250710091112_0766_D-2.jpg`, title: 'Президентский парк', text: 'Президентский парк — один из масштабных парков города, созданный для прогулок, отдыха на свежем воздухе и комфортного семейного времяпрепровождения.' },
        { image: `${R2}/DJI_20250710091117_0767_D-2.jpg`, title: 'Музей им. Абиша Кекилбаева', text: 'Музей имени Абиша Кекилбаева — современное культурное пространство, посвящённое жизни, творчеству и наследию выдающегося казахстанского писателя и государственного деятеля.' },
      ],
      notes: [
        'Жилой комплекс Central Park расположен в перспективном 40-м микрорайоне Актау.',
        'Близость Парку Первого Президента — крупнейшему зелёному массиву города.',
      ],
    },
    architecture: {
      id: `${slug}-architecture`,
      label: 'Архитектура и материалы',
      title: 'Материалы, которые не подчиняются погоде, не блекнут и не стареют, а служат десятилетиями',
      lead: 'Фасады комплекса выполнены с применением алюминиевых композитных панелей (ОАЭ), натурального иранского мрамора, японского клинкерного кирпича. Здания собраны на монолитно-каркасной технологии — с продуманной теплоизоляцией и пятикамерными профилями окон, которые достойно справляются и с климатом прикаспийских ветров, и с требованиями тишины.',
      image: `${R1}/Aktau_40mkr (5).jpg`,
      gallery: [
        `${R1}/Aktau_40mkr (6).jpg`,
        `${R1}/Aktau_40mkr (7).jpg`,
      ],
      points: [
        'Алюминиевые композитные панели (ОАЭ)',
        'Натуральный иранский мрамор',
        'Японский клинкерный кирпич',
        'Монолитно-каркасная технология',
        'Пятикамерные профили окон',
      ],
      ctaQuestion: 'Желаете лично оценить качество материалов Central Park?',
      ctaButton: 'Записаться на экскурсию',
    },
    autonomy: {
      label: 'Автономность',
      title: 'Комплекс, который работает без перебоев',
      points: [
        '2 дизельных генератора обеспечивают свет и электричество в подъездах и квартирах при отключениях',
        '350 м³ воды хранятся в резерве на случай перебоев с водоснабжением',
        '50 м³ выделены только для полива ландшафта',
      ],
    },
    yard: {
      label: 'Дворовое пространство',
      title: 'Территория Central Park полностью закрыта от посторонних и не имеет доступа для автомобилей',
      text: 'Двор спроектирован как безопасное место для отдыха и общения, свободное от шума и движения машин.',
      image: `${R1}/Aktau_40mkr (8).jpg`,
      features: [
        'Зоны отдыха для взрослых',
        'Прогулочные маршруты и скамьи',
        'Детские игровые эко-пространства',
        'Освещение, озеленение и акустический комфорт',
      ],
    },
    playground: {
      title: 'Детская площадка',
      text: 'Для детей установлена современная игровая площадка от Buglo, выполненная из долговечных и безопасных материалов. Игровые элементы от Buglo способствуют активному развитию, а продуманная зона с мягким покрытием делает игры безопасными — независимо от сезона.',
      image: `${R1}/Aktau_40mkr (9).jpg`,
      cta: 'Получить консультацию',
    },
    kids: {
      labelKey: 'project.label.kids.sport',
      label: 'Спортивная инфраструктура',
      gallery: [
        { image: `${R1}/Aktau_40mkr (10).jpg`, title: 'Workout-зона' },
        { image: `${R1}/Aktau_40mkr (11).jpg`, title: 'Футбольная площадка' },
        { image: `${R1}/Aktau_40mkr (12).jpg`, title: 'Баскетбольная площадка' },
      ],
      roomLabel: 'Workout-зона от Buglo',
      roomTitle: 'Оборудование для уличных тренировок',
      roomText: 'Workout-зона от Buglo — оборудование для уличных тренировок с упором на развитие силы, выносливости и координации. Все элементы выполнены из антивандальных и экологически безопасных материалов.',
    },
    extras: {
      labelKey: 'project.label.residents',
      label: 'Пространства для жителей',
      title: 'На территории двора предусмотрены полноценные пространства для отдыха, общения и проведения мероприятий',
      items: [
        { title: 'Қазан-ошақ', text: 'Традиционная зона для приготовления блюд на открытом огне' },
        { title: 'Барбекю аймақтар', text: 'Площадки для готовки на гриле в кругу семьи или соседей' },
        { title: '2 киіз үй', text: 'Адаптированные для отдыха юрты, символизирующие бережное отношение к традициям и культуре' },
      ],
    },
    hall: {
      id: `${slug}-hall`,
      label: 'Общественные пространства',
      title: 'Каждый подъезд Central Park начинается с просторного дизайнерского холла',
      text1: 'Авторская отделка, продуманное освещение, декоративные элементы и качественная мебель создают особую атмосферу в каждом подъезде.',
      text2: 'В комплексе внедрена система "Умный домофон" с биометрическим распознаванием. Теперь можно открыть подъезд без ключей, принять вызов с телефона и впустить гостей удалённо. Все визиты фиксируются, система работает 24/7, повышая безопасность и удобство.',
      image: `${MOP}/Альбом Актау-1.png`,
      gallery: [
        { image: `${MOP}/Альбом Актау-2.png`, title: 'Дизайнерский холл' },
        { image: `${MOP}/Альбом Актау-3.png`, title: 'Умный домофон' },
        { image: `${MOP}/Альбом Актау-4.png`, title: 'Зона ожидания' },
      ],
      features: [
        'Дизайнерская авторская отделка',
        'Продуманное освещение',
        'Декоративные элементы и мебель',
        'Умный домофон с биометрией',
        'Открытие подъезда без ключей',
        'Удалённый доступ гостей',
        'Запись всех визитов 24/7',
      ],
    },
    apartments: {
      id: `${slug}-apartments`,
      label: 'Особенности квартир',
      title: 'Высокие технологии в каждой квартире',
      text: 'Вход в подъезд — по распознаванию лица, в квартиру — по умному замку Philips, IP домофоны - интерфейс, работающий с телефона, с записью и удалённым доступом.',
      image: `${R2}/DSC09126.jpeg`,
      cta: 'Получить консультацию',
      features: [
        'Вход в подъезд по распознаванию лица',
        'Умный замок Philips в квартиру',
        'IP домофон с записью и удалённым доступом',
        'Интерфейс управления с телефона',
      ],
    },
    floorPlans: null,
    parking: null,
    boxroom: null,
    consult: {
      title: 'ХОЧУ ПОЛУЧИТЬ ИНФОРМАЦИЮ ПРО КОММЕРЧЕСКИЕ ПОМЕЩЕНИЯ В CENTRAL PARK',
      subtitle: 'Менеджер свяжется с вами и расскажет об актуальных коммерческих помещениях.',
      address: 'г. Актау, 40 МКР 2 ДОМ',
      instagram: '@bs_holding.aktau',
      hours: 'Ежедневно с 9:00 до 19:00',
      policy: 'Оставляя заявку, вы соглашаетесь с нашей политикой обработки конфиденциальных данных',
    },
    footer: SHARED_FOOTER,
  };
})();

/** Единая заглушка для блоков без официальных визуалов MURA (согласно брифу). */
const MURA_PLACEHOLDER = null;
const MURA_PLACEHOLDER_TEXT = 'Визуальные материалы готовятся. Скоро здесь появятся дополнительные изображения проекта.';
const MR = '/images/mura/renders';
const MP = '/images/mura/plans';

const MURA = (() => {
  const slug = 'mura';
  const cityPhone = phoneForCity('Актау');
  return {
    slug,
    name: 'MURA',
    city: 'Актау',
    phone: cityPhone.full,
    phoneHref: cityPhone.href,
    theme: {
      accent: '#61D0C5',
      accentDark: '#1F6059',
    },
    nav: [
      { labelKey: 'project.nav.location', label: 'Расположение', href: `#${slug}-location` },
      { labelKey: 'project.nav.architecture', label: 'Архитектура', href: `#${slug}-architecture` },
      { labelKey: 'project.nav.plans', label: 'Планировки', href: `#${slug}-plans` },
    ],
    hero: {
      image: `${MR}/7.jpg`,
      imageMobile: `${MR}/8.jpg`,
      title: 'МҰРА',
      location: 'г. Актау / 40 МКР',
      tagline: 'МҰРА — жилой комплекс комфорт+ класса в 40 микрорайоне Актау',
    },
    about: {
      label: 'О жилом комплексе',
      text: 'МҰРА — жилой комплекс от BS Holding, расположенный в 40-м микрорайоне Актау, в непосредственной близости от Президентского парка. Комплекс состоит из 3 блоков высотой 7 этажей, в которых предусмотрено 262 квартиры. Архитектурная концепция комплекса основана на сочетании современной эстетики и надёжных строительных решений, а разнообразие планировок — от одно- до четырёхкомнатных квартир — позволяет подобрать вариант как для одного человека, так и для большой семьи.',
      stats: [
        { icon: E_IMG.iconKey, text: 'Сдача 1 квартал 2028 года' },
        { icon: E_IMG.iconBuilding, text: '262 квартиры · 3 блока · 7 этажей' },
      ],
    },
    standards: {
      label: 'MURA',
      title: '262 квартиры · 3 блока · Сдача I квартал 2028',
      text: 'Жилой комплекс «Мұра» расположен в 40-м микрорайоне Актау, в непосредственной близости от Президентского парка.',
      cards: [
        { image: `${MR}/7.jpg`, title: '262 квартир', tall: true },
        { image: `${MR}/9.jpg`, title: '3 блока' },
        { image: `${MR}/10.jpg`, title: 'Сдача 1 квартал 2028 года' },
      ],
    },
    location: {
      id: `${slug}-location`,
      label: 'Локация',
      title: '40-й микрорайон Актау\nрядом с Президентским парком',
      /* Бриф: текст по локации не заполнен — блок сохраняем, визуал-заглушка */
      cards: [
        { image: MURA_PLACEHOLDER, title: MURA_PLACEHOLDER_TEXT, solid: true, icon: E_IMG.iconBuilding },
        { image: MURA_PLACEHOLDER, title: MURA_PLACEHOLDER_TEXT, solid: true, icon: E_IMG.iconBuilding },
        { image: MURA_PLACEHOLDER, title: MURA_PLACEHOLDER_TEXT, solid: true, icon: E_IMG.iconBuilding },
      ],
      notes: [],
    },
    architecture: {
      id: `${slug}-architecture`,
      label: 'Архитектура и материалы',
      title: 'Современный и лаконичный архитектурный облик, долговременная прочность и эстетичность',
      lead: 'Жилой комплекс «Мұра» состоит из 3 блоков высотой 7 этажей, общее количество квартир — 262. Каркас здания выполнен из кирпича, наружный фасад облицован высококачественными фиброцементными панелями. Этот материал придаёт зданию современный и лаконичный архитектурный облик, обеспечивая долговременную прочность и эстетичность фасада. Теплоэффективность здания обеспечивается теплоизоляцией из плит минеральной ваты. В качестве дополнительной защиты применена трёхслойная мембрана «Изоспан», предназначенная для защиты конструкции от влаги, пара и воздействия ветра.',
      image: `${MR}/8.jpg`,
      gallery: [`${MR}/9.jpg`],
      points: [
        'Каркас здания из кирпича',
        'Фасад — высококачественные фиброцементные панели',
        'Теплоизоляция из плит минеральной ваты',
        'Трёхслойная мембрана «Изоспан» от влаги, пара и ветра',
      ],
      ctaQuestion: 'Желаете лично оценить качество материалов MURA?',
      ctaButton: 'Записаться на экскурсию',
    },
    /* Бриф: «Крупное преимущество проекта» — текст не заполнен, блок сохраняем без автономности */
    yard: {
      label: 'Дворовое пространство',
      title: 'Двор жилого комплекса «Мұра» спроектирован как открытое и благоустроенное пространство',
      text: 'Двор жилого комплекса «Мұра» спроектирован как открытое и благоустроенное пространство, где предусмотрены различные функциональные зоны для комфортного отдыха жителей и безопасного времяпрепровождения детей. Для детей размещена современная игровая площадка из экологически чистых материалов. Для жителей предусмотрены уютные зоны отдыха и беседки, а также специальная зона қазан-ошақ для проведения семейных встреч, приготовления традиционных блюд и совместного отдыха на свежем воздухе. Территория двора озеленяется и дополняется зелёными насаждениями, газонами и элементами ландшафтного благоустройства.',
      image: `${MR}/10.jpg`,
    },
    playground: {
      title: 'Современная игровая площадка из экологически чистых материалов',
      text: 'Для детей размещена современная игровая площадка из экологически чистых материалов — безопасное и уютное место для игр.',
      image: MURA_PLACEHOLDER,
      cta: 'Получить консультацию',
    },
    /* Бриф: «Дополнительные преимущества зоны» — текст не заполнен, сохраняем kids-блок с заглушкой */
    kids: {
      label: 'Особое внимание — детям',
      gallery: [
        { image: MURA_PLACEHOLDER, title: MURA_PLACEHOLDER_TEXT },
        { image: MURA_PLACEHOLDER, title: MURA_PLACEHOLDER_TEXT },
        { image: MURA_PLACEHOLDER, title: MURA_PLACEHOLDER_TEXT },
      ],
      roomLabel: 'Детская зона',
      /* Бриф: «Дополнительное пространство для жителей» — текст не заполнен */
      roomTitle: MURA_PLACEHOLDER_TEXT,
      roomText: '',
    },
    hall: {
      label: 'Холлы',
      title: 'Входные группы жилого комплекса оформлены в авторском дизайне',
      text1: 'Входные группы жилого комплекса оформлены в авторском дизайне. Каждый подъезд оснащён современной лифтовой системой, обеспечивающей повседневный комфорт жителей.',
      text2: 'Входные двери в квартиры выполнены на металлической основе, облицованы MDF-панелями и оснащены современными умными замками — решение сочетает безопасность и повседневное удобство.',
      image: MURA_PLACEHOLDER,
      features: [
        'Авторский дизайн входных групп',
        'Современная лифтовая система',
        'Металлические двери квартир с MDF-облицовкой',
        'Умные замки',
      ],
    },
    apartments: {
      id: `${slug}-apartments`,
      label: 'Квартиры',
      title: 'В квартирах предусмотрены окна с пятикамерным профилем и двухкамерными стеклопакетами',
      text: 'В квартирах предусмотрены окна с пятикамерным профилем и двухкамерными стеклопакетами. Такая оконная система улучшает тепло- и звукоизоляцию, способствуя формированию комфортного микроклимата для жителей.',
      image: MURA_PLACEHOLDER,
      cta: 'Получить консультацию',
      features: [
        'Пятикамерный профиль окон',
        'Двухкамерные стеклопакеты',
        'Улучшенная тепло- и звукоизоляция',
        'Комфортный микроклимат',
      ],
    },
    floorPlans: {
      id: `${slug}-plans`,
      label: 'Планировки',
      title: 'Планировки MURA',
      text: 'В жилом комплексе представлены одно-, двух-, трёх- и четырёхкомнатные квартиры с удобными и просторными планировками. Такое разнообразие позволяет выбрать вариант, который будет комфортен как для одного человека или пары, так и для большой семьи.',
      items: [
        { id: 'mura-1r-1', name: '1-комнатная', rooms: '1 комната', area: 'уточняется', price: 'уточняется', image: `${MP}/1.png` },
        { id: 'mura-1r-2', name: '1-комнатная', rooms: '1 комната', area: 'уточняется', price: 'уточняется', image: `${MP}/2.png` },
        { id: 'mura-1r-3', name: '1-комнатная', rooms: '1 комната', area: 'уточняется', price: 'уточняется', image: `${MP}/3.png` },
        { id: 'mura-2r-1', name: '2-комнатная', rooms: '2 комнаты', area: 'уточняется', price: 'уточняется', image: `${MP}/4.png` },
        { id: 'mura-2r-2', name: '2-комнатная', rooms: '2 комнаты', area: 'уточняется', price: 'уточняется', image: `${MP}/5.png` },
        { id: 'mura-2r-3', name: '2-комнатная', rooms: '2 комнаты', area: 'уточняется', price: 'уточняется', image: `${MP}/6.png` },
        { id: 'mura-3r-1', name: '3-комнатная', rooms: '3 комнаты', area: 'уточняется', price: 'уточняется', image: `${MP}/7.png` },
        { id: 'mura-3r-2', name: '3-комнатная', rooms: '3 комнаты', area: 'уточняется', price: 'уточняется', image: `${MP}/8 (2).png` },
        { id: 'mura-3r-3', name: '3-комнатная', rooms: '3 комнаты', area: 'уточняется', price: 'уточняется', image: `${MP}/9.png` },
        { id: 'mura-4r-1', name: '4-комнатная', rooms: '4 комнаты', area: 'уточняется', price: 'уточняется', image: `${MP}/10.png` },
      ],
    },
    parking: {
      label: 'Паркинг',
      title: 'Наземный паркинг на 323 машиноместа',
      image: MURA_PLACEHOLDER,
      points: [
        'Наземный паркинг общей вместимостью 323 машиноместа.',
        'Удобный въезд и выезд для жителей комплекса.',
        'Продуманная навигация и освещение.',
      ],
      note: 'В жилом комплексе «Мұра» для жителей и гостей предусмотрен наземный паркинг. Общая вместимость паркинга — 323 машиноместа.',
    },
    boxroom: {
      label: 'BoxRoom',
      title: 'Кладовые помещения для хранения',
      image: MURA_PLACEHOLDER,
      text: 'В жилом комплексе «Мұра» предусмотрены дополнительные пространства для хранения: в каждом подъезде расположена кладовая площадью 3,2 м², а также предусмотрены индивидуальные кладовые помещения в подвальной части комплекса. Всё необходимое для хранения — рядом с домом и без лишней нагрузки на пространство квартиры.',
    },
    consult: {
      title: 'Хочу получить подробную информацию про ЖК «Мұра»',
      subtitle: 'Менеджер свяжется с вами и ответит на все вопросы о жилом комплексе MURA.',
      address: 'г. Актау, 40 МКР',
      instagram: '@bs_holding.aktau',
      hours: 'Ежедневно с 9:00 до 19:00',
      policy: 'Оставляя заявку, вы соглашаетесь с нашей политикой обработки конфиденциальных данных',
    },
    footer: SHARED_FOOTER,
  };
})();

/** @type {Record<string, ProjectPageData>} */
export const PROJECT_PAGES = {
  easton: EASTON_PAGE,
  'central-park': CENTRAL_PARK,
  'avenue-park': AVENUE_PARK,
  mura: MURA,
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
