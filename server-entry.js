/**
 * Продакшен-сервер для деплоя вне Vercel (VPS): оборачивает `handleLeadRequest`
 * из server/lead-handler.js в Express, чтобы отдавать его одним
 * долгоживущим процессом за nginx.
 */
import "dotenv/config"
import express from "express"

import { handleLeadRequest } from "./server/lead-handler.js"

const app = express()
app.disable("x-powered-by")
app.set("trust proxy", 1)
app.use(express.json())

app.post("/api/lead", async (req, res) => {
  try {
    const { status, headers, body } = await handleLeadRequest({
      method: req.method,
      headers: req.headers,
      body: req.body,
    })
    for (const [name, value] of Object.entries(headers)) res.setHeader(name, value)
    res.status(status).json(body)
  } catch (error) {
    console.error("Необработанная ошибка /api/lead", error)
    if (!res.headersSent) res.status(500).json({ ok: false, error: "internal_error" })
  }
})

const port = process.env.PORT || 3002
app.listen(port, "127.0.0.1", () => console.log(`API слушает 127.0.0.1:${port}`))
