import Purchases, { LOG_LEVEL, CustomerInfo, PurchasesPackage } from "react-native-purchases";
import { Platform } from "react-native";

let configured = false;
let configuring = false;
let lastInitError: string | null = null;

const RC_ANDROID_KEY = process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY ?? "";
const RC_IOS_KEY = process.env.EXPO_PUBLIC_RC_IOS_API_KEY ?? "";

function getApiKey() {
  return Platform.OS === "android" ? RC_ANDROID_KEY : RC_IOS_KEY;
}

export function getRevenueCatInitError() {
  return lastInitError;
}

export async function initRevenueCat(): Promise<boolean> {
  if (configured) return true;
  if (configuring) return false;

  const apiKey = getApiKey();

  if (!apiKey || apiKey.includes(" ")) {
    lastInitError = "RevenueCat public SDK key missing";
    return false;
  }

  try {
    configuring = true;
    lastInitError = null;

    Purchases.setLogLevel(LOG_LEVEL.ERROR);
    await Purchases.configure({ apiKey });

    configured = true;
    return true;
  } catch (error: any) {
    configured = false;
    lastInitError = error?.message || "RevenueCat init failed";
    return false;
  } finally {
    configuring = false;
  }
}

export async function getCustomerInfoSafe(): Promise<CustomerInfo | null> {
  const ok = await initRevenueCat();
  if (!ok) return null;

  try {
    return await Purchases.getCustomerInfo();
  } catch (error: any) {
    lastInitError = error?.message || "Customer info alınamadı";
    return null;
  }
}

export async function hasVipEntitlement(): Promise<boolean> {
  const info = await getCustomerInfoSafe();
  if (!info) return false;
  return Boolean(info.entitlements.active["vip_access"]);
}

export async function getCurrentMonthlyPackage(): Promise<PurchasesPackage | null> {
  const ok = await initRevenueCat();
  if (!ok) return null;

  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;

    if (!current) {
      lastInitError = "Satın alma sistemi henüz bağlanmamış.";
      return null;
    }

    return (
      current.monthly ||
      current.availablePackages.find((pkg) => pkg.identifier === "$rc_monthly") ||
      current.availablePackages[0] ||
      null
    );
  } catch (error: any) {
    lastInitError = error?.message || "Offerings alınamadı";
    return null;
  }
}

export async function buySanriPremium() {
  const monthlyPackage = await getCurrentMonthlyPackage();

  if (!monthlyPackage) {
    throw new Error(lastInitError || "Satın alma sistemi henüz bağlanmamış.");
  }

  return await Purchases.purchasePackage(monthlyPackage);
}