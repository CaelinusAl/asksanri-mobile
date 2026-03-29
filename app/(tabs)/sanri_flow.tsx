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
  StatusBar,
  ImageBackground,
  Share,
  Platform,
  
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import { BlurView } from "expo-blur";

import { apiPostJson, apiPostForm, API } from "../../lib/apiClient";
import ConsciousMenu from "../../components/ConsciousMenu";
import SanriShareButtons from "../../components/SanriShareButtons";
import { useAuth } from "../../context/AuthContext";
import { trackEvent } from "../../lib/analytics";
import { useScreenTime } from "../../lib/useScreenTime";
import { hasVipEntitlement } from "../../lib/premium";
import { getUsageCount, incrementUsage, getFreeLimit, hasReachedLimit } from "../../lib/usageLimit";


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

const IOS_STORE_URL = "https://asksanri.com";
const ANDROID_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.caelinusai.asksanri";
const FALLBACK_URL = "https://asksanri.com";

const BG = require("../../assets/sanri_bg.jpg");

const MODE_COPY = {
  tr: {
    chat: {
      label: "Sanrı'ya Sor",
      title: "Sanrı",
      sub: "Kişisel Alan",
      welcome: "Hoş geldin. Bir cümle yaz. Cevap vermem — anlamı yansıtırım.",
      placeholder: "İçinden geçen şeyi yaz…",
      tip: "İpucu: Tek bir cümle yaz. Sanrı anlamı yansıtır ve yön çıkarır.",
      sendLabel: "Gönder",
    },
    code: {
      label: "Kod Alanı",
      title: "Kod Alanı",
      sub: "Kelimeleri parçala. Anlamın altındaki dili gör.",
      welcome: "Bir kelime yaz. Parçalayalım. Kök anlamını, bilinç dilini ve günlük karşılığını açalım.",
      placeholder: "Bir kelime yaz: return, aşk, kader, sistem…",
      tip: "Tek kelime veya kısa ifade gir. Sanrı kodu parçalar.",
      sendLabel: "Kodu Aç",
    },
    decode: {
      label: "Decoder",
      title: "Decoder Sanrı",
      sub: "Görüneni değil, arkasındaki yapıyı oku.",
      welcome: "Bir rüya, haber, cümle veya sembol bırak. Katmanlarını açalım.",
      placeholder: "Bir rüya, haber, cümle veya sembol bırak…",
      tip: "Metin, rüya veya sembol gönder. Sanrı katmanlarını açar.",
      sendLabel: "Decode Et",
    },
  },
  en: {
    chat: {
      label: "Ask Sanri",
      title: "Sanri",
      sub: "Personal Field",
      welcome: "Welcome. Write one sentence. I reflect meaning, not answers.",
      placeholder: "Write what's on your mind…",
      tip: "Tip: One sentence. Sanri mirrors meaning and produces direction.",
      sendLabel: "Send",
    },
    code: {
      label: "Code Field",
      title: "Code Field",
      sub: "Break words apart. See the language beneath meaning.",
      welcome: "Write a word. Let's break it down — root meaning, consciousness language, daily translation.",
      placeholder: "Write a word: return, love, fate, system…",
      tip: "Enter a word or short phrase. Sanri decodes it.",
      sendLabel: "Open Code",
    },
    decode: {
      label: "Decoder",
      title: "Decoder Sanri",
      sub: "Read not what's visible, but the structure behind it.",
      welcome: "Leave a dream, news, sentence, or symbol. Let's open its layers.",
      placeholder: "Leave a dream, news, sentence, or symbol…",
      tip: "Send text, dream, or symbol. Sanri opens the layers.",
      sendLabel: "Decode",
    },
  },
} as const;

