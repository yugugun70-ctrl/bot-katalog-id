import { daftarVersi, infoBank } from "./data";
import { sisaDownloadGratis } from "./userTracker";

export function pesanWelcome(nama: string): string {
  return `👋 *Halo, ${nama}!*

Selamat datang di *TikTok HK Update Bot* 🇭🇰

Bot ini menyediakan file APK TikTok versi terbaru khusus untuk pengguna *TikTok Hongkong*.

🔰 *Apa yang bisa kamu lakukan di sini?*
• 📋 Lihat katalog versi APK yang tersedia
• ⬇️ Download APK langsung via Telegram
• ℹ️ Cek info & perubahan versi terbaru
• 💛 Donasi sukarela untuk mendukung update

Gunakan tombol di bawah atau ketik perintah:
/katalog · /download · /info · /donasi · /bantuan`;
}

export function pesanKatalog(userId: number): string {
  const sisa = sisaDownloadGratis(userId);
  const infoSisa =
    sisa >= 999
      ? "✅ *Akses penuh* — Terima kasih atas donasinya! 💛"
      : sisa > 0
        ? `🎁 *Sisa download gratis: ${sisa}x*`
        : `⚠️ *Download gratis habis* — Silakan donasi untuk melanjutkan`;

  let teks = `📋 *KATALOG APK TIKTOK HONGKONG*\n\n${infoSisa}\n\n`;

  daftarVersi.forEach((v, i) => {
    const badge = i === 0 ? "🆕 " : "";
    teks += `${badge}*${v.versi}*\n`;
    teks += `📦 Ukuran: ${v.ukuran}  |  📅 ${v.tanggal}\n`;
    teks += `📝 ${v.deskripsi}\n\n`;
  });

  teks += `_Pilih aksi di bawah:_`;
  return teks;
}

export function pesanInfo(): string {
  const terbaru = daftarVersi[0];
  return `ℹ️ *INFO VERSI TERBARU*

🆕 *${terbaru.versi}*
📅 Dirilis: ${terbaru.tanggal}
📦 Ukuran: ${terbaru.ukuran}

📝 *Yang baru di versi ini:*
${terbaru.deskripsi}

✅ Versi ini sudah diuji dan aman digunakan untuk TikTok HK.

💡 *Cara install:*
1. Download file APK
2. Buka Pengaturan → Keamanan → Izinkan dari sumber tidak dikenal
3. Buka file APK dan install
4. Selesai! Buka TikTok HK seperti biasa`;
}

export function pesanDonasi(): string {
  return `💛 *DONASI SUKARELA*

Halo! Bot dan layanan update ini kami kelola secara pribadi.
File APK yang kami sediakan cukup besar dan membutuhkan:
• 💾 Biaya penyimpanan & bandwidth
• ⏰ Waktu untuk mencari & menguji setiap versi
• 🔄 Update rutin setiap ada versi baru

*Donasi Anda sangat membantu kelangsungan layanan ini!*

🏦 *Info Transfer:*
${infoBank.rekening}
*A.n.* ${infoBank.namaPenerima}

💬 *${infoBank.pesanDonasi}*

---
🎁 *Keuntungan Donatur:*
• Download tanpa batas (tidak ada limit 3x)
• Notifikasi prioritas saat versi baru rilis

Setelah donasi, klik tombol *"Saya Sudah Donasi"* di bawah.
_(Kami percaya kejujuran Anda)_ 🙏`;
}

export function pesanBantuan(): string {
  return `❓ *PANDUAN PENGGUNAAN BOT*

*Perintah yang tersedia:*

/start — Mulai & tampilkan menu utama
/katalog — Lihat daftar semua versi APK
/download — Langsung ke menu download
/info — Info versi TikTok terbaru
/donasi — Cara donasi & info rekening
/bantuan — Tampilkan panduan ini

---
*Sistem Download:*
• 🎁 Gratis *3x download* untuk semua pengguna
• 💛 Donasi sukarela untuk download tanpa batas
• ✅ Donatur mendapat akses prioritas & tanpa batas

*Masalah atau pertanyaan?*
Hubungi admin grup langsung.`;
}

export function pesanDownloadVersi(
  userId: number,
  indexVersi: number,
): string {
  const v = daftarVersi[indexVersi];
  const sisa = sisaDownloadGratis(userId);

  if (sisa <= 0) {
    return `⚠️ *Download gratis kamu sudah habis (3/3)*

Untuk tetap mendapatkan file APK TikTok terbaru, silakan lakukan donasi sukarela.

Ketik /donasi untuk melihat cara donasi. 💛

_Terima kasih sudah memahami! Donasi membantu kami terus update._`;
  }

  const sisaSetelah = sisa >= 999 ? "∞ (Donatur)" : `${sisa - 1}x`;

  return `✅ *${v.versi}*

📦 Ukuran: ${v.ukuran}
📅 ${v.tanggal}
📝 ${v.deskripsi}

⬇️ *Link Download:*
${v.linkDownload}

---
🔢 Sisa download gratis kamu: *${sisaSetelah}*

💡 *Cara install:*
1. Download file APK dari link di atas
2. Pengaturan → Keamanan → Izinkan sumber tidak dikenal
3. Install APK → Buka TikTok HK

🙏 Jika terbantu, pertimbangkan donasi sukarela ya! /donasi`;
}

export function pesanKonfirmasiDonasi(nama: string): string {
  return `✅ *Terima kasih, ${nama}!*

Kami mencatat konfirmasi donasi kamu. 🙏
Kamu sekarang mendapat akses *download tanpa batas*!

💛 Dukungan kamu sangat berarti untuk kelangsungan layanan ini.
Semoga berkah! 🌟

Ketik /download untuk mulai download kapan saja.`;
}
