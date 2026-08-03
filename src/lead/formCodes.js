/**
 * Реестр форм сайта (ТЗ 3).
 *
 * Код формы — стабильный идентификатор: он уходит в Bitrix24 и в аналитику,
 * поэтому менять коды после запуска нельзя. `title` попадает в название лида
 * («Сайт | Easton | Квиз по подбору квартиры»), его править безопасно.
 *
 * Чтобы добавить форму, достаточно дописать запись сюда: сервер принимает
 * только коды из этого реестра, всё остальное отклоняется как невалидное.
 */

/**
 * @typedef {Object} FormMeta
 * @property {string} title Название формы для темы лида и карточки в CRM.
 * @property {'general'|'project'} scope Общая форма сайта или форма страницы ЖК.
 * @property {boolean} [requiresName] Форма спрашивает имя. По умолчанию да.
 * @property {boolean} [whatsapp] После создания лида открывается WhatsApp (ТЗ 7).
 * @property {string} [whatsappMessage] Фиксированный текст первого сообщения вместо сгенерированного.
 */

/** @type {Record<string, FormMeta>} */
export const FORM_CODES = {
  callback_header: { title: 'Заказать звонок', scope: 'general' },
  // Формы на сайте больше нет — номера показаны сразу. Код оставлен: он уже
  // стоит в лидах Bitrix24, а `requiresName: false` описывает контракт для форм
  // без имени.
  sales_phone_reveal: { title: 'Получить номер отдела продаж', scope: 'general', requiresName: false },
  main_consultation: { title: 'Общая консультация', scope: 'general' },
  calculator_mortgage: { title: 'Калькулятор — ипотека', scope: 'general' },
  calculator_installment: { title: 'Калькулятор — рассрочка', scope: 'general' },
  zhk_hero_application: { title: 'Заявка с первого экрана', scope: 'project' },
  zhk_calculation: { title: 'Получить расчёт', scope: 'project' },
  tour_booking: { title: 'Запись на экскурсию', scope: 'project' },
  layout_application: { title: 'Заявка по планировке', scope: 'project' },
  apartment_quiz: { title: 'Квиз по подбору квартиры', scope: 'project' },
  catalog_download: { title: 'Получение каталога', scope: 'project', whatsapp: true },
  presentation_download: { title: 'Получение презентации', scope: 'project', whatsapp: true },
  zhk_consultation: { title: 'Консультация по ЖК', scope: 'project' },
  zhk_final_consultation: { title: 'Консультация — нижняя форма', scope: 'project' },
  easton_quiz_landing_presentation: {
    title: 'Квиз-лендинг Easton — презентация',
    scope: 'project',
    whatsapp: true,
    whatsappMessage: 'Здравствуйте! Хочу получить презентацию ЖК Easton.',
  },
  promotion_offer: { title: 'Акции и предложения', scope: 'general' },
};

/**
 * @param {string} code
 * @returns {FormMeta|null}
 */
export function getFormMeta(code) {
  return Object.hasOwn(FORM_CODES, code) ? FORM_CODES[code] : null;
}

/**
 * Тема лида: «Сайт | {ЖК или Общая заявка} | {Название формы}» (ТЗ 2).
 * Название строит только сервер — клиент его не передаёт, иначе тему в CRM
 * можно было бы подменить произвольным текстом.
 * @param {{ formCode: string, project?: string|null }} lead
 * @returns {string}
 */
export function buildLeadTitle({ formCode, project }) {
  const meta = getFormMeta(formCode);
  const subject = String(project ?? '').trim() || 'Общая заявка';
  return `Сайт | ${subject} | ${meta?.title ?? formCode}`;
}