const T = {
  tr: {
    title: "Sanrı",
    personal: "Kişisel Alan",
    welcome: "Hoş geldin. Bir cümle yaz. Cevap vermem — anlamı yansıtırım.",
    placeholder: "İçinden geçen şeyi yaz…",
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
  const { user, isAdmin } = useAuth();
  useScreenTime("sanri_flow", user?.id);

  useEffect(() => {
    trackEvent("page_view", { userId: user?.id, meta: { page: "sanri_flow" } });
  }, []);

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
  responseMode?: string;
}>();

  type SanriMode = "chat" | "code" | "decode";
  const [mode, setMode] = useState<SanriMode>("chat");



  const initialLang: Lang = safeStr(params.lang).toLowerCase() === "en" ? "en" : "tr";
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = useMemo(() => T[lang], [lang]);
  const mc = useMemo(() => MODE_COPY[lang][mode], [lang, mode]);

  const [messages, setMessages] = useState<Msg[]>([
    { id: uid("a"), role: "assistant", text: T[initialLang].welcome },
  ]);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [isWaking, setIsWaking] = useState(true);

  const [isVip, setIsVip] = useState(false);
  const [codeUsed, setCodeUsed] = useState(0);
  const [decodeUsed, setDecodeUsed] = useState(0);
  const FREE_LIMIT = getFreeLimit();

  useEffect(() => {
    (async () => {
      if (isAdmin) {
        setIsVip(true);
        if (__DEV__) console.log("ADMIN VIP ACTIVE — sanri_flow unlimited");
        return;
      }
      const vip = await hasVipEntitlement(user);
      setIsVip(vip);
      const cu = await getUsageCount("code");
      const du = await getUsageCount("decode");
      setCodeUsed(cu);
      setDecodeUsed(du);
    })();
  }, [isAdmin, user]);

  const scrollRef = useRef<ScrollView>(null);
  const loaderIdRef = useRef<string>("");
  const lastSentRef = useRef<string>("");
  const recordingRef = useRef<Audio.Recording | null>(null);
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

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

  const openShare = async (text: string) => {
  const storeUrl =
    Platform.OS === "ios"
      ? IOS_STORE_URL
      : Platform.OS === "android"
      ? ANDROID_STORE_URL
      : FALLBACK_URL;

  try {
    await Share.share({
      message: `Sanrı dedi ki:\n\n"${text}"\n\nSanrı — Ask and Remember\n${storeUrl}`,
    });
  } catch (e) {
    if (__DEV__) console.log("share error", e);
  }
};

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
      if (!mountedRef.current) return;

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
    setMessages([{ id: uid("a"), role: "assistant", text: MODE_COPY[lang][mode].welcome }]);
    setIsWaking(false);
  }, [busy, lang, mode]);

  const switchMode = useCallback((m: SanriMode) => {
    if (busy || m === mode) return;
    trackEvent("mode_switch", { userId: user?.id, mode: m });
    setMode(m);
    loaderIdRef.current = "";
    setError("");
    setInput("");
    setMessages([{ id: uid("a"), role: "assistant", text: MODE_COPY[lang][m].welcome }]);
    setIsWaking(false);
  }, [busy, lang, mode, user?.id]);

  const openMyArea = useCallback(() => {
    router.push("/(tabs)/my_area" as any);
  }, [router]);

  const sendText = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;

      if ((mode === "code" || mode === "decode") && !isVip && !isAdmin) {
        const limitReached = await hasReachedLimit(mode);
        if (limitReached) {
          router.push({ pathname: "/(tabs)/vip", params: { lang, source: "sanri_limit" } } as any);
          return;
        }
      }

      trackEvent("message_sent", { userId: user?.id, mode });

      if (mode === "code" || mode === "decode") {
        const newCount = await incrementUsage(mode);
        if (mode === "code") setCodeUsed(newCount);
        else setDecodeUsed(newCount);
      }

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

        let modeInstruction = "";
        if (mode === "code") {
          modeInstruction = lang === "tr"
            ? "RESPONSE MODE: KOD ALANI.\nKullanıcı bir kelime veya kısa ifade gönderdi. Şu formatta cevap ver:\n1. PARÇALAMA: Kelimeyi hece/kök parçalarına ayır.\n2. KÖK ANLAM: Her parçanın etimolojik/sembolik anlamı.\n3. BİLİNÇ YORUMU: Kelimenin bilinç dilindeki karşılığı (2-3 cümle).\n4. GÜNLÜK ANLAM: Günlük hayata çevirisi (1-2 cümle, sade).\nTon: öğretici, net, hafif mistik ama anlaşılır. Başlıkları kalın yazma, düz metin olarak yaz."
            : "RESPONSE MODE: CODE FIELD.\nUser sent a word or short phrase. Respond in this format:\n1. BREAKDOWN: Split the word into syllable/root parts.\n2. ROOT MEANING: Etymological/symbolic meaning of each part.\n3. CONSCIOUSNESS READING: What it means in the language of consciousness (2-3 sentences).\n4. DAILY MEANING: Translation to everyday life (1-2 sentences, simple).\nTone: instructive, clear, slightly mystical but understandable. Don't use bold headers, write as plain text.";
        } else if (mode === "decode") {
          modeInstruction = lang === "tr"
            ? "RESPONSE MODE: DECODER SANRI.\nKullanıcı bir metin, rüya, sembol veya haber gönderdi. Şu formatta çözümle:\n1. İLK KATMAN: Görünen/yüzey anlam (1-2 cümle).\n2. SEMBOLİK KATMAN: Hangi simgeler çalışıyor, ne temsil ediyorlar (2-3 cümle).\n3. FREKANS KATMANI: Bu içerik korku mu, dönüşüm mü, çağrı mı taşıyor? Enerji okuması (2-3 cümle).\n4. YANSIMA: Bu sende hangi kapıyı çalıyor? (1 soru veya yönlendirme).\nTon: sakin, derin, çok katmanlı, 'okuyan' bir bilinç. Başlıkları kalın yazma, düz metin olarak yaz."
            : "RESPONSE MODE: DECODER SANRI.\nUser sent text, dream, symbol, or news. Decode in this format:\n1. SURFACE LAYER: Visible/surface meaning (1-2 sentences).\n2. SYMBOLIC LAYER: What symbols are at play, what they represent (2-3 sentences).\n3. FREQUENCY LAYER: Does this carry fear, transformation, or calling? Energy reading (2-3 sentences).\n4. REFLECTION: What door does this knock on in you? (1 question or direction).\nTone: calm, deep, multi-layered, a 'reading' consciousness. Don't use bold headers, write as plain text.";
        }

        const payload: Record<string, any> = {
  message: modeInstruction ? modeInstruction + "\n\nKullanıcı mesajı:\n" + text : text,
  session_id: "mobile-default",
  lang,
  response_mode: mode,
};
        if (params.code) payload.city_code = params.code;
        if (params.city) payload.city_name = params.city;
        if (params.layer) payload.layer = params.layer;
        if (params.domain) payload.domain = params.domain;
        if (params.gateMode) payload.gate_mode = params.gateMode;
        if (params.intent) payload.intent = params.intent;
        if (__DEV__) console.log("SANRI_SEND", payload);
        const data: any = await apiPostJson(API.ask, payload, 60000);

        if (__DEV__) {
          console.log("SANRI_RAW_RESPONSE", data);
          try { console.log("SANRI_KEYS", Object.keys(data || {})); } catch {}
          console.log("API ASK =", API.ask);
        }

  
        const answer =
          safeStr(data?.answer || data?.response).trim() ||
          (lang === "tr" ? "Buradayım." : "I’m here.");

        setIsWaking(false);
        await typeIntoLoader(loaderId, answer);
      } catch (e: any) {

  if (__DEV__) {
    console.log("SANRI_RAW_ERROR", e);
    console.log("SANRI_RESPONSE_DATA", e?.response?.data);
  }

  const msg =
    e?.response?.data?.detail?.error ||
    e?.response?.data?.detail ||
    e?.response?.data?.error ||
    e?.message ||
    JSON.stringify(e);

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
  if (__DEV__) console.log("SANRI ERROR:", e);
  setError(
    e?.response?.data?.detail?.error ||
    e?.message ||
    JSON.stringify(e)
  );
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
          <Text style={styles.topTitle}>{mc.title}</Text>
          <Text style={styles.topMeta}>{mc.sub}</Text>
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

      <View style={styles.modeRow}>
        {(["chat", "code", "decode"] as SanriMode[]).map((m) => {
          const active = mode === m;
          const isPaidMode = m === "code" || m === "decode";
          const used = m === "code" ? codeUsed : m === "decode" ? decodeUsed : 0;
          const remaining = FREE_LIMIT - used;
          return (
            <Pressable key={m} onPress={() => switchMode(m)} style={[styles.modeTab, active && styles.modeTabActive]}>
              <Text style={[styles.modeTabTxt, active && styles.modeTabTxtActive]}>
                {MODE_COPY[lang][m].label}
              </Text>
              {isPaidMode && !isVip && !isAdmin ? (
                <Text style={styles.modeCountTxt}>
                  {remaining > 0 ? `${remaining}/${FREE_LIMIT}` : "VIP"}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {(mode === "code" || mode === "decode") && !isVip && !isAdmin ? (
        <Pressable
          style={styles.limitBanner}
          onPress={() => router.push({ pathname: "/(tabs)/vip", params: { lang, source: "sanri_limit" } } as any)}
        >
          <Text style={styles.limitText}>
            {lang === "tr"
              ? `${mode === "code" ? "Kod Alanı" : "Decoder"}: ${Math.max(FREE_LIMIT - (mode === "code" ? codeUsed : decodeUsed), 0)} ücretsiz hak kaldı`
              : `${mode === "code" ? "Code" : "Decoder"}: ${Math.max(FREE_LIMIT - (mode === "code" ? codeUsed : decodeUsed), 0)} free uses left`}
          </Text>
          <Text style={styles.limitVipTxt}>
            {lang === "tr" ? "Sınırsız için VIP →" : "Unlimited with VIP →"}
          </Text>
        </Pressable>
      ) : null}

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

        {!isUser && (
          <Pressable
            style={styles.shareBtn}
            onPress={() => openShare(m.text)}
          >
            <Text style={styles.shareIcon}>↗</Text>
          </Pressable>
        )}

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
              maxLength={2000}
              placeholder={mc.placeholder}
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
  onPress={() => {
    if (__DEV__) console.log("SEND PRESSED");
    send();
  }}
  style={[styles.sendBtn, (!input.trim() || busy) && { opacity: 0.6 }]}
  hitSlop={10}
  disabled={false}
>
  <BlurView intensity={24} tint="dark" style={styles.sendInner}>
    <View style={styles.sendGlow} />
    <Text style={styles.sendTxt}>✦</Text>
  </BlurView>
</Pressable>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.hintBottom}>{mc.tip}</Text>
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

  modeRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 8,
  },

  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  modeTabActive: {
    backgroundColor: "rgba(124,247,216,0.10)",
    borderColor: "rgba(124,247,216,0.28)",
  },

  modeTabTxt: {
    color: "rgba(255,255,255,0.60)",
    fontWeight: "800",
    fontSize: 13,
  },

  modeTabTxtActive: {
    color: "#7cf7d8",
  },

  modeCountTxt: {
    color: "rgba(203,188,255,0.70)",
    fontSize: 10,
    fontWeight: "900",
    marginTop: 2,
  },

  limitBanner: {
    marginHorizontal: 16,
    marginBottom: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "rgba(94,59,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.30)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  limitText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "700",
  },

  limitVipTxt: {
    color: "#cbbcff",
    fontSize: 12,
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
  width: 68,
  height: 68,
  borderRadius: 22,
  overflow: "hidden",
  marginLeft: 10,
},

sendInner: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: "rgba(180,160,255,0.20)",
  backgroundColor: "rgba(20,16,34,0.28)",
},

sendGlow: {
  position: "absolute",
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "rgba(142, 109, 255, 0.22)",
  shadowColor: "#8e6dff",
  shadowOpacity: 0.35,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 0 },
},

sendTxt: {
  color: "#efeaff",
  fontSize: 22,
  fontWeight: "700",
  textShadowColor: "rgba(180,160,255,0.35)",
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 10,
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

  shareRow: {
  marginTop: 6,
  alignItems: "flex-end"
},

shareBtn: {
  position: "absolute",
  right: -18,
  bottom: 0,
  backgroundColor: "rgba(20,20,30,0.6)",
  borderRadius: 20,
  paddingHorizontal: 6,
  paddingVertical: 4,
},

shareIcon: {
  color: "#9ee7d7",
  fontSize: 14,
},
});