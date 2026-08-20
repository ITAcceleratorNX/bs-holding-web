/**
 * Визуальные слоты страницы ЖК Avenue Park — единая таблица для трёх мест:
 *
 *  - `prepare-avenue-park-images.mjs` — раскладывает выгрузку по слотам;
 *  - `avenue-park-placeholders.mjs`   — рисует подписанные заглушки;
 *  - docs/avenue-park-media.md        — таблица для человека.
 *
 * `fit` определяет, что скрипт делает с кадром:
 *
 *  - `cover` — слот держит фиксированную пропорцию (задана в CSS через
 *    `aspect-ratio`), кадр обрезается до неё по центру. Пропорция слота
 *    постоянна на любой ширине экрана, поэтому кадр, выгруженный в ней,
 *    дальше не режется вообще;
 *  - `free` — слот подстраивает высоту под пропорцию файла (`height: auto` в
 *    CSS). Обрезки нет никогда, пропорция исходника любая; `w`/`h` здесь
 *    только предел по ширине и пропорция заглушки;
 *  - `pad` — кадр целиком вписывается в слот и дополняется фоном. Нужен там,
 *    где материал предметный (замок Xiaomi), а слот широкий: обрезать такой
 *    кадр нельзя, а растянуть — нечем.
 *
 * `w`/`h` — размер выгрузки в пикселях. Апскейл скрипт не делает: если
 * исходник меньше, останется родное разрешение в пропорции слота.
 */

/** Пропорции слотов должны совпадать с `.project-avenue-park` в src/index.css. */
export const SLOTS = [
  {
    name: 'hero',
    block: 'Первый экран',
    w: 2560,
    h: 1440,
    fit: 'cover',
    source: 'Внешние рендеры',
    title: 'Общий вид комплекса, широкий ракурс',
    note: 'Самый сильный кадр: читается весь ЖК целиком.',
  },
  {
    name: 'hero-mobile',
    block: 'Первый экран (≤900px)',
    w: 1200,
    h: 2000,
    fit: 'cover',
    source: 'Внешние рендеры',
    title: 'Тот же ракурс, вертикальный кадр',
    note: 'Если отдельного вертикального кадра нет — скрипт возьмёт hero и обрежет по центру.',
    fallbackFrom: 'hero',
  },
  {
    name: 'about',
    block: 'О жилом комплексе',
    w: 2400,
    h: 1350,
    fit: 'free',
    source: 'Общая папка render',
    title: 'Комплекс целиком, другой ракурс, не как в hero',
  },
  {
    name: 'feature-autonomy',
    block: 'Главные преимущества · большая плитка',
    w: 1200,
    h: 1600,
    fit: 'cover',
    source: 'Внешние рендеры',
    title: 'Вертикальный рендер комплекса (вечерний, со светом в окнах)',
    note: 'Плитка под текстом про инженерную автономность.',
  },
  {
    name: 'feature-security',
    block: 'Главные преимущества · плитка 2',
    w: 1200,
    h: 1600,
    fit: 'cover',
    source: 'MOP Avenue',
    title: 'Входная группа с домофоном',
    note: 'Кадр не должен повторять mop-entrance.',
  },
  {
    name: 'feature-engineering',
    block: 'Главные преимущества · плитка 3',
    w: 1200,
    h: 1600,
    fit: 'cover',
    source: 'MOP Avenue',
    title: 'Лифтовой холл / лифты',
    note: 'Кадр не должен повторять mop-lift.',
  },
  {
    name: 'location-map',
    block: 'Локация · схема',
    w: 2400,
    h: 1200,
    fit: 'free',
    source: 'Общая папка render',
    title: 'Схема расположения в 40-м микрорайоне',
  },
  {
    name: 'place-park',
    block: 'Локация · объект рядом 1',
    w: 980,
    h: 1400,
    fit: 'cover',
    source: 'Photos / локация',
    title: 'Парк Первого Президента',
  },
  {
    name: 'place-museum',
    block: 'Локация · объект рядом 2',
    w: 980,
    h: 1400,
    fit: 'cover',
    source: 'Референс музея им. А. Кекілбаева',
    title: 'Музей им. Абиша Кекілбаева',
  },
  {
    name: 'place-arena',
    block: 'Локация · объект рядом 3',
    w: 980,
    h: 1400,
    fit: 'cover',
    source: 'Референс BS Arena',
    title: 'Спорткомплекс BS Arena',
  },
  {
    name: 'architecture',
    block: 'Архитектура · основной кадр',
    w: 2400,
    h: 1350,
    fit: 'free',
    source: 'Внешние рендеры',
    title: 'Фасад крупно: материалы и архитектура',
  },
  {
    name: 'architecture-2',
    block: 'Архитектура · фото 1',
    w: 1600,
    h: 900,
    fit: 'cover',
    source: 'Avenue Park photos',
    title: 'Реальная фотография фасада',
  },
  {
    name: 'architecture-3',
    block: 'Архитектура · фото 2',
    w: 1600,
    h: 900,
    fit: 'cover',
    source: 'Avenue Park photos',
    title: 'Реальная фотография фасада, другой ракурс',
  },
  {
    name: 'smart-lock',
    block: 'Умный замок Xiaomi',
    w: 2400,
    h: 1350,
    fit: 'pad',
    align: 'right',
    source: 'Xiaomi / Magic Pro',
    title: 'Замок Xiaomi MI Magic Vein',
    note: 'Слот широкий, кадр предметный — скрипт вписывает его справа, текст блока идёт слева.',
  },
  {
    name: 'smart-lock-mobile',
    block: 'Умный замок Xiaomi (≤900px)',
    w: 1000,
    h: 1250,
    fit: 'pad',
    align: 'top',
    source: 'Xiaomi / Magic Pro',
    title: 'Тот же замок, вертикальный слот',
    note: 'На мобильном текст уходит вниз, кадр — вверх.',
    fallbackFrom: 'smart-lock',
  },
  {
    name: 'yard',
    block: 'Двор · основной кадр',
    w: 1600,
    h: 1200,
    fit: 'cover',
    source: 'Дворовые ракурсы',
    title: 'Общий вид двора: озеленение и прогулочные пространства',
  },
  {
    name: 'yard-playground',
    block: 'Двор и благоустройство · плитка 1',
    w: 1500,
    h: 1000,
    fit: 'cover',
    source: 'Дворовые ракурсы / Photos',
    title: 'Детская игровая площадка и оборудование',
  },
  {
    name: 'yard-sport',
    block: 'Двор и благоустройство · плитка 2',
    w: 1500,
    h: 1000,
    fit: 'cover',
    source: 'Дворовые ракурсы / Photos',
    title: 'Спортивная зона: workout, игровые покрытия',
  },
  {
    name: 'yard-lounge',
    block: 'Двор и благоустройство · плитка 3',
    w: 1500,
    h: 1000,
    fit: 'cover',
    source: 'Дворовые ракурсы / Photos',
    title: 'Зона отдыха: лавочки, перголы, озеленение',
  },
  {
    name: 'kids-room',
    block: 'Kids Room',
    w: 2000,
    h: 1125,
    fit: 'free',
    source: 'Общая папка render / Photos',
    title: 'Интерьер детской комнаты Kids Room',
  },
  {
    name: 'yurt',
    block: 'Юрта и зона казана',
    w: 1080,
    h: 1440,
    fit: 'free',
    source: 'Дворовые ракурсы / Photos',
    title: 'Юрта и зона казана',
    note: 'Кадр стоит рядом с текстом в колонке 460px — вертикальный смотрится лучше горизонтального.',
  },
  {
    name: 'mop-entrance',
    block: 'Общественные пространства · МОП 1',
    w: 1200,
    h: 1600,
    fit: 'cover',
    source: 'MOP Avenue',
    title: 'Входная группа',
  },
  {
    name: 'mop-hall',
    block: 'Общественные пространства · МОП 2',
    w: 1200,
    h: 1600,
    fit: 'cover',
    source: 'MOP Avenue',
    title: 'Холл первого этажа',
  },
  {
    name: 'mop-lift',
    block: 'Общественные пространства · МОП 3',
    w: 1200,
    h: 1600,
    fit: 'cover',
    source: 'MOP Avenue',
    title: 'Лифтовой холл',
  },
  {
    name: 'apartments',
    block: 'Квартиры',
    w: 2400,
    h: 1350,
    fit: 'free',
    source: 'Общая папка render / Photos',
    title: 'Интерьер квартиры: потолки, французский балкон',
  },
  {
    name: 'boxroom',
    block: 'Boxroom',
    w: 1500,
    h: 1000,
    fit: 'cover',
    source: 'Общая папка render / Photos',
    title: 'Кладовая Boxroom',
  },
  {
    name: 'business',
    block: 'Бизнес-пространства',
    w: 1500,
    h: 1000,
    fit: 'cover',
    source: 'Общая папка render / Photos',
    title: 'Коммерческое / бизнес-пространство',
  },
];

