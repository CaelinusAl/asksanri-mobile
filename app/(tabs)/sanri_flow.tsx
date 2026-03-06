// app/(tabs)/sanri_flow.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";

import { apiPostJson, apiPostForm, API } from "@/lib/apiClient";
import ConsciousMenu from "../../components/ConsciousMenu";

type Lang = "tr" | "en";
type Role = "user" | "assistant";
type Msg = { id: string; role: Role; text: string };

function uid(prefix?: string) {
  const p = prefix ? String(prefix) : "m";
  const a = Math.random().toString(16).slice(2);
  const b = Date.now().toString(16);
  return p + b + a;
}

function safeStr(x: any) {
  return String(x == null ? "" : x);
}

const BG = require("../../assets/sanri_bg.jpg");

const T = {
  tr: {
    title: "Sanrı",
    personal: "Kişisel Alan",
    welcome: "Hoş geldin. Bir cümle yaz. Cevap vermem — anlamı yansıtırım.",
    placeholder: "Bir cümle yaz…",
    send: "Gönder",
    tip: "İpucu: Tek bir cümle yaz. Sanrı anlamı yansıtır ve yön çıkarır.",
    micHold: "Basılı tut",
    waking: "Sanrı uyanıyor…",
    wakingSub: "Sistem hazırlanıyor. Birkaç saniye sürebilir.",
    timeout: "Hata: Timeout (20sn). API cevap vermedi.",
    netfail: "Hata: Bağlantı kurulamadı. İnternet / VPN / izinleri kontrol et.",
    invalidJson: "Hata: API geçersiz JSON döndürdü.",
    audioShort: "Ses çok kısa/boş geldi. 1–2 saniye basılı tut.",
    audioEmpty: "Ses alındı ama metin boş döndü.",
    retry: "Tekrar dene",
    newChat: "Yeni Sohbet",
    myArea: "Benim Alanım",
  },
  en: {
    title: "Sanri",
    personal: "Personal Field",
    welcome: "Welcome. Write one sentence. I reflect meaning, not answers.",
    placeholder: "Write one sentence…",
    send: "Send",
    tip: "Tip: One sentence. Sanri mirrors meaning and produces direction.",
    micHold: "Hold",
    waking: "Sanri is waking…",
    wakingSub: "Preparing the system. It may take a few seconds.",
    timeout: "Error: Timeout (20s). API did not respond.",
    netfail: "Error: Network request failed. Check internet / VPN / permissions.",
    invalidJson: "Error: API returned invalid JSON.",
    audioShort: "Audio too short/empty. Hold for 1–2 seconds.",
    audioEmpty: "Audio received but text came back empty.",
    retry: "Retry",
    newChat: "New Chat",
    myArea: "My Area",
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
  const router = useRouter();

  const params = useLocalSearchParams<{
    lang?: string;
    title?: string;
    seed?: string;
    code?: string;
    city?: string;
    layer?: string;
  }>();

  const initialLang: Lang = safeStr(params.lang).toLowerCase() === "en" ? "en" : "tr";
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = useMemo(() => T[lang], [lang]);

  const [messages, setMessages] = useState<Msg[]>([
    { id: uid("a"), role: "assistant", text: T[initialLang].welcome },
  ]);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [isWaking, setIsWaking] = useState(true);

  const scrollRef = useRef<ScrollView>(null);
  const loaderIdRef = useRef<string>("");
  const lastSentRef = useRef<string>("");
  const recordingRef = useRef<Audio.Recording | null>(null);
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);

  useEffect(() => {
    setLang(initialLang);
  }, [initialLang]);

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

  const ensureLoader = useCallback((): string => {
    if (!loaderIdRef.current) {
      loaderIdRef.current = uid("ld");
      const id = loaderIdRef.current;
      setMessages((prev) => prev.concat([{ id, role: "assistant", text: "…" }]));
      return id;
    }
    const id = loaderIdRef.current;
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: "…" } : m)));
    return id;
  }, []);

  const resolveLoader = useCallback((id: string, text: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text } : m)));
  }, []);

  const removeLoader = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    loaderIdRef.current = "";
  }, []);

  const typeIntoLoader = useCallback(async (id: string, fullText: string) => {
    let i = 0;

    const step = () => {
      i = Math.min(i + 1, fullText.length);
      const part = fullText.slice(0, i);

      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: part } : m)));

      const ch = fullText[i - 1] || "";
      const pause = ch === "\n" ? 60 : ch === "." || ch === "!" || ch === "?" ? 90 : 0;
      const delay = 9 + Math.floor(Math.random() * 14) + pause;

      if (i < fullText.length) setTimeout(step, delay);
      else loaderIdRef.current = "";
    };

    setTimeout(step, 100);
  }, []);

  const resetChat = useCallback(() => {
    if (busy) return;
    loaderIdRef.current = "";
    setError("");
    setInput("");
    setMessages([{ id: uid("a"), role: "assistant", text: T[lang].welcome }]);
    setIsWaking(false);
  }, [busy, lang]);

  const openMyArea = useCallback(() => {
    router.push("/(tabs)/my_area" as any);
  }, [router]);

  const sendText = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;

      lastSentRef.current = text;

      setInput("");
      setBusy(true);
      setError("");

      const loaderId = ensureLoader();

      try {
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {}

        setMessages((prev) => prev.concat([{ id: uid("u"), role: "user", text }]));

        if (isWaking) {
          resolveLoader(loaderId, t.waking + "\n" + t.wakingSub);
          setTimeout(() => {
            setMessages((prev) => prev.map((m) => (m.id === loaderId ? { ...m, text: "…" } : m)));
          }, 650);
        }

        const payload = {
          message: text,
          session_id: "mobile-default",
          domain: "auto",
          gate_mode: "mirror",
          persona: "user",
          lang,
          context: {
            source: "personal_field",
            title: params.title ? safeStr(params.title) : undefined,
            seed: params.seed ? safeStr(params.seed) : undefined,
            city_code: params.code ? safeStr(params.code) : undefined,
            city: params.city ? safeStr(params.city) : undefined,
            layer: params.layer ? safeStr(params.layer) : undefined,
          },
        };

        const data: any = await apiPostJson(API.ask, payload, 60000);

        console.log("SANRI_RAW_RESPONSE", data);
        try {
          console.log("SANRI_KEYS", Object.keys(data || {}));
        } catch {}

        const answer =
          safeStr(data?.answer || data?.response).trim() ||
          (lang === "tr" ? "Buradayım." : "I’m here.");

        setIsWaking(false);
        await typeIntoLoader(loaderId, answer);
      } catch (e: any) {
        removeLoader(loaderId);

        const msg = safeStr(e?.message || e);

        if (msg === "TIMEOUT" || msg.toLowerCase().includes("abort")) {
          setError(t.timeout);
        } else if (msg === "INVALID_JSON" || msg === "NON_JSON_RESPONSE") {
          const st = String(e?.status || "");
          const ct = String(e?.contentType || "");
          const rawErr = String(e?.raw || "");
          setError(
            (lang === "tr" ? "API JSON dönmedi. " : "API did not return JSON. ") +
              "status=" +
              st +
              " ct=" +
              ct +
              " raw=" +
              rawErr
          );
        } else if (msg.toLowerCase().includes("network request failed")) {
          setError(t.netfail);
        } else if (msg.startsWith("HTTP_")) {
          const detail = e?.detail;
          setError("Hata: " + safeStr(detail?.message || detail || msg));
        } else {
          setError("Hata: " + msg);
        }
      } finally {
        setBusy(false);
        scrollToEnd();
      }
    },
    [
      busy,
      ensureLoader,
      isWaking,
      lang,
      params.city,
      params.code,
      params.layer,
      params.seed,
      params.title,
      resolveLoader,
      removeLoader,
      scrollToEnd,
      t,
      typeIntoLoader,
    ]
  );

  const send = useCallback(() => sendText(input), [sendText, input]);

  const retrySend = useCallback(() => {
    const last = lastSentRef.current;
    if (!last || busy) return;
    sendText(last);
  }, [sendText, busy]);

  const startRec = useCallback(async () => {
    if (busy) return;
    if (isStartingRef.current || isStoppingRef.current) return;
    if (recordingRef.current) return;

    isStartingRef.current = true;
    setError("");

    try {
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
      setError("Hata: " + safeStr(e?.message || e));
      try {
        await recordingRef.current?.stopAndUnloadAsync();
      } catch {}
      recordingRef.current = null;
      setIsRecording(false);
    } finally {
      isStartingRef.current = false;
    }
  }, [busy, lang]);

  const stopRec = useCallback(async () => {
    const rec = recordingRef.current;
    if (!rec) return;
    if (isStoppingRef.current) return;

    isStoppingRef.current = true;

    try {
      setIsRecording(false);
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      recordingRef.current = null;

      if (!uri) return;

      const info = await FileSystem.getInfoAsync(uri);
      const size =
        info && (info as any).exists && typeof (info as any).size === "number"
          ? (info as any).size
          : 0;

      if (size < 2000) {
        setError(t.audioShort);
        return;
      }

      const form = new FormData();
      form.append("lang", lang);
      form.append(
        "file",
        {
          uri: String(uri),
          name: "voice.m4a",
          type: "audio/m4a",
        } as any
      );

      const voice: any = await apiPostForm(API.transcribe, form, 60000);
      const outText = safeStr(voice?.text).trim();

      if (!outText) {
        setError(t.audioEmpty);
        return;
      }

      setInput((prev) => (prev ? prev + " " : "") + outText);
    } catch (e: any) {
      const msg = safeStr(e?.message || e);
      if (msg === "TIMEOUT" || msg.toLowerCase().includes("abort")) setError(t.timeout);
      else if (msg.toLowerCase().includes("network request failed")) setError(t.netfail);
      else setError("Hata: " + msg);
    } finally {
      isStoppingRef.current = false;
      scrollToEnd();
    }
  }, [lang, t.audioShort, t.audioEmpty, t.timeout, t.netfail, scrollToEnd]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground source={BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View pointerEvents="none" style={styles.veil} />
      <View pointerEvents="none" style={styles.glowA} />
      <View pointerEvents="none" style={styles.glowB} />

      {/* TOP BAR */}
      <View style={styles.topbar}>
        <Pressable onPress={openMyArea} style={styles.profileBtn} hitSlop={10}>
          <Text style={styles.profileTxt}>◎</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.topTitle}>{t.title}</Text>
          <Text style={styles.topMeta}>{t.personal}</Text>
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

      {/* NEW CHAT */}
      <View style={styles.actionRow}>
        <Pressable onPress={resetChat} style={styles.newChatBtn} hitSlop={10}>
          <Text style={styles.newChatTxt}>{t.newChat}</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m) => {
            const isUser = m.role === "user";

            return (
              <View key={m.id} style={[styles.row, isUser ? styles.rowRight : styles.rowLeft]}>
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
                  <Text style={styles.bubbleText}>{m.text}</Text>
                </View>
              </View>
            );
          })}

          {error ? (
            <View style={styles.errWrap}>
              <Text style={styles.errorText}>{error}</Text>

              <Pressable
                onPress={retrySend}
                style={styles.retryBtn}
                hitSlop={10}
                disabled={busy}
              >
                <Text style={styles.retryTxt}>{t.retry}</Text>
              </Pressable>
            </View>
          ) : null}

          <View style={{ height: 10 }} />
        </ScrollView>

        {/* INPUT BAR */}
        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t.placeholder}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
            multiline
          />

          <Pressable
            onPressIn={startRec}
            onPressOut={stopRec}
            style={[styles.micBtn, isRecording && styles.micBtnActive, busy && { opacity: 0.5 }]}
            hitSlop={10}
            disabled={busy}
          >
            <Text style={styles.micTxt}>{isRecording ? "■" : "🎙"}</Text>
            <Text style={styles.micHint}>{t.micHold}</Text>
          </Pressable>

          <Pressable
            onPress={send}
            style={[styles.sendBtn, (!input.trim() || busy) && { opacity: 0.5 }]}
            hitSlop={10}
            disabled={!input.trim() || busy}
          >
            <Text style={styles.sendText}>{t.send}</Text>
          </Pressable>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.hintBottom}>{t.tip}</Text>
          <ConsciousMenu />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#05060b" },

  veil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6,8,18,0.35)",
  },

  glowA: {
    position: "absolute",
    width: 430,
    height: 430,
    borderRadius: 999,
    backgroundColor: "rgba(124, 92, 255, 0.18)",
    top: 70,
    left: -120,
  },

  glowB: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 999,
    backgroundColor: "rgba(124, 92, 255, 0.14)",
    bottom: 80,
    right: -70,
  },

  topbar: {
    paddingTop: 54,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  profileBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,247,216,0.08)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.28)",
  },

  profileTxt: {
    color: "#7cf7d8",
    fontSize: 20,
    fontWeight: "900",
  },

  topTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
  },

  topMeta: {
    color: "rgba(255,255,255,0.58)",
    marginTop: 2,
    fontSize: 12,
  },

  langRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  langChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  langChipActive: {
    backgroundColor: "rgba(124,247,216,0.12)",
    borderColor: "rgba(124,247,216,0.30)",
  },

  langText: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: "900",
    fontSize: 13,
  },

  langTextActive: {
    color: "#7cf7d8",
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  backBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
  },

  actionRow: {
    paddingHorizontal: 14,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },

  newChatBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  newChatTxt: {
    color: "#cbbcff",
    fontWeight: "800",
    fontSize: 13,
  },

  row: {
  width: "100%",
  marginBottom: 12,
  flexDirection: "row",
},

