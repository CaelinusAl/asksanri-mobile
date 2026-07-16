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
import { getOnboarding, type OnboardingState } from "../../lib/onboardingStore";
import { type ReminderTone } from "../../lib/dailyReminders";
import { appendArchive, updateArchiveReply } from "../../lib/archiveStore";
import { charDelay, gapBeforeBubble } from "../../lib/humanizeReply";
import { COLORS, FONTS } from "../../lib/theme";
import { trackUserMessage, endConversation } from "../../lib/analytics";
import { MicButton } from "../../components/MicButton";
import { SpeakButton } from "../../components/SpeakButton";
import { SanctumBackground } from "../../components/SanctumBackground";
import { parseReading } from "../../lib/parseReading";

const BG = COLORS.bg;
const ACCENT = COLORS.gold;

type Msg = {
  id: string;
  who: "sanri" | "user";
  text: string;
  label?: string;
  opening?: boolean;
};

type Ctx = "home" | "think" | "create" | "projects" | "explore" | "dream" | "relationship" | "journal";

type DeepenOffer = {
  theme: string;
  label: string;
  title: string;
  message: string;
  cta: string;
  gate: string;
} | null;

/** Bağlama göre Sanrı'nın açılış cümlesi. */
function openingFor(ctx: Ctx, tr: boolean): string {
  if (tr) {
    switch (ctx) {
      case "think":
        return "Birlikte düşünelim. Şu an hangi sorunun içinde duruyorsun?";
      case "create":
        return "Bir şey inşa edelim. Fikrin şu an hangi hâlde?";
      case "projects":
        return "Projenin yanındayım. En son hangi noktada kalmıştık?";
      case "explore":
        return "Yavaşça bakalım. İçeride ne hareket ediyor?";
      case "dream":
        return "Rüyanı dinliyorum. Anlat — neyi hatırlıyorsun?";
      case "relationship":
        return "Seni dinliyorum. İlişkinde şu an neler oluyor?";
      case "journal":
        return "Bugünü birlikte yazalım. Aklında ne kaldı?";
      default:
        return "Bugün birlikte ne inşa ediyoruz?";
    }
  }
  switch (ctx) {
    case "think":
      return "Let's think together. What question are you inside right now?";
    case "create":
      return "Let's build something. What shape is your idea in right now?";
    case "projects":
      return "I'm with your project. Where did we leave off?";
    case "explore":
      return "Let's look slowly. What is moving inside?";
    case "dream":
      return "I'm listening to your dream. What do you remember?";
    case "relationship":
      return "I'm here. What's happening in your relationship?";
    case "journal":
      return "Let's write today together. What stayed with you?";
    default:
      return "What are we building together today?";
  }
}

function areaInstruction(ctx: Ctx): string {
  switch (ctx) {
    case "think":
      return "Active room: THINK. Ask clarifying questions, reveal perspectives, summarize the issue, and help the user reach their own conclusion. Do not act like a generic answer engine. Success criterion: the user should be able to say, 'I see this more clearly now.'";
    case "create":
      return "Active room: CREATE. AURA does not delay the requested result: first create, then deepen together. If the user asks for ideas, reel topics, content, captions, book titles, scripts, project names, campaigns, or creative concepts, immediately acknowledge the request and deliver 5-10 high-quality usable options. Never begin with a poetic or philosophical reflection. Highlight the strongest option, then ask which direction to expand into a full script or production package. Success criterion: the user should be able to say, 'I can use this immediately.'";
    case "projects":
      return "Active room: PROJECTS. AURA is now connected to the project as a practical partner, not a distant commentator. Evaluate the project concretely; organize its current state, value, risks, decisions, priorities and next smallest step. When the user asks whether an idea has potential, explain why and give a clear validation path. Do not begin with poetic reflection or end with a forced self-reflection question. Success criterion: the user should know what to do next.";
    case "explore":
      return "Active room: EXPLORE. Be slow, reflective and symbolic. Never present dream or symbol interpretations as absolute; guide the user toward personal meaning. Success criterion: the user should notice something new about themselves.";
    default:
      return "Active room: HOME. Understand what the user needs today and guide them into the right room.";
  }
}

