import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  StatusBar,
  Animated,
  Easing,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getOnboarding,
  saveOnboarding,
  type ReminderTime,
  type Lang,
} from "../lib/onboardingStore";
import { TONE_META, type ReminderTone } from "../lib/dailyReminders";
import { scheduleDaily } from "../lib/notificationScheduler";
import { SanctumBackground } from "../components/SanctumBackground";
import { COLORS, FONTS } from "../lib/theme";

const BG = COLORS.bg;

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Nefes alan altın halka — onboarding kahramanı (gri/teal daire yerine). */
function HeroRing({ glyph }: { glyph?: string }) {
  const scale = useRef(new Animated.Value(0.94)).current;
  const glow = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.05, duration: 3600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(glow, { toValue: 1, duration: 3600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 0.94, duration: 3600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.55, duration: 3600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale, glow]);

  return (
    <View style={st.heroWrap}>
      <Animated.View style={[st.heroRing, st.heroOuter, { transform: [{ scale }], opacity: glow }]} />
      <Animated.View style={[st.heroRing, st.heroMid, { transform: [{ scale }], opacity: glow }]} />
      <View style={[st.heroRing, st.heroInner]} />
      {glyph ? <Text style={st.heroGlyph}>{glyph}</Text> : <View style={st.heroCore} />}
    </View>
  );
}

