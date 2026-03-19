import Purchases, {
  LOG_LEVEL,
  CustomerInfo,
  PurchasesPackage,
  PURCHASES_ERROR_CODE,
} from "react-native-purchases";
import { Platform, Linking } from "react-native";

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
  if (__DEV__) {
    lastInitError = "Expo Go / dev modda RevenueCat gerçek satın alma çalışmaz.";
    return false;
  }

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
    const info = await Purchases.getCustomerInfo();
    return info ?? null;
  } catch (error: any) {
    lastInitError = error?.message || "Customer info alınamadı";
    return null;
  }
}

export async function hasVipEntitlement(): Promise<boolean> {
  const info = await getCustomerInfoSafe();

  if (!info) {
    return false;
  }

  return Boolean(info.entitlements?.active?.["vip_access"]);
}

export async function getCurrentMonthlyPackage(): Promise<PurchasesPackage | null> {
  const ok = await initRevenueCat();
  if (!ok) return null;

  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings?.current;

    if (!current) {
      lastInitError = "Satın alma sistemi henüz bağlanmamış.";
      return null;
    }

    return (
      current.monthly ||
      current.availablePackages?.find((pkg) => pkg.identifier === "$rc_monthly") ||
      current.availablePackages?.[0] ||
      null
    );
  } catch (error: any) {
    lastInitError = error?.message || "Offerings alınamadı";
    return null;
  }
}

export type PremiumPurchaseResult =
  | { ok: true; customerInfo: CustomerInfo }
  | {
      ok: false;
      reason:
        | "not_configured"
        | "already_active"
        | "cancelled"
        | "pending_google_play"
        | "plan_change_not_allowed"
        | "purchase_not_allowed"
        | "unknown";
      message: string;
    };

export async function buySanriPremium(): Promise<PremiumPurchaseResult> {
  const isActive = await hasVipEntitlement();
  if (isActive) {
    const info = await getCustomerInfoSafe();
    if (info) {
      return {
        ok: true,
        customerInfo: info,
      };
    }
  }

  const monthlyPackage = await getCurrentMonthlyPackage();

  if (!monthlyPackage) {
    return {
      ok: false,
      reason: "not_configured",
      message: lastInitError || "Satın alma sistemi henüz bağlanmamış.",
    };
  }

  try {
    const result = await Purchases.purchasePackage(monthlyPackage);

    return {
      ok: true,
      customerInfo: result.customerInfo,
    };
  } catch (error: any) {
    const code = error?.code;
    const message = String(error?.message || "");

    if (
      code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR ||
      message.toLowerCase().includes("cancel")
    ) {
      return {
        ok: false,
        reason: "cancelled",
        message: "Satın alma iptal edildi.",
      };
    }

    if (
      message.includes("Abonelik planınız değiştirilemiyor") ||
      message.toLowerCase().includes("cannot be changed")
    ) {
      return {
        ok: false,
        reason: "plan_change_not_allowed",
        message:
          "Google Play tarafında bekleyen veya çakışan bir abonelik işlemi var. Önce abonelikleri yönet ekranını kontrol et.",
      };
    }

    if (
      message.toLowerCase().includes("not allowed to make the purchase") ||
      message.toLowerCase().includes("billing is not available")
    ) {
      return {
        ok: false,
        reason: "purchase_not_allowed",
        message:
          "Bu hesap veya cihaz şu anda test satın alımına uygun görünmüyor. Play test hesabını ve dahili test yüklemesini kontrol et.",
      };
    }

    if (
      message.toLowerCase().includes("already subscribed") ||
      message.toLowerCase().includes("already purchased")
    ) {
      return {
        ok: false,
        reason: "already_active",
        message: "Bu abonelik zaten aktif görünüyor.",
      };
    }

    if (
      message.toLowerCase().includes("pending") ||
      message.toLowerCase().includes("planı onaylayın")
    ) {
      return {
        ok: false,
        reason: "pending_google_play",
        message:
          "Google Play tarafında bekleyen bir abonelik onayı var. Önce oradan işlemi tamamla.",
      };
    }

    return {
      ok: false,
      reason: "unknown",
      message: message || "Satın alma sırasında bilinmeyen bir hata oluştu.",
    };
  }
}

export async function restoreSanriPurchases(): Promise<boolean> {
  const ok = await initRevenueCat();
  if (!ok) return false;

  try {
    await Purchases.restorePurchases();
    return await hasVipEntitlement();
  } catch {
    return false;
  }
}

export async function openManageSubscriptions() {
  if (Platform.OS === "android") {
    await Linking.openURL("https://play.google.com/store/account/subscriptions");
    return;
  }

  await Linking.openURL("https://apps.apple.com/account/subscriptions");
}