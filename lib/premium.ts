import { getCustomerInfo } from "./revenuecat";

export async function hasVipEntitlement() {
  try {
    const info = await getCustomerInfo();
    return Boolean(info.entitlements.active["vip_access"]);
  } catch {
    return false;
  }
}