import * as Speech from "expo-speech";
import type { TtsEngine, VoiceId, VoiceLang } from "./types";

/**
 * Faz 3 temel motoru — cihazın yerel TTS'i (expo-speech) üzerinden Aura sesi.
 *
 * Bu, ağ gerektirmeyen "hazır" bir temeldir. İleride bulut tabanlı, daha
 * doğal bir Aura sesi (ör. ElevenLabs / kendi servisimiz) takmak için aynı
 * `TtsEngine` sözleşmesini uygulayan yeni bir sınıf yazıp engines.ts'te
 * değiştirmek yeterli — UI hiç değişmez.
 */
export class ExpoSpeechTts implements TtsEngine {
  readonly id = "expo-speech";

  isAvailable(): boolean {
    return typeof Speech?.speak === "function";
  }

  async speak(
    text: string,
    opts: { voice: VoiceId; lang: VoiceLang; onDone?: () => void }
  ): Promise<void> {
    const clean = (text || "").trim();
    if (!clean) {
      opts.onDone?.();
      return;
    }
    try {
      Speech.stop();
    } catch {
      /* ignore */
    }
    Speech.speak(clean, {
      language: opts.lang === "tr" ? "tr-TR" : "en-US",
      // Aura tonu — sakin, hafif yavaş.
      rate: 0.96,
      pitch: 1.0,
      onDone: opts.onDone,
      onStopped: opts.onDone,
      onError: opts.onDone,
    });
  }

  async stop(): Promise<void> {
    try {
      Speech.stop();
    } catch {
      /* ignore */
    }
  }
}
