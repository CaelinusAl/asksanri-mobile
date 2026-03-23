/**
 * Native: expo-secure-store. Web: localStorage (SecureStore web'de tam desteklenmez).
 */
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const isWeb = Platform.OS === "web";

export async function storageGet(key: string): Promise<string | null> {
  if (isWeb) {
    try {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
      }
    } catch {
      /* ignore */
    }
    return null;
  }
  return SecureStore.getItemAsync(key);
}

export async function storageSet(key: string, value: string): Promise<void> {
  if (isWeb) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      if (__DEV__) console.log("storageSet web error:", e);
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function storageDelete(key: string): Promise<void> {
  if (isWeb) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (e) {
      if (__DEV__) console.log("storageDelete web error:", e);
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
}
