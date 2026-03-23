import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { storageDelete, storageGet, storageSet } from "../lib/storage";

type User = {
  id: string | number;
  name?: string;
  email?: string;
  phone?: string;
  isVerified?: boolean;
  role?: "free" | "premium" | string;
  isPremium?: boolean;
  premiumUntil?: string | null;
  matrixRoleUnlocked?: boolean;
};

type SessionPayload = {
  user: User;
  token: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  bootstrapAuth: () => Promise<void>;
  setSession: (payload: SessionPayload) => Promise<void>;
  setUser: (u: User | null) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "user_data";
const TOKEN_KEY = "user_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, _setUser] = useState<User | null>(null);
  const [token, _setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSessionStorage = async () => {
    await storageDelete(USER_KEY);
    await storageDelete(TOKEN_KEY);
    (globalThis as any).__token = null;
    (globalThis as any).__user_id = null;
  };

  const bootstrapAuth = async () => {
    try {
      setIsLoading(true);

      const [rawUser, rawToken] = await Promise.all([
        storageGet(USER_KEY),
        storageGet(TOKEN_KEY),
      ]);

      if (!rawUser || !rawToken) {
        _setUser(null);
        _setToken(null);
        (globalThis as any).__token = null;
        (globalThis as any).__user_id = null;
        return;
      }

      const parsedUser = JSON.parse(rawUser) as User;

      _setUser(parsedUser);
      _setToken(rawToken);

      (globalThis as any).__token = rawToken;
      (globalThis as any).__user_id =
        parsedUser?.id !== undefined && parsedUser?.id !== null
          ? String(parsedUser.id)
          : null;
    } catch (e) {
      if (__DEV__) console.log("bootstrapAuth error:", e);
      _setUser(null);
      _setToken(null);
      await clearSessionStorage();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bootstrapAuth();
  }, []);

  const setSession = async (payload: SessionPayload) => {
    const safeUser = {
      ...payload.user,
      id: String(payload.user.id),
    };

    _setUser(safeUser);
    _setToken(payload.token);

    (globalThis as any).__token = payload.token;
    (globalThis as any).__user_id = String(safeUser.id);

    try {
      await storageSet(USER_KEY, JSON.stringify(safeUser));
      await storageSet(TOKEN_KEY, payload.token);
    } catch (e) {
      if (__DEV__) console.log("setSession storage error:", e);
    }
  };

  const setUser = async (u: User | null) => {
    _setUser(u);

    try {
      if (!u) {
        await storageDelete(USER_KEY);
        (globalThis as any).__user_id = null;
      } else {
        const safeUser = { ...u, id: String(u.id) };
        await storageSet(USER_KEY, JSON.stringify(safeUser));
        (globalThis as any).__user_id = String(safeUser.id);
      }
    } catch (e) {
      if (__DEV__) console.log("setUser storage error:", e);
    }
  };

  const logout = async () => {
    _setUser(null);
    _setToken(null);

    try {
      await clearSessionStorage();
    } catch (e) {
      if (__DEV__) console.log("logout storage error:", e);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      bootstrapAuth,
      setSession,
      setUser,
      logout,
    }),
    [user, token, isLoading]
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