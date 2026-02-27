// lib/revenuecat.ts
import Purchases from "react-native-purchases";
import Constants from "expo-constants";

function isExpoGo() {
  // Expo Go'da appOwnership = "expo"
  // Dev build / Store build'da "standalone" veya "guest" gelir
  const ownership = (Constants as any).appOwnership;
  return ownership === "expo";
}

export async function initRevenueCat() {
  // ✅ Expo Go: satın alma yok → init yapma (crash bitsin)
  if (isExpoGo()) {
    console.log("[RC] Expo Go detected → Purchases.configure skipped");
    return;
  }

  const platform = Constants.expoConfig?.extra?.platform;
  const key =
    platform === "ios"
      ? process.env.EXPO_PUBLIC_RC_IOS_API_KEY
      : process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY;

  if (!key) {
    console.warn("[RC] Missing API key (EXPO_PUBLIC_RC_*_API_KEY)");
    return;
  }

  await Purchases.configure({ apiKey: key });
  console.log("[RC] Purchases configured");
}