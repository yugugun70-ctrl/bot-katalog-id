import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

export const ADMIN_IDS: number[] = [6592352872];

const STORE_PATH = path.join(process.cwd(), "assets", "filestore.json");

type EntriKatalog =
  | { tipe: "file"; nilai: string }
  | { tipe: "url"; nilai: string };

interface FileStore {
  [katalogId: string]: EntriKatalog;
}

function loadStore(): FileStore {
  if (!existsSync(STORE_PATH)) return {};
  try {
    const raw = JSON.parse(readFileSync(STORE_PATH, "utf-8")) as Record<string, unknown>;
    const store: FileStore = {};
    for (const [k, v] of Object.entries(raw)) {
      if (typeof v === "string") {
        store[k] = { tipe: "file", nilai: v };
      } else {
        store[k] = v as EntriKatalog;
      }
    }
    return store;
  } catch {
    return {};
  }
}

function saveStore(store: FileStore): void {
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export function isAdmin(userId: number): boolean {
  return ADMIN_IDS.includes(userId);
}

export function simpanFileId(katalogId: string, fileId: string): void {
  const store = loadStore();
  store[katalogId] = { tipe: "file", nilai: fileId };
  saveStore(store);
}

export function simpanUrl(katalogId: string, url: string): void {
  const store = loadStore();
  store[katalogId] = { tipe: "url", nilai: url };
  saveStore(store);
}

export function hapusEntri(katalogId: string): void {
  const store = loadStore();
  delete store[katalogId];
  saveStore(store);
}

export function ambilEntri(katalogId: string): EntriKatalog | null {
  const store = loadStore();
  return store[katalogId] ?? null;
}

export function ambilFileId(katalogId: string): string | null {
  const entri = ambilEntri(katalogId);
  if (!entri || entri.tipe !== "file") return null;
  return entri.nilai || null;
}

export function cekTersedia(katalogId: string): boolean {
  const entri = ambilEntri(katalogId);
  return !!entri && !!entri.nilai;
}

const pendingUrl = new Map<number, string>();

export function simpanPendingUrl(adminId: number, url: string): void {
  pendingUrl.set(adminId, url);
}

export function ambilPendingUrl(adminId: number): string | null {
  return pendingUrl.get(adminId) ?? null;
}

export function hapusPendingUrl(adminId: number): void {
  pendingUrl.delete(adminId);
}
