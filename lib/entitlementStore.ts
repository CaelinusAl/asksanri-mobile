import { create } from "zustand";
import type { EntitlementId, EntitlementStatus } from "./premium";

type EntitlementState = {
  status: EntitlementStatus;
  loading: boolean;
  lastRefreshedAt: number;

  refresh: () => Promise<void>;
  has: (id: EntitlementId) => boolean;
  setStatus: (next: EntitlementStatus) => void;
};

// REVIEW_MODE_ALL_UNLOCKED ile uyumlu — store başlangıç hâli de tüm
// entitlement'lar açık. Refresh önce tamamlanmasa bile VipWall flash
// olmasın. premium.ts bayrağı false yapıldığında refresh sonucu false
// dönecektir (kayıt güncellenir).
export const useEntitlementStore = create<EntitlementState>((set, get) => ({
  status: {
    vip_access: true,
    role_access: true,
    code_training_access: true,
    general_reading_access: true,
    relationship_deep_access: true,
    career_deep_access: true,
    weekly_flow_access: true,
    person_deep_access: true,
    money_deep_access: true,
  },
  loading: true,
  lastRefreshedAt: 0,

  refresh: async () => {
    try {
      set({ loading: true });
      const { getActiveEntitlements } = require("./premium") as typeof import("./premium");
      const result = await getActiveEntitlements();
      if (__DEV__) {
        console.log("vip:", result.vip_access);
        console.log("role:", result.role_access);
        console.log("code:", result.code_training_access);
      }
      set({ status: result, loading: false, lastRefreshedAt: Date.now() });
    } catch {
      set({ loading: false });
    }
  },

  has: (id: EntitlementId) => get().status[id],

  setStatus: (next: EntitlementStatus) => set({ status: next, lastRefreshedAt: Date.now() }),
}));
