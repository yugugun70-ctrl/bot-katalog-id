import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { batasGratisDownload } from "./data";

interface UserData {
  jumlahDownload: number;
  sudahDonasi: boolean;
  namaUser: string;
  pertamaKali: string;
  terakhirDownload?: string;
}

interface UserStore {
  [userId: string]: UserData;
}

const STORE_PATH = path.join(process.cwd(), "assets", "userstore.json");

function loadStore(): UserStore {
  if (!existsSync(STORE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(STORE_PATH, "utf-8")) as UserStore;
  } catch {
    return {};
  }
}

function saveStore(store: UserStore): void {
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export function getUserData(userId: number, namaUser: string): UserData {
  const store = loadStore();
  const key = String(userId);
  if (!store[key]) {
    store[key] = {
      jumlahDownload: 0,
      sudahDonasi: false,
      namaUser,
      pertamaKali: new Date().toISOString(),
    };
    saveStore(store);
  }
  return store[key]!;
}

export function tambahDownload(userId: number): void {
  const store = loadStore();
  const key = String(userId);
  if (store[key]) {
    store[key]!.jumlahDownload += 1;
    store[key]!.terakhirDownload = new Date().toISOString();
    saveStore(store);
  }
}

export function tandaiSudahDonasi(userId: number): void {
  const store = loadStore();
  const key = String(userId);
  if (store[key]) {
    store[key]!.sudahDonasi = true;
    saveStore(store);
  }
}

export function cekBolehDownload(userId: number): boolean {
  const store = loadStore();
  const data = store[String(userId)];
  if (!data) return true;
  if (data.sudahDonasi) return true;
  return data.jumlahDownload < batasGratisDownload;
}

export function sisaDownloadGratis(userId: number): number {
  const store = loadStore();
  const data = store[String(userId)];
  if (!data) return batasGratisDownload;
  if (data.sudahDonasi) return 999;
  return Math.max(0, batasGratisDownload - data.jumlahDownload);
}

export function getDaftarPenggunaHabis(): UserData[] {
  const store = loadStore();
  return Object.values(store).filter(
    (u) => !u.sudahDonasi && u.jumlahDownload >= batasGratisDownload,
  );
}

export function getTotalPengguna(): number {
  return Object.keys(loadStore()).length;
}

export function getTotalDonatur(): number {
  return Object.values(loadStore()).filter((u) => u.sudahDonasi).length;
}
