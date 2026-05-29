import app from "./app";
import { logger } from "./lib/logger";
import { startBot } from "./bot/index";

const rawPort = process.env["PORT"] || "3000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  console.error(`[SERVER] ❌ PORT tidak valid: "${rawPort}"`);
  process.exit(1);
}

process.on("uncaughtException", (err) => {
  console.error("[SERVER] ❌ Uncaught exception:", err.message);
  logger.error({ err }, "Uncaught exception — bot tetap berjalan");
});

process.on("unhandledRejection", (reason) => {
  console.error("[SERVER] ❌ Unhandled rejection:", reason);
  logger.error({ reason }, "Unhandled rejection — bot tetap berjalan");
});

app.listen(port, (err) => {
  if (err) {
    console.error("[SERVER] ❌ Gagal mendengarkan port:", err);
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  console.log(`[SERVER] ✅ Express berjalan di port ${port}`);
  logger.info({ port }, "Server listening");

  const isProduction = process.env["NODE_ENV"] === "production";
  const devBotEnabled = process.env["BOT_DEV_MODE"] === "true";

  if (isProduction || devBotEnabled) {
    console.log(`[BOT] 🚀 Memulai bot Telegram... (mode: ${isProduction ? "production" : "dev"})`);
    startBot();
    startKeepAlive(port);
  } else {
    console.log("[BOT] ⏸️  Bot tidak dijalankan di development. Set BOT_DEV_MODE=true untuk aktifkan lokal.");
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
      } else {
        console.warn(`[KEEPALIVE] ⚠️ Ping status: ${res.status}`);
      }
    } catch (err) {
      console.warn("[KEEPALIVE] ⚠️ Ping gagal:", (err as Error).message);
      logger.warn({ err }, "Keep-alive ping gagal");
    }
  }, interval);

  console.log("[KEEPALIVE] ✅ Keep-alive aktif (ping setiap 4 menit)");
  logger.info("Keep-alive aktif (ping setiap 4 menit)");
}
