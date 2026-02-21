
import Purchases from "react-native-purchases";
import { Platform } from "react-native";

// ✅ RevenueCat PUBLIC SDK key (secret değil – uygulamanın içine konabilir)
// iOS ve Android ayrı key olabilir, istersen ikisini de koy.
const RC_PUBLIC_SDK_KEY = "test_CveiYtwWpfCbhKzLDyFvwdrutcq";
const RC_IOS_KEY = "REVENUECAT_PUBLIC_KEY_BURAYA";

let configured = false;

export function initRevenueCatOnce() {
  if (configured) return;
  configured = true;

  const apiKey = Platform.OS === "ios" ? RC_IOS_KEY : RC_PUBLIC_SDK_KEY;
  if (!apiKey || apiKey.includes("BURAYA")) return; // key eklenmediyse sessiz geç

  Purchases.configure({ apiKey });
}

export async function getCustomerInfoSafe() {
  try {
    return await Purchases.getCustomerInfo();
  } catch {
    return null;
  }
}