import type { SttEngine, VoiceLang } from "./types";

/**
 * Faz 2 yer tutucusu — henüz gerçek konuşma-metin motoru yok.
 *
 * `isAvailable()` false döndüğü için UI'da mikrofon görünmez. Faz 2'de:
 *   1. expo-av ile ses kaydı + bir STT servisine (Whisper vb.) gönderim
 *      yapan bir sınıf yaz (aynı SttEngine sözleşmesi),
 *   2. engines.ts içinde StubStt yerine onu döndür,
 *   3. config.ts'te VOICE_PHASE.stt = true yap.
 * UI tarafında başka değişiklik gerekmez.
 */
export class StubStt implements SttEngine {
  readonly id = "stub";

  isAvailable(): boolean {
    return false;
  }

  async start(_opts: { lang: VoiceLang; onPartial?: (t: string) => void }): Promise<void> {
    throw new Error("STT engine not implemented (Faz 2)");
  }

  async stop(): Promise<string> {
    return "";
  }

  async cancel(): Promise<void> {
    /* no-op */
  }
}
