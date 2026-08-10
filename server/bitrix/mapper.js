/**
 * Сборка полей лида для `crm.lead.add` (ТЗ 4, 5).
 *
 * Правило простое: сначала стандартные поля Bitrix24, затем настроенные
 * пользовательские, и в любом случае — структурированный комментарий, куда
 * попадает всё до единого значения. Благодаря комментарию карточка лида
 * читается сразу после подключения вебхука, ещё до создания UF-полей.
 */

import { buildLeadTitle } from '../../src/lead/formCodes.js';
import { UTM_KEYS } from '../../src/lead/contract.js';
import { GROUP_LABELS, GROUP_ORDER, UF_SLOTS, fieldForDetail, fieldForSlot, formatTouch } from './fields.js';

/**
 * Комментарий лида Bitrix24 отображается как HTML. Всё, что пришло из формы,
 * экранируется — иначе имя вида `<img onerror=...>` выполнилось бы в браузере
 * менеджера, открывшего карточку.
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Дата и время в часовом поясе Казахстана — карточку читает менеджер,
 * а не сервер в UTC.
 * @param {Date} date
 * @returns {string}
 */
function formatMoment(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Almaty',
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date);
}

/**
 * Собирает строки комментария по группам (ТЗ 4).
 * @param {import('../../src/lead/contract.js').NormalizedLead} lead
 * @param {Date} submittedAt
 * @param {{ withContact?: boolean }} [options]
 * @returns {Map<string, [string, string][]>}
 */
function collectGroups(lead, submittedAt, options = {}) {
  /** @type {Map<string, [string, string][]>} */
  const groups = new Map();
  /** @param {string} group @param {string} label @param {string} value */
  const add = (group, label, value) => {
    if (!value) return;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push([label, value]);
  };

  // У сделки нет собственных полей имени и телефона — они живут в привязанном
  // контакте. Дублируем их в комментарий, чтобы менеджер видел, кому звонить,
  // даже если контакт по какой-то причине не создался.
  if (options.withContact) {
    add('context', 'Имя', lead.name);
    add('context', 'Телефон', lead.phone);
  }

  add('context', 'Форма', `${lead.formTitle} (${lead.formCode})`);
  add('context', 'Город', lead.city);
  add('context', 'ЖК', lead.project);
  add('context', 'Расположение CTA', lead.ctaLocation);

  // Данные квиза, планировки и калькулятора уже размечены группами на клиенте.
  for (const detail of lead.details) {
    add(detail.group, detail.label, detail.value);
  }

  add('page', 'URL страницы', lead.page.url);
  add('page', 'Название страницы', lead.page.title);
  add('page', 'Язык сайта', lead.page.lang);

  add('ad', 'Первый источник', formatTouch(lead.attribution.first));
  add('ad', 'Первый вход', lead.attribution.first.landing);
  add('ad', 'Referrer первого входа', lead.attribution.first.referrer);
  add('ad', 'Последний источник', formatTouch(lead.attribution.last));
  add('ad', 'Referrer последнего входа', lead.attribution.last.referrer);

  add('tech', 'Дата и время заявки', formatMoment(submittedAt));
  add('tech', 'ID отправки', lead.submissionId);
  add(
    'tech',
    'Согласие на обработку ПДн',
    lead.consent ? `получено, ${formatMoment(submittedAt)}` : '',
  );

  return groups;
}

/**
 * Читаемый блок для карточки лида или сделки.
 * @param {import('../../src/lead/contract.js').NormalizedLead} lead
 * @param {Date} submittedAt
 * @param {{ withContact?: boolean }} [options]
 * @returns {string}
 */
export function buildComments(lead, submittedAt, options = {}) {
  const groups = collectGroups(lead, submittedAt, options);
  const lines = ['<b>Заявка с сайта BS Holding</b>'];

  for (const group of GROUP_ORDER) {
    const rows = groups.get(group);
    if (!rows?.length) continue;
    lines.push('', `<b>${escapeHtml(GROUP_LABELS[group] ?? group)}</b>`);
    for (const [label, value] of rows) {
      lines.push(`${escapeHtml(label)}: ${escapeHtml(value)}`);
    }
  }

  return lines.join('<br>');
}

/**
 * Рекламные метки для стандартных полей Bitrix24.
 *
 * Какой источник считать основным, решает `BITRIX_UTM_PRIORITY`: по умолчанию
 * первый — именно он сохраняется при первом входе и живёт 30 дней (ТЗ 5).
 * Второй источник при этом не теряется: он всегда есть в комментарии и может
 * уйти в отдельное пользовательское поле.
 * @param {import('../../src/lead/contract.js').NormalizedLead} lead
 * @param {import('../env.js').LeadConfig} config
 * @returns {Record<string, string>}
 */
function utmFields(lead, config) {
  const primary = config.utmPriority === 'last' ? lead.attribution.last : lead.attribution.first;
  const fallback = config.utmPriority === 'last' ? lead.attribution.first : lead.attribution.last;

  /** @type {Record<string, string>} */
  const fields = {};
  for (const key of UTM_KEYS) {
    const value = primary[key] || fallback[key];
    if (value) fields[key.toUpperCase()] = value;
  }
  return fields;
}

