import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { normalizeLead } from '../../src/lead/contract.js';
import { readConfig } from '../env.js';
import { buildLeadFields } from './mapper.js';

const WEBHOOK = 'https://bsholding.bitrix24.kz/rest/1/abc123token/';

/** @param {Record<string, string>} [extra] */
function config(extra = {}) {
  return readConfig({ BITRIX_WEBHOOK_URL: WEBHOOK, ...extra });
}

/** @param {Record<string, unknown>} [overrides] */
function lead(overrides = {}) {
  const { ok, lead: normalized } = normalizeLead({
    formCode: 'apartment_quiz',
    name: 'Айгерим',
    phone: '+77071234567',
    consent: true,
    submissionId: 'sub-1',
    project: 'Easton',
    city: 'Актау',
    ctaLocation: 'Квиз подбора квартиры',
    ...overrides,
  });
  assert.equal(ok, true, 'тестовая заявка должна быть корректной');
  return normalized;
}

describe('buildLeadFields — стандартные поля', () => {
  it('строит тему из ЖК и названия формы', () => {
    const fields = buildLeadFields(lead(), config());
    assert.equal(fields.TITLE, 'Сайт | Easton | Квиз по подбору квартиры');
  });

  it('передаёт телефон как мобильный и город', () => {
    const fields = buildLeadFields(lead(), config());
    assert.deepEqual(fields.PHONE, [{ VALUE: '+77071234567', VALUE_TYPE: 'MOBILE' }]);
    assert.equal(fields.ADDRESS_CITY, 'Актау');
    assert.equal(fields.NAME, 'Айгерим');
  });

  it('не доверяет теме, присланной браузером', () => {
    const fields = buildLeadFields(lead({ TITLE: 'Подменённая тема' }), config());
    assert.equal(fields.TITLE, 'Сайт | Easton | Квиз по подбору квартиры');
  });

  it('назначает ответственного, если он задан', () => {
    assert.equal(buildLeadFields(lead(), config()).ASSIGNED_BY_ID, undefined);
    assert.equal(buildLeadFields(lead(), config({ BITRIX_ASSIGNED_BY_ID: '17' })).ASSIGNED_BY_ID, '17');
  });
});

describe('buildLeadFields — рекламные метки', () => {
  const attribution = {
    first: { utm_source: 'google', utm_medium: 'cpc', gclid: 'G-1' },
    last: { utm_source: 'instagram', utm_medium: 'social' },
  };

  it('по умолчанию в стандартные поля уходит первый источник', () => {
    const fields = buildLeadFields(lead({ attribution }), config());
    assert.equal(fields.UTM_SOURCE, 'google');
    assert.equal(fields.UTM_MEDIUM, 'cpc');
  });

  it('приоритет можно переключить на последний источник', () => {
    const fields = buildLeadFields(lead({ attribution }), config({ BITRIX_UTM_PRIORITY: 'last' }));
    assert.equal(fields.UTM_SOURCE, 'instagram');
  });

  it('оба источника видны в комментарии', () => {
    const fields = buildLeadFields(lead({ attribution }), config());
    assert.match(fields.COMMENTS, /Первый источник: utm_source=google/);
    assert.match(fields.COMMENTS, /Последний источник: utm_source=instagram/);
  });
});

describe('buildLeadFields — комментарий', () => {
  it('содержит ответы квиза с подписями', () => {
    const fields = buildLeadFields(
      lead({
        details: [
          { key: 'quiz_rooms', label: 'Комнатность', value: '2 комнаты', group: 'quiz' },
          { key: 'quiz_payment', label: 'Способ оплаты', value: 'Рассрочка', group: 'quiz' },
        ],
      }),
      config(),
    );
    assert.match(fields.COMMENTS, /Комнатность: 2 комнаты/);
    assert.match(fields.COMMENTS, /Способ оплаты: Рассрочка/);
  });

  it('фиксирует факт согласия и идентификатор отправки', () => {
    const fields = buildLeadFields(lead(), config());
    assert.match(fields.COMMENTS, /Согласие на обработку ПДн: получено/);
    assert.match(fields.COMMENTS, /ID отправки: sub-1/);
  });

  it('экранирует HTML: комментарий отображается в карточке как разметка', () => {
    const fields = buildLeadFields(
      lead({
        project: 'Easton <img src=x onerror=alert(1)>',
        details: [{ key: 'quiz_rooms', label: 'Комнатность', value: '<script>alert(1)</script>', group: 'quiz' }],
      }),
      config(),
    );
    assert.doesNotMatch(fields.COMMENTS, /<img|<script/);
    assert.match(fields.COMMENTS, /&lt;img/);
    assert.match(fields.COMMENTS, /&lt;script&gt;/);
  });
});

describe('buildLeadFields — пользовательские поля', () => {
  it('не отправляет UF-поля, пока они не настроены', () => {
    const fields = buildLeadFields(lead(), config());
    assert.ok(!Object.keys(fields).some((k) => k.startsWith('UF_CRM_')));
  });

  it('заполняет настроенные слоты', () => {
    const fields = buildLeadFields(
      lead(),
      config({ BITRIX_UF_FORM_CODE: 'UF_CRM_1712345678', BITRIX_UF_PROJECT: 'UF_CRM_1712345679' }),
    );
    assert.equal(fields.UF_CRM_1712345678, 'apartment_quiz');
    assert.equal(fields.UF_CRM_1712345679, 'Easton');
  });

  it('заполняет поле под отдельное значение формы', () => {
    const fields = buildLeadFields(
      lead({ details: [{ key: 'quiz_rooms', label: 'Комнатность', value: '2 комнаты', group: 'quiz' }] }),
      config({ BITRIX_UF_DETAIL_QUIZ_ROOMS: 'UF_CRM_1712345680' }),
    );
    assert.equal(fields.UF_CRM_1712345680, '2 комнаты');
  });

  it('игнорирует опечатку в коде поля вместо отправки мусора в CRM', () => {
    const fields = buildLeadFields(lead(), config({ BITRIX_UF_PROJECT: 'не-код-поля' }));
    assert.ok(!Object.values(fields).includes('не-код-поля'));
  });
});

describe('readConfig', () => {
  it('требует вебхук', () => {
    assert.throws(() => readConfig({}), /BITRIX_WEBHOOK_URL не задан/);
  });

  it('отклоняет вебхук неверного формата и не показывает его значение', () => {
    assert.throws(
      () => readConfig({ BITRIX_WEBHOOK_URL: 'https://example.com/hook/secret-token' }),
      (error) => /неверный формат/.test(error.message) && !error.message.includes('secret-token'),
    );
  });
});