rowLeft: {
  justifyContent: "flex-start",
},

rowRight: {
  justifyContent: "flex-end",
},

scroll: {
  flex: 1,
},

scrollContent: {
  paddingHorizontal: 14,
  paddingTop: 8,
  paddingBottom: 20,
},

bubble: {
  maxWidth: "88%",
  borderRadius: 24,
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderWidth: 1,
},
  bubbleAI: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.10)",
  },

  bubbleUser: {
    backgroundColor: "rgba(94,59,255,0.42)",
    borderColor: "rgba(94,59,255,0.30)",
  },

  bubbleText: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },

  errWrap: {
    marginTop: 4,
    marginHorizontal: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,90,90,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,120,120,0.18)",
  },

  errorText: {
    color: "#ffd0d0",
    lineHeight: 20,
  },

  retryBtn: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  retryTxt: {
    color: "white",
    fontWeight: "800",
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(10,12,20,0.72)",
  },

  input: {
    flex: 1,
    minHeight: 54,
    maxHeight: 120,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "white",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    fontSize: 16,
  },

  micBtn: {
    width: 78,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  micBtnActive: {
    backgroundColor: "rgba(255,80,120,0.25)",
    borderColor: "rgba(255,80,120,0.35)",
  },

  micTxt: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
  },

  micHint: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 11,
    marginTop: 2,
  },

  sendBtn: {
    height: 54,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(94,59,255,0.85)",
  },

  sendText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 20,
    paddingTop: 6,
    backgroundColor: "rgba(10,12,20,0.72)",
  },

  hintBottom: {
    flex: 1,
    color: "rgba(255,255,255,0.52)",
    fontSize: 12,
    lineHeight: 18,
  },
});