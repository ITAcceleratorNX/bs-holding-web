import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PhoneRevealPopup from './PhoneRevealPopup';

/**
 * Показ номера отдела продаж по заявке.
 *
 * Номера показываются в нескольких местах (шапка, мобильное меню, шапка
 * страницы ЖК, блок «Поддержка»), поэтому форма живёт одна на всё приложение,
 * а точки показа обращаются к ней через контекст — иначе состояние пришлось бы
 * протаскивать пропсами через все страницы.
 *
 * Открытый номер запоминается на время вкладки: повторно просить телефон у
 * того, кто его уже оставил, — только терять звонок и плодить дубли в CRM.
 * У колл-центра ЖК несколько линий, но запись одна — по ссылке первой линии:
 * заявка открывает весь набор сразу.
 */

const PhoneRevealContext = createContext(null);

const STORAGE_KEY = 'bs_phone_revealed_v1';

/**
 * Без провайдера точки показа работают как раньше — обычной ссылкой на номер.
 * Форма — надстройка над телефоном, а не условие его существования.
 */
const NO_PROVIDER = { isRevealed: () => true, openReveal: () => {} };

/** @returns {Set<string>} */
function readRevealed() {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(list) ? list.filter((item) => typeof item === 'string') : []);
  } catch {
    // sessionStorage недоступен или содержит мусор — номер будет открыт до
    // перезагрузки страницы, заявка при этом не теряется.
    return new Set();
  }
}

/** @param {Set<string>} value */
function writeRevealed(value) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...value]));
  } catch {
    // Запись запрещена — состояние остаётся в памяти вкладки.
  }
}

export function PhoneRevealProvider({ children }) {
  /** Открытые номера — ссылки вида `tel:+7…`. */
  const [revealed, setRevealed] = useState(readRevealed);
  /** Запрос на показ: какой номер и откуда его попросили. `null` — форма закрыта. */
  const [request, setRequest] = useState(null);

  const openReveal = useCallback((next) => setRequest(next), []);
  const closeReveal = useCallback(() => setRequest(null), []);

  const markRevealed = useCallback((phoneHref) => {
    setRevealed((prev) => {
      const next = new Set(prev).add(phoneHref);
      writeRevealed(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ isRevealed: (phoneHref) => revealed.has(phoneHref), openReveal }),
    [revealed, openReveal],
  );

  return (
    <PhoneRevealContext.Provider value={value}>
      {children}
      <PhoneRevealPopup
        open={request !== null}
        request={request}
        onClose={closeReveal}
        onRevealed={markRevealed}
      />
    </PhoneRevealContext.Provider>
  );
}

/**
 * @returns {{ isRevealed: (phoneHref: string) => boolean, openReveal: (request: { phoneHref: string, phone?: Object, city?: string, project?: string, ctaLocation?: string, hours?: string }) => void }}
 */
export function usePhoneReveal() {
  return useContext(PhoneRevealContext) ?? NO_PROVIDER;
}
