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

export const useEntitlementStore = create<EntitlementState>((set, get) => ({
  status: {
    vip_access: false,
    role_access: false,
    code_training_access: false,
    general_reading_access: false,
    relationship_deep_access: false,
    career_deep_access: false,
    weekly_flow_access: false,
    person_deep_access: false,
    money_deep_access: false,
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
