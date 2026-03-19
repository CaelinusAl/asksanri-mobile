import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const TOKEN_KEY = "sanri_token_v2";
const USER_KEY = "sanri_user_v2";

const base = "http://192.168.1.62"
function trimSlash(url: string) {
  return String(url || "").replace(/\/+$/, "");
}

function getApiBase() {
  return "https://api.asksanri.com";
}

export const API = {
  base: getApiBase(),
  ask: `${getApiBase()}/bilinc-alani/ask`,
  transcribe: `${getApiBase()}/voice/transcribe`,
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
    return parsedUser?.id
      ? String(parsedUser.id)
      : (globalThis as any).__user_id || null;
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

function parseResponseText(text: string) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

function normalizeErrorPayload(data: any, url: string, method: string, status: number) {
  if (typeof data === "string") {
    return data;
  }

  return (
    data?.detail?.error ||
    data?.detail?.message ||
    data?.detail ||
    data?.error ||
    `${method} ${url} failed: ${status}`
  );
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
    const data = parseResponseText(text);

    if (!res.ok) {
      throw new Error(
        String(normalizeErrorPayload(data, url, "GET", res.status))
      );
    }

    return data;
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw new Error("TIMEOUT");
    }
    throw e;
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
    const data = parseResponseText(text);

    if (!res.ok) {
      const err: any = new Error(
        String(normalizeErrorPayload(data, url, "POST", res.status))
      );
      err.status = res.status;
      err.response = { data };
      throw err;
    }

    return data;
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw new Error("TIMEOUT");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export async function apiPostForm(url: string, form: FormData, timeout = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = await buildHeaders(false);

    console.log("POST FORM URL =", url);
    console.log("POST FORM HEADERS =", headers);

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: form,
      signal: controller.signal,
    });

    const text = await res.text();
    const data = parseResponseText(text);

    if (!res.ok) {
      const err: any = new Error(
        String(normalizeErrorPayload(data, url, "POST_FORM", res.status))
      );
      err.status = res.status;
      err.response = { data };
      throw err;
    }

    return data;
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw new Error("TIMEOUT");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}