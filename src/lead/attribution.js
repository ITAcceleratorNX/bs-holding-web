/**
 * Рекламный источник: сбор и хранение между переходами (ТЗ 5).
 *
 * Метки снимаются при первом входе и живут 30 дней, поэтому заявка со страницы
 * ЖК, до которой пользователь дошёл через три перехода, всё равно приносит
 * кампанию, которая его привела. Приход по новой рекламной ссылке первый
 * источник не затирает — он дописывается как последний.
 *
 * Хранилище — localStorage. Если оно недоступно (приватный режим, запрет
 * cookie), модуль молча переходит на память вкладки: заявка должна уходить
 * в любом случае, потеря меток здесь — меньшее зло.
 */

import { CLICK_ID_KEYS, UTM_KEYS } from './contract.js';

const STORAGE_KEY = 'bs_attribution_v1';
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Запасное хранилище, когда localStorage недоступен. */
let memoryFallback = null;

/**
 * @returns {{ first: Record<string, string>, last: Record<string, string>, savedAt: number }|null}
 */
function read() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // localStorage недоступен или содержит мусор — используем память вкладки.
  }
  return memoryFallback;
}

/**
 * @param {{ first: Record<string, string>, last: Record<string, string>, savedAt: number }} value
 */
function write(value) {
  memoryFallback = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Переполнение или запрет записи — остаёмся на памяти вкладки.
  }
}

/**
 * Параметры текущего адреса. Маршрутизация хешевая, поэтому метки могут стоять
 * и до `#`, и после него.
 * @returns {URLSearchParams}
 */
function currentParams() {
  const { search, hash } = window.location;
  const params = new URLSearchParams(search);
  const hashQuery = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '';
  if (hashQuery) {
    new URLSearchParams(hashQuery).forEach((value, key) => {
      if (!params.has(key)) params.set(key, value);
    });
  }
  return params;
}

/**
 * Снимок источника для текущего входа.
 * @returns {{ touch: Record<string, string>, hasAdParams: boolean }}
 */
function currentTouch() {
  const params = currentParams();
  /** @type {Record<string, string>} */
  const touch = {};

  for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const value = params.get(key);
    if (value) touch[key] = value;
  }
  const hasAdParams = Object.keys(touch).length > 0;

  // Переходы внутри сайта источником не считаются.
  const referrer = document.referrer;
  if (referrer) {
    try {
      if (new URL(referrer).host !== window.location.host) touch.referrer = referrer;
    } catch {
      // Некорректный referrer игнорируем.
    }
  }

  touch.landing = window.location.href;
  touch.ts = new Date().toISOString();

  return { touch, hasAdParams };
}

/**
 * Фиксирует источник текущего входа. Вызывается один раз при старте приложения.
 * @returns {void}
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return;

  const { touch, hasAdParams } = currentTouch();
  const stored = read();
  const fresh = stored && Date.now() - stored.savedAt < TTL_MS;

  if (!fresh) {
    write({ first: touch, last: touch, savedAt: Date.now() });
    return;
  }

  // Первый источник неприкосновенен; новая рекламная ссылка обновляет последний.
  if (hasAdParams) {
    write({ first: stored.first, last: touch, savedAt: Date.now() });
  }
}

/**
 * Сохранённый источник для отправки с заявкой.
 * @returns {{ first: Record<string, string>, last: Record<string, string> }}
 */
export function getAttribution() {
  if (typeof window === 'undefined') return { first: {}, last: {} };

  const stored = read();
  if (!stored || Date.now() - stored.savedAt >= TTL_MS) {
    // Срок хранения вышел — считаем текущий вход и первым, и последним.
    const { touch } = currentTouch();
    return { first: touch, last: touch };
  }
  return { first: stored.first ?? {}, last: stored.last ?? {} };
}

/**
 * Контекст страницы для заявки (ТЗ 4).
 * @returns {{ url: string, title: string, lang: string }}
 */
export function getPageContext() {
  if (typeof window === 'undefined') return { url: '', title: '', lang: '' };
  return {
    url: window.location.href,
    title: document.title,
    lang: document.documentElement.lang || 'ru',
  };
}
