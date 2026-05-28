export interface TiktokVersion {
  versi: string;
  ukuran: string;
  tanggal: string;
  deskripsi: string;
  linkDownload: string;
  tersedia: boolean;
}

export const daftarVersi: TiktokVersion[] = [
  {
    versi: "TikTok v39.9.4",
    ukuran: "85 MB",
    tanggal: "Mei 2026",
    deskripsi: "Versi terbaru — Fitur live streaming ditingkatkan, performa lebih cepat, bug fix kamera",
    linkDownload: "https://t.me/+LINK_VERSI_39_9_4",
    tersedia: true,
  },
  {
    versi: "TikTok v39.8.0",
    ukuran: "83 MB",
    tanggal: "Apr 2026",
    deskripsi: "Dukungan video 4K ditambahkan, perbaikan notifikasi",
    linkDownload: "https://t.me/+LINK_VERSI_39_8_0",
    tersedia: true,
  },
  {
    versi: "TikTok v39.5.3",
    ukuran: "80 MB",
    tanggal: "Mar 2026",
    deskripsi: "Stabilitas aplikasi ditingkatkan, dukungan regional HK diperbaiki",
    linkDownload: "https://t.me/+LINK_VERSI_39_5_3",
    tersedia: true,
  },
  {
    versi: "TikTok v39.2.1",
    ukuran: "78 MB",
    tanggal: "Feb 2026",
    deskripsi: "Versi stabil lama — cocok untuk perangkat dengan RAM rendah",
    linkDownload: "https://t.me/+LINK_VERSI_39_2_1",
    tersedia: true,
  },
];

export const infoBank = {
  nama: "Bank Transfer / DANA / GoPay",
  rekening: "DANA: 08xxxxxxxxxx (Ganti dengan nomor Anda)",
  namaPenerima: "Nama Anda",
  pesanDonasi:
    "Terima kasih sudah mendukung layanan update TikTok HK ini! Donasi Anda membantu kami terus menyediakan file APK terbaru untuk komunitas.",
};

export const batasGratisDownload = 3;
