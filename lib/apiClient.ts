import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const TOKEN_KEY = "sanri_token_v2";

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
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function apiGetJson(url: string, timeout = 15000) {
  const token = await getToken();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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
  const token = await getToken();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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