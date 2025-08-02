import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createTelegramBot, type CarTycoonBot } from "./telegram-bot";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Статические файлы attached_assets
app.use('/attached_assets', express.static('attached_assets'));

// Инициализация Telegram бота
let telegramBot: CarTycoonBot | null = null;

// Функция для получения URL WebApp
function getWebAppUrl(): string {
  const isDevelopment = app.get("env") === "development";
  
  // Проверяем есть ли Replit домен (всегда используем HTTPS для Telegram)
  const replitDomain = process.env.REPLIT_DOMAINS || process.env.REPL_SLUG;
  if (replitDomain) {
    // Извлекаем первый домен если их несколько
    const domain = replitDomain.split(',')[0].trim();
    return `https://${domain}`;
  }
  
  // Для разработки тоже попробуем HTTPS если возможно
  const port = process.env.PORT || 5000;
  
  // В Replit даже в разработке часто доступен HTTPS
  if (process.env.REPL_ID || process.env.REPLIT_ENVIRONMENT) {
    const replId = process.env.REPL_ID || 'unknown';
    const username = process.env.REPL_OWNER || 'user';
    return `https://${replId}-${username}.replit.app`;
  }
  
  // Fallback для локальной разработки (не будет работать с Telegram)
  return `http://localhost:${port}`;
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Запуск Telegram бота если есть токен
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (botToken) {
    try {
      const webAppUrl = getWebAppUrl();
      telegramBot = createTelegramBot(botToken, webAppUrl);
      log(`🤖 Telegram бот запущен! WebApp URL: ${webAppUrl}`);
    } catch (error) {
      log(`❌ Ошибка запуска Telegram бота: ${error}`);
    }
  } else {
    log(`⚠️  TELEGRAM_BOT_TOKEN не найден. Бот не запущен.`);
    log(`💡 Для запуска бота добавьте токен в переменные окружения.`);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

// Экспорт для использования в других модулях
export { telegramBot };
