import Purchases from "react-native-purchases";
import { Platform } from "react-native";

/**
 * DEV MODE: RevenueCat tamamen kapalı.
 * App stabil çalışsın diye.
 * Yayına yaklaşınca tekrar açacağız.
 */
export function initRevenueCatOnce() {
  return; // ✅ hiçbir şey yapma
}

export async function getCustomerInfoSafe() {
  return null;
}