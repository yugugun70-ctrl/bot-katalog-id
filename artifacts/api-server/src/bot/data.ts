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
    versi: "TikTok Versi Terbaru",
    ukuran: "± 80-90 MB",
    tanggal: "Selalu diperbarui",
    deskripsi: "Versi paling terbaru yang sudah diuji dan aman untuk TikTok HK. Admin akan upload file APK terbaru secara berkala.",
    linkDownload: "DIKIRIM_LANGSUNG",
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
