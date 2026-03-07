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
import { BlurView } from "expo-blur";

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
  domain?: string;
  gateMode?: string;
  intent?: string;
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
      const id = uid("ld");
      loaderIdRef.current = id;
      setMessages((prev) => [...prev, { id, role: "assistant", text: "…" }]);
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
    if (!fullText?.trim()) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: "" } : m)));
      loaderIdRef.current = "";
      return;
    }

    let i = 0;

    const step = () => {
      i = Math.min(i + 1, fullText.length);
      const part = fullText.slice(0, i);

      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: part } : m)));

      const ch = fullText[i - 1] || "";
      const pause = ch === "\n" ? 60 : ch === "." || ch === "!" || ch === "?" ? 90 : 0;
      const delay = 9 + Math.floor(Math.random() * 14) + pause;

      if (i < fullText.length) {
        setTimeout(step, delay);
      } else {
        loaderIdRef.current = "";
      }
    };

    setTimeout(step, 90);
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
      setBusy(true);
      setError("");
      setInput("");

      try {
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {}

        // önce kullanıcı mesajını ekle
        setMessages((prev) => [...prev, { id: uid("u"), role: "user", text }]);

        // sonra loader ekle ki cevap mutlaka altta başlasın
        const loaderId = ensureLoader();

        if (isWaking) {
          resolveLoader(loaderId, t.waking + "\n" + t.wakingSub);
          setTimeout(() => {
            setMessages((prev) => prev.map((m) => (m.id === loaderId ? { ...m, text: "…" } : m)));
          }, 650);
        }

        const payload = {
           message: text,
           session_id: "mobile-default",
           domain: safeStr(params.domain || "auto") || "auto",
           gate_mode: safeStr(params.gateMode || "mirror") || "mirror",
           persona: "user",
           lang,
           context: {
             source: "personal_field",
             title: params.title ? safeStr(params.title) : undefined,
             seed: params.seed ? safeStr(params.seed) : undefined,
             city_code: params.code ? safeStr(params.code) : undefined,
             city: params.city ? safeStr(params.city) : undefined,
             layer: params.layer ? safeStr(params.layer) : undefined,
             intent: params.intent ? safeStr(params.intent) : undefined,
  },
};

        console.log("SANRI_SEND", { text, lang });

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
        const msg = safeStr(e?.message || e);

        if (loaderIdRef.current) {
          removeLoader(loaderIdRef.current);
        }

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
        loaderIdRef.current = "";
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
      removeLoader,
      resolveLoader,
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
    recordingRef.current = null;
    setIsRecording(false);
  } finally {
    isStartingRef.current = false;
  }
}, [busy, lang]);

