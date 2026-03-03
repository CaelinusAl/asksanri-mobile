// lib/deviceId.ts
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

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
    const existing = await SecureStore.getItemAsync(KEY);
    if (existing && existing.length > 8) return existing;

    const id = makeId();
    await SecureStore.setItemAsync(KEY, id);
    return id;
  } catch {
    return makeId();
  }
}