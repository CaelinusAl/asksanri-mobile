import Purchases, {
  LOG_LEVEL,
  CustomerInfo,
  PurchasesPackage,
  PURCHASES_ERROR_CODE,
} from "react-native-purchases";
import { Platform, Linking } from "react-native";
import type { EntitlementId } from "./premium";

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

    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
    await Purchases.configure({ apiKey });

    configured = true;
    return true;
  } catch (error: any) {
    configured = false;
    lastInitError = error?.message || "RevenueCat init failed";
    console.log("RC INIT ERROR =", error);
    return false;
  } finally {
    configuring = false;
  }
}

export async function getCustomerInfoSafe(): Promise<CustomerInfo | null> {
  const ok = await initRevenueCat();
  if (!ok) { console.log("RC INIT FAIL"); return null; }

  try {
    const info = await Purchases.getCustomerInfo();
    if (!info) { console.log("RC INFO NULL"); return null; }

    if (__DEV__) {
      const activeKeys = Object.keys(info.entitlements?.active || {});
      console.log("[RC] Active entitlements:", activeKeys.join(", ") || "none");
    }

    return info;
  } catch (error: any) {
    console.log("RC ERROR =", error);
    lastInitError = error?.message || "Customer info alınamadı";
    return null;
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  return await getCustomerInfoSafe();
}

export async function hasVipEntitlement(): Promise<boolean> {
  try {
    const { storageGet } = require("./storage");
    const raw = await storageGet("user_data");
    if (raw) {
      const user = JSON.parse(raw);
      const email = (user?.email || "").toLowerCase().trim();
      const ADMIN_EMAILS = [
        "caelinusai.asksanri@gmail.com",
        "selin.irmak89@gmail.com",
      ];
      if (ADMIN_EMAILS.includes(email)) return true;
    }
  } catch {}

  const info = await getCustomerInfoSafe();
  if (!info || !info.entitlements) return false;
  return Boolean(info.entitlements.active?.["vip_access"]);
}

// ─── Offering → Package resolution per entitlement ───

const OFFERING_MAP: Record<EntitlementId, string> = {
  vip_access: "default",
  role_access: "role",
  code_training_access: "code_training",
};

export async function getPackageForEntitlement(
  entitlement: EntitlementId
): Promise<PurchasesPackage | null> {
  const ok = await initRevenueCat();
  if (!ok) return null;

  try {
    const offerings = await Purchases.getOfferings();
    const offeringId = OFFERING_MAP[entitlement];
    const offering = offeringId === "default"
      ? offerings?.current
      : offerings?.all?.[offeringId];

    if (!offering) {
      if (__DEV__) console.log(`[RC] Offering "${offeringId}" not found for ${entitlement}`);
      lastInitError = "Satın alma sistemi henüz bağlanmamış.";
      return null;
    }

    return (
      offering.monthly ||
      offering.availablePackages?.find((pkg) => pkg.identifier === "$rc_monthly") ||
      offering.availablePackages?.[0] ||
      null
    );
  } catch (error: any) {
    lastInitError = error?.message || "Offerings alınamadı";
    console.log("RC OFFERINGS ERROR =", error);
    return null;
  }
}

export async function getCurrentMonthlyPackage(): Promise<PurchasesPackage | null> {
  return getPackageForEntitlement("vip_access");
}

// ─── Purchase result type ───

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

// ─── Generic purchase function ───

export async function purchaseEntitlement(
  entitlement: EntitlementId
): Promise<PremiumPurchaseResult> {
  const info = await getCustomerInfoSafe();
  if (info?.entitlements?.active?.[entitlement]) {
    return { ok: true, customerInfo: info };
  }

  const pkg = await getPackageForEntitlement(entitlement);
  if (!pkg) {
    return {
      ok: false,
      reason: "not_configured",
      message: lastInitError || "Satın alma sistemi henüz bağlanmamış.",
    };
  }

  try {
    if (__DEV__) console.log(`[RC] Purchasing ${entitlement} — pkg: ${pkg.identifier}`);
    const result = await Purchases.purchasePackage(pkg);
    return { ok: true, customerInfo: result.customerInfo };
  } catch (error: any) {
    return classifyPurchaseError(error);
  }
}

export async function buySanriPremium(): Promise<PremiumPurchaseResult> {
  return purchaseEntitlement("vip_access");
}

export async function buySanriRole(): Promise<PremiumPurchaseResult> {
  return purchaseEntitlement("role_access");
}

export async function buySanriCodeTraining(): Promise<PremiumPurchaseResult> {
  return purchaseEntitlement("code_training_access");
}

// ─── Restore — all entitlements ───

export async function restoreSanriPurchases(): Promise<boolean> {
  const ok = await initRevenueCat();
  if (!ok) return false;

  try {
    const info = await Purchases.restorePurchases();
    const activeKeys = Object.keys(info?.entitlements?.active || {});

    if (__DEV__) console.log("[RC] Restored entitlements:", activeKeys.join(", ") || "none");

    return activeKeys.length > 0;
  } catch (error) {
    console.log("RC RESTORE ERROR =", error);
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

// ─── Error classification ───

function classifyPurchaseError(error: any): PremiumPurchaseResult {
  const code = error?.code;
  const message = String(error?.message || "");

  if (
    code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR ||
    message.toLowerCase().includes("cancel")
  ) {
    return { ok: false, reason: "cancelled", message: "Satın alma iptal edildi." };
  }

  if (
    message.includes("Abonelik planınız değiştirilemiyor") ||
    message.toLowerCase().includes("cannot be changed")
  ) {
    return {
      ok: false,
      reason: "plan_change_not_allowed",
      message: "Google Play tarafında bekleyen veya çakışan bir abonelik işlemi var.",
    };
  }

  if (
    message.toLowerCase().includes("not allowed to make the purchase") ||
    message.toLowerCase().includes("billing is not available")
  ) {
    return {
      ok: false,
      reason: "purchase_not_allowed",
      message: "Bu cihazda satın alma şu anda kullanılamıyor.",
    };
  }

  if (
    message.toLowerCase().includes("already subscribed") ||
    message.toLowerCase().includes("already purchased")
  ) {
    return { ok: false, reason: "already_active", message: "Bu abonelik zaten aktif." };
  }

  if (
    message.toLowerCase().includes("pending") ||
    message.toLowerCase().includes("planı onaylayın")
  ) {
    return {
      ok: false,
      reason: "pending_google_play",
      message: "Google Play tarafında bekleyen bir abonelik onayı var.",
    };
  }

  return {
    ok: false,
    reason: "unknown",
    message: message || "Satın alma sırasında bilinmeyen bir hata oluştu.",
  };
}
