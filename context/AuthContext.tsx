import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { getToken, clearToken } from "../lib/auth";

type User = {
  id: string;
  email?: string;
  phone?: string;
  role?: "free" | "premium";
  isPremium?: boolean;
  premiumUntil?: string | null;
  matrixRoleUnlocked?: boolean;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  setUser: (u: User | null) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const KEY = "sanri_user_v1";
const ME_URL = "https://api.asksanri.com/auth/me";
const LOGOUT_URL = "https://api.asksanri.com/auth/logout";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, _setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = async (u: User | null) => {
    _setUser(u);
    try {
      if (!u) {
        await SecureStore.deleteItemAsync(KEY);
      } else {
        await SecureStore.setItemAsync(KEY, JSON.stringify(u));
      }
    } catch {
      // ignore
    }
  };

  const clearAllAuth = async () => {
    _setUser(null);
    try {
      await SecureStore.deleteItemAsync(KEY);
    } catch {
      // ignore
    }
    try {
      await clearToken();
    } catch {
      // ignore
    }
  };

  const refreshMe = async () => {
    try {
      const token = await getToken();

      if (!token) {
        await clearAllAuth();
        return;
      }

      const res = await fetch(ME_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        await clearAllAuth();
        return;
      }

      const authenticated =
        Boolean((data as any)?.authenticated) ||
        Boolean((data as any)?.user_id) ||
        Boolean((data as any)?.id);

      if (!authenticated) {
        await clearAllAuth();
        return;
      }

      const nextUser: User = {
        id: String((data as any)?.user_id ?? (data as any)?.id ?? ""),
        email: (data as any)?.email ?? undefined,
        phone: (data as any)?.phone ?? undefined,
        role:
          ((data as any)?.plan === "premium" || (data as any)?.role === "premium")
            ? "premium"
            : "free",
        isPremium: Boolean((data as any)?.is_premium ?? (data as any)?.isPremium ?? false),
        premiumUntil: (data as any)?.premium_until ?? (data as any)?.premiumUntil ?? null,
        matrixRoleUnlocked: Boolean((data as any)?.matrix_role_unlocked ?? false),
      };

      await setUser(nextUser);
    } catch {
      await clearAllAuth();
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(KEY);
        if (raw) {
          try {
            _setUser(JSON.parse(raw));
          } catch {
            await SecureStore.deleteItemAsync(KEY);
          }
        }

        await refreshMe();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    try {
      const token = await getToken();

      await fetch(LOGOUT_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }).catch(() => {});
    } finally {
      await clearAllAuth();
    }
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      setUser,
      logout,
      refreshMe,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}