/**
 * Переход в WhatsApp после создания лида (ТЗ 7).
 *
 * Прямой клик по WhatsApp лид не создаёт — он только фиксируется в аналитике,
 * а сообщение обрабатывает открытая линия Bitrix24. Здесь другой случай:
 * формы «Получить каталог» и «Получить презентацию» сначала создают лид и
 * только потом открывают переписку с подготовленным текстом.
 *
 * Вкладка открывается синхронно по клику и лишь затем получает адрес: если
 * открыть её после `await`, браузер посчитает это всплывающим окном и заблокирует.
 */

import { whatsappForCity } from '../data/phones';
import { getFormMeta } from './formCodes';

/**
 * Текст первого сообщения: менеджер сразу видит ЖК и тему обращения.
 * @param {{ formCode: string, project?: string, city?: string }} context
 * @returns {string}
 */
export function buildWhatsappMessage({ formCode, project, city }) {
  const topic = getFormMeta(formCode)?.title ?? 'Заявка с сайта';
  const parts = [`Здравствуйте! Тема обращения: ${topic}.`];
  if (project) parts.push(`ЖК: ${project}.`);
  if (city) parts.push(`Город: ${city}.`);
  return parts.join(' ');
}

/**
 * Ссылка на переписку с подготовленным сообщением.
 * @param {{ formCode: string, project?: string, city?: string }} context
 * @returns {string}
 */
export function buildWhatsappUrl({ formCode, project, city }) {
  const phone = whatsappForCity(city);
  const text = buildWhatsappMessage({ formCode, project, city });
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Заранее открытая вкладка, которую можно направить в WhatsApp после ответа
 * сервера.
 *
 * @typedef {{ redirect: (url: string) => boolean, cancel: () => void }} PendingTab
 */

/**
 * Открывает пустую вкладку прямо в обработчике клика.
 *
 * Возвращает `null`, если браузер всё же заблокировал окно, — в этом случае
 * форма показывает обычную ссылку, по которой пользователь перейдёт сам.
 * @returns {PendingTab|null}
 */
export function openPendingTab() {
  if (typeof window === 'undefined') return null;
  const tab = window.open('', '_blank', 'noopener');
  if (!tab) return null;

  return {
    redirect(url) {
      try {
        tab.location.replace(url);
        tab.focus?.();
        return true;
      } catch {
        return false;
      }
    },
    cancel() {
      try {
        tab.close();
      } catch {
        // Вкладку мог закрыть сам пользователь.
      }
    },
  };
}
