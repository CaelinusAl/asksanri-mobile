import { getCustomerInfo } from "./revenuecat";
import { isAdmin } from "./admin";

export async function hasVipEntitlement(user?: { role?: string } | null) {
  if (isAdmin(user)) {
    console.log("ADMIN VIP ACTIVE");
    return true;
  }

  try {
    const info = await getCustomerInfo();
    return Boolean(info?.entitlements?.active?.["vip_access"]);
  } catch {
    return false;
  }
}