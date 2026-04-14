import { getCustomerInfo } from "./revenuecat";
import { storageGet } from "./storage";

export type EntitlementId = "vip_access" | "role_access" | "code_training_access";

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

async function checkEntitlement(id: EntitlementId): Promise<boolean> {
  try {
    if (await isAdminUser()) return true;
    const info = await getCustomerInfo();
    const active = Boolean(info?.entitlements?.active?.[id]);
    if (__DEV__) console.log(`[ENTITLEMENT] ${id} = ${active}`);
    return active;
  } catch {
    return false;
  }
}

export async function hasVipEntitlement(): Promise<boolean> {
  return checkEntitlement("vip_access");
}

export async function hasRoleAccess(): Promise<boolean> {
  return checkEntitlement("role_access");
}

export async function hasCodeTrainingAccess(): Promise<boolean> {
  return checkEntitlement("code_training_access");
}

export type EntitlementStatus = Record<EntitlementId, boolean>;

export async function getActiveEntitlements(): Promise<EntitlementStatus> {
  const admin = await isAdminUser();
  if (admin) {
    if (__DEV__) console.log("[ENTITLEMENT] Admin user — all entitlements active");
    return { vip_access: true, role_access: true, code_training_access: true };
  }

  const info = await getCustomerInfo();
  const active = info?.entitlements?.active;

  const status: EntitlementStatus = {
    vip_access: Boolean(active?.["vip_access"]),
    role_access: Boolean(active?.["role_access"]),
    code_training_access: Boolean(active?.["code_training_access"]),
  };

  if (__DEV__) {
    console.log("[ENTITLEMENT] Status:", JSON.stringify(status));
  }

  return status;
}

export const ENTITLEMENT_META: Record<EntitlementId, {
  label: string;
  labelEn: string;
  color: string;
  glyph: string;
  offering: string;
}> = {
  vip_access: {
    label: "VIP Erişim",
    labelEn: "VIP Access",
    color: "#7cf7d8",
    glyph: "☽",
    offering: "default",
  },
  role_access: {
    label: "Rol Okuma",
    labelEn: "Role Reading",
    color: "#c084fc",
    glyph: "◈",
    offering: "role",
  },
  code_training_access: {
    label: "Kod Eğitimi",
    labelEn: "Code Training",
    color: "#eab308",
    glyph: "⌬",
    offering: "code_training",
  },
};
