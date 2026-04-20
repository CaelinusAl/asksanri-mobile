import Purchases, {
  LOG_LEVEL,
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
  PURCHASES_ERROR_CODE,
} from "react-native-purchases";
import { Platform, Linking } from "react-native";
import type { EntitlementId } from "./premium";

let configured = false;
let configuring = false;
let lastInitError: string | null = null;
let lastInitErrorDetail: any = null;

const RC_ANDROID_KEY = process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY ?? "";
const RC_IOS_KEY = process.env.EXPO_PUBLIC_RC_IOS_API_KEY ?? "";

function getApiKey() {
  return Platform.OS === "android" ? RC_ANDROID_KEY : RC_IOS_KEY;
}

function maskKey(k: string): string {
  if (!k) return "(empty)";
  if (k.length <= 10) return k;
  return `${k.substring(0, 8)}...${k.substring(k.length - 4)} (len=${k.length})`;
}

function logRC(msg: string, payload?: any) {
  // Always log (not just __DEV__) so we can diagnose production builds via adb logcat
  if (payload !== undefined) {
    try {
      console.log(`[RC] ${msg}`, JSON.stringify(payload, null, 2));
    } catch {
      console.log(`[RC] ${msg}`, payload);
    }
  } else {
    console.log(`[RC] ${msg}`);
  }
}

export function getRevenueCatInitError() {
  return lastInitError;
}

export function getRevenueCatInitErrorDetail() {
  return lastInitErrorDetail;
}

export async function initRevenueCat(): Promise<boolean> {
  if (configured) return true;
  if (configuring) return false;

  const apiKey = getApiKey();

  logRC(`init — platform=${Platform.OS} key=${maskKey(apiKey)}`);

  if (!apiKey || apiKey.includes(" ")) {
    lastInitError = "RevenueCat public SDK key missing";
    lastInitErrorDetail = { reason: "missing_key", platform: Platform.OS };
    logRC("init FAILED — missing key");
    return false;
  }

  try {
    configuring = true;
    lastInitError = null;
    lastInitErrorDetail = null;

    // Keep verbose logs on in production too while diagnosing paywall config.
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    await Purchases.configure({ apiKey });

    configured = true;
    logRC("init OK");
    return true;
  } catch (error: any) {
    configured = false;
    lastInitError = error?.message || "RevenueCat init failed";
    lastInitErrorDetail = {
      message: error?.message,
      code: error?.code,
      userInfo: error?.userInfo,
      readableErrorCode: error?.userInfo?.readableErrorCode,
      underlyingErrorMessage: error?.userInfo?.underlyingErrorMessage,
      raw: String(error),
    };
    logRC("init ERROR", lastInitErrorDetail);
    return false;
  } finally {
    configuring = false;
  }
}

