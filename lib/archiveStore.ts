/**
 * Archive — kullanıcının yazdığı yankıların yerel arşivi.
 * AsyncStorage kullanır (SecureStore'un 2KB limiti yok).
 * Anonim, login gerektirmez. Cihaz-yerel.
 *
 * Premium katmanda backend sync eklenir (faz 2).
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_ENTRIES = "sanri_archive_entries_v1";
const MAX_ENTRIES = 365; // Yaklaşık 1 yıl

export type ArchiveEntry = {
  id: string;
  createdAt: string; // ISO
  /** Bugünün cümlesi — Sanrı'nın çağrısı */
  prompt: string;
  /** Kullanıcının yazdığı yankı */
  userText: string;
  /** Sanrı'nın yansıması (opsiyonel — chat'ten dönerse kaydedilir) */
  sanriReply?: string;
  tone: "durulma" | "hareket" | "derinlesme";
  lang: "tr" | "en";
};

export async function getArchive(): Promise<ArchiveEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_ENTRIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ArchiveEntry[];
  } catch {
    return [];
  }
}

export async function appendArchive(
  entry: Omit<ArchiveEntry, "id" | "createdAt">
): Promise<ArchiveEntry> {
  const all = await getArchive();
  const fresh: ArchiveEntry = {
    ...entry,
    id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const next = [fresh, ...all].slice(0, MAX_ENTRIES);
  await AsyncStorage.setItem(KEY_ENTRIES, JSON.stringify(next));
  return fresh;
}

export async function updateArchiveReply(
  id: string,
  sanriReply: string
): Promise<void> {
  const all = await getArchive();
  const next = all.map((e) => (e.id === id ? { ...e, sanriReply } : e));
  await AsyncStorage.setItem(KEY_ENTRIES, JSON.stringify(next));
}

export async function deleteArchiveEntry(id: string): Promise<void> {
  const all = await getArchive();
  const next = all.filter((e) => e.id !== id);
  await AsyncStorage.setItem(KEY_ENTRIES, JSON.stringify(next));
}

export async function clearArchive(): Promise<void> {
  await AsyncStorage.removeItem(KEY_ENTRIES);
}
