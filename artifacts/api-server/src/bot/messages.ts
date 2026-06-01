import { daftarKatalog, infoBank } from "./data";
import { sisaDownloadGratis } from "./userTracker";
import { cekTersedia, ambilEntri } from "./adminStore";

export function pesanWelcome(nama: string): string {
  return `👋 *Halo, ${nama}!*

Selamat datang di *Bot Update TikTok HK* 🇭🇰

Bot ini membantu anggota grup mendapatkan file APK TikTok Hongkong versi terbaru dengan mudah.

🔰 *Yang bisa kamu lakukan:*
• 📋 Lihat katalog jenis APK yang tersedia
• ⬇️ Download file APK langsung dari bot
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
        ? `🎁 *Sisa download gratis: ${sisa}x*`
        : `⚠️ *Download gratis habis* — Silakan donasi untuk melanjutkan`;

  const statusFile = (id: string) => (cekTersedia(id) ? "✅" : "⏳");

  return `📋 *KATALOG APK TIKTOK HK*

${infoSisa}

Pilih jenis APK yang ingin kamu download:

${statusFile("platinum_arm8")} ⭐ *Platinum arm8* —  Tidak perlu tambahkan plugin
${statusFile("universal")} ⭐ *Universal* - Tambahkan plugin universal yang ada di katalog
${statusFile("private_plus_arm8")} 🔒 *Private Plus arm8* — Tambahkan plugin private plus di katalog
${statusFile("plugin_universal")} 🔒 *Plugin universal* — Cocok digunakan untuk universal
${statusFile("plugin_private_plus")} 🔌 *Plugin* — Cocok digunakan private plus dan central
${statusFile("central")} 🏛️ *Central* — Versi Central

✅ = File tersedia  ⏳ = Segera hadir

---
💡 *Tidak tahu mau download yang mana?*
Rekomendasi menggunakan platinum karena file tidak terlalu besar dan sudah termasuk plugin`;
}

export function pesanInfo(): string {
  return `ℹ️ *INFO LAYANAN UPDATE TIKTOK HK*

📱 Admin selalu menyediakan versi APK terbaru:

⭐ *Platinum* — Stabil
🌍 *Universal* - Versi lengkap
🔒 *Private Plus* — Versi privat dengan fitur eksklusif
🔌 *Plugin* — File plugin pendukung
🏛️ *Central* — Versi central standar

🔄 File diupdate secara berkala, versi lama diganti saat ada yang baru.
✅ *Semua file sudah diuji dan aman.*

---
💡 *Cara install APK:*
1. Download file APK dari bot
2. Pengaturan → Keamanan → Izinkan sumber tidak dikenal
3. Buka file APK dan install
4. Selesai! Buka TikTok HK

*Untuk download:* ketik /katalog`;
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
• Download tanpa batas (tidak ada limit 3x)
• Prioritas saat versi baru rilis

Setelah donasi, klik *"Saya Sudah Donasi"* di bawah.
_Kami percaya kejujuran kamu_ 🙏

*${infoBank.pesanDonasi}*`;
}

export function pesanBantuan(): string {
  return `❓ *PANDUAN PENGGUNAAN BOT*

*Daftar perintah:*
/start — Tampilkan menu utama
/katalog — Pilih & download APK TikTok HK
/info — Penjelasan tiap jenis APK
/donasi — Info donasi & rekening
/qralipay — Tampilkan QR Code Alipay HK
/bantuan — Panduan ini

---
*Sistem download:*
🎁 Gratis *3x download* untuk semua anggota
💛 Donasi sukarela = download tanpa batas
✅ Donatur mendapat akses prioritas

*Ada masalah?* Hubungi admin grup secara langsung.`;
}

export function pesanAdminPanduan(): string {
  const daftar = daftarKatalog
    .map((v) => `• \`${v.id}\` → ${v.nama}`)
    .join("\n");

  return `🔧 *PANEL ADMIN*

Halo Admin! Cara upload file APK:

*Kirim file APK ke bot ini dengan caption salah satu ID berikut:*

${daftar}

*Contoh:*
Kirim file APK → caption: \`platinum_arm8\`

Bot akan otomatis menyimpan dan mengirimkan file tersebut ke pengguna yang meminta.

*Perintah admin lain:*
/status — Cek file yang sudah terupload
/statistik — Lihat pengguna yang habis jatah tapi belum donasi
/hapus [id] — Hapus file dari katalog`;
}

