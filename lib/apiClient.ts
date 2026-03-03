// lib/apiClient.ts
import Constants from "expo-constants";
import { getDeviceId } from "./deviceId";

type Json = Record<string, any>;

function trimSlash(url: string) {
  return String(url || "").replace(/\/+$/, "");
}

function getApiBase() {
  const extra = (Constants.expoConfig as any)?.extra || {};
  const fromExtra = extra?.EXPO_PUBLIC_API_BASE || extra?.apiBase || "";
  const fromEnv = (process as any)?.env?.EXPO_PUBLIC_API_BASE || "";
  const base = String(fromExtra || fromEnv || "https://sanri-api-2.onrender.com");
  return trimSlash(base);
}

export const API = {
  base: getApiBase(),
  ask: "",
  transcribe: "",
};

API.ask = API.base + "/bilinc-alani/ask";
API.transcribe = API.base + "/api/voice/transcribe";

function timeoutController(ms: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  return { controller, cancel: () => clearTimeout(t) };
}

async function buildHeaders(extra?: Record<string, string>) {
  const deviceId = await getDeviceId();
  return {
    Accept: "application/json",
    "X-User-Id": String(deviceId),
    ...(extra || {}),
  };
}

function isJsonResponse(contentType: string | null) {
  const ct = (contentType || "").toLowerCase();
  return ct.includes("application/json") || ct.includes("application/problem+json");
}

export async function apiPostJson<T = any>(url: string, body: any, timeoutMs = 60000): Promise<T> {
  const t = timeoutController(timeoutMs);
  try {
    const headers = await buildHeaders({ "Content-Type": "application/json" });

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: t.controller.signal,
    });

    const raw = await res.text();
    const ct = res.headers.get("content-type");

    // JSON değilse: Render/Cloudflare HTML vb.
    if (!isJsonResponse(ct)) {
      const err: any = new Error("NON_JSON_RESPONSE");
      err.status = res.status;
      err.contentType = ct;
      err.raw = raw?.slice(0, 800);
      throw err;
    }

    let data: any = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      const err: any = new Error("INVALID_JSON");
      err.status = res.status;
      err.raw = raw?.slice(0, 800);
      throw err;
    }

    if (!res.ok) {
      const err: any = new Error("HTTP_" + res.status);
      err.status = res.status;
      err.detail = data?.detail ?? data;
      throw err;
    }

    return data as T;
  } catch (e: any) {
    const msg = String(e?.message || e);
    if (msg.toLowerCase().includes("abort")) {
      throw new Error("TIMEOUT");
    }
    throw e;
  } finally {
    t.cancel();
  }
}

export async function apiPostForm<T = any>(url: string, form: FormData, timeoutMs = 60000): Promise<T> {
  const t = timeoutController(timeoutMs);
  try {
    const headers = await buildHeaders(); // Content-Type koyma (FormData boundary bozulur)

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: form,
      signal: t.controller.signal,
    });

    const raw = await res.text();
    const ct = res.headers.get("content-type");

    if (!isJsonResponse(ct)) {
      const err: any = new Error("NON_JSON_RESPONSE");
      err.status = res.status;
      err.contentType = ct;
      err.raw = raw?.slice(0, 800);
      throw err;
    }

    let data: any = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      const err: any = new Error("INVALID_JSON");
      err.status = res.status;
      err.raw = raw?.slice(0, 800);
      throw err;
    }

    if (!res.ok) {
      const err: any = new Error("HTTP_" + res.status);
      err.status = res.status;
      err.detail = data?.detail ?? data;
      throw err;
    }

    return data as T;
  } catch (e: any) {
    const msg = String(e?.message || e);
    if (msg.toLowerCase().includes("abort")) {
      throw new Error("TIMEOUT");
    }
    throw e;
  } finally {
    t.cancel();
  }
}