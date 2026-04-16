import * as FileSystem from "expo-file-system/legacy";
import { AppState, AppStateStatus } from "react-native";
import { API_BASE } from "./config";
import { storageGet } from "./storage";

const ANALYTICS_FILE = (FileSystem.documentDirectory || "") + "sanri_analytics.json";
const TOKEN_KEY = "user_token";
const USER_KEY = "user_data";

export type AnalyticsEvent = {
  event: string;
  userId?: string | number;
  timestamp: string;
  mode?: string;
  city?: string;
  meta?: Record<string, any>;
};

let memoryBuffer: AnalyticsEvent[] = [];
let fileLoaded = false;

async function loadFromFile(): Promise<AnalyticsEvent[]> {
  if (fileLoaded) return memoryBuffer;
  try {
    const info = await FileSystem.getInfoAsync(ANALYTICS_FILE);
    if (!info.exists) {
      fileLoaded = true;
      return [];
    }
    const raw = await FileSystem.readAsStringAsync(ANALYTICS_FILE);
    const parsed = JSON.parse(raw) as AnalyticsEvent[];
    memoryBuffer = Array.isArray(parsed) ? parsed : [];
    fileLoaded = true;
    return memoryBuffer;
  } catch {
    fileLoaded = true;
    return [];
  }
}

async function persistToFile() {
  try {
    const last1000 = memoryBuffer.slice(-1000);
    await FileSystem.writeAsStringAsync(ANALYTICS_FILE, JSON.stringify(last1000));
  } catch (e) {
    if (__DEV__) console.log("[ANALYTICS] persist error:", e);
  }
}

async function _getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const token = await storageGet(TOKEN_KEY);
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const rawUser = await storageGet(USER_KEY);
    if (rawUser) {
      const u = JSON.parse(rawUser);
      if (u?.id) headers["X-User-Id"] = String(u.id);
    }
  } catch { /* noop */ }
  return headers;
}

async function _getUserId(): Promise<string | undefined> {
  try {
    const rawUser = await storageGet(USER_KEY);
    if (rawUser) {
      const u = JSON.parse(rawUser);
      if (u?.id) return String(u.id);
    }
  } catch { /* noop */ }
  return (globalThis as any).__user_id || undefined;
}

export async function trackEvent(
  event: string,
  params: {
    userId?: string | number;
    mode?: string;
    city?: string;
    meta?: Record<string, any>;
  } = {}
) {
  const uid = params.userId || (await _getUserId());
  const entry: AnalyticsEvent = {
    event,
    userId: uid,
    timestamp: new Date().toISOString(),
    mode: params.mode,
    city: params.city,
    meta: params.meta,
  };

  if (__DEV__) {
    console.log("[ANALYTICS]", event, params);
  }

  if (!fileLoaded) await loadFromFile();
  memoryBuffer.push(entry);
  persistToFile();

  try {
    const ctrl = new AbortController();
    const tmr = setTimeout(() => ctrl.abort(), 8000);
    const headers = await _getAuthHeaders();
    await fetch(API_BASE + "/events/log", {
      method: "POST",
      headers,
      body: JSON.stringify({
        action: event,
        domain: params.meta?.domain || "app",
        user_id: uid ? String(uid) : undefined,
        meta: {
          ...params.meta,
          mode: params.mode,
          city: params.city,
        },
        session_id: uid ? String(uid) : "anon",
      }),
      signal: ctrl.signal,
    });
    clearTimeout(tmr);
  } catch {
    /* backend offline — data in file */
  }
}

// ═══════════════════════════════════════════════
// SESSION TRACKING
// ═══════════════════════════════════════════════

let _sessionStart: number | null = null;
let _heartbeatInterval: ReturnType<typeof setInterval> | null = null;
let _currentScreen: string | null = null;
let _screenEnterTime: number | null = null;

