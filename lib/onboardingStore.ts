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
const KEY_NEED = "sanri_onboarding_need";
const KEY_FOCUS = "sanri_onboarding_focus";
const KEY_SUPPORT = "sanri_onboarding_support";

export type ReminderTime = "morning" | "noon" | "evening";
export type Lang = "tr" | "en";

export type OnboardingState = {
  completed: boolean;
  tone: ReminderTone;
  time: ReminderTime;
  lang: Lang;
  deviceUuid: string;
  need: string;
  focus: string;
  support: string;
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
  const [completed, tone, time, lang, uuid, need, focus, support] = await Promise.all([
    storageGet(KEY_COMPLETED),
    storageGet(KEY_TONE),
    storageGet(KEY_TIME),
    storageGet(KEY_LANG),
    ensureDeviceUuid(),
    storageGet(KEY_NEED),
    storageGet(KEY_FOCUS),
    storageGet(KEY_SUPPORT),
  ]);

  return {
    completed: completed === "true",
    tone: (tone as ReminderTone) || "durulma",
    time: (time as ReminderTime) || "morning",
    lang: (lang as Lang) || "tr",
    deviceUuid: uuid,
    need: need || "",
    focus: focus || "",
    support: support || "",
  };
}

export async function saveOnboarding(state: {
  tone: ReminderTone;
  time: ReminderTime;
  lang: Lang;
  need: string;
  focus: string;
  support: string;
}): Promise<void> {
  await Promise.all([
    storageSet(KEY_COMPLETED, "true"),
    storageSet(KEY_TONE, state.tone),
    storageSet(KEY_TIME, state.time),
    storageSet(KEY_LANG, state.lang),
    storageSet(KEY_NEED, state.need.trim()),
    storageSet(KEY_FOCUS, state.focus.trim()),
    storageSet(KEY_SUPPORT, state.support.trim()),
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
    storageDelete(KEY_NEED),
    storageDelete(KEY_FOCUS),
    storageDelete(KEY_SUPPORT),
  ]);
  // Device UUID is preserved for analytics continuity.
}
