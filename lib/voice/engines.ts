import { VOICE_PHASE } from "./config";
import { ExpoSpeechTts } from "./ttsExpoSpeech";
import { StubStt } from "./sttStub";
import type { SttEngine, TtsEngine } from "./types";

/**
 * Motor kayıt defteri — uygulama her zaman bu fonksiyonlar üzerinden
 * konuşur, somut sınıfa bağlanmaz. Faz hazır olmadığında veya cihaz
 * desteklemediğinde `null` döner; çağıran taraf düğmeyi gizler.
 */

let _tts: TtsEngine | null = null;
let _stt: SttEngine | null = null;

export function getTtsEngine(): TtsEngine | null {
  if (!VOICE_PHASE.tts) return null;
  if (!_tts) _tts = new ExpoSpeechTts();
  return _tts.isAvailable() ? _tts : null;
}

export function getSttEngine(): SttEngine | null {
  if (!VOICE_PHASE.stt) return null;
  if (!_stt) _stt = new StubStt();
  return _stt.isAvailable() ? _stt : null;
}

/** Bu cihaz/derlemede konuşma-metin teknik olarak kullanılabilir mi? */
export function sttSupported(): boolean {
  return getSttEngine() !== null;
}

/** Bu cihaz/derlemede sesli yanıt (TTS) teknik olarak kullanılabilir mi? */
export function ttsSupported(): boolean {
  return getTtsEngine() !== null;
}
