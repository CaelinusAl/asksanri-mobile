// lib/config.ts
export const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE?.replace(/\/$/, "") ||
  "https://api.asksanri.com"; // prod default

export const ASK_URL = '${API_BASE}/bilinc-alani/ask';
export const VOICE_TRANSCRIBE_URL = '${API_BASE}/api/voice/transcribe';

// world-events public router sende prefix'sizdi: /world-events/...
export const WORLD_EVENTS_PINNED_URL = '${API_BASE}/world-events/pinned';
export const WORLD_EVENTS_CREATE_URL = '${API_BASE}/world-events'
;