/** Пропорция слота строкой — «16:9», «4:3». Для таблицы в документации. */
export function ratioLabel(slot) {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const g = gcd(slot.w, slot.h);
  const a = slot.w / g;
  const b = slot.h / g;
  // 1200/1390 сокращается в 120:139 — читать нечего, показываем десятичную.
  if (a > 40 || b > 40) return `${(slot.w / slot.h).toFixed(2).replace('.', ',')}:1`;
  return `${a}:${b}`;
}

/** Фон подписанных заглушек. Один и тот же у всех, менять только вместе с
 *  `BG` в avenue-park-placeholders.mjs. */
export const PLACEHOLDER_BG = [0x22, 0x40, 0x3c];

/**
 * Отличает заглушку от настоящего материала по цвету верхней кромки кадра.
 *
 * Метку в метаданных webp libwebp не пишет, а по «плотности» файла ошибиться
 * легко: собранный кадр замка Xiaomi — это тоже почти плоская заливка, и он
 * попадал в заглушки. Зато у заглушки вся верхняя кромка залита ровно фоновым
 * цветом, а у рендера или фотографии там небо, потолок или стена: три пробы
 * поперёк кромки совпадают с фоном только у заглушки.
 */
export function isPlaceholderPixels(rgb) {
  if (!rgb || rgb.length < 9) return false;
  for (let i = 0; i < 9; i++) {
    // Допуск на потери webp: цвет сдвигается на единицы, но не на десятки.
    if (Math.abs(rgb[i] - PLACEHOLDER_BG[i % 3]) > 6) return false;
  }
  return true;
}

/** Фильтр ffmpeg, который отдаёт эти три пробы: 9 байт RGB. */
export const PLACEHOLDER_PROBE = 'crop=iw:ih*0.02:0:ih*0.005,scale=3:1,format=rgb24';
