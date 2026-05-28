import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

export const ADMIN_IDS: number[] = [6592352872];

const STORE_PATH = path.join(process.cwd(), "assets", "filestore.json");

interface FileStore {
  [katalogId: string]: string;
}

function loadStore(): FileStore {
  if (!existsSync(STORE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(STORE_PATH, "utf-8")) as FileStore;
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
  store[katalogId] = fileId;
  saveStore(store);
}

export function ambilFileId(katalogId: string): string | null {
  const store = loadStore();
  return store[katalogId] ?? null;
}

export function daftarFileTersedia(): string[] {
  const store = loadStore();
  return Object.keys(store);
}
