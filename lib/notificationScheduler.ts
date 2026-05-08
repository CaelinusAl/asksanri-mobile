/**
 * Notification Scheduler — Sanrı'nın günlük tek bildirim mimarisi.
 *
 * MVP yaklaşımı:
 *  - Lokal, repeating CALENDAR trigger (her gün aynı saat).
 *  - Title + body kısa, Sanrı tonu. Cümlenin kendisi uygulamaya
 *    girince render olur (push payload içinde gönderilmez — bu sayede
 *    backend cron'a bağımlılık yok, MVP için yeterli).
 *  - Onboarding bittiğinde ve Silence ekranında ton/zaman/dil değişince
 *    re-schedule edilir.
 *  - Web platformunda no-op.
 *
 * Apple uyumluluğu:
 *  - Bildirimler izin gerektirir, kullanıcı reddedebilir, uygulama
 *    izinsiz çalışmaya devam eder.
 *  - Hassas içerik gönderilmez (sadece "günün cümlesi hazır").
 */

import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import type { ReminderTime, Lang } from "./onboardingStore";

const SCHEDULE_TAG = "sanri.daily.reminder";

/**
 * Ton-bağımsız sabit saatler. Pencerenin ortası seçildi —
 * sabah 09:00, öğle 13:00, akşam 21:00.
 *
 * Apple, "alarm" benzeri kesin saat tarifeleri için ek izinler
 * istemez; CALENDAR repeating trigger izinli ve standarttır.
 */
const TIME_MAP: Record<ReminderTime, { hour: number; minute: number }> = {
  morning: { hour: 9, minute: 0 },
  noon: { hour: 13, minute: 0 },
  evening: { hour: 21, minute: 0 },
};

const COPY: Record<Lang, { title: string; body: string }> = {
  tr: {
    title: "Sanrı ◉",
    body: "Bugünün cümlesi hazır. Bir nefes ver, bak.",
  },
  en: {
    title: "Sanrı ◉",
    body: "Today's sentence is here. Take a breath and look.",
  },
};

/**
 * Mevcut tüm Sanrı reminder'larını iptal eder. Yeni schedule
 * için temiz başlangıç sağlar.
 */
async function cancelExisting(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      all
        .filter((n) => n.content?.data?.tag === SCHEDULE_TAG)
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
    );
  } catch (e) {
    if (__DEV__) console.log("cancelExisting error:", e);
  }
}

export async function cancelDaily(): Promise<void> {
  await cancelExisting();
}

/**
 * Günlük tek bildirim kur. Mevcut zamanlanmış bildirimler önce
 * iptal edilir. İzin yoksa schedule denenmez (Apple'ın tavsiyesi).
 */
export async function scheduleDaily(
  time: ReminderTime,
  lang: Lang
): Promise<{ ok: boolean; reason?: string }> {
  if (Platform.OS === "web") {
    return { ok: false, reason: "web" };
  }

  try {
    const perm = await Notifications.getPermissionsAsync();
    if (perm.status !== "granted") {
      // Sessizce çık. UI tarafı "izin yok" durumunu kendi gösterir.
      return { ok: false, reason: "no-permission" };
    }

    await cancelExisting();

    const slot = TIME_MAP[time] || TIME_MAP.morning;
    const copy = COPY[lang] || COPY.tr;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: copy.title,
        body: copy.body,
        data: { tag: SCHEDULE_TAG, route: "/(tabs)/daily" },
        sound: false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: slot.hour,
        minute: slot.minute,
        repeats: true,
      },
    });

    return { ok: true };
  } catch (e: any) {
    if (__DEV__) console.log("scheduleDaily error:", e);
    return { ok: false, reason: e?.message || "error" };
  }
}

/**
 * Debug yardımcısı. Yalnızca dev modda console'a kaydedilir.
 */
export async function debugListScheduled(): Promise<void> {
  if (!__DEV__ || Platform.OS === "web") return;
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    console.log(
      "[NOTIF] scheduled:",
      all.filter((n) => n.content?.data?.tag === SCHEDULE_TAG)
    );
  } catch {
    /* ignore */
  }
}
