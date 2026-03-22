import { API_BASE } from "./config";
import { storageGet } from "./storage";

const TOKEN_KEY = "user_token";
const USER_KEY = "user_data";

export const API = {
  base: API_BASE,
  ask: `${API_BASE}/bilinc-alani/ask`,
  transcribe: `${API_BASE}/api/voice/transcribe`,
  ritualPack: `${API_BASE}/content/ritual-pack`,
  deviceRegister: `${API_BASE}/device/register`,
  dailyStream: `${API_BASE}/content/daily-stream`,
};

// ------------------ TOKEN ------------------
async function getToken() {
  try {
    return await storageGet(TOKEN_KEY);
  } catch {
    return null;
  }
}

// ------------------ USER ID ------------------
async function getUserId() {
  try {
    const rawUser = await storageGet(USER_KEY);

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

// ------------------ POST FORM (multipart) ------------------
export async function apiPostForm(
  url: string,
  formData: FormData,
  timeout = 60000
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const token = await getToken();
    const userId = await getUserId();

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (userId && String(userId).trim()) {
      headers["X-User-Id"] = String(userId).trim();
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
      signal: controller.signal,
    });

    const text = await res.text();
    const data = parseResponseText(text);

    if (!res.ok) {
      throw new Error(
        normalizeErrorPayload(data, url, "POST-FORM", res.status)
      );
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}

// ------------------ DELETE ------------------
export async function apiDeleteJson(url: string, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = await buildHeaders(true);

    const res = await fetch(url, {
      method: "DELETE",
      headers,
      signal: controller.signal,
    });

    const text = await res.text();
    const data = parseResponseText(text);

    if (!res.ok) {
      throw new Error(
        normalizeErrorPayload(data, url, "DELETE", res.status)
      );
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}