export function startSession() {
  _sessionStart = Date.now();
  trackEvent("session_start", { meta: { platform: "mobile" } });

  if (_heartbeatInterval) clearInterval(_heartbeatInterval);
  _heartbeatInterval = setInterval(() => {
    if (_sessionStart) {
      const dur = Math.round((Date.now() - _sessionStart) / 1000);
      trackEvent("heartbeat", { meta: { duration_sec: dur } });
    }
  }, 60_000);
}

export function endSession() {
  if (_sessionStart) {
    const dur = Math.round((Date.now() - _sessionStart) / 1000);
    trackEvent("session_end", { meta: { duration_sec: dur } });
  }
  if (_heartbeatInterval) {
    clearInterval(_heartbeatInterval);
    _heartbeatInterval = null;
  }
  if (_currentScreen && _screenEnterTime) {
    _trackScreenLeave();
  }
  _sessionStart = null;
}

export function trackScreenView(screen: string) {
  if (_currentScreen && _screenEnterTime) {
    _trackScreenLeave();
  }
  _currentScreen = screen;
  _screenEnterTime = Date.now();
  trackEvent("screen_view", { meta: { screen, domain: "navigation" } });
}

function _trackScreenLeave() {
  if (!_currentScreen || !_screenEnterTime) return;
  const sec = Math.round((Date.now() - _screenEnterTime) / 1000);
  if (sec >= 2) {
    trackEvent("time_spent", { meta: { screen: _currentScreen, seconds: sec } });
  }
  _currentScreen = null;
  _screenEnterTime = null;
}

let _appStateListener: ReturnType<typeof AppState.addEventListener> | null = null;

export function initSessionTracking() {
  startSession();

  _appStateListener = AppState.addEventListener("change", (state: AppStateStatus) => {
    if (state === "active") {
      if (!_sessionStart) startSession();
    } else if (state === "background" || state === "inactive") {
      endSession();
    }
  });
}

export function cleanupSessionTracking() {
  endSession();
  if (_appStateListener) {
    _appStateListener.remove();
    _appStateListener = null;
  }
}

// ═══════════════════════════════════════════════
// SUMMARY (local)
// ═══════════════════════════════════════════════

export async function getStoredEvents(): Promise<AnalyticsEvent[]> {
  if (!fileLoaded) await loadFromFile();
  return [...memoryBuffer];
}

export async function getAnalyticsSummary() {
  const events = await getStoredEvents();

  const totalUsers = new Set(
    events.filter((e) => e.userId).map((e) => String(e.userId))
  ).size;

  const modeCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};
  const pageCounts: Record<string, number> = {};
  const timeSpent: Record<string, number> = {};
  let vipClicks = 0;
  let vipUnlocks = 0;
  let sessionStarts = 0;
  let messageSent = 0;

  for (const e of events) {
    if (e.event === "mode_switch" && e.mode) {
      modeCounts[e.mode] = (modeCounts[e.mode] || 0) + 1;
    }
    if (e.event === "city_open" && e.city) {
      cityCounts[e.city] = (cityCounts[e.city] || 0) + 1;
    }
    if (e.event === "page_view" && e.meta?.page) {
      pageCounts[e.meta.page] = (pageCounts[e.meta.page] || 0) + 1;
    }
    if (e.event === "time_spent" && e.meta?.screen && e.meta?.seconds) {
      const screen = e.meta.screen as string;
      timeSpent[screen] = (timeSpent[screen] || 0) + (e.meta.seconds as number);
    }
    if (e.event === "vip_click") vipClicks++;
    if (e.event === "vip_unlock") vipUnlocks++;
    if (e.event === "session_start") sessionStarts++;
    if (e.event === "message_sent") messageSent++;
  }

  const topMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0];
  const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0];
  const topPage = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0];

  return {
    totalEvents: events.length,
    totalUsers,
    topMode: topMode ? { name: topMode[0], count: topMode[1] } : null,
    topCity: topCity ? { name: topCity[0], count: topCity[1] } : null,
    topPage: topPage ? { name: topPage[0], count: topPage[1] } : null,
    vipClicks,
    vipUnlocks,
    sessionStarts,
    messageSent,
    modeCounts,
    cityCounts,
    pageCounts,
    timeSpent,
  };
}