/**
 * Описание источника: название формы и, если оно его не повторяет,
 * расположение кнопки.
 * @param {import('../../src/lead/contract.js').NormalizedLead} lead
 * @returns {string}
 */
function sourceDescription(lead) {
  return [lead.formTitle, lead.ctaLocation === lead.formTitle ? '' : lead.ctaLocation]
    .filter(Boolean)
    .join(' · ');
}

/**
 * Дописывает настроенные пользовательские поля (ТЗ 9).
 *
 * Коды полей задаются переменными окружения и относятся к той сущности,
 * которую создаёт сайт: подключили воронки — поля нужно завести у сделок,
 * иначе портал их проигнорирует. В комментарий значения попадают всегда.
 * @param {Record<string, unknown>} fields
 * @param {import('../../src/lead/contract.js').NormalizedLead} lead
 * @param {import('../env.js').LeadConfig} config
 */
function applyUserFields(fields, lead, config) {
  for (const { slot, value } of UF_SLOTS) {
    const field = fieldForSlot(slot, config.userFields);
    if (!field) continue;
    const text = value(lead);
    if (text) fields[field] = text;
  }

  // Отдельные значения квиза, планировки и расчёта — если под них завели поля.
  for (const detail of lead.details) {
    const field = fieldForDetail(detail.key, config.userFields);
    if (field) fields[field] = detail.value;
  }
}

/**
 * Поля лида для `crm.lead.add`.
 * @param {import('../../src/lead/contract.js').NormalizedLead} lead
 * @param {import('../env.js').LeadConfig} config
 * @param {Date} [submittedAt]
 * @returns {Record<string, unknown>}
 */
export function buildLeadFields(lead, config, submittedAt = new Date()) {
  /** @type {Record<string, unknown>} */
  const fields = {
    // Тему строит сервер, а не браузер: иначе её можно было бы подменить (ТЗ 2).
    TITLE: buildLeadTitle({ formCode: lead.formCode, project: lead.project }),
    NAME: lead.name,
    PHONE: [{ VALUE: lead.phone, VALUE_TYPE: 'MOBILE' }],
    SOURCE_ID: config.sourceId,
    SOURCE_DESCRIPTION: sourceDescription(lead),
    ADDRESS_CITY: lead.city,
    COMMENTS: buildComments(lead, submittedAt),
    OPENED: 'Y',
    ...utmFields(lead, config),
  };

  if (config.assignedById) fields.ASSIGNED_BY_ID = config.assignedById;
  applyUserFields(fields, lead, config);

  return fields;
}

/**
 * Поля сделки для `crm.deal.add` — заявка города, у которого настроена воронка.
 *
 * Стадию не задаём: Bitrix24 сам ставит первую стадию указанной воронки, и
 * заявка появляется в её начале. `CATEGORY_ID` — это и есть «воронка»
 * (Актау, Актобе, Усть-Каменогорск).
 *
 * @param {import('../../src/lead/contract.js').NormalizedLead} lead
 * @param {import('../env.js').LeadConfig} config
 * @param {{ categoryId: string, contactId?: number }} destination
 * @param {Date} [submittedAt]
 * @returns {Record<string, unknown>}
 */
export function buildDealFields(lead, config, destination, submittedAt = new Date()) {
  /** @type {Record<string, unknown>} */
  const fields = {
    TITLE: buildLeadTitle({ formCode: lead.formCode, project: lead.project }),
    CATEGORY_ID: destination.categoryId,
    SOURCE_ID: config.sourceId,
    SOURCE_DESCRIPTION: sourceDescription(lead),
    COMMENTS: buildComments(lead, submittedAt, { withContact: true }),
    OPENED: 'Y',
    ...utmFields(lead, config),
  };

  if (destination.contactId) fields.CONTACT_ID = destination.contactId;
  if (config.assignedById) fields.ASSIGNED_BY_ID = config.assignedById;
  applyUserFields(fields, lead, config);

  return fields;
}

/**
 * Поля контакта для `crm.contact.add`.
 *
 * Сделка сама по себе телефон не хранит — звонить менеджер будет по контакту,
 * поэтому он создаётся вместе с ней. Часть форм имени не спрашивает: без него
 * в CRM попадёт понятная подпись вместо пустой строки.
 *
 * @param {import('../../src/lead/contract.js').NormalizedLead} lead
 * @param {import('../env.js').LeadConfig} config
 * @returns {Record<string, unknown>}
 */
export function buildContactFields(lead, config) {
  /** @type {Record<string, unknown>} */
  const fields = {
    NAME: lead.name || 'Клиент с сайта',
    PHONE: [{ VALUE: lead.phone, VALUE_TYPE: 'MOBILE' }],
    SOURCE_ID: config.sourceId,
    SOURCE_DESCRIPTION: sourceDescription(lead),
    TYPE_ID: 'CLIENT',
    OPENED: 'Y',
  };

  if (config.assignedById) fields.ASSIGNED_BY_ID = config.assignedById;

  return fields;
}
