#!/usr/bin/env node
/**
 * Проверка связи с Bitrix24 и настроек воронок.
 *
 * Отвечает на три вопроса, ради которых иначе пришлось бы лезть в код:
 *   1. Работает ли вебхук и есть ли у него права на CRM.
 *   2. Какие воронки есть на портале и какие у них номера.
 *   3. Совпадают ли номера с переменными `BITRIX_FUNNEL_*` в окружении.
 *
 * Запуск:
 *   npm run check:bitrix                    — проверка настроек, ничего не создаёт
 *   npm run check:bitrix -- --send http://localhost:5173
 *                                           — тестовая заявка по каждому городу
 *
 * Адрес вебхука не печатается никогда: вывод можно показывать и пересылать.
 */

import { readFileSync } from 'node:fs';
import { CITY_FUNNEL_KEYS } from '../server/bitrix/routing.js';

/** Читает `.env` рядом с проектом. Переменные окружения имеют приоритет. */
function loadEnv() {
  /** @type {Record<string, string>} */
  const file = {};
  try {
    for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq > 0) file[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  } catch {
    // Файла нет — работаем на том, что уже в окружении.
  }
  return { ...file, ...process.env };
}

const env = loadEnv();
const ok = (text) => console.log(`  ✅ ${text}`);
const bad = (text) => console.log(`  ❌ ${text}`);
const warn = (text) => console.log(`  ⚠️  ${text}`);

const webhook = String(env.BITRIX_WEBHOOK_URL ?? '').trim();
if (!webhook) {
  bad('BITRIX_WEBHOOK_URL не задан — ни в .env, ни в окружении.');
  process.exit(1);
}
const base = webhook.endsWith('/') ? webhook : `${webhook}/`;

/**
 * Вызов метода REST. Ошибку не бросает — возвращает разобранный ответ портала.
 * @param {string} method
 * @param {Record<string, unknown>} [params]
 */
async function call(method, params = {}) {
  try {
    const response = await fetch(`${base}${method}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(15000),
    });
    const raw = await response.text();
    try {
      return JSON.parse(raw);
    } catch {
      return { error: 'BAD_RESPONSE', error_description: `портал вернул не JSON (HTTP ${response.status})` };
    }
  } catch (error) {
    return { error: 'NETWORK_ERROR', error_description: String(error?.message ?? error) };
  }
}

console.log('\n1. Связь с порталом');
const profile = await call('profile');
if (profile.error) {
  bad(`портал не ответил: ${profile.error} — ${profile.error_description ?? ''}`);
  console.log('     Проверьте адрес вебхука: он должен заканчиваться косой чертой.\n');
  process.exit(1);
}
ok(`портал отвечает, вебхук выпущен от имени: ${profile.result?.NAME ?? ''} ${profile.result?.LAST_NAME ?? ''}`);

console.log('\n2. Права вебхука на CRM');
const fields = await call('crm.lead.fields');
const hasCrm = !fields.error;
if (hasCrm) {
  ok('права на CRM есть — сайт может создавать заявки');
} else if (fields.error === 'insufficient_scope') {
  bad('у вебхука НЕТ прав на CRM — ни одна заявка с сайта не дойдёт до Bitrix24');
  console.log('     Лечится так: Приложения → Разработчикам → Входящий вебхук →');
  console.log('     открыть свой вебхук → в «Настройки прав» отметить CRM (crm) → Сохранить.');
  console.log('     Затем впишите новый адрес в BITRIX_WEBHOOK_URL и передеплойте сайт.\n');
} else {
  bad(`портал вернул ошибку: ${fields.error} — ${fields.error_description ?? ''}`);
}

console.log('\n3. Воронки портала (направления сделок)');
const categories = hasCrm ? await call('crm.category.list', { entityTypeId: 2 }) : { error: 'skipped' };
/** @type {{ id: number, name: string }[]} */
const funnels = (categories.result?.categories ?? []).map((c) => ({ id: Number(c.id), name: String(c.name) }));

if (categories.error === 'skipped') {
  warn('пропущено — сначала выдайте вебхуку права на CRM');
} else if (categories.error) {
  bad(`не удалось получить список: ${categories.error} — ${categories.error_description ?? ''}`);
} else if (funnels.length === 0) {
  warn('на портале нет ни одной воронки сделок — создайте их в CRM → Сделки → Воронки');
} else {
  for (const f of funnels) console.log(`  • ${String(f.id).padStart(3)} — ${f.name}`);
}

console.log('\n4. Настройки сайта: город → воронка');
let configured = 0;
for (const { city, keys } of CITY_FUNNEL_KEYS) {
  const key = keys.find((k) => String(env[`BITRIX_FUNNEL_${k}`] ?? '').trim());
  const value = key ? String(env[`BITRIX_FUNNEL_${key}`]).trim() : '';

  if (!value) {
    warn(`${city}: воронка не задана — заявки уйдут в раздел «Лиды» (BITRIX_FUNNEL_${keys[0]})`);
    continue;
  }
  if (!/^\d+$/.test(value)) {
    bad(`${city}: BITRIX_FUNNEL_${key}="${value}" — ожидается номер воронки, значение будет проигнорировано`);
    continue;
  }

  const match = funnels.find((f) => f.id === Number(value));
  if (funnels.length > 0 && !match) {
    bad(`${city}: воронки с номером ${value} на портале нет — заявки не создадутся`);
    continue;
  }
  configured += 1;
  ok(`${city} → воронка ${value}${match ? ` («${match.name}»)` : ''}`);
}

const fallback = String(env.BITRIX_FUNNEL_DEFAULT ?? '').trim();
if (fallback) console.log(`  ℹ️  прочие города → воронка ${fallback}`);

console.log(
  `\nИтог: настроено городов ${configured} из ${CITY_FUNNEL_KEYS.length}.` +
    (hasCrm ? '' : ' Права на CRM обязательны — без них не работает ничего.'),
);

// ── Тестовые заявки ─────────────────────────────────────────────────────────

const sendIndex = process.argv.indexOf('--send');
if (sendIndex === -1) {
  console.log('\nТестовая заявка по каждому городу: npm run check:bitrix -- --send http://localhost:5173\n');
  process.exit(0);
}

const site = String(process.argv[sendIndex + 1] ?? '').replace(/\/$/, '');
if (!site) {
  bad('после --send укажите адрес сайта, например http://localhost:5173');
  process.exit(1);
}

console.log(`\n5. Тестовые заявки через ${site}/api/lead`);
console.log('   В CRM появятся настоящие карточки — удалите их после проверки.\n');

for (const { city } of CITY_FUNNEL_KEYS) {
  const payload = {
    formCode: 'zhk_consultation',
    name: `ТЕСТ ${city}`,
    phone: '+7 (700) 000-00-01',
    consent: true,
    city,
    project: `Проверка маршрутизации — ${city}`,
    ctaLocation: 'Скрипт проверки',
    submissionId: `check-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    page: { url: `${site}/`, title: 'Проверка интеграции', lang: 'ru' },
  };

  let body;
  try {
    const response = await fetch(`${site}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });
    body = await response.json();
  } catch (error) {
    bad(`${city}: сайт недоступен — ${String(error?.message ?? error)}`);
    continue;
  }

  if (body?.ok) {
    const where = body.entity === 'deal' ? 'сделка в воронке города' : 'лид (воронка для города не задана)';
    ok(`${city}: создано, номер ${body.leadId} — ${where}`);
  } else {
    bad(`${city}: ${body?.error ?? 'неизвестная ошибка'} — ${body?.message ?? ''}`);
  }
}

console.log('');
