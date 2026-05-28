import { batasGratisDownload } from "./data";

interface UserData {
  jumlahDownload: number;
  sudahDonasi: boolean;
  namaUser: string;
}

const userDb = new Map<number, UserData>();

export function getUserData(userId: number, namaUser: string): UserData {
  if (!userDb.has(userId)) {
    userDb.set(userId, {
      jumlahDownload: 0,
      sudahDonasi: false,
      namaUser,
    });
  }
  return userDb.get(userId)!;
}

export function tambahDownload(userId: number): void {
  const data = userDb.get(userId);
  if (data) {
    data.jumlahDownload += 1;
  }
}

export function tandaiSudahDonasi(userId: number): void {
  const data = userDb.get(userId);
  if (data) {
    data.sudahDonasi = true;
  }
}

export function cekBolehDownload(userId: number): boolean {
  const data = userDb.get(userId);
  if (!data) return true;
  if (data.sudahDonasi) return true;
  return data.jumlahDownload < batasGratisDownload;
}

export function sisaDownloadGratis(userId: number): number {
  const data = userDb.get(userId);
  if (!data) return batasGratisDownload;
  if (data.sudahDonasi) return 999;
  return Math.max(0, batasGratisDownload - data.jumlahDownload);
}
