/**
 * ЖК, участвующие в программе Auto Trade-in.
 *
 * Порядок и состав — из макета поп-апа. Картинки берём те же, что у карточек
 * каталога: это реальные рендеры комплексов, и они уже в webp.
 *
 * @typedef {Object} AutoTradeInProject
 * @property {string} slug   ключ страницы ЖК в `PROJECT_PAGES`
 * @property {string} name
 * @property {string} image
 *
 * @type {AutoTradeInProject[]}
 */
export const AUTO_TRADE_IN_PROJECTS = [
  { slug: 'avenue-park', name: 'Avenue Park', image: '/images/project-avenue-park.webp' },
  { slug: 'orta', name: 'ORTA', image: '/images/project-orta.webp' },
  { slug: 'bs-towers', name: 'BS Towers', image: '/images/project-bs-towers.webp' },
];
