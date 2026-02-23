import Purchases from "react-native-purchases";
import { Platform } from "react-native";

let configured = false;

export function initRevenueCatOnce() {
  if (configured) return;
  configured = true;

  if (Platform.OS === "web") return;

  const apiKey =
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_RC_IOS_API_KEY ?? ""
      : process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY ?? "";

  if (!apiKey) return;

  Purchases.configure({ apiKey });
}

export async function getCustomerInfoSafe() {
  if (Platform.OS === "web") return null;

  try {
    return await Purchases.getCustomerInfo();
  } catch {
    return null;
  }
}