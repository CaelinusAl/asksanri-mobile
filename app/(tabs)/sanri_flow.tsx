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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { ImageBackground } from "react-native";


const API = "https://api.asksanri.com";

type Lang = "tr" | "en";

type Msg = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function uid() {
  return "m_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

const T = {
  tr: {
    title: "Sanrı",
    personal: "Kişisel Alan",
    gatePrefix: "Kapı",
    welcome: "Hoş geldin. Bir cümle yaz. Cevap vermem — anlamı yansıtırım.",
    placeholder: "Bir cümle yaz…",
    send: "Gönder",
    tip: "İpucu: Tek bir cümle yaz. Sanrı anlamı yansıtır ve yön çıkarır.",
    err: "Hata: ",
  },
  en: {
    title: "Sanri",
    personal: "Personal Field",
    gatePrefix: "Gate",
    welcome: "Welcome. Write a sentence. I will reflect meaning, not answer.",
    placeholder: "Write one sentence…",
    send: "Send",
    tip: "Tip: Write one sentence. Sanri mirrors meaning and produces direction.",
    err: "Error: ",
  },
} as const;

export default function SanriFlowScreen() {
  const bg = useMemo<[string, string, string]>(() => ["#07080d", "#0b0620", "#050610"], []);
  const scrollRef = useRef<ScrollView>(null);

  // Params from Cities OR Upper Consciousness
  const params = useLocalSearchParams<{
    code?: string;
    city?: string;
    layer?: string;
    lang?: string;

    intent?: string;
    source?: string;
    title?: string;
    seed?: string;
  }>();

  const cityCode = (params.code ? String(params.code) : "").trim();
  const cityName = (params.city ? String(params.city) : "").trim();
  const fromLayer = (params.layer ? String(params.layer) : "").trim();

  const fromLangRaw = (params.lang ? String(params.lang) : "").trim().toLowerCase();
  const initialLang: Lang = fromLangRaw === "en" ? "en" : "tr";

  const intent = (params.intent ? String(params.intent) : "").trim();
  const source = (params.source ? String(params.source) : "").trim();
  const flowTitle = (params.title ? String(params.title) : "").trim();
  const seed = (params.seed ? String(params.seed) : "").trim();

  const hasCityContext = Boolean(cityCode);
  const hasIntentContext = Boolean(intent || source || flowTitle || seed);

  const [lang, setLang] = useState<Lang>(initialLang);

  // keep language in sync if navigation params change
  useEffect(() => {
    setLang(initialLang);
  }, [initialLang]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");

  // If opened from showcase (seed), prefill a starter line ONCE
  useEffect(() => {
    if (!hasCityContext && hasIntentContext && seed) {
      const starter =
        initialLang === "tr"
          ? "Sembol: " + seed + "\nÜst bilinç okumasını başlat."
          : "Symbol: " + seed + "\nStart a system-view reading.";
      setInput(starter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerTitle = T[lang].title;

  const headerMeta = hasCityContext
    ? T[lang].gatePrefix + " " + cityCode + (cityName ? " · " + cityName : "")
    : hasIntentContext
      ? (flowTitle || source || "Context")
      : T[lang].personal;

  const [messages, setMessages] = useState<Msg[]>([
    { id: uid(), role: "assistant", text: T[initialLang].welcome },
  ]);

  // Update welcome message when language changes (only if it's still the first assistant message)
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

  const typeIn = useCallback(async (fullText: string) => {
    setTyping(true);
    const id = uid();
    setMessages((prev) => [...prev, { id, role: "assistant", text: "" }]);

    let i = 0;
    const step = () => {
      i = Math.min(i + 1, fullText.length);
      const part = fullText.slice(0, i);

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, text: part } : m)),
      );

      const ch = fullText[i - 1] || "";
      const pause = ch === "\n" ? 70 : ch === "." || ch === "!" || ch === "?" ? 90 : 0;
      const delay = 10 + Math.floor(Math.random() * 18) + pause;

      if (i < fullText.length) setTimeout(step, delay);
      else setTyping(false);
    };

    setTimeout(step, 120);
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isSending || typing) return;

    setError("");
    setInput("");
    setIsSending(true);

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    setMessages((prev) => [...prev, { id: uid(), role: "user", text }]);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);

      const payload: any = {
        message: text,
        session_id: "mobile-default",
        domain: hasCityContext ? "awakened_cities" : (hasIntentContext ? "ust_bilinc" : "auto"),
        gate_mode: "mirror",
        persona: "user",
        lang: lang,

        context: hasCityContext
          ? {
              source: "awakened_cities",
              city_code: cityCode,
              city_name: cityName || undefined,
              layer: fromLayer || undefined,
              lang: lang,
            }
          : {
              source: source || "personal_field",
              intent: intent || "chat",
              title: flowTitle || undefined,
              seed: seed || undefined,
              lang: lang,
            },
      };

      const res = await fetch(API + "/bilinc-alani/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = data?.detail ? String(data.detail) : "";
        throw new Error(detail || "HTTP " + String(res.status));
      }

      const answer =
        String(data?.answer || data?.response || "").trim() ||
        (lang === "tr" ? "Buradayım." : "I’m here.");

      await typeIn(answer);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setIsSending(false);
      scrollToEnd();
    }
  }, [
    cityCode,
    cityName,
    fromLayer,
    hasCityContext,
    hasIntentContext,
    input,
    intent,
    isSending,
    lang,
    scrollToEnd,
    seed,
    source,
    flowTitle,
    typeIn,
    typing,
  ]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
source={require("../../assets/sanri_bg.jpg")}
style={StyleSheet.absoluteFillObject}
resizeMode="cover"
/>

<View pointerEvents="none" style={styles.chatOverlay} />
      <View style={styles.glowA} />
      <View style={styles.glowB} />

      <View style={styles.topbar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.topTitle}>{headerTitle}</Text>
          <Text style={styles.topMeta}>{headerMeta}</Text>
        </View>

        {/* TR / EN */}
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
          <ScrollView
  ref={scrollRef}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]}
