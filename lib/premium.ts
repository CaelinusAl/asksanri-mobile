import Purchases from "react-native-purchases";

export async function hasVipEntitlement(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active["vip"];
  } catch {
    return false;
  }
}