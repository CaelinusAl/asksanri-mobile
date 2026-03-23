// lib/deviceId.ts
import { Platform } from "react-native";
import { storageGet, storageSet } from "./storage";

const KEY = "sanri_device_id_v1";

function rand(len: number = 16) {
  return Math.random().toString(16).slice(2).padEnd(len, "0").slice(0, len);
}

function makeId() {
  const p = Platform.OS || "x";
  return (
    p +
    "_" +
    Date.now().toString(16) +
    "_" +
    rand(12) +
    "_" +
    rand(12)
  );
}

export async function getDeviceId(): Promise<string> {
  try {
    const existing = await storageGet(KEY);
    if (existing && existing.length > 8) return existing;

    const id = makeId();
    await storageSet(KEY, id);
    return id;
  } catch {
    return makeId();
  }
}