>
  {messages.map((m) => {
    const isUser = m.role === "user";
    return (
      <View
        key={m.id}
        style={[styles.bubbleRow, isUser ? styles.rowRight : styles.rowLeft]}
      >
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
          <Text style={styles.bubbleText}>{m.text}</Text>
        </View>
      </View>
    );
  })}

  {error ? <Text style={styles.errorText}>{T[lang].err + error}</Text> : null}
  {isSending || typing ? <Text style={styles.thinking}>…</Text> : null}
</ScrollView>
        

        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={T[lang].placeholder}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
            multiline
          />
          <Pressable
            onPress={send}
            style={[styles.sendBtn, (!input.trim() || isSending || typing) && { opacity: 0.5 }]}
            hitSlop={10}
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

  chatOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(5,8,20,0.45)", // premium veil
},

  glowA: {
    position: "absolute",
    width: 480,
    height: 480,
    borderRadius: 480,
    left: -160,
    top: 40,
    backgroundColor: "rgba(94,59,255,0.18)",
  },
  glowB: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 520,
    right: -180,
    bottom: -60,
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
  langChipActive: {
    backgroundColor: "rgba(124,247,216,0.12)",
    borderColor: "rgba(124,247,216,0.28)",
  },
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

  bubble: {
    maxWidth: "92%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  bubbleAI: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.12)",
  },
  bubbleUser: {
    backgroundColor: "rgba(94,59,255,0.70)",
    borderColor: "rgba(94,59,255,0.55)",
  },
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
  sendBtn: {
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5e3bff",
  },
  sendText: { color: "white", fontWeight: "900" },

  hintBottom: {
    color: "rgba(255,255,255,0.45)",
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
});