import path from "path";
import { Telegraf, Context, Markup } from "telegraf";
import { message } from "telegraf/filters";
import { logger } from "../lib/logger";
import { daftarKatalog } from "./data";
import {
  menuUtama,
  menuKatalog,
  menuPilihKatalogLink,
  menuPilihKatalogFile,
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
  pesanStatistik,
  pesanPilihKatalogLink,
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
  getDaftarPenggunaHabis,
  getTotalPengguna,
  getTotalDonatur,
  getDaftarSemuaUserId,
} from "./userTracker";
import {
  isAdmin,
  simpanFileId,
  simpanUrl,
  hapusEntri,
  ambilEntri,
  simpanPendingUrl,
  ambilPendingUrl,
  hapusPendingUrl,
  simpanPendingFileId,
  ambilPendingFileId,
  hapusPendingFileId,
  mulaiModeBroadcast,
  cekModeBroadcast,
  hapusModeBroadcast,
} from "./adminStore";

const token = process.env["TELEGRAM_BOT_TOKEN"];
if (!token) {
  throw new Error(
    "TELEGRAM_BOT_TOKEN tidak ditemukan di environment variables",
  );
}
const ADMIN_ID = 6592352872;
let bot: Telegraf;
const QRALIPAY_PATH = path.join(process.cwd(), "assets", "qralipay.jpg");

