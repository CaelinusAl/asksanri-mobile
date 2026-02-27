import { getCustomerInfo } from "./revenuecat";

export async function isPremiumUser(): Promise<boolean> {
  const info = await getCustomerInfo();

  if (!info) return false;

  return !!info.entitlements.active["premium"];
}
