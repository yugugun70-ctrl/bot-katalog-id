import { Markup } from "telegraf";

export const menuUtama = Markup.inlineKeyboard([
  [
    Markup.button.callback("📋 Katalog APK", "katalog"),
    Markup.button.callback("⬇️ Download", "download"),
  ],
  [
    Markup.button.callback("ℹ️ Info Terbaru", "info"),
    Markup.button.callback("💛 Donasi", "donasi"),
  ],
  [Markup.button.callback("❓ Bantuan", "bantuan")],
]);

export const menuKatalog = (versiBebas: boolean) =>
  Markup.inlineKeyboard([
    [Markup.button.callback("⬇️ Download Versi Terbaru", "download_terbaru")],
    [Markup.button.callback("📜 Semua Versi", "semua_versi")],
    [
      versiBebas
        ? Markup.button.callback("💛 Dukung Kami (Donasi)", "donasi")
        : Markup.button.callback("💛 Donasi untuk Akses Penuh", "donasi"),
    ],
    [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
  ]);

export const menuDownload = Markup.inlineKeyboard([
  [Markup.button.callback("📱 v39.9.4 (Terbaru)", "dl_0")],
  [Markup.button.callback("📱 v39.8.0", "dl_1")],
  [Markup.button.callback("📱 v39.5.3", "dl_2")],
  [Markup.button.callback("📱 v39.2.1", "dl_3")],
  [Markup.button.callback("💛 Donasi", "donasi")],
  [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
]);

export const menuDonasi = Markup.inlineKeyboard([
  [Markup.button.callback("✅ Saya Sudah Donasi", "konfirmasi_donasi")],
  [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
]);

export const menuKembali = Markup.inlineKeyboard([
  [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
]);
