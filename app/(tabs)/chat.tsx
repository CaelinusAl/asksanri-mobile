import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiPostJson } from "../../lib/apiClient";
import { API } from "../../lib/apiClient";
import {
  getOnboarding,
  type OnboardingState,
} from "../../lib/onboardingStore";
import { TONE_META, type ReminderTone } from "../../lib/dailyReminders";
import {
  appendArchive,
  updateArchiveReply,
} from "../../lib/archiveStore";
import {
  splitIntoBubbles,
  charDelay,
  gapBeforeBubble,
} from "../../lib/humanizeReply";
import PyramidMenu from "../../components/PyramidMenu";

const BG = "#07080d";

type Msg = {
  id: string;
  who: "sanri" | "user";
  text: string;
};

/** "Yazıyor…" üç-nokta animasyonu — gerçek mesajlaşma uygulamalarındaki gibi */
function TypingDots({ color }: { color: string }) {
  const a1 = useRef(new Animated.Value(0.25)).current;
  const a2 = useRef(new Animated.Value(0.25)).current;
  const a3 = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    const make = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: 1,
            duration: 380,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0.25,
            duration: 380,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );

    const loops = [make(a1, 0), make(a2, 140), make(a3, 280)];
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [a1, a2, a3]);

  const dotStyle = (op: Animated.Value) => ({
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: color,
    opacity: op,
    transform: [
      {
        scale: op.interpolate({ inputRange: [0.25, 1], outputRange: [0.85, 1.05] }),
      },
    ],
  });

  return (
    <View style={st.typingDotsRow}>
      <Animated.View style={dotStyle(a1)} />
      <Animated.View style={dotStyle(a2)} />
      <Animated.View style={dotStyle(a3)} />
    </View>
  );
}

