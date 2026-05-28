import { Telegraf, Context } from "telegraf";
import { logger } from "../lib/logger";
import { daftarVersi } from "./data";
import {
  menuUtama,
  menuKatalog,
  menuDownload,
  menuDonasi,
  menuKembali,
} from "./keyboards";
import {
  pesanWelcome,
  pesanKatalog,
  pesanInfo,
  pesanDonasi,
  pesanBantuan,
  pesanDownloadVersi,
  pesanKonfirmasiDonasi,
} from "./messages";
import {
  getUserData,
  tambahDownload,
  tandaiSudahDonasi,
  cekBolehDownload,
  sisaDownloadGratis,
} from "./userTracker";

const token = process.env["TELEGRAM_BOT_TOKEN"];
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN tidak ditemukan di environment variables");
}

const bot = new Telegraf(token);

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
  const boleh = cekBolehDownload(userId);
  return ctx.reply(pesanKatalog(userId), {
    parse_mode: "Markdown",
    ...menuKatalog(boleh),
  });
});

bot.command("download", (ctx) => {
  initUser(ctx);
  return ctx.reply("⬇️ *Pilih versi yang ingin didownload:*", {
    parse_mode: "Markdown",
    ...menuDownload,
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
  const boleh = cekBolehDownload(userId);
  await ctx.answerCbQuery();
  return ctx.editMessageText(pesanKatalog(userId), {
    parse_mode: "Markdown",
    ...menuKatalog(boleh),
  });
});

bot.action("download", async (ctx) => {
  initUser(ctx);
  await ctx.answerCbQuery();
  return ctx.editMessageText("⬇️ *Pilih versi yang ingin didownload:*", {
    parse_mode: "Markdown",
    ...menuDownload,
  });
});

bot.action("download_terbaru", async (ctx) => {
  initUser(ctx);
  const userId = getUserId(ctx);
  await ctx.answerCbQuery();
  if (!cekBolehDownload(userId)) {
    return ctx.editMessageText(pesanDownloadVersi(userId, 0), {
      parse_mode: "Markdown",
      ...menuDonasi,
    });
  }
  tambahDownload(userId);
  return ctx.editMessageText(pesanDownloadVersi(userId, 0), {
    parse_mode: "Markdown",
    ...menuKembali,
  });
});

bot.action("semua_versi", async (ctx) => {
  initUser(ctx);
  await ctx.answerCbQuery();
  return ctx.editMessageText("⬇️ *Pilih versi yang ingin didownload:*", {
    parse_mode: "Markdown",
    ...menuDownload,
  });
});

for (let i = 0; i < daftarVersi.length; i++) {
  bot.action(`dl_${i}`, async (ctx) => {
    initUser(ctx);
    const userId = getUserId(ctx);
    await ctx.answerCbQuery();
    if (!cekBolehDownload(userId)) {
      return ctx.editMessageText(pesanDownloadVersi(userId, i), {
        parse_mode: "Markdown",
        ...menuDonasi,
      });
    }
    tambahDownload(userId);
    return ctx.editMessageText(pesanDownloadVersi(userId, i), {
      parse_mode: "Markdown",
      ...menuKembali,
    });
  });
}

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
    `Halo ${nama}! Gunakan perintah atau tombol menu ya 😊\n\nKetik /bantuan untuk melihat semua perintah.`,
    menuKembali,
  );
});

export function startBot(): void {
  bot.launch({
    dropPendingUpdates: true,
  });
  logger.info("Bot Telegram TikTok HK berhasil dijalankan 🚀");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

export default bot;
