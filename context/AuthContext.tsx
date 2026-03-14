import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";

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
};

const AuthContext = createContext<AuthContextValue | null>(null);

const KEY = "sanri_user_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, _setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // app açılınca user'ı oku
  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(KEY);
        if (raw) _setUser(JSON.parse(raw));
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setUser = async (u: User | null) => {
    _setUser(u);
    try {
      if (!u) await SecureStore.deleteItemAsync(KEY);
      else await SecureStore.setItemAsync(KEY, JSON.stringify(u));
    } catch {
      // ignore
    }
  };

  const logout = async () => {
    await setUser(null);
  };

  const value = useMemo(() => ({ user, isLoading, setUser, logout }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}