function QuestionStep({
  title,
  placeholder,
  value,
  onChangeText,
  onNext,
  nextLabel,
}: {
  title: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  onNext: () => void;
  nextLabel: string;
}) {
  return (
    <>
      <Text style={st.kicker}>AURA</Text>
      <Text style={st.title}>{title}</Text>
      <TextInput
        autoFocus
        multiline
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textFaint}
        style={st.questionInput}
      />
      <Pressable onPress={onNext} disabled={!value.trim()} style={[st.primaryBtn, !value.trim() && st.disabledBtn]}>
        <LinearGradient colors={[COLORS.goldSoft, COLORS.gold]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.primaryBtnGrad}>
          <Text style={st.primaryBtnTxt}>{nextLabel}</Text>
        </LinearGradient>
      </Pressable>
    </>
  );
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>(0);
  const [need, setNeed] = useState("");
  const [focus, setFocus] = useState("");
  const [support, setSupport] = useState("");
  const [tone, setTone] = useState<ReminderTone>("durulma");
  const [time, setTime] = useState<ReminderTime>("morning");
  const [lang, setLang] = useState<Lang>("tr");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(8)).current;

  // İlk açılış: zaten onboarding tamamlandıysa Ana Sayfa'ya atla
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const ob = await getOnboarding();
        if (!alive) return;
        setLang(ob.lang);
        if (ob.completed) {
          router.replace("/(tabs)" as any);
          return;
        }
        setReady(true);
      } catch {
        setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Step animasyonu
  useEffect(() => {
    fade.setValue(0);
    slide.setValue(12);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 520, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [step, fade, slide]);

  const tr = lang === "tr";

  const T = {
    welcomeTitle: tr ? "Hoş geldin." : "Welcome.",
    welcomeSub: tr
      ? "Ben AURA. Sana cevap vermek için değil, birlikte düşünmek için buradayım."
      : "I’m AURA. I’m here to think with you, not just answer you.",
    welcomeCta: tr ? "Başla" : "Begin",
    needTitle: tr ? "Bugün neye ihtiyacın var?" : "What do you need today?",
    needPlaceholder: tr ? "Bir cümleyle anlat…" : "Tell me in one sentence…",
    focusTitle: tr ? "Şu anda hayatının odağı ne?" : "What is your life focused on right now?",
    focusPlaceholder: tr ? "Aklındaki ana alan…" : "The main thing on your mind…",
    supportTitle: tr ? "Sana nasıl eşlik etmemi istersin?" : "How would you like me to accompany you?",
    supportPlaceholder: tr ? "Örneğin: net sorularla, sakinçe, plan yaparak…" : "For example: with clear questions, calmly, by making plans…",

    toneTitle: tr ? "Hangi ton sana iyi gelir?" : "Which tone feels right?",
    toneSub: tr ? "İstediğin zaman değiştirebilirsin." : "You can change this anytime.",

    timeTitle: tr ? "Ne zaman gelmemi istersin?" : "When should I arrive?",
    timeSub: tr ? "Bir hatırlatma her gün bu aralıkta gelir." : "A gentle note arrives within this window each day.",
    timeMorning: tr ? "Sabah" : "Morning",
    timeMorningSub: "07:00 — 10:00",
    timeNoon: tr ? "Öğle" : "Noon",
    timeNoonSub: "12:00 — 14:00",
    timeEvening: tr ? "Akşam" : "Evening",
    timeEveningSub: "20:00 — 22:00",

    finalKicker: tr ? "HAZIR" : "READY",
    finalTitle: tr ? "AURA seni bekliyor." : "AURA is waiting for you.",
    finalSub: tr
      ? "Hatırlatmaları açarsan ilk söz doğru saatte gelir.\nDilersen sonra da değiştirebilirsin."
      : "Turn on reminders and the first note arrives at the right hour.\nYou can change it later.",
    finalCta: tr ? "Hatırlatmaları Aç ve Başla" : "Allow Reminders & Begin",
    finalSkip: tr ? "Şimdilik bildirimsiz devam et" : "Continue without notifications",

    backBtn: tr ? "← Geri" : "← Back",
    langSwitch: tr ? "EN" : "TR",
  };

  const onBegin = () => {
    Haptics.selectionAsync().catch(() => {});
    setStep(1);
  };
  const onPickTone = (t: ReminderTone) => {
    Haptics.selectionAsync().catch(() => {});
    setTone(t);
    setStep(5);
  };
  const onPickTime = (t: ReminderTime) => {
    Haptics.selectionAsync().catch(() => {});
    setTime(t);
    setStep(6);
  };
  const onBack = () => {
    Haptics.selectionAsync().catch(() => {});
    setStep((s) => (s > 0 ? ((s - 1) as Step) : s));
  };
  const onLangSwitch = () => {
    setLang((l) => (l === "tr" ? "en" : "tr"));
  };

  const finishOnboarding = async (allowNotif: boolean) => {
    if (busy) return;
    setBusy(true);
    try {
      let permGranted = false;
      if (allowNotif && Platform.OS !== "web") {
        try {
          const res = await Notifications.requestPermissionsAsync();
          permGranted = res.status === "granted";
        } catch {
          /* sessiz geç */
        }
      }
      await saveOnboarding({ tone, time, lang, need, focus, support });
      if (permGranted) {
        scheduleDaily(time, lang).catch(() => {});
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace({ pathname: "/(tabs)/chat", params: { ctx: "home" } } as any);
    } catch (e: any) {
      Alert.alert("", e?.message || (tr ? "Bir şey oldu, tekrar dener misin?" : "Something happened. Try again?"));
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <View style={st.root}>
        <StatusBar barStyle="light-content" backgroundColor={BG} translucent={false} />
      </View>
    );
  }

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" backgroundColor={BG} translucent={false} />
      <SanctumBackground showRing={false}>
        {/* Top bar */}
        <View style={[st.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
          {step > 0 ? (
            <Pressable onPress={onBack} style={st.topBtn} hitSlop={12}>
              <Text style={st.topBtnTxt}>{T.backBtn}</Text>
            </Pressable>
          ) : (
            <View style={st.topBtn} />
          )}
          <Pressable onPress={onLangSwitch} style={st.topBtn} hitSlop={12}>
            <Text style={st.topBtnTxt}>{T.langSwitch}</Text>
          </Pressable>
        </View>

        {/* İki satırlı logo */}
        <View style={st.logoWrap}>
          <Text style={st.wordmark}>SANRI OS</Text>
          <Text style={st.byline}>AURA SENİ KARŞILIYOR</Text>
        </View>

        {/* Step indicator */}
        <View style={st.dotsRow}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={[st.dot, step === i && st.dotActive]} />
          ))}
        </View>

        <Animated.View
          style={[
            st.body,
            {
              opacity: fade,
              transform: [{ translateY: slide }],
              paddingBottom: Math.max(insets.bottom + 16, 32),
            },
          ]}
        >
          {step === 0 && (
            <>
              <HeroRing />
              <Text style={st.title}>{T.welcomeTitle}</Text>
              <Text style={st.sub}>{T.welcomeSub}</Text>

              <Pressable onPress={onBegin} style={st.primaryBtn}>
                <LinearGradient
                  colors={[COLORS.goldSoft, COLORS.gold]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={st.primaryBtnGrad}
                >
                  <Text style={st.primaryBtnTxt}>{T.welcomeCta}</Text>
                </LinearGradient>
              </Pressable>
            </>
          )}

          {step === 1 && (
            <QuestionStep
              title={T.needTitle}
              placeholder={T.needPlaceholder}
              value={need}
              onChangeText={setNeed}
              onNext={() => setStep(2)}
              nextLabel={tr ? "Devam" : "Continue"}
            />
          )}

          {step === 2 && (
            <QuestionStep
              title={T.focusTitle}
              placeholder={T.focusPlaceholder}
              value={focus}
              onChangeText={setFocus}
              onNext={() => setStep(3)}
              nextLabel={tr ? "Devam" : "Continue"}
            />
          )}

          {step === 3 && (
            <QuestionStep
              title={T.supportTitle}
              placeholder={T.supportPlaceholder}
              value={support}
              onChangeText={setSupport}
              onNext={() => setStep(4)}
              nextLabel={tr ? "Devam" : "Continue"}
            />
          )}

          {step === 4 && (
            <>
              <Text style={st.kicker}>{tr ? "TON" : "TONE"}</Text>
              <Text style={st.title}>{T.toneTitle}</Text>
              <Text style={st.sub}>{T.toneSub}</Text>

              <View style={st.toneList}>
                {(["durulma", "hareket", "derinlesme"] as ReminderTone[]).map((t) => {
                  const meta = TONE_META[t];
                  return (
                    <Pressable
                      key={t}
                      style={[st.toneCard, { borderColor: COLORS.surfaceBorder }]}
                      onPress={() => onPickTone(t)}
                    >
                      <Text style={[st.toneGlyph, { color: COLORS.gold }]}>{meta.glyph}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={st.toneLabel}>{tr ? meta.labelTr : meta.labelEn}</Text>
                        <Text style={st.toneDesc}>{tr ? meta.descTr : meta.descEn}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {step === 5 && (
            <>
              <Text style={st.kicker}>{tr ? "ZAMAN" : "TIME"}</Text>
              <Text style={st.title}>{T.timeTitle}</Text>
              <Text style={st.sub}>{T.timeSub}</Text>

              <View style={st.toneList}>
                {(
                  [
                    { id: "morning" as ReminderTime, label: T.timeMorning, sub: T.timeMorningSub, glyph: "☀" },
                    { id: "noon" as ReminderTime, label: T.timeNoon, sub: T.timeNoonSub, glyph: "✦" },
                    { id: "evening" as ReminderTime, label: T.timeEvening, sub: T.timeEveningSub, glyph: "☽" },
                  ]
                ).map((opt) => (
                  <Pressable
                    key={opt.id}
                    style={[
                      st.toneCard,
                      {
                        borderColor: time === opt.id ? `${COLORS.gold}66` : COLORS.surfaceBorder,
                        backgroundColor: time === opt.id ? "rgba(212,178,106,0.12)" : COLORS.surface,
                      },
                    ]}
                    onPress={() => onPickTime(opt.id)}
                  >
                    <Text style={[st.toneGlyph, { color: COLORS.gold }]}>{opt.glyph}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={st.toneLabel}>{opt.label}</Text>
                      <Text style={st.toneDesc}>{opt.sub}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {step === 6 && (
            <>
              <Text style={st.kicker}>{T.finalKicker}</Text>
              <HeroRing glyph={TONE_META[tone].glyph} />
              <Text style={st.title}>{T.finalTitle}</Text>
              <Text style={st.sub}>{T.finalSub}</Text>

              <Pressable onPress={() => finishOnboarding(true)} style={st.primaryBtn} disabled={busy}>
                <LinearGradient
                  colors={[COLORS.goldSoft, COLORS.gold]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={st.primaryBtnGrad}
                >
                  <Text style={st.primaryBtnTxt}>{T.finalCta}</Text>
                </LinearGradient>
              </Pressable>

              <Pressable onPress={() => finishOnboarding(false)} style={st.skipBtn} disabled={busy}>
                <Text style={st.skipTxt}>{T.finalSkip}</Text>
              </Pressable>
            </>
          )}
        </Animated.View>
      </SanctumBackground>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 4,
  },
  topBtn: { padding: 8, minWidth: 60 },
  topBtnTxt: { color: COLORS.goldDim, fontFamily: FONTS.bodyMed, fontSize: 14 },

  logoWrap: { alignItems: "center", marginTop: 2, marginBottom: 8 },
  wordmark: { color: COLORS.goldSoft, fontFamily: FONTS.serifBold, fontSize: 24, letterSpacing: 7, lineHeight: 26 },
  byline: { color: COLORS.goldDim, fontFamily: FONTS.bodyMed, fontSize: 9, letterSpacing: 6, marginTop: 3 },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(212,178,106,0.22)" },
  dotActive: { backgroundColor: COLORS.gold, width: 18 },

  body: { flex: 1, paddingHorizontal: 28, paddingTop: 16, alignItems: "center", justifyContent: "center", width: "100%", maxWidth: 520, alignSelf: "center" },
  kicker: {
    color: COLORS.goldDim,
    letterSpacing: 4,
    fontSize: 12,
    fontFamily: FONTS.bodyMed,
    marginBottom: 16,
    textAlign: "center",
  },
  title: {
    color: COLORS.text,
    fontFamily: FONTS.serif,
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: 0.3,
    marginBottom: 14,
    textAlign: "center",
  },
  sub: { color: COLORS.textMuted, fontFamily: FONTS.body, fontSize: 15, lineHeight: 23, marginBottom: 28, textAlign: "center" },
  questionInput: {
    width: "100%",
    minHeight: 110,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    fontFamily: FONTS.body,
    fontSize: 16,
    lineHeight: 24,
    padding: 18,
    textAlignVertical: "top",
    marginBottom: 14,
  },
  disabledBtn: { opacity: 0.45 },

  // Hero halka
  heroWrap: { width: 168, height: 168, alignItems: "center", justifyContent: "center", marginBottom: 30 },
  heroRing: { position: "absolute", borderRadius: 200, borderWidth: 1 },
  heroOuter: { width: 168, height: 168, borderColor: "rgba(212,178,106,0.22)" },
  heroMid: { width: 120, height: 120, borderColor: "rgba(212,178,106,0.4)" },
  heroInner: { width: 76, height: 76, borderColor: "rgba(212,178,106,0.6)" },
  heroGlyph: { fontSize: 40, color: COLORS.gold, fontFamily: FONTS.serif },
  heroCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.9,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },

  toneList: { gap: 12, width: "100%" },
  toneCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: COLORS.surface,
  },
  toneGlyph: { fontSize: 30, width: 36, textAlign: "center" },
  toneLabel: { color: COLORS.text, fontFamily: FONTS.serif, fontSize: 20, marginBottom: 3 },
  toneDesc: { color: COLORS.textMuted, fontFamily: FONTS.body, fontSize: 13, lineHeight: 18 },

  primaryBtn: { marginTop: 8, borderRadius: 22, overflow: "hidden", width: "100%" },
  primaryBtnGrad: { paddingVertical: 18, paddingHorizontal: 32, alignItems: "center" },
  primaryBtnTxt: { color: COLORS.bgDeep, fontFamily: FONTS.bodyMed, fontSize: 16, letterSpacing: 0.5 },
  skipBtn: { marginTop: 14, paddingVertical: 14, alignItems: "center" },
  skipTxt: { color: COLORS.textFaint, fontFamily: FONTS.bodyMed, fontSize: 14 },
});