export default function ChatScreen() {
  const params = useLocalSearchParams<{ prompt?: string; tone?: string }>();
  const initialPrompt = String(params.prompt || "").trim();
  const incomingTone = (params.tone as ReminderTone) || "durulma";
  const insets = useSafeAreaInsets();

  const [ob, setOb] = useState<OnboardingState | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  // Sanrı şu an yazıyor mu (üç-nokta animasyonu görünür mü)
  const [typing, setTyping] = useState(false);

  const archiveIdRef = useRef<string | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await getOnboarding();
      if (!alive) return;
      setOb(data);

      if (initialPrompt) {
        setMsgs([
          {
            id: `m_open_${Date.now()}`,
            who: "sanri",
            text: initialPrompt,
          },
        ]);
      } else {
        const opening =
          data.lang === "tr"
            ? "Buradayım. Şu an ne hissediyorsun?"
            : "I am here. What do you feel right now?";
        setMsgs([
          { id: `m_open_${Date.now()}`, who: "sanri", text: opening },
        ]);
      }
    })();
    return () => { alive = false; };
  }, [initialPrompt]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() =>
      scrollRef.current?.scrollToEnd({ animated: true })
    );
  }, []);

  /** Tek baloncuğu typewriter'la dolduran asenkron yardımcı */
  const typeBubble = useCallback(
    (full: string) =>
      new Promise<void>((resolve) => {
        if (!full) { resolve(); return; }
        const id = `m_s_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`;

        // Önce boş bubble'ı listeye ekle
        setMsgs((m) => [...m, { id, who: "sanri", text: "" }]);
        scrollToEnd();

        let i = 0;
        const step = () => {
          if (!mountedRef.current) { resolve(); return; }
          i = Math.min(i + 1, full.length);
          const part = full.slice(0, i);
          setMsgs((m) => m.map((x) => (x.id === id ? { ...x, text: part } : x)));
          // Her yeni satırda ya da uzun cümlede scroll
          if (i % 24 === 0 || full[i - 1] === "\n") scrollToEnd();
          if (i < full.length) {
            const ch = full[i - 1] || "";
            setTimeout(step, charDelay(ch));
          } else {
            resolve();
          }
        };
        // Yazmaya başlamadan minik bir an
        setTimeout(step, 80);
      }),
    [scrollToEnd]
  );

  if (!ob) {
    return (
      <View style={st.root}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={BG}
          translucent={false}
        />
      </View>
    );
  }

  const tr = ob.lang === "tr";
  const tone = (incomingTone || ob.tone) as ReminderTone;
  const meta = TONE_META[tone] || TONE_META.durulma;

  const T = {
    placeholder: tr ? "Yankını yaz…" : "Write your echo…",
    send: tr ? "Gönder" : "Send",
    backToDaily: tr ? "← Bugün" : "← Today",
    error: tr
      ? "Sanrı şu an sessiz. Biraz sonra tekrar dener misin?"
      : "Sanrı is silent now. Try again in a moment?",
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    setDraft("");
    Haptics.selectionAsync().catch(() => {});

    const userMsg: Msg = {
      id: `m_u_${Date.now()}`,
      who: "user",
      text,
    };
    setMsgs((m) => [...m, userMsg]);

    // Yerel arşiv
    try {
      const promptText = msgs[0]?.text || "";
      const entry = await appendArchive({
        prompt: promptText,
        userText: text,
        tone,
        lang: ob.lang,
      });
      archiveIdRef.current = entry.id;
    } catch {
      /* ignore archive failures */
    }

    // Sanrı "yazıyor…" göstergesi açık
    setTyping(true);
    scrollToEnd();

    // Cevap geldikten sonra dahi göstereceğimiz minimum "düşünme" süresi
    // (insan hissi). Çok hızlı API cevaplarında bile robotik durmasın.
    const startedAt = Date.now();

    try {
      const data: any = await apiPostJson(
        API.ask,
        {
          message: text,
          session_id: `anon_${ob.deviceUuid}`,
          lang: ob.lang,
        },
        45000
      );

      const replyRaw =
        (typeof data === "string"
          ? data
          : data?.answer || data?.response || data?.reply || data?.message ||
            (tr ? "Seni duyuyorum." : "I hear you.")
        ).toString();

      // Cevabı 1-3 kısa baloncuğa böl ve markdown/etiket kalıntısı temizle
      const bubbles = splitIntoBubbles(replyRaw);
      if (bubbles.length === 0) bubbles.push(tr ? "Seni duyuyorum." : "I hear you.");

      // İlk baloncuk için minimum yazıyor… süresi
      const firstGap = gapBeforeBubble(0);
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, firstGap - elapsed);
      if (remaining > 0) {
        await new Promise((r) => setTimeout(r, remaining));
      }

      // Bağlamı arşive kaydet (tüm baloncukları birleştirip yaz)
      const fullReply = bubbles.join("\n\n");
      if (archiveIdRef.current) {
        updateArchiveReply(archiveIdRef.current, fullReply).catch(() => {});
      }

      for (let i = 0; i < bubbles.length; i++) {
        if (!mountedRef.current) break;
        if (i > 0) {
          // Sonraki baloncuk için kısa "yazıyor…" duraklaması
          await new Promise((r) => setTimeout(r, gapBeforeBubble(i)));
          if (!mountedRef.current) break;
        }
        // Yazmaya başlarken üç-nokta görünür kalsın, ilk char ile birlikte
        // hemen kapatıyoruz ki "üç nokta + yazı" üst üste binmesin.
        setTyping(false);
        await typeBubble(bubbles[i]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        scrollToEnd();
        // Eğer daha sıradaki baloncuk varsa, üç-nokta tekrar yansın
        if (i < bubbles.length - 1) {
          setTyping(true);
        }
      }
    } catch {
      setTyping(false);
      setMsgs((m) => [
        ...m,
        { id: `m_err_${Date.now()}`, who: "sanri", text: T.error },
      ]);
    } finally {
      if (mountedRef.current) {
        setTyping(false);
        setBusy(false);
      }
      scrollToEnd();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={st.root}
      keyboardVerticalOffset={0}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={BG}
        translucent={false}
      />

      <PyramidMenu lang={ob.lang} />

      <View style={[st.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={st.topBtn}>
          <Text style={st.topBtnTxt}>{T.backToDaily}</Text>
        </Pressable>
        <View style={[st.toneChip, { borderColor: `${meta.color}55` }]}>
          <Text style={[st.toneChipGlyph, { color: meta.color }]}>{meta.glyph}</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={st.thread}
        keyboardShouldPersistTaps="handled"
      >
        {msgs.map((m) => (
          <View
            key={m.id}
            style={[
              st.bubbleRow,
              m.who === "user" ? st.bubbleRowR : st.bubbleRowL,
            ]}
          >
            {m.who === "sanri" && (
              <Text style={[st.glyph, { color: meta.color }]}>{meta.glyph}</Text>
            )}
            <View
              style={[
                st.bubble,
                m.who === "user"
                  ? st.bubbleUser
                  : { ...st.bubbleSanri, borderColor: `${meta.color}33` },
              ]}
            >
              <Text style={st.bubbleTxt}>{m.text}</Text>
            </View>
          </View>
        ))}

        {typing && (
          <View style={[st.bubbleRow, st.bubbleRowL]}>
            <Text style={[st.glyph, { color: meta.color }]}>{meta.glyph}</Text>
            <View
              style={[
                st.bubble,
                st.bubbleSanri,
                { borderColor: `${meta.color}33`, paddingVertical: 14 },
              ]}
            >
              <TypingDots color={meta.color} />
            </View>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          st.inputRow,
          { paddingBottom: Math.max(insets.bottom, 10) },
        ]}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onFocus={() => {
            setTimeout(
              () => scrollRef.current?.scrollToEnd({ animated: true }),
              250
            );
          }}
          placeholder={T.placeholder}
          placeholderTextColor="rgba(255,255,255,0.34)"
          style={st.input}
          multiline
          editable={!busy}
        />
        <Pressable
          onPress={send}
          disabled={busy || !draft.trim()}
          style={[st.sendBtn, (busy || !draft.trim()) && st.sendBtnOff]}
        >
          <LinearGradient
            colors={[meta.color, "#5e3bff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={st.sendGrad}
          >
            <Text style={st.sendTxt}>{T.send}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 64, // PyramidMenu'ye yer
    paddingRight: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  topBtn: { padding: 6 },
  topBtnTxt: { color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: "700" },

  toneChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  toneChipGlyph: { fontSize: 16 },

  thread: { padding: 18, gap: 12, paddingBottom: 20 },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    maxWidth: "100%",
  },
  bubbleRowL: { justifyContent: "flex-start" },
  bubbleRowR: { justifyContent: "flex-end" },
  glyph: {
    fontSize: 18,
    width: 22,
    textAlign: "center",
    marginBottom: 6,
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    maxWidth: "82%",
  },
  bubbleSanri: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
  },
  bubbleUser: {
    backgroundColor: "rgba(124,247,216,0.10)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.25)",
  },
  bubbleTxt: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
  },

  typingDotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
    minWidth: 30,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.04)",
    backgroundColor: BG,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sendBtn: { borderRadius: 18, overflow: "hidden" },
  sendBtnOff: { opacity: 0.4 },
  sendGrad: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  sendTxt: {
    color: BG,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});
