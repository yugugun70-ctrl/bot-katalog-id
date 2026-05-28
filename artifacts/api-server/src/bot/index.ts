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
  daftarFileTersedia,
} from "./adminStore";

const token = process.env["TELEGRAM_BOT_TOKEN"];
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN tidak ditemukan di environment variables");
}

const bot = new Telegraf(token);
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
      "🔴 *QR Code Alipay HK*\n\nSilakan hubungi admin untuk mendapatkan QR Code Alipay HK.\n\n💚 *GoPay:* 0856-4145-2357",
      { parse_mode: "Markdown", ...menuDonasi },
    );
  }
}

async function kirimFile(
  ctx: Context,
  jenisApk: string,
  editMessage = false,
): Promise<void> {
  const userId = getUserId(ctx);
  const nama = getNamaUser(ctx);

  if (!cekBolehDownload(userId)) {
    const pesan = pesanDownloadGratisHabis(nama);
    if (editMessage) {
      await ctx.editMessageText(pesan, { parse_mode: "Markdown", ...menuHabis });
    } else {
      await ctx.reply(pesan, { parse_mode: "Markdown", ...menuHabis });
    }
    return;
  }

  const fileId = ambilFileId(jenisApk);
  const item = daftarKatalog.find((v) => v.id === jenisApk);
  const namaApk = item?.nama ?? jenisApk;

  if (!fileId) {
    const pesan = pesanFileBelumAda(namaApk);
    if (editMessage) {
      await ctx.editMessageText(pesan, { parse_mode: "Markdown", ...menuKembali });
    } else {
      await ctx.reply(pesan, { parse_mode: "Markdown", ...menuKembali });
    }
    return;
  }

  tambahDownload(userId);

  try {
    await ctx.replyWithDocument(fileId, {
      caption: pesanDownloadBerhasil(userId, nama, namaApk),
      parse_mode: "Markdown",
    });
  } catch {
    await ctx.reply(
      "❌ Terjadi kesalahan saat mengirim file. Silakan coba lagi atau hubungi admin.",
      menuKembali,
    );
  }
}

bot.start((ctx) => {
  initUser(ctx);
  const userId = getUserId(ctx);
  const nama = getNamaUser(ctx);
  if (isAdmin(userId)) {
    return ctx.reply(pesanAdminPanduan(), { parse_mode: "Markdown" });
  }
  return ctx.reply(pesanWelcome(nama), {
    parse_mode: "Markdown",
    ...menuUtama,
  });
});

bot.command("admin", (ctx) => {
  initUser(ctx);
  const userId = getUserId(ctx);
  if (!isAdmin(userId)) {
    return ctx.reply("⛔ Kamu tidak memiliki akses admin.");
  }
  return ctx.reply(pesanAdminPanduan(), { parse_mode: "Markdown" });
});

bot.command("status", (ctx) => {
  initUser(ctx);
  const userId = getUserId(ctx);
  if (!isAdmin(userId)) {
    return ctx.reply("⛔ Kamu tidak memiliki akses admin.");
  }
  return ctx.reply(pesanStatusAdmin(), { parse_mode: "Markdown" });
});

bot.command("hapus", (ctx) => {
  initUser(ctx);
  const userId = getUserId(ctx);
  if (!isAdmin(userId)) {
    return ctx.reply("⛔ Kamu tidak memiliki akses admin.");
  }
  const args = ctx.message.text.split(" ");
  const id = args[1];
  if (!id) {
    return ctx.reply("Gunakan: /hapus [id]\nContoh: /hapus platinum_arm8");
  }
  const valid = daftarKatalog.find((v) => v.id === id);
  if (!valid) {
    return ctx.reply(`❌ ID tidak ditemukan: \`${id}\`\n\nID yang valid:\n${daftarKatalog.map((v) => `• \`${v.id}\``).join("\n")}`, { parse_mode: "Markdown" });
  }
  simpanFileId(id, "");
  return ctx.reply(`✅ File *${valid.nama}* berhasil dihapus dari katalog.`, { parse_mode: "Markdown" });
});

bot.command("katalog", (ctx) => {
  initUser(ctx);
  const userId = getUserId(ctx);
  return ctx.reply(pesanKatalog(userId), {
    parse_mode: "Markdown",
    ...menuKatalog,
  });
});

bot.command("info", (ctx) => {
  initUser(ctx);
  return ctx.reply(pesanInfo(), { parse_mode: "Markdown", ...menuKembali });
});

bot.command("donasi", (ctx) => {
  initUser(ctx);
  return ctx.reply(pesanDonasi(), { parse_mode: "Markdown", ...menuDonasi });
});

bot.command("qralipay", async (ctx) => {
  initUser(ctx);
  await kirimQRAlipay(ctx);
});

bot.command("bantuan", (ctx) => {
  initUser(ctx);
  return ctx.reply(pesanBantuan(), { parse_mode: "Markdown", ...menuKembali });
});

for (const item of daftarKatalog) {
  bot.action(`minta_${item.id}`, async (ctx) => {
    initUser(ctx);
    await ctx.answerCbQuery();
    await kirimFile(ctx, item.id, false);
  });
}

bot.on(message("document"), async (ctx) => {
  const userId = getUserId(ctx);
  if (!isAdmin(userId)) {
    return ctx.reply(
      "Halo! Gunakan tombol menu atau ketik perintah ya 😊\n\nKetik /bantuan untuk melihat semua perintah.",
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
    const daftarId = daftarKatalog.map((v) => `• \`${v.id}\` → ${v.nama}`).join("\n");
    return ctx.reply(
      `⚠️ *Caption tidak dikenali:* \`${caption || "(kosong)"}\`\n\nTulis caption dengan salah satu ID ini:\n\n${daftarId}`,
      { parse_mode: "Markdown" },
    );
  }

  simpanFileId(katalogItem.id, fileId);
  logger.info({ katalogId: katalogItem.id, namaFile }, "Admin upload file APK");

  return ctx.reply(
    `✅ *File berhasil disimpan!*\n\n📦 Jenis: *${katalogItem.nama}*\n📄 File: \`${namaFile}\`\n\nAnggota sekarang bisa download langsung via bot!\n\n/status — cek semua file`,
    { parse_mode: "Markdown" },
  );
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

bot.on(message("text"), (ctx) => {
  initUser(ctx);
  const userId = getUserId(ctx);
  const nama = getNamaUser(ctx);
  if (isAdmin(userId)) {
    return ctx.reply(
      `Halo Admin! Kirim file APK ke sini dengan caption ID katalog.\n\nKetik /admin untuk panduan lengkap.`,
    );
  }
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
