// lib/apiClient.ts
import { getToken } from "./auth";

type ApiFetchInit = RequestInit & { json?: any };

export async function apiFetch(url: string, init: ApiFetchInit = {}) {
  const token = await getToken();

  const headers: Record<string, string> = {};
  // mevcut header'ları kopyala
  if (init.headers) {
    const h: any = init.headers as any;
    Object.keys(h).forEach((k) => (headers[k] = String(h[k])));
  }

  if (token) headers["Authorization"] = "Bearer " + token;

  // json helper
  let body = init.body as any;
  if (init.json !== undefined) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
    headers["Accept"] = headers["Accept"] || "application/json";
    body = JSON.stringify(init.json);
  }

  const res = await fetch(url, {
    method: init.method || "GET",
    headers,
    body,
  });

  return res;
}

export async function apiJson(url: string, init: ApiFetchInit = {}) {
  const res = await apiFetch(url, init);
  const raw = await res.text();

  let data: any = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { raw: raw };
  }

  if (!res.ok) {
    const msg = String((data && (data.detail || data.message)) || ("HTTP " + res.status));
    throw new Error(msg);
  }

  return data;
}