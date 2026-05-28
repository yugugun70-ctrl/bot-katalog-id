import { Markup } from "telegraf";

export const menuUtama = Markup.inlineKeyboard([
  [
    Markup.button.callback("📋 Info APK", "katalog"),
    Markup.button.callback("⬇️ Minta File APK", "minta"),
  ],
  [
    Markup.button.callback("ℹ️ Info Versi", "info"),
    Markup.button.callback("💛 Donasi", "donasi"),
  ],
  [Markup.button.callback("❓ Bantuan", "bantuan")],
]);

export const menuKatalog = Markup.inlineKeyboard([
  [Markup.button.callback("⬇️ Minta File APK", "minta")],
  [Markup.button.callback("💛 Dukung Kami (Donasi Sukarela)", "donasi")],
  [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
]);

export const menuDonasi = Markup.inlineKeyboard([
  [Markup.button.callback("🔴 Lihat QR Alipay HK", "qralipay")],
  [Markup.button.callback("✅ Saya Sudah Donasi", "konfirmasi_donasi")],
  [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
]);

export const menuSetelahMinta = Markup.inlineKeyboard([
  [Markup.button.callback("💛 Donasi Sukarela", "donasi")],
  [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
]);

export const menuKembali = Markup.inlineKeyboard([
  [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
]);

export const menuHabis = Markup.inlineKeyboard([
  [Markup.button.callback("💛 Lihat Info Donasi", "donasi")],
  [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
]);
