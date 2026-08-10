import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { readConfig } from '../env.js';
import { cityKey, resolveDestination } from './routing.js';

const WEBHOOK = 'https://bsholding.bitrix24.kz/rest/1/abc123token/';

/** @param {Record<string, string>} [overrides] */
function config(overrides = {}) {
  return readConfig({ BITRIX_WEBHOOK_URL: WEBHOOK, ...overrides });
}

const THREE_CITIES = {
  BITRIX_FUNNEL_AKTAU: '1',
  BITRIX_FUNNEL_AKTOBE: '2',
  BITRIX_FUNNEL_UST_KAMENOGORSK: '3',
};

describe('воронки городов — чтение настроек', () => {
  it('читает воронку каждого города', () => {
    const c = config(THREE_CITIES);

    assert.equal(c.cityFunnels[cityKey('Актау')], '1');
    assert.equal(c.cityFunnels[cityKey('Актобе')], '2');
    assert.equal(c.cityFunnels[cityKey('Усть-Каменогорск')], '3');
  });

  it('принимает сокращение УКГ для Усть-Каменогорска', () => {
    const c = config({ BITRIX_FUNNEL_UKG: '7' });
    assert.equal(c.cityFunnels[cityKey('Усть-Каменогорск')], '7');
  });

  it('пропускает воронку 0 — это общая воронка портала', () => {
    const c = config({ BITRIX_FUNNEL_AKTAU: '0' });
    assert.equal(c.cityFunnels[cityKey('Актау')], '0');
  });

  it('игнорирует значение, которое не является номером воронки', () => {
    const c = config({ BITRIX_FUNNEL_AKTAU: 'Актау' });
    assert.equal(c.cityFunnels[cityKey('Актау')], undefined);
  });

  it('без переменных воронок не настроено ни одной', () => {
    assert.deepEqual(config().cityFunnels, {});
    assert.equal(config().defaultFunnel, '');
  });
});

describe('воронки городов — выбор назначения', () => {
  it('отправляет заявку в воронку своего города', () => {
    const c = config(THREE_CITIES);

    assert.deepEqual(resolveDestination('Актау', c), { entity: 'deal', categoryId: '1' });
    assert.deepEqual(resolveDestination('Актобе', c), { entity: 'deal', categoryId: '2' });
    assert.deepEqual(resolveDestination('Усть-Каменогорск', c), { entity: 'deal', categoryId: '3' });
  });

  it('не зависит от регистра, пробелов и «ё»', () => {
    const c = config(THREE_CITIES);

    assert.equal(resolveDestination('  актау ', c).categoryId, '1');
    assert.equal(resolveDestination('УСТЬ-КАМЕНОГОРСК', c).categoryId, '3');
  });

  it('город без своей воронки уходит в воронку по умолчанию', () => {
    const c = config({ BITRIX_FUNNEL_AKTAU: '1', BITRIX_FUNNEL_DEFAULT: '9' });
    assert.deepEqual(resolveDestination('Астана', c), { entity: 'deal', categoryId: '9' });
  });

  it('без настроек создаёт лид — как до подключения воронок', () => {
    assert.deepEqual(resolveDestination('Актау', config()), { entity: 'lead', categoryId: '' });
  });

  it('город, для которого воронку ещё не включили, создаёт лид', () => {
    const c = config({ BITRIX_FUNNEL_AKTAU: '1' });
    assert.equal(resolveDestination('Актобе', c).entity, 'lead');
  });
});
