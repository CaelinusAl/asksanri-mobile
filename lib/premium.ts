import { getCustomerInfo } from "./revenuecat";
import { storageGet } from "./storage";

export type EntitlementId =
  | "vip_access"
  | "role_access"
  | "code_training_access"
  | "general_reading_access"
  | "relationship_deep_access"
  | "career_deep_access"
  | "weekly_flow_access"
  | "person_deep_access"
  | "money_deep_access";

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
    return {
      vip_access: true,
      role_access: true,
      code_training_access: true,
      general_reading_access: true,
      relationship_deep_access: true,
      career_deep_access: true,
      weekly_flow_access: true,
      person_deep_access: true,
      money_deep_access: true,
    };
  }

  const info = await getCustomerInfo();
  const active = info?.entitlements?.active;

  const status: EntitlementStatus = {
    vip_access: Boolean(active?.["vip_access"]),
    role_access: Boolean(active?.["role_access"]),
    code_training_access: Boolean(active?.["code_training_access"]),
    general_reading_access: Boolean(active?.["general_reading_access"]),
    relationship_deep_access: Boolean(active?.["relationship_deep_access"]),
    career_deep_access: Boolean(active?.["career_deep_access"]),
    weekly_flow_access: Boolean(active?.["weekly_flow_access"]),
    person_deep_access: Boolean(active?.["person_deep_access"]),
    money_deep_access: Boolean(active?.["money_deep_access"]),
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
  general_reading_access: {
    label: "Genel Okuma",
    labelEn: "General Reading",
    color: "#c084fc",
    glyph: "◈",
    offering: "general_reading",
  },
  relationship_deep_access: {
    label: "Derin İlişki",
    labelEn: "Deep Relationship",
    color: "#f472b6",
    glyph: "♡",
    offering: "relationship_deep",
  },
  career_deep_access: {
    label: "Derin Kariyer",
    labelEn: "Deep Career",
    color: "#38bdf8",
    glyph: "⬡",
    offering: "career_deep",
  },
  weekly_flow_access: {
    label: "Derin Haftalık",
    labelEn: "Deep Weekly",
    color: "#a78bfa",
    glyph: "⦿",
    offering: "weekly_flow",
  },
  person_deep_access: {
    label: "Derin Kişi",
    labelEn: "Deep Person",
    color: "#fb923c",
    glyph: "✦",
    offering: "person_deep",
  },
  money_deep_access: {
    label: "Derin Para",
    labelEn: "Deep Money",
    color: "#fbbf24",
    glyph: "◇",
    offering: "money_deep",
  },
};
