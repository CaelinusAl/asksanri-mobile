// lib/revenuecat.ts
import Purchases from "react-native-purchases";
import Constants from "expo-constants";

export async function initRevenueCat() {
  // DEV ortamda RevenueCat'i tamamen kapat
  if (__DEV__) {
    console.log("RevenueCat skipped (__DEV__)");
    return;
  }

  // API key'leri env'den alıyoruz
  const key =
    Constants.expoConfig?.extra?.platform === "ios"
      ? process.env.EXPO_PUBLIC_RC_IOS_API_KEY
      : process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY;

  if (!key) {
    console.log("[RC] Missing API key -> skip");
    return;
  }

  try {
    await Purchases.configure({ apiKey: key });
    console.log("[RC] Configured successfully");
  } catch (e) {
    console.log("[RC] Configure error", e);
  }
}