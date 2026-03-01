// lib/premium.ts
import Purchases from "react-native-purchases";

export async function hasVipEntitlement(): Promise<boolean> {
  try {
    const info = await Purchases.getCustomerInfo();
    // RevenueCat entitlement identifier: "vip_access"
    return Boolean(info.entitlements.active["vip_access"]);
  } catch {
    return false;
  }
}