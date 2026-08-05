/**
 * Плагин дев-сервера Vite: поднимает POST /api/lead локально.
 *
 * Без него `npm run dev` отдавал бы 404 на отправку формы, и проверить
 * интеграцию можно было бы только после деплоя. Обработчик здесь тот же, что
 * и в проде, — расхождения между средами исключены.
 *
 * Плагин работает только в режиме разработки и в сборку не попадает.
 */

import { loadEnv } from 'vite';
import { handleLeadRequest } from './lead-handler.js';

/** @returns {import('vite').Plugin} */
export function leadApiPlugin() {
  return {
    name: 'bs-lead-api',
    apply: 'serve',

    config(_config, { mode }) {
      // Vite отдаёт клиенту только переменные с префиксом VITE_. Серверные
      // читаются здесь и кладутся в process.env — так же, как на Vercel.
      // В браузерный бандл они при этом не попадают.
      const env = loadEnv(mode, process.cwd(), '');
      for (const [key, value] of Object.entries(env)) {
        if (key.startsWith('BITRIX_') || key.startsWith('LEAD_')) {
          process.env[key] ??= value;
        }
      }
    },

    configureServer(server) {
      server.middlewares.use('/api/lead', async (req, res, next) => {
        // Middleware Vite вызывается и для вложенных путей — отдаём остальное дальше.
        if (req.url && req.url !== '/' && req.url !== '') return next();

        let raw = '';
        req.setEncoding('utf8');
        for await (const chunk of req) raw += chunk;

        const { status, headers, body } = await handleLeadRequest({
          method: req.method ?? 'GET',
          headers: req.headers,
          body: raw,
        });

        for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
        res.statusCode = status;
        res.end(JSON.stringify(body));
      });
    },
  };
}
