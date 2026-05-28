import { daftarKatalog, infoBank } from "./data";
import { sisaDownloadGratis } from "./userTracker";

export function pesanWelcome(nama: string): string {
  return `👋 *Halo, ${nama}!*

Selamat datang di *Bot Update TikTok HK* 🇭🇰

Bot ini membantu anggota grup mendapatkan file APK TikTok Hongkong versi terbaru dengan mudah.

🔰 *Yang bisa kamu lakukan:*
• 📋 Lihat katalog jenis APK yang tersedia
• ⬇️ Minta file APK langsung dari admin
• 💛 Donasi sukarela untuk mendukung update

Gunakan tombol di bawah atau ketik perintah:
/katalog · /info · /donasi · /bantuan`;
}

export function pesanKatalog(userId: number): string {
  const sisa = sisaDownloadGratis(userId);
  const infoSisa =
    sisa >= 999
      ? "✅ *Donatur aktif* — Terima kasih banyak! 💛"
      : sisa > 0
        ? `🎁 *Sisa permintaan gratis: ${sisa}x*`
        : `⚠️ *Permintaan gratis habis* — Silakan donasi untuk melanjutkan`;

  return `📋 *KATALOG APK TIKTOK HK*

${infoSisa}

Pilih jenis APK yang ingin kamu minta:

⭐ *Platinum arm8* — Untuk HP modern (ARM64)
⭐ *Platinum arm7* — Untuk HP lama (ARM32)
🔒 *Private Plus arm8* — Untuk HP modern (ARM64)
🔒 *Private Plus arm7* — Untuk HP lama (ARM32)
🔌 *Plugin* — File plugin tambahan
🏛️ *Central* — Versi Central TikTok HK
💛 *Donasi* — Dukung layanan ini

---
💡 *Tidak tahu ARM berapa HP kamu?*
Cek di: Pengaturan → Tentang Ponsel → Prosesor
• ARM64/aarch64 = pilih *arm8*
• ARM32/armeabi = pilih *arm7*`;
}

export function pesanInfo(): string {
  return `ℹ️ *INFO LAYANAN UPDATE TIKTOK HK*

📱 Admin selalu menyediakan versi APK terbaru:

⭐ *Platinum* — Versi premium dengan fitur lengkap
🔒 *Private Plus* — Versi privat dengan fitur eksklusif
🔌 *Plugin* — File plugin pendukung
🏛️ *Central* — Versi central standar

🔄 File diupdate secara berkala, versi lama dihapus saat ada yang baru.

✅ *Semua file sudah diuji dan aman.*

---
💡 *Cara install APK:*
1. Download file APK yang dikirim admin
2. Pengaturan → Keamanan → Izinkan sumber tidak dikenal
3. Buka file APK dan install
4. Selesai! Buka TikTok HK

*Untuk minta file:* ketik /katalog`;
}

export function pesanDonasi(): string {
  return `💛 *DONASI SUKARELA*

Halo! Layanan update TikTok HK ini dikelola secara pribadi.
File APK cukup besar & butuh waktu untuk cari, uji, dan upload setiap versi baru.

*Donasi kamu sangat membantu kelangsungan layanan ini!*

---
💚 *GoPay:*
*0856-4145-2357*

🔴 *Alipay HK:*
Klik tombol di bawah untuk lihat QR Code Alipay HK

---
🎁 *Keuntungan Donatur:*
• Minta APK tanpa batas (tidak ada limit 3x)
• Prioritas saat versi baru rilis

Setelah donasi, klik *"Saya Sudah Donasi"* di bawah.
_Kami percaya kejujuran kamu_ 🙏

*${infoBank.pesanDonasi}*`;
}

export function pesanBantuan(): string {
  return `❓ *PANDUAN PENGGUNAAN BOT*

*Daftar perintah:*
/start — Tampilkan menu utama
/katalog — Pilih & minta jenis APK TikTok HK
/info — Penjelasan tiap jenis APK
/donasi — Info donasi & rekening
/qralipay — Tampilkan QR Code Alipay HK
/bantuan — Panduan ini

---
*Sistem permintaan file:*
🎁 Gratis *3x permintaan* untuk semua anggota
💛 Donasi sukarela = permintaan tanpa batas
✅ Donatur mendapat akses prioritas

*Ada masalah?* Hubungi admin grup secara langsung.`;
}

export function pesanMintaFile(
  userId: number,
  nama: string,
  jenisApk: string,
): string {
  const sisa = sisaDownloadGratis(userId);

  if (sisa <= 0) {
    return `⚠️ *Permintaan gratis kamu sudah habis (3/3), ${nama}*

Untuk terus mendapatkan file APK TikTok terbaru, silakan lakukan donasi sukarela.

Ketik /donasi untuk melihat cara donasi. 💛

_Terima kasih sudah memahami! Donasi membantu admin terus update untuk komunitas._`;
  }

  const item = daftarKatalog.find((v) => v.id === jenisApk);
  const namaApk = item ? item.nama : jenisApk;
  const sisaSetelah = sisa >= 999 ? "∞ (Donatur)" : `${sisa - 1}x`;

  return `✅ *Permintaan diterima, ${nama}!*

📦 Jenis APK: *${namaApk}*

📩 Admin akan segera mengirimkan file ke chat ini.
⏳ *Mohon tunggu sebentar ya.*

---
🔢 Sisa permintaan gratis kamu: *${sisaSetelah}*

💡 Setelah file diterima:
1. Klik file untuk download
2. Izinkan install dari sumber tidak dikenal
3. Install & nikmati TikTok HK terbaru!

🙏 Jika terbantu, pertimbangkan donasi sukarela → /donasi`;
}

export function pesanKonfirmasiDonasi(nama: string): string {
  return `✅ *Terima kasih, ${nama}!* 🙏

Kami mencatat konfirmasi donasi kamu.
Kamu sekarang mendapat akses *permintaan tanpa batas*! 🎉

💛 Dukungan kamu sangat berarti untuk kelangsungan layanan update TikTok HK ini.
Semoga berkah selalu! 🌟

Ketik /katalog kapan saja untuk meminta file APK terbaru.`;
}
