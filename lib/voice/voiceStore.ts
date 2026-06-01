import { create } from "zustand";
import { storageGet, storageSet } from "../storage";
import { VOICE_DEFAULTS } from "./config";
import { getSttEngine, getTtsEngine, sttSupported, ttsSupported } from "./engines";
import type { VoiceLang } from "./types";

const K_STT = "sanri_voice_stt_enabled";
const K_TTS = "sanri_voice_tts_enabled";
const K_AUTOPLAY = "sanri_voice_autoplay";

type VoiceState = {
  // Kalıcı tercihler
  sttEnabled: boolean;
  ttsEnabled: boolean;
  autoPlay: boolean;
  loaded: boolean;

  // Runtime durum
  isRecording: boolean;
  speakingId: string | null;

  load: () => Promise<void>;
  setSttEnabled: (v: boolean) => void;
  setTtsEnabled: (v: boolean) => void;
  setAutoPlay: (v: boolean) => void;

  // Yetenek (faz bayrağı + tercih + cihaz desteği)
  micVisible: () => boolean;
  speakVisible: () => boolean;

  // Faz 2 — dikte
  startRecording: (lang: VoiceLang, onPartial?: (t: string) => void) => Promise<void>;
  stopRecording: () => Promise<string>;
  cancelRecording: () => Promise<void>;

  // Faz 3 — seslendirme
  speak: (id: string, text: string, lang: VoiceLang) => Promise<void>;
  stopSpeaking: () => Promise<void>;
};

export const useVoiceStore = create<VoiceState>((set, get) => ({
  sttEnabled: VOICE_DEFAULTS.sttEnabled,
  ttsEnabled: VOICE_DEFAULTS.ttsEnabled,
  autoPlay: VOICE_DEFAULTS.autoPlay,
  loaded: false,

  isRecording: false,
  speakingId: null,

  load: async () => {
    try {
      const [stt, tts, auto] = await Promise.all([
        storageGet(K_STT),
        storageGet(K_TTS),
        storageGet(K_AUTOPLAY),
      ]);
      set({
        sttEnabled: stt == null ? VOICE_DEFAULTS.sttEnabled : stt === "true",
        ttsEnabled: tts == null ? VOICE_DEFAULTS.ttsEnabled : tts === "true",
        autoPlay: auto == null ? VOICE_DEFAULTS.autoPlay : auto === "true",
        loaded: true,
      });
    } catch {
      set({ loaded: true });
    }
  },

  setSttEnabled: (v) => {
    set({ sttEnabled: v });
    storageSet(K_STT, v ? "true" : "false").catch(() => {});
  },
  setTtsEnabled: (v) => {
    set({ ttsEnabled: v });
    storageSet(K_TTS, v ? "true" : "false").catch(() => {});
    if (!v) get().stopSpeaking();
  },
  setAutoPlay: (v) => {
    set({ autoPlay: v });
    storageSet(K_AUTOPLAY, v ? "true" : "false").catch(() => {});
  },

  micVisible: () => sttSupported() && get().sttEnabled,
  speakVisible: () => ttsSupported() && get().ttsEnabled,

  startRecording: async (lang, onPartial) => {
    const eng = getSttEngine();
    if (!eng) return;
    set({ isRecording: true });
    try {
      await eng.start({ lang, onPartial });
    } catch {
      set({ isRecording: false });
    }
  },
  stopRecording: async () => {
    const eng = getSttEngine();
    set({ isRecording: false });
    if (!eng) return "";
    try {
      return await eng.stop();
    } catch {
      return "";
    }
  },
  cancelRecording: async () => {
    const eng = getSttEngine();
    set({ isRecording: false });
    if (eng) {
      try {
        await eng.cancel();
      } catch {
        /* ignore */
      }
    }
  },

  speak: async (id, text, lang) => {
    const eng = getTtsEngine();
    if (!eng) return;
    // Aynı mesaja tekrar basılırsa durdur (toggle).
    if (get().speakingId === id) {
      await get().stopSpeaking();
      return;
    }
    set({ speakingId: id });
    try {
      await eng.speak(text, {
        voice: "aura",
        lang,
        onDone: () => {
          if (get().speakingId === id) set({ speakingId: null });
        },
      });
    } catch {
      set({ speakingId: null });
    }
  },
  stopSpeaking: async () => {
    const eng = getTtsEngine();
    set({ speakingId: null });
    if (eng) {
      try {
        await eng.stop();
      } catch {
        /* ignore */
      }
    }
  },
}));
