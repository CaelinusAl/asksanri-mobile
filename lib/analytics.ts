import * as FileSystem from "expo-file-system/legacy";
import { AppState, AppStateStatus } from "react-native";
import { API_BASE } from "./config";
import { storageGet, storageSet } from "./storage";
import { getSupabaseSession } from "./supabase";
import { getEventSessionId } from "./eventSession";

const ANALYTICS_FILE = (FileSystem.documentDirectory || "") + "sanri_analytics.json";

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
  const session = await getSupabaseSession();
  if (!session?.access_token) return {};
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
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
  const uid = params.userId;
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
    if (!headers.Authorization) {
      clearTimeout(tmr);
      return;
    }
    const sessionId = await getEventSessionId();
    await fetch(API_BASE + "/events/log", {
      method: "POST",
      headers,
      body: JSON.stringify({
        action: event,
        domain: params.meta?.domain || "app",
        meta: {
          ...params.meta,
          mode: params.mode,
          city: params.city,
        },
        session_id: sessionId,
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
  // Uygulama arka plana giderse açık konuşmayı da kapat (süre kaybolmasın).
  endConversation();
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
      if (!_sessionStart) {
        startSession();
        // Arka plandan dönüş — tekrar gelme / install yaşı tekrar ölçülsün.
        trackAppOpen();
      }
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
// FAZ 1 — ÜRÜN METRİKLERİ
// Strateji: "Önce kullanıcı davranışını anla."
// İzlenen: ilk soru soruldu mu · sekme kullanımı · tekrar gelme ·
//          ortalama konuşma süresi · en çok kullanılan sekme.
// ═══════════════════════════════════════════════

const FIRST_Q_KEY = "sanri_first_question_done";
const FIRST_OPEN_KEY = "sanri_first_open_at";
const LAST_OPEN_KEY = "sanri_last_open_at";

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

/**
 * Uygulama açılışı + "tekrar gelen kullanıcı" tespiti.
 * Cold start ve foreground'a dönüşte çağrılır.
 * `is_returning`: son açılıştan 6+ saat sonra tekrar gelmiş mi.
 * `days_since_install`: ilk açılıştan bu yana geçen gün (D1/D7 retention için).
 */
export async function trackAppOpen() {
  try {
    const now = Date.now();
    const firstRaw = await storageGet(FIRST_OPEN_KEY);
    const lastRaw = await storageGet(LAST_OPEN_KEY);

    const firstAt = firstRaw ? Number(firstRaw) : now;
    if (!firstRaw) await storageSet(FIRST_OPEN_KEY, String(now));

    const lastAt = lastRaw ? Number(lastRaw) : now;
    await storageSet(LAST_OPEN_KEY, String(now));

    const daysSinceInstall = Math.floor((now - firstAt) / DAY_MS);
    const hoursSinceLast = Math.round((now - lastAt) / HOUR_MS);
    const isReturning = !!firstRaw && now - lastAt > 6 * HOUR_MS;
    const isFirstEver = !firstRaw;

    trackEvent("app_open", {
      meta: {
        domain: "retention",
        is_first_ever: isFirstEver,
        is_returning: isReturning,
        days_since_install: daysSinceInstall,
        hours_since_last: hoursSinceLast,
      },
    });

    // V1 Insight — geri dönüş ayrı bir event olarak da ölçülsün.
    if (isReturning) {
      trackEvent("returning_user", {
        meta: {
          domain: "retention",
          days_since_install: daysSinceInstall,
          hours_since_last: hoursSinceLast,
        },
      });
    }
  } catch {
    /* noop */
  }
}

// Aktif konuşma durumu (chat ekranı başına).
let _convoStart: number | null = null;
let _convoMsgCount = 0;
let _convoCtx: string | null = null;

/**
 * Kullanıcı chat'te bir mesaj gönderdiğinde çağrılır.
 * - İlk kez ise `first_question_asked` (kullanıcı başına bir kez).
 * - Konuşma başlamamışsa `conversation_started`.
 * - Her mesaj için `message_sent` (ctx = home/journal/dream/relationship).
 */
export async function trackUserMessage(ctx: string, sessionId?: string) {
  try {
    const done = await storageGet(FIRST_Q_KEY);
    if (!done) {
      await storageSet(FIRST_Q_KEY, "1");
      trackEvent("first_question_asked", { meta: { domain: "engagement", ctx } });
    }
  } catch {
    /* noop */
  }

  if (_convoStart === null) {
    _convoStart = Date.now();
    _convoMsgCount = 0;
    _convoCtx = ctx;
    trackEvent("conversation_started", {
      meta: { domain: "engagement", ctx, session_id: sessionId },
    });
  }

  _convoMsgCount += 1;
  trackEvent("message_sent", {
    meta: {
      domain: "engagement",
      ctx,
      message_index: _convoMsgCount,
      session_id: sessionId,
    },
  });
}

/**
 * Konuşma biter (chat ekranından çıkış / arka plana alma).
 * `conversation_ended`: toplam mesaj sayısı + süre → ortalama konuşma süresi.
 */
export function endConversation() {
  if (_convoStart === null) return;
  const durSec = Math.round((Date.now() - _convoStart) / 1000);
  trackEvent("conversation_ended", {
    meta: {
      domain: "engagement",
      ctx: _convoCtx,
      message_count: _convoMsgCount,
      duration_sec: durSec,
    },
  });
  _convoStart = null;
  _convoMsgCount = 0;
  _convoCtx = null;
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
