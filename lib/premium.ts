import { getCustomerInfo } from "./revenuecat";
import { storageGet } from "./storage";

const ADMIN_EMAILS = [
  "caelinusai.asksanri@gmail.com",
  "selin.irmak89@gmail.com",
];

async function isAdminUser(): Promise<boolean> {
  try {
    const raw = await storageGet("user_data");
    if (!raw) return false;
    const user = JSON.parse(raw);
    const email = (user?.email || "").toLowerCase().trim();
    return ADMIN_EMAILS.includes(email);
  } catch {
    return false;
  }
}

export async function hasVipEntitlement() {
  try {
    if (await isAdminUser()) return true;
    const info = await getCustomerInfo();
    return Boolean(info?.entitlements?.active?.["vip_access"]);
  } catch {
    return false;
  }
}