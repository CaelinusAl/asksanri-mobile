import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const TOKEN_KEY = "sanri_token_v2";
const USER_KEY = "sanri_user_v2";

function trimSlash(url: string) {
  return String(url || "").replace(/\/+$/, "");
}

function getApiBase() {
  const extra = (Constants.expoConfig as any)?.extra || {};
  const fromExtra = extra?.EXPO_PUBLIC_API_BASE || extra?.apiBase || "";
  const fromEnv = (process as any)?.env?.EXPO_PUBLIC_API_BASE || "";
  const base = String(fromExtra || fromEnv || "https://api.asksanri.com");
  return trimSlash(base);
}

export const API = {
  base: getApiBase(),
};

async function getToken() {
  const stored = await SecureStore.getItemAsync(TOKEN_KEY);
  return stored || (globalThis as any).__token || null;
}

async function getUserId() {
  try {
    const rawUser = await SecureStore.getItemAsync(USER_KEY);
    if (!rawUser) return (globalThis as any).__user_id || null;

    const parsedUser = JSON.parse(rawUser);
    return parsedUser?.id ? String(parsedUser.id) : (globalThis as any).__user_id || null;
  } catch {
    return (globalThis as any).__user_id || null;
  }
}

async function buildHeaders(isJson = false) {
  const token = await getToken();
  const userId = await getUserId();

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (userId) {
    headers["X-User-Id"] = userId;
  }

  return headers;
}

export async function apiGetJson(url: string, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = await buildHeaders(false);

    console.log("GET URL =", url);
    console.log("GET HEADERS =", headers);

    const res = await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    const text = await res.text();
    let data: any = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      throw new Error(
        typeof data === "string"
          ? data
          : data?.detail || `GET ${url} failed: ${res.status}`
      );
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}

export async function apiPostJson(url: string, body: any, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = await buildHeaders(true);

    console.log("POST URL =", url);
    console.log("POST HEADERS =", headers);
    console.log("POST BODY =", body);

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await res.text();
    let data: any = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      throw new Error(
        typeof data === "string"
          ? data
          : data?.detail || `POST ${url} failed: ${res.status}`
      );
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}