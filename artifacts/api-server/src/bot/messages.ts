import { infoBank } from "./data";
import { sisaDownloadGratis } from "./userTracker";

export function pesanWelcome(nama: string): string {
  return `👋 *Halo, ${nama}!*

Selamat datang di *Bot Update TikTok HK* 🇭🇰

Bot ini membantu anggota grup mendapatkan file APK TikTok Hongkong versi terbaru dengan mudah.

🔰 *Yang bisa kamu lakukan:*
• 📋 Lihat info versi APK terkini
• ⬇️ Minta file APK langsung dari admin
• 💛 Donasi sukarela untuk mendukung update

Gunakan tombol di bawah atau ketik perintah:
/katalog · /minta · /info · /donasi · /bantuan`;
}

export function pesanKatalog(userId: number): string {
  const sisa = sisaDownloadGratis(userId);
  const infoSisa =
    sisa >= 999
      ? "✅ *Donatur aktif* — Terima kasih banyak! 💛"
      : sisa > 0
        ? `🎁 *Sisa permintaan gratis: ${sisa}x*`
        : `⚠️ *Permintaan gratis habis* — Silakan donasi untuk melanjutkan`;

  return `📋 *INFO APK TIKTOK HONGKONG*

${infoSisa}

📱 *TikTok HK — Versi Terbaru*
📦 Ukuran: ± 80–90 MB
🔄 Diperbarui secara berkala oleh admin

📝 *Tentang file ini:*
File APK TikTok khusus versi Hongkong yang sudah diuji dan aman digunakan. Admin selalu mengupdate ke versi paling baru dan menghapus yang lama.

⬇️ Klik tombol *"Minta File APK"* untuk meminta admin mengirimkan file ke kamu.

---
💡 *Cara install setelah dapat file:*
1. Buka file APK yang dikirim bot
2. Pengaturan → Keamanan → Izinkan sumber tidak dikenal
3. Install & buka TikTok HK seperti biasa`;
}

export function pesanInfo(): string {
  return `ℹ️ *INFO VERSI TERBARU*

📱 *TikTok HK — Selalu Versi Terbaru*
🔄 Admin memperbarui file setiap ada versi baru dari TikTok HK
🗑️ Versi lama dihapus otomatis setelah ada yang baru

✅ *Jaminan keamanan:*
• Setiap file diuji terlebih dahulu sebelum dibagikan
• Khusus untuk pengguna TikTok Hongkong
• Tidak ada modifikasi — file asli dari TikTok HK

📩 *Cara dapatkan file:*
Ketik /minta dan admin akan mengirimkan APK terbaru langsung ke chat ini.

💡 *Cara install:*
1. Download file APK yang dikirim
2. Pengaturan → Keamanan → Izinkan dari sumber tidak dikenal
3. Buka file APK dan install
4. Selesai! Buka TikTok HK seperti biasa`;
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
Ketik /qralipay untuk melihat QR Code Alipay HK

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
/katalog — Info APK TikTok HK terbaru
/minta — Minta file APK ke admin
/info — Detail versi & cara install
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

export function pesanMintaFile(userId: number, nama: string): string {
  const sisa = sisaDownloadGratis(userId);

  if (sisa <= 0) {
    return `⚠️ *Permintaan gratis kamu sudah habis (3/3), ${nama}*

Untuk terus mendapatkan file APK TikTok terbaru, silakan lakukan donasi sukarela.

Ketik /donasi untuk melihat cara donasi. 💛

_Terima kasih sudah memahami! Donasi membantu admin terus update untuk komunitas._`;
  }

  const sisaSetelah = sisa >= 999 ? "∞ (Donatur)" : `${sisa - 1}x`;

  return `✅ *Permintaan diterima, ${nama}!*

📩 Admin akan segera mengirimkan file APK TikTok HK versi terbaru ke chat ini.

⏳ *Mohon tunggu sebentar* — admin akan memproses permintaan kamu.

---
📦 Yang akan kamu terima:
• File APK TikTok HK versi terbaru
• Ukuran: ± 80–90 MB

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

Ketik /minta kapan saja untuk mendapatkan file APK terbaru.`;
}
