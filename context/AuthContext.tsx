import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";

type User = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  isVerified?: boolean;
  role?: "free" | "premium";
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

const USER_KEY = "sanri_user_v2";
const TOKEN_KEY = "sanri_token_v2";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, _setUser] = useState<User | null>(null);
  const [token, _setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSessionStorage = async () => {
    await SecureStore.deleteItemAsync(USER_KEY);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  };

  const bootstrapAuth = async () => {
    try {
      setIsLoading(true);

      const [rawUser, rawToken] = await Promise.all([
        SecureStore.getItemAsync(USER_KEY),
        SecureStore.getItemAsync(TOKEN_KEY),
      ]);

      if (!rawUser || !rawToken) {
        _setUser(null);
        _setToken(null);
        return;
      }

      const parsedUser = JSON.parse(rawUser) as User;

      _setUser(parsedUser);
      _setToken(rawToken);
    } catch (e) {
      console.log("bootstrapAuth error:", e);
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
    _setUser(payload.user);
    _setToken(payload.token);

    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(payload.user));
      await SecureStore.setItemAsync(TOKEN_KEY, payload.token);
    } catch (e) {
      console.log("setSession storage error:", e);
    }
  };

  const setUser = async (u: User | null) => {
    _setUser(u);

    try {
      if (!u) {
        await SecureStore.deleteItemAsync(USER_KEY);
      } else {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(u));
      }
    } catch (e) {
      console.log("setUser storage error:", e);
    }
  };

  const logout = async () => {
    _setUser(null);
    _setToken(null);
    try {
      await clearSessionStorage();
    } catch (e) {
      console.log("logout storage error:", e);
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