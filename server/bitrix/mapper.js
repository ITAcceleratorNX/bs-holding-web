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
 * @returns {Map<string, [string, string][]>}
 */
function collectGroups(lead, submittedAt) {
  /** @type {Map<string, [string, string][]>} */
  const groups = new Map();
  /** @param {string} group @param {string} label @param {string} value */
  const add = (group, label, value) => {
    if (!value) return;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push([label, value]);
  };

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
 * Читаемый блок для карточки лида.
 * @param {import('../../src/lead/contract.js').NormalizedLead} lead
 * @param {Date} submittedAt
 * @returns {string}
 */
export function buildComments(lead, submittedAt) {
  const groups = collectGroups(lead, submittedAt);
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
    // Расположение CTA добавляем, только если оно не повторяет название формы.
    SOURCE_DESCRIPTION: [lead.formTitle, lead.ctaLocation === lead.formTitle ? '' : lead.ctaLocation]
      .filter(Boolean)
      .join(' · '),
    ADDRESS_CITY: lead.city,
    COMMENTS: buildComments(lead, submittedAt),
    OPENED: 'Y',
    ...utmFields(lead, config),
  };

  if (config.assignedById) fields.ASSIGNED_BY_ID = config.assignedById;

  // Пользовательские поля верхнего уровня — только настроенные (ТЗ 9).
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

  return fields;
}
