import app from "./app";
import { logger } from "./lib/logger";
import { startBot } from "./bot/index";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught exception — bot tetap berjalan");
});

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled rejection — bot tetap berjalan");
});

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  const isProduction = process.env["REPLIT_DEPLOYMENT"] === "1";
  const devBotEnabled = process.env["BOT_DEV_MODE"] === "true";

  if (isProduction || devBotEnabled) {
    startBot();
    startKeepAlive(port);
    logger.info({ isProduction }, "Bot started");
  } else {
    logger.info("Bot tidak dijalankan di development — set BOT_DEV_MODE=true untuk aktifkan lokal");
  }
});

function startKeepAlive(port: number): void {
  const interval = 4 * 60 * 1000;

  setInterval(async () => {
    try {
      const res = await fetch(`http://localhost:${port}/api/healthz`);
      if (res.ok) {
        logger.debug("Keep-alive ping OK");
      }
    } catch (err) {
      logger.warn({ err }, "Keep-alive ping gagal");
    }
  }, interval);

  logger.info("Keep-alive aktif (ping setiap 4 menit)");
}
