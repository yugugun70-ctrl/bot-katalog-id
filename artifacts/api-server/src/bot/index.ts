import path from "path";
import { Telegraf, Context } from "telegraf";
import { message } from "telegraf/filters";
import { logger } from "../lib/logger";
import { daftarKatalog } from "./data";
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
  pesanAdminPanduan,
  pesanStatusAdmin,
  pesanDownloadBerhasil,
  pesanFileBelumAda,
  pesanDownloadGratisHabis,
  pesanKonfirmasiDonasi,
} from "./messages";
import {
  getUserData,
  tambahDownload,
  tandaiSudahDonasi,
  cekBolehDownload,
} from "./userTracker";
import {
  isAdmin,
  simpanFileId,
  ambilFileId,
} from "./adminStore";

const token = process.env["TELEGRAM_BOT_TOKEN"];
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN tidak ditemukan di environment variables");
}

let bot: Telegraf;
const QRALIPAY_PATH = path.join(process.cwd(), "assets", "qralipay.jpg");

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

function safeHandler<T extends Context>(
  fn: (ctx: T) => Promise<unknown>,
): (ctx: T) => Promise<void> {
  return async (ctx: T) => {
    try {
      await fn(ctx);
    } catch (err) {
      logger.error({ err }, "Bot handler error");
      try {
        await ctx.reply("⚠️ Terjadi kesalahan. Silakan coba lagi.");
      } catch {
        // ignore reply error
      }
    }
  };
}

async function kirimQRAlipay(ctx: Context): Promise<void> {
  try {
    await ctx.replyWithPhoto(
      { source: QRALIPAY_PATH },
      {
        caption:
          "🔴 *QR Code Alipay HK*\n\nScan QR di atas untuk donasi via Alipay HK 🙏\n\n💚 *GoPay:* 0856-4145-2357",
        parse_mode: "Markdown",
        ...menuDonasi,
      },
    );
  } catch {
    await ctx.reply(
      "🔴 *QR Code Alipay HK*\n\nHubungi admin untuk QR Code.\n\n💚 *GoPay:* 0856-4145-2357",
      { parse_mode: "Markdown", ...menuDonasi },
    );
  }
}

async function kirimFile(ctx: Context, jenisApk: string): Promise<void> {
  const userId = getUserId(ctx);
  const nama = getNamaUser(ctx);

  if (!cekBolehDownload(userId)) {
    await ctx.reply(pesanDownloadGratisHabis(nama), {
      parse_mode: "Markdown",
      ...menuHabis,
    });
    return;
  }

  const fileId = ambilFileId(jenisApk);
  const item = daftarKatalog.find((v) => v.id === jenisApk);
  const namaApk = item?.nama ?? jenisApk;

  if (!fileId) {
    await ctx.reply(pesanFileBelumAda(namaApk), {
      parse_mode: "Markdown",
      ...menuKembali,
    });
    return;
  }

  tambahDownload(userId);

  await ctx.replyWithDocument(fileId, {
    caption: pesanDownloadBerhasil(userId, nama, namaApk),
    parse_mode: "Markdown",
  });
}

