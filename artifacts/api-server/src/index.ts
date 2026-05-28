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

  startBot();
  startKeepAlive(port);
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