export function pesanStatusAdmin(): string {
  const baris = daftarKatalog.map((v) => {
    const entri = ambilEntri(v.id);
    const icon = entri ? "✅" : "❌";
    const tipe = entri ? (entri.tipe === "url" ? " (link)" : " (file)") : "";
    return `${icon} ${v.nama}${tipe} (\`${v.id}\`)`;
  });
  return `📊 *STATUS FILE KATALOG*\n\n${baris.join("\n")}`;
}

export function pesanPilihKatalogLink(url: string): string {
  const singkat = url.length > 50 ? url.slice(0, 47) + "..." : url;
  return `🔗 *Link diterima:*\n\`${singkat}\`\n\nLink ini untuk APK jenis apa?\nPilih salah satu di bawah:`;
}

export function pesanStatistik(
  totalPengguna: number,
  totalDonatur: number,
  penggunaHabis: Array<{
    namaUser: string;
    jumlahDownload: number;
    terakhirDownload?: string;
  }>,
): string {
  const habisText =
    penggunaHabis.length === 0
      ? "_Tidak ada pengguna yang habis jatah_"
      : penggunaHabis
          .map((u, i) => {
            const tgl = u.terakhirDownload
              ? new Date(u.terakhirDownload).toLocaleDateString("id-ID")
              : "-";
            return `${i + 1}. *${u.namaUser}* — ${u.jumlahDownload}x download (terakhir: ${tgl})`;
          })
          .join("\n");

  return `📈 *STATISTIK BOT*

👥 Total pengguna: *${totalPengguna}*
💛 Donatur: *${totalDonatur}*
⚠️ Habis jatah (belum donasi): *${penggunaHabis.length}*

---
⚠️ *Pengguna habis jatah & belum donasi:*

${habisText}`;
}

export function pesanDownloadBerhasil(
  userId: number,
  nama: string,
  namaApk: string,
): string {
  const sisa = sisaDownloadGratis(userId);
  const sisaText = sisa >= 999 ? "∞ (Donatur)" : `${sisa}x`;
  return `✅ *File dikirim, ${nama}!*

📦 *${namaApk}* sedang dikirim ke chat ini.
💛 Terima kasih telah mendukung bot ini.

Bot ini berjalan berkat dukungan para donatur.

Jika suatu saat ingin membantu pengembangan dan biaya operasional, donasi tambahan selalu sangat dihargai 🙏
🔢 Sisa download gratis: 

💡 *Cara install:*
1. Klik file untuk download
2. Izinkan install dari sumber tidak dikenal
3. Install & nikmati TikTok HK terbaru!`;
}

export function pesanFileBelumAda(namaApk: string): string {
  return `⏳ *File ${namaApk} belum tersedia*

Admin belum mengupload file ini. Silakan coba lagi nanti atau hubungi admin grup.

Cek ketersediaan file lain di /katalog`;
}

export function pesanDownloadGratisHabis(nama: string): string {
  return `⚠️ *Download gratis kamu sudah habis (3/3), ${nama}*

Untuk terus mendapatkan file APK TikTok terbaru, silakan lakukan donasi sukarela.

Ketik /donasi untuk melihat cara donasi. 💛

_Terima kasih sudah memahami! Donasi membantu admin terus update untuk komunitas._`;
}

export function pesanKonfirmasiDonasi(nama: string): string {
  return `✅ *Terima kasih, ${nama}!* 🙏

Kami mencatat konfirmasi donasi kamu.
Kamu sekarang mendapat akses *download tanpa batas*! 🎉

💛 Dukungan kamu sangat berarti untuk kelangsungan layanan ini.
Semoga berkah selalu! 🌟

Ketik /katalog kapan saja untuk download APK terbaru.`;
}
