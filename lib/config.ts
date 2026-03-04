// lib/config.ts
// SANRI Mobile API Configuration
// Production ready

import Constants from "expo-constants";

function trimSlash(url: string) {
  return String(url || "").replace(/\/+$/, "");
}

function getApiBase() {
  const extra = (Constants.expoConfig as any)?.extra || {};
  const fromExtra = extra?.EXPO_PUBLIC_API_BASE || "";
  const fromEnv = (process as any)?.env?.EXPO_PUBLIC_API_BASE || "";

  const base = fromExtra || fromEnv || "https://api.asksanri.com";

  return trimSlash(base);
}

export const API_BASE = getApiBase();

/*
|--------------------------------------------------------------------------
| CORE API
|--------------------------------------------------------------------------
*/

export const SANRI_ASK_URL =
  API_BASE + "/bilinc-alani/ask";

export const SANRI_TRANSCRIBE_URL =
  API_BASE + "/api/voice/transcribe";

/*
|--------------------------------------------------------------------------
| DAILY CONSCIOUSNESS STREAM
|--------------------------------------------------------------------------
*/

export const DAILY_STREAM_URL =
  API_BASE + "/content/daily-stream";

export const WEEKLY_SYMBOL_URL =
  API_BASE + "/content/weekly-symbol";

/*
|--------------------------------------------------------------------------
| RITUAL SYSTEM
|--------------------------------------------------------------------------
*/

export const RITUAL_PACKS_URL =
  API_BASE + "/content/ritual-packs";

export const RITUAL_PACK_URL =
  API_BASE + "/content/ritual-pack";

/*
example:
RITUAL_PACK_URL + "/tanricanin_hatirlayisi"
*/

/*
|--------------------------------------------------------------------------
| WORLD EVENTS
|--------------------------------------------------------------------------
*/

export const WORLD_EVENTS_LIST_URL =
  API_BASE + "/world-events/list";

export const WORLD_EVENTS_CREATE_URL =
  API_BASE + "/bilinc-alani/ask";

/*
|--------------------------------------------------------------------------
| DEBUG
|--------------------------------------------------------------------------
*/

export const DEBUG_API = false;

if (DEBUG_API) {
  console.log("SANRI API BASE:", API_BASE);
}