function isUrl(text: string): boolean {
  return /^https?:\/\/[^\s]+$/.test(text.trim());
}

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
        // ignore
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
  const item = daftarKatalog.find((v) => v.id === jenisApk);
  const namaApk = item?.nama ?? jenisApk;

  if (!cekBolehDownload(userId)) {
    await ctx.reply(pesanDownloadGratisHabis(nama), {
      parse_mode: "Markdown",
      ...menuHabis,
    });
    return;
  }

  const entri = ambilEntri(jenisApk);
  if (!entri || !entri.nilai) {
    await ctx.reply(pesanFileBelumAda(namaApk), {
      parse_mode: "Markdown",
      ...menuKembali,
    });
    return;
  }

  tambahDownload(userId);

  if (entri.tipe === "url") {
    await ctx.reply(pesanDownloadBerhasil(userId, nama, namaApk), {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.url(`⬇️ Download ${namaApk}`, entri.nilai)],
        [Markup.button.callback("📋 Katalog APK", "katalog")],
      ]),
    });
  } else {
    await ctx.replyWithDocument(entri.nilai, {
      caption: pesanDownloadBerhasil(userId, nama, namaApk),
      parse_mode: "Markdown",
    });
  }
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
    "approve",
    safeHandler(async (ctx) => {
      if (!isAdmin(getUserId(ctx))) {
        return ctx.reply("⛔ Akses ditolak.");
      }

      const args = ctx.message.text.split(" ");
      const userId = Number(args[1]);

      if (!userId || Number.isNaN(userId)) {
        return ctx.reply("Gunakan: /approve USER_ID");
      }

      tandaiSudahDonasi(userId);

      return ctx.reply(`✅ Donasi user ${userId} berhasil disetujui.`);
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
    "statistik",
    safeHandler(async (ctx) => {
      initUser(ctx);
      if (!isAdmin(getUserId(ctx))) return ctx.reply("⛔ Akses ditolak.");
      const habis = getDaftarPenggunaHabis();
      const total = getTotalPengguna();
      const donatur = getTotalDonatur();
      return ctx.reply(pesanStatistik(total, donatur, habis), {
        parse_mode: "Markdown",
      });
    }),
  );

  b.command(
    "broadcast",
    safeHandler(async (ctx) => {
      initUser(ctx);
      const userId = getUserId(ctx);
      if (!isAdmin(userId)) return ctx.reply("⛔ Akses ditolak.");
      mulaiModeBroadcast(userId);
      return ctx.reply(
        `📢 *Mode Broadcast Aktif*\n\nKirim pesan yang ingin dikirim ke semua pengguna.\nBisa berisi teks, emoji, format bold/italic.\n\nKirim /batal untuk membatalkan.`,
        { parse_mode: "Markdown" },
      );
    }),
  );

  b.command(
    "batal",
    safeHandler(async (ctx) => {
      const userId = getUserId(ctx);
      if (!isAdmin(userId)) return;
      hapusModeBroadcast(userId);
      return ctx.reply("❌ Broadcast dibatalkan.");
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
      hapusEntri(id);
      return ctx.reply(`✅ File *${valid.nama}* dihapus dari katalog.`, {
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
      return ctx.reply(pesanInfo(), { parse_mode: "Markdown", ...menuKembali });
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

    b.action(
      `assign_link_${item.id}`,
      safeHandler(async (ctx) => {
        const userId = getUserId(ctx);
        if (!isAdmin(userId)) return ctx.answerCbQuery("⛔ Akses ditolak.");
        const url = ambilPendingUrl(userId);
        if (!url) {
          await ctx.answerCbQuery("❌ Link sudah kadaluarsa, kirim ulang.");
          return;
        }
        simpanUrl(item.id, url);
        hapusPendingUrl(userId);
        await ctx.answerCbQuery(`✅ Disimpan ke ${item.nama}`);
        return ctx.editMessageText(
          `✅ *Link berhasil disimpan!*\n\n📦 Jenis: *${item.nama}*\n🔗 Link: \`${url}\`\n\nAnggota sudah bisa download via bot! /status`,
          { parse_mode: "Markdown" },
        );
      }),
    );
  }

  b.action(
    "batal_link",
    safeHandler(async (ctx) => {
      const userId = getUserId(ctx);
      hapusPendingUrl(userId);
      await ctx.answerCbQuery("Dibatalkan");
      return ctx.editMessageText("❌ Dibatalkan. Link tidak disimpan.");
    }),
  );

  for (const item of daftarKatalog) {
    b.action(
      `assign_file_${item.id}`,
      safeHandler(async (ctx) => {
        const userId = getUserId(ctx);
        if (!isAdmin(userId)) return ctx.answerCbQuery("⛔ Akses ditolak.");
        const fileId = ambilPendingFileId(userId);
        if (!fileId) {
          await ctx.answerCbQuery("❌ File sudah kadaluarsa, upload ulang.");
          return;
        }
        simpanFileId(item.id, fileId);
        hapusPendingFileId(userId);
        await ctx.answerCbQuery(`✅ Disimpan ke ${item.nama}`);
        return ctx.editMessageText(
          `✅ *File APK berhasil disimpan!*\n\n📦 Jenis: *${item.nama}*\n\nAnggota sudah bisa download via bot! /status`,
          { parse_mode: "Markdown" },
        );
      }),
    );
  }

  b.action(
    "batal_file",
    safeHandler(async (ctx) => {
      const userId = getUserId(ctx);
      hapusPendingFileId(userId);
      await ctx.answerCbQuery("Dibatalkan");
      return ctx.editMessageText("❌ Dibatalkan. File tidak disimpan.");
    }),
  );

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
      await b.telegram.sendMessage(
        6592352872,
        `🔔 Permintaan Donasi

👤 Nama: ${nama}
🆔 User ID: ${userId}

Gunakan:
/approve ${userId}`,
      );
      await ctx.answerCbQuery("⏳ Permintaan donasi dikirim ke admin");
      // tandaiSudahDonasi(userId);
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
      const fileId = ctx.message.document.file_id;
      const namaFile = ctx.message.document.file_name ?? "file";
      const caption = ctx.message.caption?.trim().toLowerCase() ?? "";

      // Jika ada caption yang cocok, langsung simpan
      const katalogItem = daftarKatalog.find(
        (v) => v.id === caption || v.nama.toLowerCase() === caption,
      );
      if (katalogItem) {
        simpanFileId(katalogItem.id, fileId);
        logger.info(
          { katalogId: katalogItem.id, namaFile },
          "Admin upload APK file",
        );
        return ctx.reply(
          `✅ *${katalogItem.nama}* berhasil disimpan!\n\nAnggota sudah bisa download. Ketik /status untuk cek semua file.`,
          { parse_mode: "Markdown" },
        );
      }

      // Tidak ada caption / caption tidak cocok → tampilkan tombol pilih jenis
      simpanPendingFileId(userId, fileId);
      logger.info({ namaFile }, "Admin upload file, menunggu pilih katalog");
      return ctx.reply(
        `📦 *File diterima:* \`${namaFile}\`\n\nPilih jenis APK untuk file ini:`,
        { parse_mode: "Markdown", ...menuPilihKatalogFile },
      );
    }),
  );

  b.on(
    message("text"),
    safeHandler(async (ctx) => {
      initUser(ctx);
      const userId = getUserId(ctx);
      const teks = ctx.message.text.trim();

      // Mode broadcast aktif → kirim ke semua pengguna
      if (isAdmin(userId) && cekModeBroadcast(userId)) {
        hapusModeBroadcast(userId);
        const semuaId = getDaftarSemuaUserId();
        const pesanBroadcast = `📢 *Pengumuman dari Admin*\n\n${teks}`;
        let berhasil = 0;
        let gagal = 0;
        for (const uid of semuaId) {
          try {
            await bot.telegram.sendMessage(uid, pesanBroadcast, {
              parse_mode: "Markdown",
            });
            berhasil++;
          } catch {
            gagal++;
          }
        }
        logger.info(
          { berhasil, gagal, total: semuaId.length },
          "Broadcast selesai",
        );
        return ctx.reply(
          `✅ *Broadcast selesai!*\n\n📨 Terkirim: *${berhasil}* pengguna\n❌ Gagal: *${gagal}* pengguna\n👥 Total: *${semuaId.length}* pengguna`,
          { parse_mode: "Markdown" },
        );
      }

      if (isAdmin(userId) && isUrl(teks)) {
        simpanPendingUrl(userId, teks);
        return ctx.reply(pesanPilihKatalogLink(teks), {
          parse_mode: "Markdown",
          ...menuPilihKatalogLink,
        });
      }

      if (isAdmin(userId)) {
        return ctx.reply(
          "Halo Admin! Kirim file APK atau link, atau ketik /admin untuk panduan lengkap.",
          { parse_mode: "Markdown" },
        );
      }

      const nama = getNamaUser(ctx);
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

let reconnectAttempt = 0;

function launchBot(): void {
  console.log(
    `[BOT] 🔄 Menghubungkan ke Telegram... (percobaan ke-${reconnectAttempt + 1})`,
  );

  try {
    bot = new Telegraf(token!);
  } catch (err) {
    console.error(
      "[BOT] ❌ Gagal inisialisasi Telegraf:",
      (err as Error).message,
    );
    scheduleReconnect();
    return;
  }

  setupHandlers(bot);

  bot
    .launch({ dropPendingUpdates: true })
    .then(() => {
      reconnectAttempt = 0;
      console.log(
        "[BOT] ✅ Bot Telegram TikTok HK berhasil terhubung dan aktif 🚀",
      );
      logger.info("Bot Telegram TikTok HK berhasil dijalankan 🚀");
    })
    .catch((err: Error) => {
      console.error("[BOT] ❌ Koneksi gagal:", err.message);
      logger.error({ err }, "Bot launch gagal");
      scheduleReconnect();
    });
}

function scheduleReconnect(): void {
  reconnectAttempt += 1;
  const delay = Math.min(10_000 * reconnectAttempt, 60_000);
  console.log(
    `[BOT] ⏳ Mencoba reconnect dalam ${delay / 1000} detik... (percobaan ${reconnectAttempt})`,
  );
  logger.warn({ reconnectAttempt, delay }, "Bot akan reconnect");
  setTimeout(launchBot, delay);
}

export function startBot(): void {
  launchBot();
  process.once("SIGINT", () => {
    console.log("[BOT] 🛑 Bot dihentikan (SIGINT)");
    bot?.stop("SIGINT");
  });
  process.once("SIGTERM", () => {
    console.log("[BOT] 🛑 Bot dihentikan (SIGTERM)");
    bot?.stop("SIGTERM");
  });
}

export default bot!;
