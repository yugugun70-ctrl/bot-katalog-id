import { Telegraf, Context } from "telegraf";
import { logger } from "../lib/logger";
import {
  menuUtama,
  menuKatalog,
  menuDonasi,
  menuKembali,
  menuSetelahMinta,
  menuHabis,
} from "./keyboards";
import {
  pesanWelcome,
  pesanKatalog,
  pesanInfo,
  pesanDonasi,
  pesanBantuan,
  pesanMintaFile,
  pesanKonfirmasiDonasi,
} from "./messages";
import {
  getUserData,
  tambahDownload,
  tandaiSudahDonasi,
  cekBolehDownload,
} from "./userTracker";

const token = process.env["TELEGRAM_BOT_TOKEN"];
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN tidak ditemukan di environment variables");
}

const bot = new Telegraf(token);

const QRALIPAY_PATH = process.env["QRALIPAY_PATH"] ?? "";

function getNamaUser(ctx: Context): string {
  const user = ctx.from;
  if (!user) return "Pengguna";
  return user.first_name || user.username || "Pengguna";
}

function getUserId(ctx: Context): number {
  return ctx.from?.id ?? 0;
}

function initUser(ctx: Context): void {
  const id = getUserId(ctx);
  const nama = getNamaUser(ctx);
  if (id) getUserData(id, nama);
}

async function kirimQRAlipay(ctx: Context): Promise<void> {
  if (QRALIPAY_PATH) {
    try {
      await ctx.replyWithPhoto(
        { source: QRALIPAY_PATH },
        {
          caption:
            "🔴 *QR Code Alipay HK*\nScan QR di atas untuk donasi via Alipay HK 🙏",
          parse_mode: "Markdown",
          ...menuDonasi,
        },
      );
      return;
    } catch {
      // fallthrough to text
    }
  }
  await ctx.reply(
    "🔴 *QR Code Alipay HK*\n\nSilakan hubungi admin untuk mendapatkan QR Code Alipay HK.\n\n💚 *GoPay:* 0856-4145-2357",
    { parse_mode: "Markdown", ...menuDonasi },
  );
}

bot.start((ctx) => {
  initUser(ctx);
  const nama = getNamaUser(ctx);
  return ctx.reply(pesanWelcome(nama), {
    parse_mode: "Markdown",
    ...menuUtama,
  });
});

bot.command("katalog", (ctx) => {
  initUser(ctx);
  const userId = getUserId(ctx);
  return ctx.reply(pesanKatalog(userId), {
    parse_mode: "Markdown",
    ...menuKatalog,
  });
});

bot.command("minta", (ctx) => {
  initUser(ctx);
  const userId = getUserId(ctx);
  const nama = getNamaUser(ctx);
  const boleh = cekBolehDownload(userId);
  if (boleh) tambahDownload(userId);
  const menu = boleh ? menuSetelahMinta : menuHabis;
  return ctx.reply(pesanMintaFile(userId, nama), {
    parse_mode: "Markdown",
    ...menu,
  });
});

bot.command("info", (ctx) => {
  initUser(ctx);
  return ctx.reply(pesanInfo(), {
    parse_mode: "Markdown",
    ...menuKembali,
  });
});

bot.command("donasi", (ctx) => {
  initUser(ctx);
  return ctx.reply(pesanDonasi(), {
    parse_mode: "Markdown",
    ...menuDonasi,
  });
});

bot.command("qralipay", async (ctx) => {
  initUser(ctx);
  await kirimQRAlipay(ctx);
});

bot.command("bantuan", (ctx) => {
  initUser(ctx);
  return ctx.reply(pesanBantuan(), {
    parse_mode: "Markdown",
    ...menuKembali,
  });
});

bot.action("menu_utama", async (ctx) => {
  initUser(ctx);
  const nama = getNamaUser(ctx);
  await ctx.answerCbQuery();
  return ctx.editMessageText(pesanWelcome(nama), {
    parse_mode: "Markdown",
    ...menuUtama,
  });
});

bot.action("katalog", async (ctx) => {
  initUser(ctx);
  const userId = getUserId(ctx);
  await ctx.answerCbQuery();
  return ctx.editMessageText(pesanKatalog(userId), {
    parse_mode: "Markdown",
    ...menuKatalog,
  });
});

bot.action("minta", async (ctx) => {
  initUser(ctx);
  const userId = getUserId(ctx);
  const nama = getNamaUser(ctx);
  const boleh = cekBolehDownload(userId);
  if (boleh) tambahDownload(userId);
  const menu = boleh ? menuSetelahMinta : menuHabis;
  await ctx.answerCbQuery(boleh ? "✅ Permintaan dikirim!" : "⚠️ Permintaan gratis habis");
  return ctx.editMessageText(pesanMintaFile(userId, nama), {
    parse_mode: "Markdown",
    ...menu,
  });
});

bot.action("info", async (ctx) => {
  initUser(ctx);
  await ctx.answerCbQuery();
  return ctx.editMessageText(pesanInfo(), {
    parse_mode: "Markdown",
    ...menuKembali,
  });
});

bot.action("donasi", async (ctx) => {
  initUser(ctx);
  await ctx.answerCbQuery();
  return ctx.editMessageText(pesanDonasi(), {
    parse_mode: "Markdown",
    ...menuDonasi,
  });
});

bot.action("qralipay", async (ctx) => {
  initUser(ctx);
  await ctx.answerCbQuery();
  await kirimQRAlipay(ctx);
});

bot.action("konfirmasi_donasi", async (ctx) => {
  initUser(ctx);
  const userId = getUserId(ctx);
  const nama = getNamaUser(ctx);
  await ctx.answerCbQuery("✅ Donasi dikonfirmasi! Terima kasih 💛");
  tandaiSudahDonasi(userId);
  return ctx.editMessageText(pesanKonfirmasiDonasi(nama), {
    parse_mode: "Markdown",
    ...menuKembali,
  });
});

bot.action("bantuan", async (ctx) => {
  initUser(ctx);
  await ctx.answerCbQuery();
  return ctx.editMessageText(pesanBantuan(), {
    parse_mode: "Markdown",
    ...menuKembali,
  });
});

bot.on("text", (ctx) => {
  initUser(ctx);
  const nama = getNamaUser(ctx);
  return ctx.reply(
    `Halo ${nama}! Gunakan tombol menu atau ketik perintah ya 😊\n\nKetik /bantuan untuk melihat semua perintah.`,
    menuKembali,
  );
});

export function startBot(): void {
  bot.launch({ dropPendingUpdates: true });
  logger.info("Bot Telegram TikTok HK berhasil dijalankan 🚀");
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

export default bot;