function setupHandlers(b: Telegraf): void {
  b.start(
    safeHandler(async (ctx) => {
      initUser(ctx);
      const userId = getUserId(ctx);
      const nama = getNamaUser(ctx);
      if (isAdmin(userId)) {
        await ctx.reply(pesanAdminPanduan(), { parse_mode: "Markdown" });
      } else {
        await ctx.reply(pesanWelcome(nama), {
          parse_mode: "Markdown",
          ...menuUtama,
        });
      }
    }),
  );

  b.command(
    "admin",
    safeHandler(async (ctx) => {
      initUser(ctx);
      if (!isAdmin(getUserId(ctx))) return ctx.reply("⛔ Akses ditolak.");
      return ctx.reply(pesanAdminPanduan(), { parse_mode: "Markdown" });
    }),
  );

  b.command(
    "status",
    safeHandler(async (ctx) => {
      initUser(ctx);
      if (!isAdmin(getUserId(ctx))) return ctx.reply("⛔ Akses ditolak.");
      return ctx.reply(pesanStatusAdmin(), { parse_mode: "Markdown" });
    }),
  );

  b.command(
    "hapus",
    safeHandler(async (ctx) => {
      initUser(ctx);
      if (!isAdmin(getUserId(ctx))) return ctx.reply("⛔ Akses ditolak.");
      const args = ctx.message.text.split(" ");
      const id = args[1];
      if (!id) return ctx.reply("Gunakan: /hapus [id]");
      const valid = daftarKatalog.find((v) => v.id === id);
      if (!valid)
        return ctx.reply(`❌ ID tidak dikenali: \`${id}\``, {
          parse_mode: "Markdown",
        });
      simpanFileId(id, "");
      return ctx.reply(`✅ File *${valid.nama}* dihapus.`, {
        parse_mode: "Markdown",
      });
    }),
  );

  b.command(
    "katalog",
    safeHandler(async (ctx) => {
      initUser(ctx);
      const userId = getUserId(ctx);
      return ctx.reply(pesanKatalog(userId), {
        parse_mode: "Markdown",
        ...menuKatalog,
      });
    }),
  );

  b.command(
    "info",
    safeHandler(async (ctx) => {
      initUser(ctx);
      return ctx.reply(pesanInfo(), {
        parse_mode: "Markdown",
        ...menuKembali,
      });
    }),
  );

  b.command(
    "donasi",
    safeHandler(async (ctx) => {
      initUser(ctx);
      return ctx.reply(pesanDonasi(), {
        parse_mode: "Markdown",
        ...menuDonasi,
      });
    }),
  );

  b.command(
    "qralipay",
    safeHandler(async (ctx) => {
      initUser(ctx);
      await kirimQRAlipay(ctx);
    }),
  );

  b.command(
    "bantuan",
    safeHandler(async (ctx) => {
      initUser(ctx);
      return ctx.reply(pesanBantuan(), {
        parse_mode: "Markdown",
        ...menuKembali,
      });
    }),
  );

  for (const item of daftarKatalog) {
    b.action(
      `minta_${item.id}`,
      safeHandler(async (ctx) => {
        initUser(ctx);
        await ctx.answerCbQuery();
        await kirimFile(ctx, item.id);
      }),
    );
  }

  b.action(
    "menu_utama",
    safeHandler(async (ctx) => {
      initUser(ctx);
      await ctx.answerCbQuery();
      return ctx.editMessageText(pesanWelcome(getNamaUser(ctx)), {
        parse_mode: "Markdown",
        ...menuUtama,
      });
    }),
  );

  b.action(
    "katalog",
    safeHandler(async (ctx) => {
      initUser(ctx);
      await ctx.answerCbQuery();
      return ctx.editMessageText(pesanKatalog(getUserId(ctx)), {
        parse_mode: "Markdown",
        ...menuKatalog,
      });
    }),
  );

  b.action(
    "info",
    safeHandler(async (ctx) => {
      initUser(ctx);
      await ctx.answerCbQuery();
      return ctx.editMessageText(pesanInfo(), {
        parse_mode: "Markdown",
        ...menuKembali,
      });
    }),
  );

  b.action(
    "donasi",
    safeHandler(async (ctx) => {
      initUser(ctx);
      await ctx.answerCbQuery();
      return ctx.editMessageText(pesanDonasi(), {
        parse_mode: "Markdown",
        ...menuDonasi,
      });
    }),
  );

  b.action(
    "qralipay",
    safeHandler(async (ctx) => {
      initUser(ctx);
      await ctx.answerCbQuery();
      await kirimQRAlipay(ctx);
    }),
  );

  b.action(
    "konfirmasi_donasi",
    safeHandler(async (ctx) => {
      initUser(ctx);
      const userId = getUserId(ctx);
      const nama = getNamaUser(ctx);
      await ctx.answerCbQuery("✅ Donasi dikonfirmasi! Terima kasih 💛");
      tandaiSudahDonasi(userId);
      return ctx.editMessageText(pesanKonfirmasiDonasi(nama), {
        parse_mode: "Markdown",
        ...menuKembali,
      });
    }),
  );

  b.action(
    "bantuan",
    safeHandler(async (ctx) => {
      initUser(ctx);
      await ctx.answerCbQuery();
      return ctx.editMessageText(pesanBantuan(), {
        parse_mode: "Markdown",
        ...menuKembali,
      });
    }),
  );

  b.on(
    message("document"),
    safeHandler(async (ctx) => {
      const userId = getUserId(ctx);
      if (!isAdmin(userId)) {
        return ctx.reply(
          "Halo! Ketik /bantuan untuk melihat semua perintah.",
          menuKembali,
        );
      }
      const caption = ctx.message.caption?.trim().toLowerCase() ?? "";
      const fileId = ctx.message.document.file_id;
      const namaFile = ctx.message.document.file_name ?? "file";
      const katalogItem = daftarKatalog.find(
        (v) => v.id === caption || v.nama.toLowerCase() === caption,
      );
      if (!katalogItem) {
        const daftarId = daftarKatalog
          .map((v) => `• \`${v.id}\``)
          .join("\n");
        return ctx.reply(
          `⚠️ Caption tidak dikenali: \`${caption || "(kosong)"}\`\n\nID yang valid:\n${daftarId}`,
          { parse_mode: "Markdown" },
        );
      }
      simpanFileId(katalogItem.id, fileId);
      logger.info({ katalogId: katalogItem.id, namaFile }, "Admin upload APK");
      return ctx.reply(
        `✅ *${katalogItem.nama}* berhasil disimpan!\n\nAnggota sudah bisa download otomatis. Ketik /status untuk cek semua file.`,
        { parse_mode: "Markdown" },
      );
    }),
  );

  b.on(
    message("text"),
    safeHandler(async (ctx) => {
      initUser(ctx);
      const nama = getNamaUser(ctx);
      if (isAdmin(getUserId(ctx))) {
        return ctx.reply(
          "Halo Admin! Kirim file APK dengan caption ID katalog.\nKetik /admin untuk panduan.",
        );
      }
      return ctx.reply(
        `Halo ${nama}! Ketik /bantuan untuk melihat semua perintah 😊`,
        menuKembali,
      );
    }),
  );

  b.catch((err, ctx) => {
    logger.error({ err, updateType: ctx.updateType }, "Bot global error");
  });
}

function launchBot(): void {
  bot = new Telegraf(token!);
  setupHandlers(bot);

  bot.launch({ dropPendingUpdates: true }).catch((err) => {
    logger.error({ err }, "Bot launch gagal, mencoba ulang dalam 10 detik...");
    setTimeout(launchBot, 10_000);
  });

  logger.info("Bot Telegram TikTok HK berhasil dijalankan 🚀");
}

export function startBot(): void {
  launchBot();

  process.once("SIGINT", () => bot?.stop("SIGINT"));
  process.once("SIGTERM", () => bot?.stop("SIGTERM"));
}

export default bot!;