/** "Yazıyor…" üç-nokta animasyonu */
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
      { scale: op.interpolate({ inputRange: [0.25, 1], outputRange: [0.85, 1.05] }) },
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
  const params = useLocalSearchParams<{
    prompt?: string;
    tone?: string;
    seed?: string;
    ctx?: string;
  }>();
  const initialPrompt = String(params.prompt || "").trim();
  const seedText = String(params.seed || "").trim();
  const ctx = (String(params.ctx || "home") as Ctx);
  const incomingTone = (params.tone as ReminderTone) || "durulma";
  const insets = useSafeAreaInsets();

  const [ob, setOb] = useState<OnboardingState | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [deepen, setDeepen] = useState<DeepenOffer>(null);

  const archiveIdRef = useRef<string | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const mountedRef = useRef(true);
  const sendRef = useRef<(t: string) => void>(() => {});
  const autoSentRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Ekrandan çıkış: açık konuşmayı kapat (süre + mesaj sayısı kaydı).
      endConversation();
    };
  }, []);

  // ob yükle + açılış cümlesini bağlama göre kur
  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await getOnboarding();
      if (!alive) return;
      setOb(data);

      const tr = data.lang === "tr";
      const opening = initialPrompt || openingFor(ctx, tr);
      setMsgs([{ id: `m_open_${Date.now()}`, who: "sanri", text: opening, opening: true }]);
    })();
    return () => {
      alive = false;
    };
  }, [initialPrompt, ctx]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  }, []);

  const typeBubble = useCallback(
    (full: string, label?: string) =>
      new Promise<void>((resolve) => {
        if (!full) {
          resolve();
          return;
        }
        const id = `m_s_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`;
        setMsgs((m) => [...m, { id, who: "sanri", text: "", label }]);
        scrollToEnd();

        let i = 0;
        const step = () => {
          if (!mountedRef.current) {
            resolve();
            return;
          }
          i = Math.min(i + 1, full.length);
          const part = full.slice(0, i);
          setMsgs((m) => m.map((x) => (x.id === id ? { ...x, text: part } : x)));
          if (i % 24 === 0 || full[i - 1] === "\n") scrollToEnd();
          if (i < full.length) {
            const ch = full[i - 1] || "";
            setTimeout(step, charDelay(ch));
          } else {
            resolve();
          }
        };
        setTimeout(step, 80);
      }),
    [scrollToEnd]
  );

  const tr = (ob?.lang ?? "tr") === "tr";
  const tone = (incomingTone || ob?.tone || "durulma") as ReminderTone;

  const T = {
    placeholder: tr ? "Yaz…" : "Write…",
    send: tr ? "Gönder" : "Send",
    back: tr ? "← Geri" : "← Back",
    error: tr
      ? "Sanrı şu an sessiz. Biraz sonra tekrar dener misin?"
      : "Sanrı is silent now. Try again in a moment?",
  };

  const sendText = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy || !ob) return;
      setBusy(true);
      setDraft("");
      setDeepen(null);
      Haptics.selectionAsync().catch(() => {});

      const userMsg: Msg = { id: `m_u_${Date.now()}`, who: "user", text };
      setMsgs((m) => [...m, userMsg]);

      // FAZ 1 metrik: ilk soru / mesaj / konuşma takibi (ctx bazlı).
      trackUserMessage(ctx, `anon_${ob.deviceUuid}`).catch(() => {});

      try {
        const entry = await appendArchive({
          prompt: openingFor(ctx, ob.lang === "tr"),
          userText: text,
          tone,
          lang: ob.lang,
        });
        archiveIdRef.current = entry.id;
      } catch {
        /* ignore archive failures */
      }

      setTyping(true);
      scrollToEnd();
      const startedAt = Date.now();

      try {
        const data: any = await apiPostJson(
          API.ask,
          {
            message: text,
            session_id: `anon_${ob.deviceUuid}`,
            lang: ob.lang,
            domain: ctx,
            system_context: areaInstruction(ctx),
            conversation_context: msgs.slice(-8).map((item) => ({
              role: item.who === "sanri" ? "assistant" : "user",
              content: item.text,
            })),
          },
          45000
        );

        const replyRaw = (
          typeof data === "string"
            ? data
            : data?.answer ||
              data?.response ||
              data?.reply ||
              data?.message ||
              (tr ? "Seni duyuyorum." : "I hear you.")
        ).toString();

        // Yanıtı dergi hareketlerine ayır: İlk Yankı / Derin Katman / Hatırlatma.
        const movements = parseReading(replyRaw, tr);
        if (movements.length === 0) movements.push({ body: tr ? "Seni duyuyorum." : "I hear you." });

        const firstGap = gapBeforeBubble(0);
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, firstGap - elapsed);
        if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));

        const fullReply = movements
          .map((mv) => (mv.label ? `${mv.label}\n${mv.body}` : mv.body))
          .join("\n\n");
        if (archiveIdRef.current) {
          updateArchiveReply(archiveIdRef.current, fullReply).catch(() => {});
        }

        for (let i = 0; i < movements.length; i++) {
          if (!mountedRef.current) break;
          if (i > 0) {
            await new Promise((r) => setTimeout(r, gapBeforeBubble(i)));
            if (!mountedRef.current) break;
          }
          setTyping(false);
          await typeBubble(movements[i].body, movements[i].label);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          scrollToEnd();
          if (i < movements.length - 1) setTyping(true);
        }

        // Gate 33: tekrarlayan temada gelen derinleşme daveti (varsa).
        if (mountedRef.current && data?.deepen?.theme) {
          setDeepen(data.deepen as DeepenOffer);
          scrollToEnd();
        }
      } catch {
        setTyping(false);
        setMsgs((m) => [...m, { id: `m_err_${Date.now()}`, who: "sanri", text: T.error }]);
      } finally {
        if (mountedRef.current) {
          setTyping(false);
          setBusy(false);
        }
        scrollToEnd();
      }
    },
    [busy, ob, ctx, tone, tr, T.error, msgs, scrollToEnd, typeBubble]
  );

  // sendRef'i güncel tut — auto-send effect'i bunu çağırır
  sendRef.current = sendText;

  // Gate 33: derinleşme davetini kabul → ölçüm + temaya dair derin sohbet.
  const acceptDeepen = useCallback(() => {
    if (!deepen || !ob) return;
    const d = deepen;
    setDeepen(null);
    Haptics.selectionAsync().catch(() => {});
    apiPostJson(
      API.deepenAccept,
      { theme: d.theme, session_id: `anon_${ob.deviceUuid}` },
      10000
    ).catch(() => {});
    const seed = tr
      ? `${d.label} teması son zamanlarda içimde çok yer kaplıyor. Bununla biraz daha derinden yüzleşmek istiyorum.`
      : `The theme of ${d.label} has weighed on me lately. I'd like to look at it a little more deeply.`;
    router.push({ pathname: "/(tabs)/chat", params: { ctx, seed } });
  }, [deepen, ob, tr, ctx]);

  // Ekrana seed ile gelindiyse (Ana Sayfa/Rüyalar/İlişkiler/Günlük), otomatik gönder
  useEffect(() => {
    if (!ob || autoSentRef.current || !seedText) return;
    autoSentRef.current = true;
    const id = setTimeout(() => sendRef.current(seedText), 140);
    return () => clearTimeout(id);
  }, [ob, seedText]);

  if (!ob) {
    return (
      <View style={st.root}>
        <StatusBar barStyle="light-content" backgroundColor={BG} translucent={false} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={st.root}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" backgroundColor={BG} translucent={false} />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <SanctumBackground showRing={false} />
      </View>

      <View style={[st.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={st.topBtn}>
          <Text style={st.topBtnTxt}>‹</Text>
        </Pressable>
        <View style={st.topCenter}>
          <Text style={st.topWordmark}>SANRI OS</Text>
          <Text style={st.topByline}>{tr ? "AURA seni hatırlıyor" : "AURA remembers you"}</Text>
        </View>
        <View style={st.topBtn} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={st.thread}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {msgs.map((m) =>
          m.who === "user" ? (
            <View key={m.id} style={st.userRow}>
              <View style={st.userRule} />
              <Text style={st.userText}>{m.text}</Text>
            </View>
          ) : (
            <View key={m.id} style={[st.reading, m.opening && st.openingBlock]}>
              {m.label ? <Text style={st.movementLabel}>{m.label}</Text> : null}
              <Text style={[st.readingText, m.opening && st.openingText]}>{m.text}</Text>
              {!m.opening && m.text ? (
                <SpeakButton id={m.id} text={m.text} lang={tr ? "tr" : "en"} />
              ) : null}
            </View>
          )
        )}

        {typing && (
          <View style={st.typingRow}>
            <Text style={st.typingLabel}>SANRI</Text>
            <TypingDots color={ACCENT} />
          </View>
        )}

        {!typing && deepen ? (
          <View style={st.deepenCard}>
            <Text style={st.deepenKicker}>DERİNLEŞME ALANI</Text>
            <Text style={st.deepenTitle}>{deepen.title}</Text>
            <Text style={st.deepenMsg}>{deepen.message}</Text>
            <Pressable onPress={acceptDeepen} style={st.deepenBtn} hitSlop={8}>
              <Text style={st.deepenBtnTxt}>{deepen.cta}</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <View style={[st.inputRow, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onFocus={() => {
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250);
          }}
          placeholder={T.placeholder}
          placeholderTextColor="rgba(255,255,255,0.34)"
          style={st.input}
          multiline
          editable={!busy}
        />
        <MicButton
          lang={tr ? "tr" : "en"}
          onTranscript={(t) => setDraft((prev) => (prev ? prev + " " + t : t))}
        />
        <Pressable
          onPress={() => sendText(draft)}
          disabled={busy || !draft.trim()}
          style={[st.sendBtn, (busy || !draft.trim()) && st.sendBtnOff]}
        >
          <LinearGradient
            colors={[COLORS.goldSoft, COLORS.gold]}
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
    paddingLeft: 18,
    paddingRight: 18,
    paddingBottom: 12,
  },
  topBtn: { padding: 6, minWidth: 40 },
  topBtnTxt: { color: COLORS.goldSoft, fontFamily: FONTS.serif, fontSize: 30, lineHeight: 32 },
  topCenter: { alignItems: "center" },
  topWordmark: { color: COLORS.goldSoft, fontFamily: FONTS.serifBold, fontSize: 18, letterSpacing: 6, lineHeight: 20 },
  topByline: { color: COLORS.goldDim, fontFamily: FONTS.bodyMed, fontSize: 8, letterSpacing: 5, marginTop: 2 },

  thread: { paddingHorizontal: 26, paddingTop: 14, paddingBottom: 28, maxWidth: 600, alignSelf: "center", width: "100%" },

  // Kullanıcının sözü — sessiz, sağda, ince altın çizgiyle.
  userRow: { alignItems: "flex-end", marginTop: 26, marginBottom: 6 },
  userRule: { width: 34, height: 1, backgroundColor: COLORS.goldDim, marginBottom: 10, opacity: 0.7 },
  userText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.serifItalic,
    fontSize: 18,
    lineHeight: 26,
    textAlign: "right",
  },

  // Sanrı'nın okuması — editöryel hareketler.
  reading: { marginTop: 22 },
  openingBlock: { marginTop: 10 },
  movementLabel: {
    color: COLORS.gold,
    fontFamily: FONTS.bodyMed,
    fontSize: 11,
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  readingText: {
    color: COLORS.text,
    fontFamily: FONTS.serifMed,
    fontSize: 21,
    lineHeight: 32,
    letterSpacing: 0.2,
  },
  openingText: { color: COLORS.goldSoft, fontSize: 23, lineHeight: 34, fontFamily: FONTS.serif },

  // Gate 33 — derinleşme daveti (satış değil; sakin, davetkâr).
  deepenCard: {
    marginTop: 34,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.goldDim,
    backgroundColor: "rgba(212,178,106,0.06)",
  },
  deepenKicker: {
    color: COLORS.goldDim,
    fontFamily: FONTS.bodyMed,
    fontSize: 10,
    letterSpacing: 4,
    marginBottom: 10,
  },
  deepenTitle: {
    color: COLORS.goldSoft,
    fontFamily: FONTS.serif,
    fontSize: 21,
    lineHeight: 28,
    marginBottom: 8,
  },
  deepenMsg: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  deepenBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  deepenBtnTxt: {
    color: COLORS.gold,
    fontFamily: FONTS.bodyMed,
    fontSize: 13,
    letterSpacing: 0.5,
  },

  typingRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 24 },
  typingLabel: { color: COLORS.goldDim, fontFamily: FONTS.bodyMed, fontSize: 11, letterSpacing: 4 },
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
    paddingHorizontal: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
    backgroundColor: "rgba(7,11,22,0.86)",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    color: COLORS.text,
    fontFamily: FONTS.body,
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "rgba(8,12,22,0.66)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
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
  sendTxt: { color: COLORS.bgDeep, fontFamily: FONTS.bodyMed, fontSize: 14, letterSpacing: 0.5 },
});
