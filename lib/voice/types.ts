/**
 * SANRI — Ses mimarisi tipleri.
 *
 * Yol haritası:
 *   Faz 1  Yalnızca metin.                         (yayında)
 *   Faz 2  Konuşma → metin (mikrofon, input alanı). (motor takılınca açılır)
 *   Faz 3  Aura sesi ile yanıt dinleme (TTS).       (motor takılınca açılır)
 *
 * Ses her zaman opsiyoneldir ve kapatılabilir. UI bağlantı noktaları
 * şimdiden hazır; faz hazır olunca yalnızca motor implementasyonu eklenir
 * ve `config.ts` içindeki ilgili bayrak `true` yapılır.
 */

export type VoiceLang = "tr" | "en";

/** Aura — SANRI'nın sesi. İleride birden fazla ses kimliği eklenebilir. */
export type VoiceId = "aura";

/** Faz 2 — Speech-to-text motoru sözleşmesi. */
export interface SttEngine {
  readonly id: string;
  /** Cihaz/derleme bu motoru destekliyor mu? */
  isAvailable(): boolean;
  /** Dinlemeyi başlat. Kısmi sonuçlar `onPartial` ile akabilir. */
  start(opts: { lang: VoiceLang; onPartial?: (text: string) => void }): Promise<void>;
  /** Dinlemeyi bitir ve nihai metni döndür. */
  stop(): Promise<string>;
  /** İptal — metin döndürmeden bırak. */
  cancel(): Promise<void>;
}

/** Faz 3 — Text-to-speech (Aura) motoru sözleşmesi. */
export interface TtsEngine {
  readonly id: string;
  isAvailable(): boolean;
  /** Metni seslendir. Bitince `onDone` çağrılır. */
  speak(text: string, opts: { voice: VoiceId; lang: VoiceLang; onDone?: () => void }): Promise<void>;
  /** Konuşmayı durdur. */
  stop(): Promise<void>;
}
