// lib/revenuecat.ts
import Purchases from "react-native-purchases";
import { Platform } from "react-native";

let configured = false;

export function initRevenueCatOnce() {
  // ✅ Dev'de / web'de RevenueCat'i tamamen kapat
  if (__DEV__ || Platform.OS === "web") return;

  if (configured) return;
  configured = true;

  const apiKey =
    Platform.OS === "ios"
      ? (process.env.EXPO_PUBLIC_RC_IOS_API_KEY ?? "")
      : (process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY ?? "");

  // Key yoksa sessizce çık
  if (!apiKey) return;

  Purchases.configure({ apiKey });
}

export async function getCustomerInfoSafe() {
  if (__DEV__ || Platform.OS === "web") return null;

  try {
    return await Purchases.getCustomerInfo();
  } catch {
    return null;
  }
}