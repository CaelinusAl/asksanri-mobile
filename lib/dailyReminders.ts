/**
 * Daily Reminder Bank — Sanrı'nın günlük bir cümlelik hatırlatıcıları.
 *
 * Apple 4.3(b) compliance: tüm cümleler mindfulness / journaling / yansıtma
 * dilindedir. Numeroloji, burç, fortune, tarot, palm reading veya ezoterik
 * tahmin içermez. Her cümle bir SORU ya da bir FARK ETME daveti.
 *
 * Voice rules (`sanriIdentity.js`'ten):
 * - Maks 18 kelime
 * - "Sen" ile hitap
 * - Yargısız, mirror tonu
 * - Kısa, nefes aralıklı
 */

export type ReminderTone = "durulma" | "hareket" | "derinlesme";

export type Reminder = {
  id: number;
  tr: string;
  en: string;
  tone: ReminderTone;
};

/**
 * 30 cümlelik MVP bankası — 10 ton başına.
 * Genişletme: backend `/v1/daily/cumle` endpoint'i devreye alınınca burası
 * cache fallback'i olur.
 */
export const REMINDERS: Reminder[] = [
  // ─── Durulma (calm / settling) ─────────────────────────
  { id: 1, tone: "durulma", tr: "Şu an bedeninde nereyi hissediyorsun?", en: "Where in your body do you feel right now?" },
  { id: 2, tone: "durulma", tr: "Bugün bir nefesin oldu mu — gerçekten alınmış bir nefes?", en: "Did you take a real breath today?" },
  { id: 3, tone: "durulma", tr: "Sessizlik sana şu an ne anlatıyor?", en: "What is silence telling you right now?" },
  { id: 4, tone: "durulma", tr: "Yorgun musun? Bunu fark ettin mi?", en: "Are you tired? Have you noticed?" },
  { id: 5, tone: "durulma", tr: "Bir kelimeyle: şu an nasılsın?", en: "In one word: how are you right now?" },
  { id: 6, tone: "durulma", tr: "Bugün kendine bir an verdin mi?", en: "Did you give yourself a moment today?" },
  { id: 7, tone: "durulma", tr: "Omuzlarına dokun. Düşmüşler mi, kalkmışlar mı?", en: "Touch your shoulders. Are they up or settled?" },
  { id: 8, tone: "durulma", tr: "Zihnin hızlı mı koşuyor, yoksa yavaşlamak mı istiyor?", en: "Is your mind racing, or asking to slow?" },
  { id: 9, tone: "durulma", tr: "En son ne zaman gerçekten dinlendin?", en: "When was the last time you truly rested?" },
  { id: 10, tone: "durulma", tr: "Bugün kalbine bak. Daralıyor mu, açılıyor mu?", en: "Look at your heart. Tightening, or opening?" },

  // ─── Hareket (movement / action) ───────────────────────
  { id: 11, tone: "hareket", tr: "Bugün bırakmak istediğin bir şey var mı?", en: "Is there something you want to let go today?" },
  { id: 12, tone: "hareket", tr: "Söyleyemediğin bir cümle hangisi?", en: "Which sentence have you been unable to say?" },
  { id: 13, tone: "hareket", tr: "Bugün bir adım atsan, hangi yöne olur?", en: "If you took one step today, which direction?" },
  { id: 14, tone: "hareket", tr: "Yapmadığın bir şey neyi koruyor?", en: "What is the thing you're not doing protecting?" },
  { id: 15, tone: "hareket", tr: "Bugün kim olmak istersin?", en: "Who do you want to be today?" },
  { id: 16, tone: "hareket", tr: "Geçen hafta bıraktığın bir şey vardı. Hatırlıyor musun?", en: "Last week you set something down. Do you remember?" },
  { id: 17, tone: "hareket", tr: "Bir telefon, bir mesaj, bir cümle… Hangisi seni bekliyor?", en: "A call, a message, a word… which one waits?" },
  { id: 18, tone: "hareket", tr: "Bir 'evet' söylemen gerekirdi. Hâlâ duruyor mu?", en: "There was a 'yes' to say. Is it still standing?" },
  { id: 19, tone: "hareket", tr: "Bir 'hayır' var. Çıkmayı bekliyor mu?", en: "There is a 'no'. Is it waiting to come out?" },
  { id: 20, tone: "hareket", tr: "Bugün kime teşekkür ederdin — ama söylemedin?", en: "Who would you thank today — but didn't?" },

  // ─── Derinleşme (depth / inner) ────────────────────────
  { id: 21, tone: "derinlesme", tr: "Bu his nereden geliyor — gerçekten oradan mı?", en: "Where does this feeling come from — really?" },
  { id: 22, tone: "derinlesme", tr: "Söylediğin şey gerçekten senin mi?", en: "Is what you say truly yours?" },
  { id: 23, tone: "derinlesme", tr: "Korkun şu an neyi koruyor?", en: "What is your fear protecting right now?" },
  { id: 24, tone: "derinlesme", tr: "İçindeki çocuk şimdi ne ister?", en: "What does the child inside you want now?" },
  { id: 25, tone: "derinlesme", tr: "Sevdiğin şey aslında sen değil misin?", en: "Isn't what you love also you?" },
  { id: 26, tone: "derinlesme", tr: "Yalnızlık mı, yalnız kalma cesareti mi?", en: "Is it loneliness, or the courage to be alone?" },
  { id: 27, tone: "derinlesme", tr: "Hangi sözünü hâlâ kendine söylemedin?", en: "Which word have you yet to say to yourself?" },
  { id: 28, tone: "derinlesme", tr: "Bir şeyi affetmek değil — bırakmak ister misin?", en: "Not to forgive, but to release. Would you?" },
  { id: 29, tone: "derinlesme", tr: "İçinde söylenmemiş bir cümle nerede yaşıyor?", en: "Where does the unsaid sentence live inside you?" },
  { id: 30, tone: "derinlesme", tr: "Sen kimsin — kim olduğunu söylediğinden önce?", en: "Who are you — before you say who you are?" },
];

