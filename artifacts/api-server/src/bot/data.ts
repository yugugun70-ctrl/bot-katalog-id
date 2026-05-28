export interface TiktokVersion {
  id: string;
  nama: string;
  deskripsi: string;
  tersedia: boolean;
}

export const daftarKatalog: TiktokVersion[] = [
  {
    id: "platinum_arm8",
    nama: "Platinum arm8",
    deskripsi: "Versi Platinum untuk perangkat ARM64 (HP modern, lebih cepat)",
    tersedia: true,
  },
  {
    id: "platinum_arm7",
    nama: "Platinum arm7",
    deskripsi: "Versi Platinum untuk perangkat ARM32 (HP lama/entry level)",
    tersedia: true,
  },
  {
    id: "private_plus_arm8",
    nama: "Private Plus arm8",
    deskripsi: "Versi Private Plus untuk perangkat ARM64 (HP modern, lebih cepat)",
    tersedia: true,
  },
  {
    id: "private_plus_arm7",
    nama: "Private Plus arm7",
    deskripsi: "Versi Private Plus untuk perangkat ARM32 (HP lama/entry level)",
    tersedia: true,
  },
  {
    id: "plugin",
    nama: "Plugin",
    deskripsi: "File plugin tambahan untuk TikTok HK",
    tersedia: true,
  },
  {
    id: "central",
    nama: "Central",
    deskripsi: "Versi Central TikTok HK",
    tersedia: true,
  },
];

export const infoBank = {
  nama: "GoPay & Alipay HK",
  rekening: "💚 GoPay: 0856-4145-2357\n🔴 Alipay HK: Scan QR Code di bawah",
  namaPenerima: "Admin TikTok HK Update",
  pesanDonasi:
    "Terima kasih sudah mendukung layanan update TikTok HK ini! Donasi Anda membantu admin terus menyediakan APK terbaru untuk komunitas.",
};

export const batasGratisDownload = 3;
