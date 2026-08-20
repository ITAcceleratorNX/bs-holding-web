/** Якорные секции главной страницы (не отдельные роуты). */
export const HOME_SECTIONS = new Set(['catalog', 'contacts', 'paida', 'top']);

export function homeSectionHref(section) {
  return `#/${section}`;
}