/**
 * Bugün için cümle seç. Tarih + ton kombinasyonu deterministic olduğu için
 * gün içinde aynı cümle gösterilir, ertesi gün değişir.
 */
export function getTodayReminder(tone: ReminderTone, locale: "tr" | "en" = "tr"): {
  text: string;
  reminder: Reminder;
} {
  const pool = REMINDERS.filter((r) => r.tone === tone);
  const dayIndex = Math.floor(Date.now() / 86400000);
  const idx = ((dayIndex % pool.length) + pool.length) % pool.length;
  const reminder = pool[idx] || REMINDERS[0];
  return {
    text: locale === "en" ? reminder.en : reminder.tr,
    reminder,
  };
}

/**
 * Belirli bir tarih için cümle (arşiv veya geçmişe bakmak için).
 */
export function getReminderByDate(
  date: Date,
  tone: ReminderTone,
  locale: "tr" | "en" = "tr"
): { text: string; reminder: Reminder } {
  const pool = REMINDERS.filter((r) => r.tone === tone);
  const dayIndex = Math.floor(date.getTime() / 86400000);
  const idx = ((dayIndex % pool.length) + pool.length) % pool.length;
  const reminder = pool[idx] || REMINDERS[0];
  return {
    text: locale === "en" ? reminder.en : reminder.tr,
    reminder,
  };
}

/**
 * Ton meta — UI renkleri ve glifleri.
 */
export const TONE_META: Record<
  ReminderTone,
  { color: string; glyph: string; labelTr: string; labelEn: string; descTr: string; descEn: string }
> = {
  durulma: {
    color: "#7cf7d8",
    glyph: "☽",
    labelTr: "Durulma",
    labelEn: "Settling",
    descTr: "Yumuşak, dingin sorular. Nefes alanı.",
    descEn: "Gentle, calming questions. Space to breathe.",
  },
  hareket: {
    color: "#fbbf24",
    glyph: "✦",
    labelTr: "Hareket",
    labelEn: "Movement",
    descTr: "Hareket eşiği. Söylenmeyenleri çağırır.",
    descEn: "Threshold of motion. Calls the unsaid.",
  },
  derinlesme: {
    color: "#c084fc",
    glyph: "◉",
    labelTr: "Derinleşme",
    labelEn: "Depth",
    descTr: "Yansıma, içe dönüş. Kalbin altındaki katman.",
    descEn: "Reflection, turning inward. Beneath the heart.",
  },
};
