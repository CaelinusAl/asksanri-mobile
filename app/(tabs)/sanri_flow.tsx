// app/(tabs)/sanri_flow.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ImageBackground,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";
import ConsciousMenu from "../../components/ConsciousMenu";

type Lang = "tr" | "en";
type Msg = { id: string; role: "user" | "assistant"; text: string };

function uid() {
  return "m_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

/**
 * API_BASE
 * Local: http://192.168.1.181:8000
 * Prod:  https://sanri-api-2.onrender.com   (Render açıldıysa bunu env ile ver)
 */
const API_BASE = "https://sanri-api-2.onrender.com";

const ASK_URL = API_BASE + "/bilinc-alani/ask";
const TRANSCRIBE_URL = API_BASE + "/api/voice/transcribe";

console.log("API_BASE_SELECTED =", API_BASE);
console.log("ASK_URL =", ASK_URL);
console.log("TRANSCRIBE_URL =", TRANSCRIBE_URL);

const BG = require("../../assets/sanri_bg.jpg");

const T = {
  tr: {
    title: "Sanrı",
    personal: "Kişisel Alan",
    welcome: "Hoş geldin. Bir cümle yaz. Cevap vermem — anlamı yansıtırım.",
    placeholder: "Bir cümle yaz…",
    send: "Gönder",
    tip: "İpucu: Tek bir cümle yaz. Sanrı anlamı yansıtır ve yön çıkarır.",
    err: "Hata: ",
    micHold: "Basılı tut",
    timeout: "Timeout (15sn). API cevap vermedi.",
    netfail: "Network request failed (IP/port/firewall/HTTP).",
    audioShort: "Ses çok kısa/boş geldi. 1-2 saniye basılı tut.",
  },
  en: {
    title: "Sanri",
    personal: "Personal Field",
    welcome: "Welcome. Write a sentence. I reflect meaning, not answers.",
    placeholder: "Write one sentence…",
    send: "Send",
    tip: "Tip: One sentence. Sanri mirrors meaning and produces direction.",
    err: "Error: ",
    micHold: "Hold",
    timeout: "Timeout (15s). API did not respond.",
    netfail: "Network request failed (IP/port/firewall/HTTP).",
    audioShort: "Audio too short/empty. Hold for 1-2s.",
  },
} as const;

const RECORDING_OPTIONS: Audio.RecordingOptions = {
  android: {
    extension: ".m4a",
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: ".m4a",
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: undefined as any,
};

export default function SanriFlowScreen() {
  const scrollRef = useRef<ScrollView>(null);

  const params = useLocalSearchParams<{ lang?: string; title?: string; seed?: string }>();
  const initialLang: Lang = String(params.lang || "").toLowerCase() === "en" ? "en" : "tr";

  const [lang, setLang] = useState<Lang>(initialLang);
  const [messages, setMessages] = useState<Msg[]>([
    { id: uid(), role: "assistant", text: T[initialLang].welcome },
  ]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // mic refs
  const recordingRef = useRef<Audio.Recording | null>(null);
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);

  useEffect(() => setLang(initialLang), [initialLang]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === "assistant") {
        return [{ ...prev[0], text: T[lang].welcome }];
      }
      return prev;
    });
  }, [lang]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, scrollToEnd]);

  const typeIn = useCallback(
    async (fullText: string) => {
      setTyping(true);
      const id = uid();
      setMessages((prev) => prev.concat([{ id, role: "assistant", text: "" }]));

      let i = 0;
      const step = () => {
        i = Math.min(i + 1, fullText.length);
        const part = fullText.slice(0, i);

        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: part } : m)));

        const ch = fullText[i - 1] || "";
        const pause = ch === "\n" ? 70 : ch === "." || ch === "!" || ch === "?" ? 90 : 0;
        const delay = 10 + Math.floor(Math.random() * 18) + pause;

        if (i < fullText.length) setTimeout(step, delay);
        else setTyping(false);
      };

      setTimeout(step, 120);
    },
    []
  );

  // ✅ TEXT SEND: ASK_URL'e gider (transcribe değil!)
  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isSending || typing) return;

    setError("");
    setInput("");
    setIsSending(true);

    try {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}

      setMessages((prev) => prev.concat([{ id: uid(), role: "user", text }]));

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);

      const payload = {
        message: text,
        session_id: "mobile-default",
        domain: "auto",
        gate_mode: "mirror",
        persona: "user",
        lang: lang,
        context: {
          source: "personal_field",
          title: params.title ? String(params.title) : undefined,
          seed: params.seed ? String(params.seed) : undefined,
        },
      };

      const res = await fetch(ASK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);

      const raw = await res.text();
      console.log("ASK_STATUS =", res.status);
      console.log("ASK_RAW =", raw.slice(0, 300));

      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("Invalid JSON from API");
      }

      if (!res.ok) {
        throw new Error(String(data?.detail || ("HTTP " + res.status)));
      }

      const answer =
        String(data?.answer || data?.response || "").trim() ||
        (lang === "tr" ? "Buradayım." : "I’m here.");

      await typeIn(answer);
    } catch (e: any) {
      const msg = String(e?.message || e);

      if (msg.toLowerCase().includes("abort")) {
        setError(T[lang].timeout);
      } else if (msg.toLowerCase().includes("network request failed")) {
        setError(T[lang].netfail);
      } else {
        setError(msg);
      }
    } finally {
      setIsSending(false);
      scrollToEnd();
    }
  }, [input, isSending, typing, lang, params.title, params.seed, typeIn, scrollToEnd]);

  // ✅ MIC START
  const startRec = useCallback(async () => {
    try {
      if (isStartingRef.current || isStoppingRef.current) return;
      if (recordingRef.current) return;

      isStartingRef.current = true;
      setError("");

      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        setError(lang === "tr" ? "Mikrofon izni yok." : "Microphone permission missing.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(RECORDING_OPTIONS);
      await rec.startAsync();

      recordingRef.current = rec;
      setIsRecording(true);

      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
    } catch (e: any) {
      setError(String(e?.message || e));
      try {
        await recordingRef.current?.stopAndUnloadAsync();
      } catch {}
      recordingRef.current = null;
      setIsRecording(false);
    } finally {
      isStartingRef.current = false;
    }
  }, [lang]);

  // ✅ MIC STOP + TRANSCRIBE
  const stopRec = useCallback(async () => {
    const rec = recordingRef.current;
    if (!rec) return;

    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    try {
      setIsRecording(false);

      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();

      // ref'i hemen boşalt
      recordingRef.current = null;

      if (!uri) return;

      // dosya boyutu kontrolü (legacy file system)
      const info = await (FileSystem as any).getInfoAsync(uri, { size: true });
      const size = info && info.exists && typeof info.size === "number" ? info.size : 0;

      console.log("REC_URI =", uri);
      console.log("REC_SIZE =", size);

      if (size < 2000) {
        setError(T[lang].audioShort);
        return;
      }

      const formData = new FormData();
      formData.append("lang", lang);
      formData.append(
        "file",
        {
          uri: String(uri),
          name: "voice.m4a",
          type: "audio/m4a",
        } as any
      );

      setIsSending(true);
      setError("");

      const res = await fetch(TRANSCRIBE_URL, {
        method: "POST",
        body: formData,
      });

      const voiceRaw = await res.text();
      console.log("VOICE_STATUS =", res.status);
      console.log("VOICE_RAW =", voiceRaw);

      let voiceData: any = {};
      try {
        voiceData = voiceRaw ? JSON.parse(voiceRaw) : {};
      } catch {
        // ignore
      }

      if (!res.ok) {
        throw new Error(String(voiceData?.detail || ("HTTP " + res.status)));
      }

      const text = String(voiceData?.text || "").trim();
      if (text) {
        setInput((prev) => (prev ? prev + " " : "") + text);
        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
      } else {
        setError(lang === "tr" ? "Ses alındı ama metin boş döndü." : "Audio received but text came back empty.");
      }
    } catch (e: any) {
      setError(String(e?.message || e));
      try {
        await rec.stopAndUnloadAsync();
      } catch {}
      recordingRef.current = null;
    } finally {
      setIsSending(false);
      isStoppingRef.current = false;
      scrollToEnd();
    }
  }, [lang, TRANSCRIBE_URL, scrollToEnd]);

  return (
    <View style={styles.root}>

      <StatusBar barStyle="light-content" />

      <ImageBackground source={BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View pointerEvents="none" style={styles.veil} />
      <View pointerEvents="none" style={styles.glowA} />
      <View pointerEvents="none" style={styles.glowB} />

      {/* TOP BAR */}
      <View style={styles.topbar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.topTitle}>{T[lang].title}</Text>
          <Text style={styles.topMeta}>{T[lang].personal}</Text>
        </View>

        <View style={styles.langRow}>
          <Pressable
            onPress={() => setLang("tr")}
            style={[styles.langChip, lang === "tr" && styles.langChipActive]}
            hitSlop={10}
          >
            <Text style={[styles.langText, lang === "tr" && styles.langTextActive]}>TR</Text>
          </Pressable>
          <Pressable
            onPress={() => setLang("en")}
            style={[styles.langChip, lang === "en" && styles.langChipActive]}
            hitSlop={10}
          >
            <Text style={[styles.langText, lang === "en" && styles.langTextActive]}>EN</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backBtnText}>←</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <View key={m.id} style={[styles.bubbleRow, isUser ? styles.rowRight : styles.rowLeft]}>
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
                  <Text style={styles.bubbleText}>{m.text}</Text>
                </View>
                <ConsciousMenu />
              </View>
            );
          })}

          {error ? <Text style={styles.errorText}>{T[lang].err + error}</Text> : null}
          {isSending || typing ? <Text style={styles.thinking}>…</Text> : null}
        </ScrollView>

        {/* INPUT BAR */}
        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={T[lang].placeholder}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
            multiline
          />

          {/* MIC: basılı tut */}
          <Pressable
            onPressIn={startRec}
            onPressOut={stopRec}
            style={[styles.micBtn, isRecording && styles.micBtnActive, (isSending || typing) && { opacity: 0.5 }]}
            hitSlop={10}
            disabled={isSending || typing}
          >
            <Text style={styles.micTxt}>{isRecording ? "■" : "🎙"}</Text>
            <Text style={styles.micHint}>{T[lang].micHold}</Text>
          </Pressable>

          <Pressable
            onPress={send}
            style={[styles.sendBtn, (!input.trim() || isSending || typing) && { opacity: 0.5 }]}
            hitSlop={10}
            disabled={!input.trim() || isSending || typing}
          >
            <Text style={styles.sendText}>{T[lang].send}</Text>
          </Pressable>
        </View>

        <Text style={styles.hintBottom}>{T[lang].tip}</Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },

  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,8,20,0.45)" },
  glowA: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 520,
    left: -180,
    top: 40,
    backgroundColor: "rgba(94,59,255,0.18)",
  },
  glowB: {
    position: "absolute",
    width: 560,
    height: 560,
    borderRadius: 560,
    right: -200,
    bottom: -80,
    backgroundColor: "rgba(140,100,255,0.12)",
  },

  topbar: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  topTitle: { color: "white", fontWeight: "900", fontSize: 20 },
  topMeta: { color: "rgba(255,255,255,0.60)", marginTop: 4 },

  langRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  langChipActive: { backgroundColor: "rgba(124,247,216,0.12)", borderColor: "rgba(124,247,216,0.28)" },
  langText: { color: "rgba(255,255,255,0.70)", fontWeight: "900", letterSpacing: 1 },
  langTextActive: { color: "#7cf7d8" },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backBtnText: { color: "white", fontWeight: "900", fontSize: 18 },

  scroll: { padding: 16, paddingBottom: 18 },

  bubbleRow: { marginBottom: 10, flexDirection: "row" },
  rowLeft: { justifyContent: "flex-start" },
  rowRight: { justifyContent: "flex-end" },

  bubble: { maxWidth: "92%", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1 },
  bubbleAI: { backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)" },
  bubbleUser: { backgroundColor: "rgba(94,59,255,0.70)", borderColor: "rgba(94,59,255,0.55)" },
  bubbleText: { color: "white", lineHeight: 20 },

  errorText: { color: "#ff6b8a", marginTop: 6 },
  thinking: { color: "rgba(255,255,255,0.55)", marginTop: 6 },

  inputBar: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(0,0,0,0.30)",
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    color: "white",
  },

  micBtn: {
    width: 64,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  micBtnActive: { backgroundColor: "rgba(255,80,120,0.20)", borderColor: "rgba(255,80,120,0.35)" },
  micTxt: { color: "white", fontWeight: "900", fontSize: 16, lineHeight: 18 },
  micHint: { color: "rgba(255,255,255,0.55)", fontSize: 10, marginTop: 2 },

  sendBtn: { paddingHorizontal: 16, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#5e3bff" },
  sendText: { color: "white", fontWeight: "900" },

  hintBottom: { color: "rgba(255,255,255,0.45)", paddingHorizontal: 14, paddingBottom: 10 },
});