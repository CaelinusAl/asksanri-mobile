import * as FileSystem from "expo-file-system/legacy";

const USAGE_FILE = (FileSystem.documentDirectory || "") + "sanri_usage.json";
const FREE_LIMIT = 3;

type UsageData = {
  code: number;
  decode: number;
  resetDate: string;
};

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function loadUsage(): Promise<UsageData> {
  try {
    const info = await FileSystem.getInfoAsync(USAGE_FILE);
    if (!info.exists) return { code: 0, decode: 0, resetDate: todayKey() };
    const raw = await FileSystem.readAsStringAsync(USAGE_FILE);
    const data = JSON.parse(raw) as UsageData;
    if (data.resetDate !== todayKey()) {
      return { code: 0, decode: 0, resetDate: todayKey() };
    }
    return data;
  } catch {
    return { code: 0, decode: 0, resetDate: todayKey() };
  }
}

async function saveUsage(data: UsageData) {
  try {
    await FileSystem.writeAsStringAsync(USAGE_FILE, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export async function getUsageCount(mode: "code" | "decode"): Promise<number> {
  const data = await loadUsage();
  return data[mode];
}

export async function incrementUsage(mode: "code" | "decode"): Promise<number> {
  const data = await loadUsage();
  data[mode] += 1;
  await saveUsage(data);
  return data[mode];
}

export function getFreeLimit(): number {
  return FREE_LIMIT;
}

export async function hasReachedLimit(mode: "code" | "decode"): Promise<boolean> {
  const count = await getUsageCount(mode);
  return count >= FREE_LIMIT;
}
