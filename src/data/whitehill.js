const IMG = '/images/white-hill';
import { phoneForProject } from './phones';

/** Колл-центр White Hill принимает звонки на две линии. */
const PHONES = phoneForProject('white-hill');

/** График приёма звонков — один текст на нижний блок контактов и футер. */
const HOURS = 'Пн–Пт: 09:00–19:00\nСб–Вс: 10:00–17:00';

export const WHITE_HILL = {
  slug: 'white-hill',
  name: 'White Hill',
  city: 'Актобе',
  phone: PHONES.full,
  phoneHref: PHONES.href,
  phones: PHONES,
  theme: {
    accent: '#61D0C5',
    accentDark: '#1F6059',
  },
  nav: [
    { labelKey: 'project.nav.location', label: 'Расположение', href: '#white-hill-location' },
    { labelKey: 'project.nav.architecture', label: 'Архитектура', href: '#white-hill-architecture' },
    { labelKey: 'project.nav.plans', label: 'Планировки', href: '#white-hill-plans' },
  ],
  hero: {
    image: `${IMG}/hero.webp`,
    imageMobile: `${IMG}/hero-mobile.webp`,
    title: 'WHITE HILL',
    location: 'г. Актобе',
  },
  about: {
    label: 'О жилом комплексе',
    text: 'White Hill — первый жилой комплекс бизнес-класса в Актобе.\nНовый уровень городской жизни в микрорайоне Алтын Орда.',
    stats: [
      { icon: `${IMG}/icon-key.svg`, text: 'Срок сдачи — август 2027 года' },
      { icon: `${IMG}/icon-building.svg`, text: '235 квартир · площади от 43 до 181 кв. м' },
    ],
  },
  standards: {
    label: 'White Hill',
    title: 'ЖК «White Hill» объединяет всё, что важно для комфортной жизни',
    text: 'White Hill объединяет авторский дизайн общественных пространств, инфраструктуру для семьи и закрытый двор с премиальными материалами.',
    cards: [
      { image: `${IMG}/standards-1.webp`, title: 'Современный архитектурный дизайн', tall: true },
      { image: `${IMG}/standards-2.webp`, title: 'Продуманная инфраструктура' },
      { image: `${IMG}/standards-3.webp`, title: 'Высокое качество строительства' },
    ],
  },
  location: {
    id: 'white-hill-location',
    label: 'Локация',
    title: 'Актобе, микрорайон Алтын Орда,\nулица Ораза Татеулы',
    // Кадры смещены `imagePosition`: плитки узкие и высокие, при центральной
    // обрезке вывески объектов уходят за край.
    cards: [
      { image: `${IMG}/location-nis.webp`, title: 'НИШ', icon: `${IMG}/icon-building.svg` },
      {
        image: `${IMG}/location-aqbobek.webp`,
        imagePosition: '58% center',
        title: 'Школа Aqbobek',
        icon: `${IMG}/icon-building.svg`,
      },
      {
        image: `${IMG}/location-ace.webp`,
        imagePosition: '40% center',
        title: 'ACE — теннисный корт',
        icon: `${IMG}/icon-building.svg`,
      },
      {
        image: `${IMG}/location-dostyq.webp`,
        imagePosition: '85% center',
        title: 'Бассейн «Достык»',
        icon: `${IMG}/icon-building.svg`,
      },
    ],
    notes: [
      'Микрорайон Алтын Орда — один из самых перспективных и быстроразвивающихся районов Актобе.',
      'В шаговой доступности школы, детские сады и всё необходимое для комфортной жизни семьи.',
    ],
  },
  architecture: {
    id: 'white-hill-architecture',
    label: 'Архитектура и материалы',
    title: 'Архитектура White Hill отражает индивидуальность и современное видение',
    image: `${IMG}/architecture.webp`,
    points: [
      'Монолитный каркас обеспечивает прочность и долговечность всего жилого здания.',
      'Фасад из алюминиевых композитных панелей с утеплением из минеральной ваты обеспечивает тепло- и шумоизоляцию, а также повышенную пожарную безопасность.',
      'Пятикамерные окна Rehau и IP-домофония подчёркивают премиальный характер комплекса.',
    ],
    ctaQuestion: 'Хотите лично оценить архитектуру White Hill?',
    ctaButton: 'Записаться на экскурсию',
  },
  yard: {
    labelKey: 'project.label.yard',
    label: 'Дворовое пространство',
    title: 'Двор без машин — закрытый двор с премиальными материалами. Тишина, безопасность и уютная атмосфера для всей семьи',
    image: `${IMG}/yard.webp`,
  },
  playground: {
    title: 'Современная игровая площадка',
    text: 'Двор — не просто пространство между домами, а гармоничная среда для отдыха, общения и прогулок всей семьёй. Мангальная зона, chill-зона и спортивные поля созданы с учётом безопасности и комфорта.',
    image: `${IMG}/zones.webp`,
    cta: 'Получить консультацию',
  },
  kids: {
    labelKey: 'project.label.kids',
    label: 'Особое внимание - детям',
    gallery: [
      { image: `${IMG}/kids-1.webp`, title: 'Kids Room\nдля жителей ЖК' },
      { image: `${IMG}/kids-2.webp`, title: 'Безопасные\nматериалы' },
      { image: `${IMG}/kids-3.webp`, title: 'Зона активных\nигр' },
      { image: `${IMG}/kids-4.webp` },
    ],
    roomLabel: 'Kids Room',
    roomTitle: 'Kids Room — крытая детская площадка для маленьких жителей ЖК',
    roomText: 'Даже в непогоду дети смогут играть, фантазировать и весело проводить время в тёплом и безопасном пространстве.',
  },
  hall: {
    labelKey: 'project.label.hall',
    label: 'Холлы',
    title: 'Холлы комплекса — сочетание элегантности и современного стиля',
    text1: 'Потолки в лобби и коммерческих помещениях — от 5,1 до 6,5 м. Оформление выполнено с вниманием к свету и пропорциям.',
    text2: 'Пространства подъездов и лифтовых зон выполнены в едином авторском стиле, создавая атмосферу премиального комфорта.',
    image: `${IMG}/hall-1.webp`,
    gallery: [
      { image: `${IMG}/hall-2.webp` },
      { image: `${IMG}/hall-3.webp` },
      { image: `${IMG}/lift.webp` },
      { image: `${IMG}/about.webp` },
    ],
    features: [
      'Авторские дизайнерские холлы',
      'Потолки лобби от 5,1 до 6,5 м',
      'Продуманные подъезды',
      'Современные лифтовые зоны',
    ],
  },
  apartments: {
    id: 'white-hill-apartments',
    label: 'Квартиры',
    title: 'Каждая квартира — пространство комфорта, функциональности и современного стиля',
    text: 'Высота потолков от 3,1 до 3,2 м, IP-домофония и пятикамерные окна Rehau создают ощущение лёгкости и максимально эффективное использование каждого метра.',
    image: `${IMG}/apartments.webp`,
    cta: 'Получить консультацию',
    features: [
      'Высота потолков от 3,1 до 3,2 м',
      'IP-домофония',
      'Пятикамерные окна Rehau',
      'Квартиры начинаются со второго этажа',
    ],
  },
  floorPlans: {
    id: 'white-hill-plans',
    label: 'Планировки',
    title: 'Планировки White Hill от 43 до 181 кв. м',
    text: 'Варианты квартир с просторными кухни-гостиные, мастер-спальнями и гардеробными. Подберите планировку и оставьте заявку на консультацию.',
    items: [
      {
        id: '2a',
        name: 'Планировка 2-A',
        rooms: '1 спальня',
        area: '74,17 м²',
        areaLiving: '42,80 м²',
        image: `${IMG}/plans-sheet.webp`,
        priceNote: 'от 550 000 ₸/м² при 100% оплате',
        meta: ['Блок 1', 'Подъезд 1', 'Этажи 2–7'],
      },
      {
        id: '3a',
        name: 'Планировка 3-A',
        rooms: '2 спальни',
        area: '129,86 м²',
        areaLiving: '77,62 м²',
        image: `${IMG}/plans-sheet.webp`,
        priceNote: 'от 550 000 ₸/м² при 100% оплате',
        meta: ['Блок 1', 'Подъезд 1', 'Этажи 2–7'],
      },
      {
        id: '5a',
        name: 'Планировка 5-A',
        rooms: '4 спальни',
        area: '178,19 м²',
        areaLiving: '108,97 м²',
        image: `${IMG}/plans-sheet.webp`,
        priceNote: 'от 550 000 ₸/м² при 100% оплате',
        meta: ['Блок 1', 'Подъезд 1', 'Этажи 2–7'],
      },
    ],
  },
  parking: {
    label: 'Паркинг',
    title: 'Паркинг White Hill — сочетание удобства, безопасности и продуманной организации',
    image: `${IMG}/parking.webp`,
    points: [
      'Надземный крытый паркинг защищён от внешних воздействий и доступен в любое время года.',
      'Въезд осуществляется по системе контроля доступа — исключено попадание посторонних.',
      'Прямой выход из паркинга в жилые этажи на лифте.',
    ],
    note: 'Просторные места, продуманная навигация и современное освещение делают использование паркинга максимально комфортным.',
  },
  consult: {
    title: 'Заполните контакты — мы зафиксируем для вас выгодную цену за м²',
    subtitle:
      'Менеджер отправит каталог, актуальные цены и условия рассрочки 0%.',
    address: 'Актобе, микрорайон Алтын Орда, улица Ораза Татеулы',
    instagram: 'bs_holding.aktobe',
    hours: HOURS,
    projectName: 'White Hill',
    city: 'Актобе',
  },
  footer: {
    cols: [
      { title: 'Проекты', items: ['Central Park', 'Avenue Park', 'MURA', 'Easton', 'White Hill', 'ORTA', 'BS Towers'] },
      { title: 'Компания', items: ['О Компании', 'Инвесторам', 'Карьера', 'Коммерческие помещения', 'BS Пайда'] },
      { title: 'Поддержка', items: ['Контакты'] },
      { title: 'Общее', items: [`График работы:\n${HOURS}`] },
    ],
    policy: 'Используя данный сайт вы соглашаетесь с нашей политикой обработки конфиденциальных данных.',
    copyright: 'ТОО TengizStroy, Все права на данном сайте защищены авторским правом.',
  },
};
