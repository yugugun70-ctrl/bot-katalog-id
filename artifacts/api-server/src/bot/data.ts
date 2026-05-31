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
    deskripsi: "Versi Platinum tidak perlu menggunakan plugin",
    tersedia: true,
  },
  {
    id: "universal",
    nama: "universal",
    deskripsi: "Versi universal harus menambahkan plugin universal",
    tersedia: true,
  },
  {
    id: "private_plus_arm8",
    nama: "Private Plus arm8",
    deskripsi: "Versi Private Plus perlu menambahkan plugin",
    tersedia: true,
  },
  {
    id: "plugin_universal",
    nama: "Plugin universal",
    deskripsi: "Plugin universal digunakan untuk versi universal",
    tersedia: true,
  },
  {
    id: "plugin_private_plus",
    nama: "Plugin private plus",
    deskripsi: "Plugin ini digunakan untuk private plus dan central",
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
