/**
 * Точка входа Vercel: POST /api/lead.
 *
 * Адаптер намеренно тонкий — вся логика в `server/lead-handler.js`, чтобы её
 * можно было запустить и на другом хостинге, и в тестах без HTTP.
 */

import { handleLeadRequest } from '../server/lead-handler.js';

/**
 * @param {import('http').IncomingMessage & { body?: unknown }} req
 * @param {import('http').ServerResponse} res
 */
export default async function handler(req, res) {
  const { status, headers, body } = await handleLeadRequest({
    method: req.method ?? 'GET',
    headers: req.headers ?? {},
    // Vercel уже разобрал JSON-тело; строку оставляем на случай другого
    // content-type — разберёт обработчик.
    body: req.body,
  });

  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value);
  }
  res.statusCode = status;
  res.end(JSON.stringify(body));
}
