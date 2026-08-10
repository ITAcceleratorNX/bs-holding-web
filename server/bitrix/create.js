/**
 * Создание заявки в Bitrix24 с учётом города.
 *
 * Один вход для обработчика: сюда приходит нормализованная заявка, отсюда
 * возвращается номер созданного элемента. Куда именно он создан — решает
 * `routing.js` по городу выбранного ЖК.
 *
 * Для города с настроенной воронкой создаются контакт и сделка: воронка
 * («направление») в Bitrix24 есть только у сделок, а телефон — только у
 * контакта, поэтому нужны оба элемента. Для остальных городов создаётся лид,
 * как и раньше.
 */

import { logger } from '../logger.js';
import { addContact, addDeal, addLead, findContactIdByPhone } from './client.js';
import { buildContactFields, buildDealFields, buildLeadFields } from './mapper.js';
import { resolveDestination } from './routing.js';

/**
 * Существующий контакт по телефону или новый.
 *
 * Ни поиск, ни создание контакта не должны отменять заявку: телефон и имя
 * продублированы в комментарии сделки, поэтому менеджер в любом случае знает,
 * кому звонить. Поэтому ошибки здесь только пишутся в журнал.
 *
 * @param {import('../../src/lead/contract.js').NormalizedLead} lead
 * @param {import('../env.js').LeadConfig} config
 * @returns {Promise<number>} Идентификатор контакта или 0.
 */
async function ensureContact(lead, config) {
  try {
    const existing = await findContactIdByPhone(lead.phone, config);
    if (existing) return existing;
  } catch (error) {
    logger.warn('contact_lookup_failed', {
      submissionId: lead.submissionId,
      code: error?.code ?? 'UNEXPECTED',
      message: error?.message,
    });
  }

  try {
    return await addContact(buildContactFields(lead, config), config);
  } catch (error) {
    logger.warn('contact_create_failed', {
      submissionId: lead.submissionId,
      code: error?.code ?? 'UNEXPECTED',
      message: error?.message,
    });
    return 0;
  }
}

/**
 * @typedef {Object} CreatedEntity
 * @property {number} id Номер созданного лида или сделки.
 * @property {'lead'|'deal'} entity
 * @property {string} categoryId Воронка сделки. Для лида — пустая строка.
 * @property {number} contactId Привязанный контакт. Для лида — 0.
 */

/**
 * Создаёт заявку в CRM и возвращает описание созданного элемента.
 * @param {import('../../src/lead/contract.js').NormalizedLead} lead
 * @param {import('../env.js').LeadConfig} config
 * @param {Date} [submittedAt]
 * @returns {Promise<CreatedEntity>}
 */
export async function createFromLead(lead, config, submittedAt = new Date()) {
  const destination = resolveDestination(lead.city, config);

  if (destination.entity === 'lead') {
    const id = await addLead(buildLeadFields(lead, config, submittedAt), config);
    return { id, entity: 'lead', categoryId: '', contactId: 0 };
  }

  const contactId = await ensureContact(lead, config);
  const id = await addDeal(
    buildDealFields(lead, config, { categoryId: destination.categoryId, contactId }, submittedAt),
    config,
  );

  return { id, entity: 'deal', categoryId: destination.categoryId, contactId };
}
