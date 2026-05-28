import { Markup } from "telegraf";
import { daftarKatalog } from "./data";

export const menuUtama = Markup.inlineKeyboard([
  [
    Markup.button.callback("📋 Katalog APK", "katalog"),
    Markup.button.callback("ℹ️ Info", "info"),
  ],
  [Markup.button.callback("💛 Donasi", "donasi")],
  [Markup.button.callback("❓ Bantuan", "bantuan")],
]);

export const menuKatalog = Markup.inlineKeyboard([
  [Markup.button.callback("💛 Donasi", "donasi")],
  [Markup.button.callback("⭐ Platinum arm8", "minta_platinum_arm8")],
  [Markup.button.callback("⭐ Platinum arm7", "minta_platinum_arm7")],
  [Markup.button.callback("🔒 Private Plus arm8", "minta_private_plus_arm8")],
  [Markup.button.callback("🔒 Private Plus arm7", "minta_private_plus_arm7")],
  [Markup.button.callback("🔌 Plugin", "minta_plugin")],
  [Markup.button.callback("🏛️ Central", "minta_central")],
  [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
]);

export const menuPilihKatalogLink = Markup.inlineKeyboard([
  ...daftarKatalog.map((v) => [
    Markup.button.callback(v.nama, `assign_link_${v.id}`),
  ]),
  [Markup.button.callback("❌ Batal", "batal_link")],
]);

export const menuDonasi = Markup.inlineKeyboard([
  [Markup.button.callback("🔴 Lihat QR Alipay HK", "qralipay")],
  [Markup.button.callback("✅ Saya Sudah Donasi", "konfirmasi_donasi")],
  [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
]);

export const menuSetelahMinta = Markup.inlineKeyboard([
  [Markup.button.callback("📋 Katalog APK", "katalog")],
  [Markup.button.callback("💛 Donasi Sukarela", "donasi")],
  [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
]);

export const menuKembali = Markup.inlineKeyboard([
  [Markup.button.callback("📋 Katalog APK", "katalog")],
  [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
]);

export const menuHabis = Markup.inlineKeyboard([
  [Markup.button.callback("💛 Lihat Info Donasi", "donasi")],
  [Markup.button.callback("🏠 Menu Utama", "menu_utama")],
]);
