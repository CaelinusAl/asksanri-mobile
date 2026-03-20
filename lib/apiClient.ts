import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "user_token";
const USER_KEY = "user_data";

const RAW_BASE =
  process.env.EXPO_PUBLIC_API_BASE?.trim() || "https://api.asksanri.com";

export const API = {
  base: RAW_BASE.replace(/\/+$/, ""),
};

// ------------------ TOKEN ------------------
async function getToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

// ------------------ USER ID ------------------
async function getUserId() {
  try {
    const rawUser = await SecureStore.getItemAsync(USER_KEY);

    if (!rawUser) {
      return (globalThis as any).__user_id || null;
    }

    const parsedUser = JSON.parse(rawUser);

    if (parsedUser?.id !== undefined && parsedUser?.id !== null) {
      return String(parsedUser.id).trim();
    }

    return (globalThis as any).__user_id || null;
  } catch {
    return (globalThis as any).__user_id || null;
  }
}

// ------------------ PARSE ------------------
function parseResponseText(text: string) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

// ------------------ ERROR ------------------
function normalizeErrorPayload(
  data: any,
  url: string,
  method: string,
  status: number
) {
  if (typeof data === "string") return data;

  return (
    data?.detail?.error ||
    data?.detail?.message ||
    data?.detail ||
    data?.error ||
    `${method} ${url} failed: ${status}`
  );
}

// ------------------ HEADERS ------------------
async function buildHeaders(includeJson = true) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  const token = await getToken();
  const userId = await getUserId();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (userId && String(userId).trim()) {
    headers["X-User-Id"] = String(userId).trim();
  }

  return headers;
}

// ------------------ GET ------------------
export async function apiGetJson(url: string, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = await buildHeaders(false);

    const res = await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    const text = await res.text();
    const data = parseResponseText(text);

    if (!res.ok) {
      throw new Error(
        normalizeErrorPayload(data, url, "GET", res.status)
      );
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}

// ------------------ POST ------------------
export async function apiPostJson(
  url: string,
  body: Record<string, any>,
  timeout = 20000
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = await buildHeaders(true);

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await res.text();
    const data = parseResponseText(text);

    if (!res.ok) {
      throw new Error(
        normalizeErrorPayload(data, url, "POST", res.status)
      );
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}