const stopRec = useCallback(async () => {
  if (isStoppingRef.current) return;

  const rec = recordingRef.current;
  if (!rec) return;

  isStoppingRef.current = true;
  setIsRecording(false);

  try {
    recordingRef.current = null;

    const status: any = await rec.getStatusAsync().catch(() => null);

    if (status?.isRecording) {
      await rec.stopAndUnloadAsync();
    }

    const uri = rec.getURI();
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

    if (msg.includes("already been unloaded")) {
      return;
    }

    if (msg === "TIMEOUT" || msg.toLowerCase().includes("abort")) {
      setError(t.timeout);
    } else if (msg.toLowerCase().includes("network request failed")) {
      setError(t.netfail);
    } else {
      setError("Hata: " + msg);
    }
  } finally {
    isStoppingRef.current = false;
    scrollToEnd();
  }
}, [lang, scrollToEnd, t.audioEmpty, t.audioShort, t.netfail, t.timeout]);  

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground source={BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View pointerEvents="none" style={styles.veil} />
      <View pointerEvents="none" style={styles.glowA} />
      <View pointerEvents="none" style={styles.glowB} />

      <View style={styles.topbar}>
        <Pressable onPress={openMyArea} style={styles.profileBtn} hitSlop={10}>
          <BlurView intensity={20} tint="dark" style={styles.profileBtnInner}>
            <Text style={styles.profileTxt}>◎</Text>
          </BlurView>
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
            <BlurView intensity={20} tint="dark" style={styles.langChipInner}>
              <Text style={[styles.langText, lang === "tr" && styles.langTextActive]}>TR</Text>
            </BlurView>
          </Pressable>

          <Pressable
            onPress={() => setLang("en")}
            style={[styles.langChip, lang === "en" && styles.langChipActive]}
            hitSlop={10}
          >
            <BlurView intensity={20} tint="dark" style={styles.langChipInner}>
              <Text style={[styles.langText, lang === "en" && styles.langTextActive]}>EN</Text>
            </BlurView>
          </Pressable>
        </View>

        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <BlurView intensity={20} tint="dark" style={styles.backBtnInner}>
            <Text style={styles.backBtnText}>←</Text>
          </BlurView>
        </Pressable>
      </View>

      <View style={styles.actionRow}>
        <Pressable onPress={resetChat} style={styles.newChatBtn} hitSlop={10}>
          <BlurView intensity={24} tint="dark" style={styles.newChatInner}>
            <Text style={styles.newChatTxt}>{t.newChat}</Text>
          </BlurView>
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
                <View style={styles.bubbleWrap}>
                  {isUser ? <View style={styles.userGlow} /> : null}
                  <BlurView
                    intensity={24}
                    tint="dark"
                    style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}
                  >
                    <Text style={styles.bubbleText}>{m.text}</Text>
                  </BlurView>
                </View>
              </View>
            );
          })}

          {error ? (
            <View style={styles.errWrap}>
              <BlurView intensity={24} tint="dark" style={styles.errCard}>
                <Text style={styles.errorText}>{error}</Text>

                <Pressable
                  onPress={retrySend}
                  style={styles.retryBtn}
                  hitSlop={10}
                  disabled={busy}
                >
                  <Text style={styles.retryTxt}>{t.retry}</Text>
                </Pressable>
              </BlurView>
            </View>
          ) : null}

          <View style={{ height: 10 }} />
        </ScrollView>

        <View style={styles.inputBar}>
          <BlurView intensity={24} tint="dark" style={styles.inputShell}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={t.placeholder}
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={styles.input}
              multiline
            />
          </BlurView>

          <Pressable
             onPressIn={startRec}
             onPressOut={() => {
             if (recordingRef.current && !isStoppingRef.current) {
            stopRec();
          }
        }}
          style={[styles.micBtn, isRecording && styles.micBtnActive, busy && { opacity: 0.5 }]}
          hitSlop={10}
          disabled={busy}
          >
          
            <BlurView intensity={24} tint="dark" style={styles.micInner}>
              <Text style={styles.micTxt}>{isRecording ? "■" : "🎙"}</Text>
              <Text style={styles.micHint}>{t.micHold}</Text>
            </BlurView>
          </Pressable>

          <Pressable
            onPress={send}
            style={[styles.sendBtn, (!input.trim() || busy) && { opacity: 0.6 }]}
            hitSlop={10}
            disabled={!input.trim() || busy}
          >
            <BlurView intensity={30} tint="dark" style={styles.sendInner}>
              <Text style={styles.sendText}>{t.send}</Text>
            </BlurView>
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
  root: { flex: 1, backgroundColor: "#07080d" },

  veil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6,8,16,0.34)",
  },

  glowA: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(101, 72, 255, 0.16)",
    top: 140,
    left: -90,
  },

  glowB: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: "rgba(130, 103, 255, 0.12)",
    bottom: 70,
    right: -90,
  },

  topbar: {
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  profileBtn: {
    width: 54,
    height: 54,
    borderRadius: 18,
    overflow: "hidden",
  },

  profileBtnInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.22)",
  },

  profileTxt: {
    color: "#7cf7d8",
    fontSize: 20,
    fontWeight: "900",
  },

  topTitle: {
    color: "white",
    fontSize: 26,
    fontWeight: "900",
  },

  topMeta: {
    color: "rgba(255,255,255,0.68)",
    marginTop: 2,
    fontSize: 14,
  },

  langRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  langChip: {
    width: 60,
    height: 54,
    borderRadius: 18,
    overflow: "hidden",
  },

  langChipInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  langChipActive: {},

  langText: {
    color: "rgba(255,255,255,0.80)",
    fontWeight: "900",
    fontSize: 16,
  },

  langTextActive: {
    color: "#7cf7d8",
  },

  backBtn: {
    width: 54,
    height: 54,
    borderRadius: 18,
    overflow: "hidden",
  },

  backBtnInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  backBtnText: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
  },

  actionRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  newChatBtn: {
    width: 150,
    height: 56,
    borderRadius: 20,
    overflow: "hidden",
  },

  newChatInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  newChatTxt: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },

  scroll: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },

  row: {
    width: "100%",
    marginBottom: 14,
    flexDirection: "row",
  },

  rowLeft: {
    justifyContent: "flex-start",
  },

  rowRight: {
    justifyContent: "flex-end",
  },

  bubbleWrap: {
    maxWidth: "88%",
    position: "relative",
  },

  userGlow: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: -10,
    height: 28,
    borderRadius: 999,
    backgroundColor: "rgba(94,59,255,0.30)",
    opacity: 0.9,
  },

  bubble: {
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 16,
    overflow: "hidden",
    borderWidth: 1,
  },

  bubbleAI: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.10)",
  },

  bubbleUser: {
    backgroundColor: "rgba(105,76,255,0.22)",
    borderColor: "rgba(163,142,255,0.34)",
  },

  bubbleText: {
    color: "white",
    fontSize: 16,
    lineHeight: 28,
    fontWeight: "500",
  },

  errWrap: {
    marginTop: 4,
    marginBottom: 10,
  },

  errCard: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: "rgba(255,80,120,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,140,160,0.18)",
    overflow: "hidden",
  },

  errorText: {
    color: "#ffd5df",
    lineHeight: 22,
  },

  retryBtn: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(105,76,255,0.88)",
  },

  retryTxt: {
    color: "white",
    fontWeight: "900",
  },

  inputBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },

  inputShell: {
    flex: 1,
    minHeight: 64,
    maxHeight: 140,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  input: {
    minHeight: 64,
    maxHeight: 140,
    color: "white",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 16,
  },

  micBtn: {
    width: 92,
    height: 64,
    borderRadius: 22,
    overflow: "hidden",
  },

  micBtnActive: {
    transform: [{ scale: 0.98 }],
  },

  micInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  micTxt: {
    color: "white",
    fontSize: 18,
  },

  micHint: {
    marginTop: 3,
    color: "rgba(255,255,255,0.80)",
    fontSize: 12,
    fontWeight: "700",
  },

  sendBtn: {
    width: 132,
    height: 64,
    borderRadius: 22,
    overflow: "hidden",
  },

  sendInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(104,76,255,0.42)",
    borderWidth: 1,
    borderColor: "rgba(170,150,255,0.24)",
  },

  sendText: {
    color: "white",
    fontWeight: "900",
    fontSize: 17,
  },

  bottomRow: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 16 : 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  hintBottom: {
    flex: 1,
    color: "rgba(255,255,255,0.58)",
    fontSize: 13,
    lineHeight: 18,
  },
});