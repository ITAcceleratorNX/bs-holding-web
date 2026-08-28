/** YouTube-ролики ЖК: один источник для главной и страниц проектов. */
export const PROJECT_VIDEOS = {
  'bs-towers': {
    slug: 'bs-towers',
    name: 'BS Towers',
    city: 'Актау',
    youtubeId: 'v8ODgGaX0VA',
  },
  orta: {
    slug: 'orta',
    name: 'ORTA',
    city: 'Актау',
    youtubeId: 'ZHekWUCxwug',
  },
  'avenue-park': {
    slug: 'avenue-park',
    name: 'Avenue Park',
    city: 'Актау',
    youtubeId: 'l4sWvrZzg_8',
  },
};

export const HOME_PROJECT_VIDEOS = [
  PROJECT_VIDEOS['bs-towers'],
  PROJECT_VIDEOS.orta,
  PROJECT_VIDEOS['avenue-park'],
];

/** Ссылка на ролик в YouTube — для кнопки «Смотреть на YouTube». */
export function youtubeWatchUrl(id) {
  return `https://www.youtube.com/watch?v=${id}`;
}
