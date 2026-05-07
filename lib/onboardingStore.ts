/**
 * Onboarding state — anonim, login gerektirmez.
 * SecureStore kullanılır. Web fallback storage.ts içinde.
 */

import { storageGet, storageSet, storageDelete } from "./storage";
import type { ReminderTone } from "./dailyReminders";

const KEY_COMPLETED = "sanri_onboarding_completed";
const KEY_TONE = "sanri_selected_tone";
const KEY_TIME = "sanri_selected_time";
const KEY_LANG = "sanri_selected_lang";
const KEY_DEVICE_UUID = "sanri_device_uuid";

export type ReminderTime = "morning" | "noon" | "evening";
export type Lang = "tr" | "en";

export type OnboardingState = {
  completed: boolean;
  tone: ReminderTone;
  time: ReminderTime;
  lang: Lang;
  deviceUuid: string;
};

/** Cihaz için kalıcı anonim UUID — ilk açılışta üretilir. */
async function ensureDeviceUuid(): Promise<string> {
  const existing = await storageGet(KEY_DEVICE_UUID);
  if (existing) return existing;
  const fresh =
    "anon_" +
    Math.random().toString(36).slice(2) +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2);
  await storageSet(KEY_DEVICE_UUID, fresh);
  return fresh;
}

export async function getOnboarding(): Promise<OnboardingState> {
  const [completed, tone, time, lang, uuid] = await Promise.all([
    storageGet(KEY_COMPLETED),
    storageGet(KEY_TONE),
    storageGet(KEY_TIME),
    storageGet(KEY_LANG),
    ensureDeviceUuid(),
  ]);

  return {
    completed: completed === "true",
    tone: (tone as ReminderTone) || "durulma",
    time: (time as ReminderTime) || "morning",
    lang: (lang as Lang) || "tr",
    deviceUuid: uuid,
  };
}

export async function saveOnboarding(state: {
  tone: ReminderTone;
  time: ReminderTime;
  lang: Lang;
}): Promise<void> {
  await Promise.all([
    storageSet(KEY_COMPLETED, "true"),
    storageSet(KEY_TONE, state.tone),
    storageSet(KEY_TIME, state.time),
    storageSet(KEY_LANG, state.lang),
  ]);
}

export async function updateTone(tone: ReminderTone): Promise<void> {
  await storageSet(KEY_TONE, tone);
}

export async function updateTime(time: ReminderTime): Promise<void> {
  await storageSet(KEY_TIME, time);
}

export async function updateLang(lang: Lang): Promise<void> {
  await storageSet(KEY_LANG, lang);
}

export async function resetOnboarding(): Promise<void> {
  await Promise.all([
    storageDelete(KEY_COMPLETED),
    storageDelete(KEY_TONE),
    storageDelete(KEY_TIME),
    storageDelete(KEY_LANG),
  ]);
  // Device UUID is preserved for analytics continuity.
}
