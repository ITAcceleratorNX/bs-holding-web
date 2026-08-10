import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';

import { resetDedupe } from './dedupe.js';
import { resetConfig } from './env.js';
import { handleLeadRequest } from './lead-handler.js';
import { resetRateLimit } from './rate-limit.js';

const WEBHOOK = 'https://bsholding.bitrix24.kz/rest/1/abc123token/';

/** Ответы портала для подстановки вместо сети. */
const bitrixOk = (id = 4242) =>
  new Response(JSON.stringify({ result: id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
const bitrixError = (error = 'ACCESS_DENIED') =>
  new Response(JSON.stringify({ error, error_description: 'нет доступа' }), { status: 400 });

/** @param {Record<string, unknown>} [overrides] */
function body(overrides = {}) {
  return {
    formCode: 'callback_header',
    name: 'Айгерим',
    phone: '+7 (707) 123-45-67',
    consent: true,
    submissionId: `sub-${Math.random().toString(36).slice(2)}`,
    city: 'Актау',
    ...overrides,
  };
}

/** @param {Record<string, unknown>} [payload] @param {Record<string, string>} [headers] */
function post(payload = body(), headers = {}) {
  return handleLeadRequest({
    method: 'POST',
    headers: { host: 'bs.kz', ...headers },
    body: payload,
  });
}

let originalFetch;

beforeEach(() => {
  originalFetch = globalThis.fetch;
  process.env.BITRIX_WEBHOOK_URL = WEBHOOK;
  process.env.LEAD_RATE_LIMIT = '100/60';
  delete process.env.LEAD_ALLOWED_ORIGINS;
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('BITRIX_FUNNEL_')) delete process.env[key];
  }
  resetConfig();
  resetDedupe();
  resetRateLimit();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('handleLeadRequest — успешная заявка', () => {
  it('создаёт лид и возвращает его номер', async () => {
    globalThis.fetch = mock.fn(async () => bitrixOk(4242));

    const res = await post();

    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.leadId, 4242);
  });

  it('обращается именно к методу crm.lead.add вебхука', async () => {
    const fetchMock = mock.fn(async () => bitrixOk());
    globalThis.fetch = fetchMock;

    await post();

    assert.equal(fetchMock.mock.calls[0].arguments[0], `${WEBHOOK}crm.lead.add.json`);
  });
});

describe('handleLeadRequest — проверки до обращения к CRM', () => {
  it('отклоняет метод, отличный от POST', async () => {
    const res = await handleLeadRequest({ method: 'GET', headers: {}, body: {} });
    assert.equal(res.status, 405);
  });

  it('не обращается к CRM при неверных полях', async () => {
    const fetchMock = mock.fn(async () => bitrixOk());
    globalThis.fetch = fetchMock;

    const res = await post(body({ phone: '123' }));

    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'validation');
    assert.ok(res.body.fields.phone);
    assert.equal(fetchMock.mock.callCount(), 0);
  });

  it('не создаёт лид без согласия на обработку данных', async () => {
    const fetchMock = mock.fn(async () => bitrixOk());
    globalThis.fetch = fetchMock;

    const res = await post(body({ consent: false }));

    assert.equal(res.status, 400);
    assert.equal(fetchMock.mock.callCount(), 0);
  });

  it('отсекает бота по заполненной ловушке', async () => {
    const fetchMock = mock.fn(async () => bitrixOk());
    globalThis.fetch = fetchMock;

    const res = await post(body({ hp: 'спам' }));

    assert.equal(res.status, 400);
    assert.equal(fetchMock.mock.callCount(), 0);
  });

  it('отсекает мгновенную отправку формы', async () => {
    const fetchMock = mock.fn(async () => bitrixOk());
    globalThis.fetch = fetchMock;

    const res = await post(body({ renderedAt: Date.now() }));

    assert.equal(res.status, 400);
    assert.equal(fetchMock.mock.callCount(), 0);
  });

  it('пропускает форму, заполненную человеком', async () => {
    globalThis.fetch = mock.fn(async () => bitrixOk());
    const res = await post(body({ renderedAt: Date.now() - 30000 }));
    assert.equal(res.status, 200);
  });

  it('отклоняет запрос с чужого домена', async () => {
    const fetchMock = mock.fn(async () => bitrixOk());
    globalThis.fetch = fetchMock;

    const res = await post(body(), { origin: 'https://зло.example' });

    assert.equal(res.status, 403);
    assert.equal(fetchMock.mock.callCount(), 0);
  });

  it('принимает запрос со своего домена', async () => {
    globalThis.fetch = mock.fn(async () => bitrixOk());
    const res = await post(body(), { origin: 'https://bs.kz' });
    assert.equal(res.status, 200);
  });
});

describe('handleLeadRequest — защита от дублей', () => {
  it('повторное нажатие с тем же идентификатором не создаёт второй лид', async () => {
    const fetchMock = mock.fn(async () => bitrixOk(777));
    globalThis.fetch = fetchMock;

    const payload = body();
    const first = await post(payload);
    const second = await post(payload);

    assert.equal(fetchMock.mock.callCount(), 1);
    assert.equal(first.body.leadId, 777);
    assert.equal(second.body.leadId, 777);
    assert.equal(second.body.duplicate, true);
  });

  it('одновременные отправки дают один лид', async () => {
    const fetchMock = mock.fn(async () => bitrixOk(888));
    globalThis.fetch = fetchMock;

    const payload = body();
    const [a, b] = await Promise.all([post(payload), post(payload)]);

    assert.equal(fetchMock.mock.callCount(), 1);
    assert.equal(a.body.leadId, 888);
    assert.equal(b.body.leadId, 888);
  });

  it('разные заявки создают разные лиды', async () => {
    const fetchMock = mock.fn(async () => bitrixOk());
    globalThis.fetch = fetchMock;

    await post(body());
    await post(body());

    assert.equal(fetchMock.mock.callCount(), 2);
  });
});

describe('handleLeadRequest — ошибки CRM', () => {
  it('не показывает успех, если портал вернул ошибку', async () => {
    globalThis.fetch = mock.fn(async () => bitrixError());

    const res = await post();

    assert.equal(res.status, 502);
    assert.equal(res.body.ok, false);
    assert.ok(!('leadId' in res.body));
  });

  it('не показывает успех, если портал не вернул номер лида', async () => {
    globalThis.fetch = mock.fn(async () => new Response(JSON.stringify({ result: 0 }), { status: 200 }));

    const res = await post();

    assert.equal(res.status, 502);
    assert.equal(res.body.ok, false);
  });

  it('в ответе нет ни адреса вебхука, ни описания ошибки портала', async () => {
    globalThis.fetch = mock.fn(async () => bitrixError());

    const res = await post();
    const serialized = JSON.stringify(res.body);

    assert.doesNotMatch(serialized, /abc123token|bitrix24|ACCESS_DENIED|нет доступа/);
  });

  it('позволяет повторить отправку после ошибки', async () => {
    let attempt = 0;
    globalThis.fetch = mock.fn(async () => {
      attempt += 1;
      return attempt === 1 ? bitrixError('ACCESS_DENIED') : bitrixOk(999);
    });

    const payload = body();
    const failed = await post(payload);
    const retried = await post(payload);

    assert.equal(failed.status, 502);
    assert.equal(retried.status, 200);
    assert.equal(retried.body.leadId, 999);
  });
});

describe('handleLeadRequest — воронки городов', () => {
  /** Разные ответы портала по методам: поиск контакта, создание контакта, сделка. */
  function portal({ contactFound = 0, dealId = 5555, contactId = 321 } = {}) {
    const calls = [];
    const fetchMock = mock.fn(async (url, init) => {
      const method = String(url).split('/').pop().replace('.json', '');
      calls.push({ method, fields: JSON.parse(init.body).fields });
      if (method === 'crm.duplicate.findbycomm') {
        return new Response(JSON.stringify({ result: contactFound ? { CONTACT: [contactFound] } : {} }), {
          status: 200,
        });
      }
      return bitrixOk(method === 'crm.deal.add' ? dealId : contactId);
    });
    globalThis.fetch = fetchMock;
    return { calls, fetchMock };
  }

  beforeEach(() => {
    process.env.BITRIX_FUNNEL_AKTAU = '1';
    process.env.BITRIX_FUNNEL_AKTOBE = '2';
    process.env.BITRIX_FUNNEL_UST_KAMENOGORSK = '3';
    resetConfig();
  });

  for (const [city, categoryId] of [
    ['Актау', '1'],
    ['Актобе', '2'],
    ['Усть-Каменогорск', '3'],
  ]) {
    it(`заявка из города ${city} создаёт сделку в воронке ${categoryId}`, async () => {
      const { calls } = portal();

      const res = await post(body({ city, project: 'ЖК тестовый' }));
      const deal = calls.find((c) => c.method === 'crm.deal.add');

      assert.equal(res.status, 200);
      assert.equal(res.body.entity, 'deal');
      assert.equal(res.body.leadId, 5555);
      assert.equal(deal.fields.CATEGORY_ID, categoryId);
    });
  }

  it('привязывает к сделке новый контакт с телефоном', async () => {
    const { calls } = portal({ contactId: 321 });

    await post(body({ city: 'Актобе' }));

    const contact = calls.find((c) => c.method === 'crm.contact.add');
    const deal = calls.find((c) => c.method === 'crm.deal.add');

    assert.equal(contact.fields.PHONE[0].VALUE, '+77071234567');
    assert.equal(deal.fields.CONTACT_ID, 321);
  });

  it('повторное обращение с того же номера не плодит контакты', async () => {
    const { calls } = portal({ contactFound: 42 });

    await post(body({ city: 'Актобе' }));

    assert.equal(
      calls.some((c) => c.method === 'crm.contact.add'),
      false,
    );
    assert.equal(calls.find((c) => c.method === 'crm.deal.add').fields.CONTACT_ID, 42);
  });

  it('город без настроенной воронки создаёт лид', async () => {
    delete process.env.BITRIX_FUNNEL_AKTOBE;
    resetConfig();
    const { calls } = portal();

    const res = await post(body({ city: 'Актобе' }));

    assert.equal(res.body.entity, 'lead');
    assert.deepEqual(
      calls.map((c) => c.method),
      ['crm.lead.add'],
    );
  });

  it('в комментарии сделки есть имя, телефон, город и ЖК', async () => {
    const { calls } = portal();

    await post(body({ city: 'Актау', project: 'ORTA' }));
    const comments = calls.find((c) => c.method === 'crm.deal.add').fields.COMMENTS;

    assert.match(comments, /Айгерим/);
    assert.match(comments, /\+77071234567/);
    assert.match(comments, /Актау/);
    assert.match(comments, /ORTA/);
  });

  it('сделка создаётся даже если контакт завести не удалось', async () => {
    globalThis.fetch = mock.fn(async (url) => {
      const method = String(url).split('/').pop().replace('.json', '');
      return method === 'crm.deal.add' ? bitrixOk(777) : bitrixError('ACCESS_DENIED');
    });

    const res = await post(body({ city: 'Актау' }));

    assert.equal(res.status, 200);
    assert.equal(res.body.leadId, 777);
  });

  it('не показывает успех, если сделку создать не удалось', async () => {
    globalThis.fetch = mock.fn(async () => bitrixError('ACCESS_DENIED'));

    const res = await post(body({ city: 'Актау' }));

    assert.equal(res.status, 502);
    assert.equal(res.body.ok, false);
  });
});

describe('handleLeadRequest — лимит частоты', () => {
  it('отклоняет поток заявок с одного адреса', async () => {
    process.env.LEAD_RATE_LIMIT = '2/60';
    resetConfig();
    globalThis.fetch = mock.fn(async () => bitrixOk());

    const headers = { 'x-forwarded-for': '203.0.113.7' };
    await post(body(), headers);
    await post(body(), headers);
    const third = await post(body(), headers);

    assert.equal(third.status, 429);
    assert.ok(third.headers['Retry-After']);
  });
});
