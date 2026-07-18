import { API_BASE } from "./config";
import { storageGet } from "./storage";
import { getSupabaseSession } from "./supabase";

const TOKEN_KEY = "user_token";

export const LEGACY_ASK_DISABLED_MESSAGE =
  "Bu alan artık legacy sohbet üzerinden çalışmıyor. Devam etmek için SANRI OS sohbetine geçin ve doğrulanmış oturumla devam edin.";

export const API = {
  base: API_BASE,
  // Sprint 3 canonical contracts. These are not used for anonymous legacy
  // traffic until the Supabase JWT migration is complete.
  v1Chat: `${API_BASE}/v1/chat`,
  v1Conversations: `${API_BASE}/v1/conversations`,
  v1SessionClose: (conversationId: string) =>
    `${API_BASE}/v1/conversations/${conversationId}/close`,
  v1Memories: `${API_BASE}/v1/memories`,
  v1Projects: `${API_BASE}/v1/projects`,
  v1AuraState: `${API_BASE}/v1/aura/state`,
  // Legacy transport retained only as a fail-closed reference. Callers are
  // blocked client-side; backend also rejects unsafe legacy identity.
  ask: `${API_BASE}/bilinc-alani/ask`,
  deepenAccept: `${API_BASE}/bilinc-alani/deepen/accept`,
  transcribe: `${API_BASE}/api/voice/transcribe`,
  ritualPack: `${API_BASE}/content/ritual-pack`,
  deviceRegister: `${API_BASE}/device/register`,
  dailyStream: `${API_BASE}/content/daily-stream`,
};

function assertLegacyAskTransportAllowed(url: string) {
  if (url.includes("/bilinc-alani/")) {
    throw new Error(LEGACY_ASK_DISABLED_MESSAGE);
  }
}

// ------------------ TOKEN ------------------
async function getToken() {
  try {
    return await storageGet(TOKEN_KEY);
  } catch {
    return null;
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
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

async function buildV1Headers() {
  const session = await getSupabaseSession();
  if (!session?.access_token) {
    throw new Error("Supabase session required for V1");
  }
  return {
    Accept: "text/event-stream",
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

// ------------------ GET ------------------
export async function apiGetJson(url: string, timeout = 15000) {
  assertLegacyAskTransportAllowed(url);
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
  timeout = 25000
) {
  assertLegacyAskTransportAllowed(url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = await buildHeaders(true);

    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (netErr: any) {
      if (netErr?.name === "AbortError") {
        throw new Error("Bağlantı zaman aşımına uğradı. İnternet bağlantınızı kontrol edin.");
      }
      throw new Error("Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.");
    }

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

export async function apiPostV1Stream(
  url: string,
  body: Record<string, any>,
  onEvent: (event: string, data: any) => void,
  timeout = 45000
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: await buildV1Headers(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok || !res.body) {
      const text = await res.text();
      throw new Error(normalizeErrorPayload(parseResponseText(text), url, "POST", res.status));
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let eventName = "message";
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const frames = buffer.split("\n\n");
      buffer = frames.pop() || "";
      for (const frame of frames) {
        const eventLine = frame.split("\n").find((line) => line.startsWith("event:"));
        const dataLine = frame.split("\n").find((line) => line.startsWith("data:"));
        if (eventLine) eventName = eventLine.slice(6).trim();
        if (dataLine) {
          const raw = dataLine.slice(5).trim();
          onEvent(eventName, parseResponseText(raw));
        }
      }
      if (done) break;
    }
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
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
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