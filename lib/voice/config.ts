/**
 * Ses faz bayrakları — tek anahtar noktası.
 *
 * Bir faz "hazır" olduğunda (gerçek motor entegre edildiğinde) ilgili bayrağı
 * `true` yap; UI düğmeleri (mikrofon / dinle) otomatik görünür hâle gelir.
 * Bayrak `false` iken kullanıcı tarafında HİÇBİR ses öğesi görünmez —
 * uygulama saf "text-first" kalır (Faz 1).
 */
export const VOICE_PHASE = {
  /** Faz 2 — mikrofon ile konuşmadan metne. */
  stt: false,
  /** Faz 3 — Aura sesiyle yanıt dinleme. */
  tts: false,
} as const;

/** Varsayılan ses tercihi. Kullanıcı ayarlardan değiştirip kapatabilir. */
export const VOICE_DEFAULTS = {
  sttEnabled: true,
  ttsEnabled: true,
  autoPlay: false, // Sanrı yanıtlarını otomatik seslendirme — varsayılan kapalı.
} as const;