export async function getCustomerInfoSafe(): Promise<CustomerInfo | null> {
  const ok = await initRevenueCat();
  if (!ok) { if (__DEV__) console.log("RC INIT FAIL"); return null; }

  try {
    const info = await Purchases.getCustomerInfo();
    if (!info) { if (__DEV__) console.log("RC INFO NULL"); return null; }

    if (__DEV__) {
      const activeKeys = Object.keys(info.entitlements?.active || {});
      console.log("[RC] Active entitlements:", activeKeys.join(", ") || "none");
    }

    return info;
  } catch (error: any) {
    if (__DEV__) console.log("RC ERROR =", error);
    lastInitError = error?.message || "Customer info alınamadı";
    return null;
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  return await getCustomerInfoSafe();
}

/**
 * @deprecated Use `hasVipEntitlement` from `./premium` or `useEntitlementStore` instead.
 * Kept for backward compat — delegates to the canonical premium.ts check.
 */
export async function hasVipEntitlement(): Promise<boolean> {
  const { hasVipEntitlement: canonical } = require("./premium") as typeof import("./premium");
  return canonical();
}

// ─── Package resolution per entitlement (single `default` offering) ───

/**
 * All packages live inside the RC `default` offering. Each entitlement maps to
 * one or more candidate package identifiers. Order = lookup priority (first match wins).
 * Keep $rc_* aliases so either dashboard naming convention works.
 */
const DEFAULT_OFFERING_ID = "default";

const PACKAGE_ID_MAP: Record<EntitlementId, string[]> = {
  vip_access: ["$rc_monthly", "monthly"],
  role_access: ["role", "$rc_custom_role", "$rc_lifetime"],
  code_training_access: ["code", "code_training", "$rc_custom_code"],
  general_reading_access: ["general_reading"],
  relationship_deep_access: ["relationship_deep"],
  career_deep_access: ["career_deep"],
  weekly_flow_access: ["weekly_flow"],
  person_deep_access: ["person_deep"],
  money_deep_access: ["money_deep"],
};

export async function getPackageForEntitlement(
  entitlement: EntitlementId
): Promise<PurchasesPackage | null> {
  const ok = await initRevenueCat();
  if (!ok) return null;

  try {
    const offerings = await Purchases.getOfferings();
    const offering = offerings?.current ?? offerings?.all?.[DEFAULT_OFFERING_ID];

    logRC(
      `getPackageForEntitlement ${entitlement} — currentId=${offerings?.current?.identifier ?? "null"} allIds=[${Object.keys(offerings?.all ?? {}).join(",") || "none"}]`
    );

    if (!offering) {
      lastInitError = `No "${DEFAULT_OFFERING_ID}" / current offering. Available: ${Object.keys(offerings?.all ?? {}).join(", ") || "none"}`;
      lastInitErrorDetail = {
        reason: "no_current_offering",
        entitlement,
        availableOfferings: Object.keys(offerings?.all ?? {}),
        currentOfferingId: offerings?.current?.identifier ?? null,
      };
      logRC("  ✗ no current/default offering");
      return null;
    }

    const candidates = PACKAGE_ID_MAP[entitlement] ?? [];
    const available = offering.availablePackages ?? [];
    const availableIds = available.map((p) => p.identifier);
    const availableProducts = available.map((p) => p.product?.identifier ?? "(null)");

    logRC(
      `  ${entitlement}: tried=[${candidates.join(", ")}] available=[${availableIds.join(", ")}] products=[${availableProducts.join(", ")}]`
    );

    for (const id of candidates) {
      const pkg = available.find((p) => p.identifier === id);
      if (pkg) {
        logRC(`  ✓ matched ${entitlement} → pkg=${pkg.identifier} product=${pkg.product?.identifier} price=${pkg.product?.priceString}`);
        return pkg;
      }
    }

    // Fallback only for VIP (monthly) — use offering.monthly if explicitly provided.
    if (entitlement === "vip_access" && offering.monthly) {
      logRC(`  ✓ fallback offering.monthly for vip_access → ${offering.monthly.identifier}`);
      return offering.monthly;
    }

    lastInitError = `Package bulunamadı: ${entitlement}. Denendi: [${candidates.join(", ")}] Mevcut: [${availableIds.join(", ")}]`;
    lastInitErrorDetail = {
      reason: "package_not_found",
      entitlement,
      triedIdentifiers: candidates,
      availableIdentifiers: availableIds,
      availableProducts,
      offeringId: offering.identifier,
    };
    logRC(`  ✗ no matching package for ${entitlement}`, lastInitErrorDetail);
    return null;
  } catch (error: any) {
    lastInitError = error?.message || "Offerings alınamadı";
    lastInitErrorDetail = {
      reason: "get_offerings_failed",
      message: error?.message,
      code: error?.code,
      userInfo: error?.userInfo,
      readableErrorCode: error?.userInfo?.readableErrorCode,
      underlyingErrorMessage: error?.userInfo?.underlyingErrorMessage,
      raw: String(error),
    };
    logRC("getOfferings ERROR", lastInitErrorDetail);
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
    logRC(`Purchasing ${entitlement} — pkg: ${pkg.identifier} product: ${pkg.product?.identifier}`);
    const result = await Purchases.purchasePackage(pkg);
    return { ok: true, customerInfo: result.customerInfo };
  } catch (error: any) {
    logRC("purchasePackage ERROR", {
      entitlement,
      package: pkg.identifier,
      product: pkg.product?.identifier,
      message: error?.message,
      code: error?.code,
      userInfo: error?.userInfo,
      readableErrorCode: error?.userInfo?.readableErrorCode,
      underlyingErrorMessage: error?.userInfo?.underlyingErrorMessage,
      userCancelled: error?.userCancelled,
    });
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
    if (__DEV__) console.log("RC RESTORE ERROR =", error);
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

// ─── Full diagnostic dump — call this from Debug screen / long-press on VIP ───

export type RevenueCatDiagnostics = {
  timestamp: string;
  platform: string;
  apiKeyLoaded: boolean;
  apiKeyMasked: string;
  apiKeyLength: number;
  configured: boolean;
  initError: string | null;
  initErrorDetail: any;
  customerInfo: {
    ok: boolean;
    originalAppUserId?: string;
    activeEntitlements?: string[];
    allEntitlements?: string[];
    error?: any;
  };
  offerings: {
    ok: boolean;
    currentId: string | null;
    allIds: string[];
    packages: Array<{
      offeringId: string;
      packageId: string;
      packageType: string;
      productId: string;
      price: string;
      priceCurrency: string;
    }>;
    error?: any;
  };
  packageIdMap: Record<string, string[]>;
};

export async function diagnoseRevenueCat(): Promise<RevenueCatDiagnostics> {
  const apiKey = getApiKey();
  const report: RevenueCatDiagnostics = {
    timestamp: new Date().toISOString(),
    platform: Platform.OS,
    apiKeyLoaded: Boolean(apiKey),
    apiKeyMasked: maskKey(apiKey),
    apiKeyLength: apiKey.length,
    configured: false,
    initError: null,
    initErrorDetail: null,
    customerInfo: { ok: false },
    offerings: { ok: false, currentId: null, allIds: [], packages: [] },
    packageIdMap: PACKAGE_ID_MAP,
  };

  try {
    const ok = await initRevenueCat();
    report.configured = ok;
    report.initError = lastInitError;
    report.initErrorDetail = lastInitErrorDetail;

    if (!ok) {
      logRC("DIAGNOSTIC — init failed, aborting", report);
      return report;
    }

    try {
      const info = await Purchases.getCustomerInfo();
      report.customerInfo = {
        ok: true,
        originalAppUserId: info?.originalAppUserId,
        activeEntitlements: Object.keys(info?.entitlements?.active || {}),
        allEntitlements: Object.keys(info?.entitlements?.all || {}),
      };
    } catch (error: any) {
      report.customerInfo = {
        ok: false,
        error: {
          message: error?.message,
          code: error?.code,
          userInfo: error?.userInfo,
          readableErrorCode: error?.userInfo?.readableErrorCode,
          underlyingErrorMessage: error?.userInfo?.underlyingErrorMessage,
        },
      };
    }

    try {
      const offerings = await Purchases.getOfferings();
      report.offerings.ok = true;
      report.offerings.currentId = offerings?.current?.identifier ?? null;
      report.offerings.allIds = Object.keys(offerings?.all ?? {});

      const packagesList: typeof report.offerings.packages = [];
      for (const [offeringId, offering] of Object.entries(offerings?.all ?? {})) {
        const pkgs = (offering as PurchasesOffering).availablePackages ?? [];
        for (const pkg of pkgs) {
          packagesList.push({
            offeringId,
            packageId: pkg.identifier,
            packageType: String(pkg.packageType),
            productId: pkg.product?.identifier ?? "(null)",
            price: pkg.product?.priceString ?? "(null)",
            priceCurrency: pkg.product?.currencyCode ?? "(null)",
          });
        }
      }
      report.offerings.packages = packagesList;
    } catch (error: any) {
      report.offerings.ok = false;
      report.offerings.error = {
        message: error?.message,
        code: error?.code,
        userInfo: error?.userInfo,
        readableErrorCode: error?.userInfo?.readableErrorCode,
        underlyingErrorMessage: error?.userInfo?.underlyingErrorMessage,
      };
    }

    logRC("DIAGNOSTIC", report);
    return report;
  } catch (error: any) {
    report.initError = error?.message || "diagnostic failed";
    report.initErrorDetail = { message: error?.message, raw: String(error) };
    logRC("DIAGNOSTIC FATAL", report.initErrorDetail);
    return report;
  }
}

// ─── Error classification ───

function classifyPurchaseError(error: any): PremiumPurchaseResult {
  const code = error?.code;
  const message = String(error?.message || "");
  const storeName = Platform.OS === "ios" ? "App Store" : "Google Play";

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
      message: `${storeName} tarafında bekleyen veya çakışan bir abonelik işlemi var.`,
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
      message: `${storeName} tarafında bekleyen bir abonelik onayı var.`,
    };
  }

  return {
    ok: false,
    reason: "unknown",
    message: message || "Satın alma sırasında bilinmeyen bir hata oluştu.",
  };
}
