import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
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
import {
  getOnboarding,
  saveOnboarding,
  type ReminderTime,
  type Lang,
} from "../../lib/onboardingStore";
import { TONE_META, type ReminderTone } from "../../lib/dailyReminders";

const BG = "#07080d";

type Step = 0 | 1 | 2 | 3;

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>(0);
  const [tone, setTone] = useState<ReminderTone>("durulma");
  const [time, setTime] = useState<ReminderTime>("morning");
  const [lang, setLang] = useState<Lang>("tr");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(8)).current;

  // İlk açılış: zaten onboarding tamamlandıysa daily'ye atla
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const ob = await getOnboarding();
        if (!alive) return;
        setLang(ob.lang);
        if (ob.completed) {
          router.replace("/(tabs)/daily" as any);
          return;
        }
        setReady(true);
      } catch {
        setReady(true);
      }
    })();
    return () => { alive = false; };
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
    welcomeKicker: tr ? "SANRI" : "SANRI",
    welcomeTitle: tr ? "Bir cümle.\nDoğru saatte." : "One sentence.\nAt the right hour.",
    welcomeSub: tr
      ? "Sanrı günde bir kez seninle konuşur — sen kim olduğunu hatırlayasın diye."
      : "Sanri speaks once a day — so you remember who you are.",
    welcomeCta: tr ? "Başla" : "Begin",

    toneTitle: tr ? "Hangi ton sana iyi gelir?" : "Which tone feels right?",
    toneSub: tr ? "İstediğin zaman değiştirebilirsin." : "You can change this anytime.",

    timeTitle: tr ? "Ne zaman gelmemi istersin?" : "When should I arrive?",
    timeSub: tr ? "Bildirim her gün bu zaman aralığında gelir." : "I'll arrive within this window each day.",
    timeMorning: tr ? "Sabah" : "Morning",
    timeMorningSub: "07:00 — 10:00",
    timeNoon: tr ? "Öğle" : "Noon",
    timeNoonSub: "12:00 — 14:00",
    timeEvening: tr ? "Akşam" : "Evening",
    timeEveningSub: "20:00 — 22:00",

    finalKicker: tr ? "HAZIR" : "READY",
    finalTitle: tr ? "Sanrı senin için bekliyor." : "Sanrı is waiting for you.",
    finalSub: tr
      ? "Bildirimleri açtığında ilk cümle doğru saatte gelir.\nDilersen sessizliği sonra seçebilirsin."
      : "Turn on notifications and the first sentence arrives at the right hour.\nYou can choose silence later.",
    finalCta: tr ? "Bildirimleri Aç ve Başla" : "Allow Notifications & Begin",
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
    setStep(2);
  };
  const onPickTime = (t: ReminderTime) => {
    Haptics.selectionAsync().catch(() => {});
    setTime(t);
    setStep(3);
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
      if (allowNotif && Platform.OS !== "web") {
        try {
          await Notifications.requestPermissionsAsync();
        } catch {
          /* sessiz geç */
        }
      }
      await saveOnboarding({ tone, time, lang });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace("/(tabs)/daily" as any);
    } catch (e: any) {
      Alert.alert("", e?.message || (tr ? "Bir şey oldu, tekrar dener misin?" : "Something happened. Try again?"));
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return <View style={st.root}><StatusBar barStyle="light-content" /></View>;
  }

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" />

      {/* Top bar */}
      <View style={st.topBar}>
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

      {/* Step indicator */}
      <View style={st.dotsRow}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[st.dot, step === i && st.dotActive]} />
        ))}
      </View>

      <Animated.View
        style={[st.body, { opacity: fade, transform: [{ translateY: slide }] }]}
      >
        {step === 0 && (
          <>
            <Text style={st.kicker}>{T.welcomeKicker}</Text>
            <Text style={st.title}>{T.welcomeTitle}</Text>
            <Text style={st.sub}>{T.welcomeSub}</Text>

            <View style={st.glyphHero}>
              <Text style={st.glyphChar}>◉</Text>
            </View>

            <Pressable onPress={onBegin} style={st.primaryBtn}>
              <LinearGradient
                colors={["#7cf7d8", "#5e3bff"]}
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
                    style={[st.toneCard, { borderColor: `${meta.color}33` }]}
                    onPress={() => onPickTone(t)}
                  >
                    <Text style={[st.toneGlyph, { color: meta.color }]}>{meta.glyph}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[st.toneLabel, { color: meta.color }]}>
                        {tr ? meta.labelTr : meta.labelEn}
                      </Text>
                      <Text style={st.toneDesc}>
                        {tr ? meta.descTr : meta.descEn}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={st.kicker}>{tr ? "ZAMAN" : "TIME"}</Text>
            <Text style={st.title}>{T.timeTitle}</Text>
            <Text style={st.sub}>{T.timeSub}</Text>

            <View style={st.timeList}>
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
                      borderColor: time === opt.id ? `${TONE_META[tone].color}55` : "rgba(255,255,255,0.08)",
                      backgroundColor: time === opt.id ? `${TONE_META[tone].color}10` : "rgba(255,255,255,0.03)",
                    },
                  ]}
                  onPress={() => onPickTime(opt.id)}
                >
                  <Text style={[st.toneGlyph, { color: TONE_META[tone].color }]}>{opt.glyph}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[st.toneLabel, { color: "#fff" }]}>{opt.label}</Text>
                    <Text style={st.toneDesc}>{opt.sub}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={st.kicker}>{T.finalKicker}</Text>
            <Text style={st.title}>{T.finalTitle}</Text>
            <Text style={st.sub}>{T.finalSub}</Text>

            <View style={st.glyphHero}>
              <Text style={[st.glyphChar, { color: TONE_META[tone].color }]}>
                {TONE_META[tone].glyph}
              </Text>
            </View>

            <Pressable
              onPress={() => finishOnboarding(true)}
              style={st.primaryBtn}
              disabled={busy}
            >
              <LinearGradient
                colors={["#7cf7d8", "#5e3bff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={st.primaryBtnGrad}
              >
                <Text style={st.primaryBtnTxt}>{T.finalCta}</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => finishOnboarding(false)}
              style={st.skipBtn}
              disabled={busy}
            >
              <Text style={st.skipTxt}>{T.finalSkip}</Text>
            </Pressable>
          </>
        )}
      </Animated.View>
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
    paddingTop: Platform.OS === "ios" ? 56 : 36,
    paddingBottom: 8,
  },
  topBtn: { padding: 8, minWidth: 60 },
  topBtnTxt: { color: "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: "700" },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  dotActive: { backgroundColor: "#7cf7d8", width: 18 },

  body: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 32,
  },
  kicker: {
    color: "rgba(255,255,255,0.40)",
    letterSpacing: 4,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 18,
  },
  title: {
    color: "#fff",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  sub: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 28,
  },

  glyphHero: {
    alignItems: "center",
    marginVertical: 28,
  },
  glyphChar: {
    fontSize: 88,
    color: "#7cf7d8",
    opacity: 0.85,
  },

  toneList: { gap: 12 },
  toneCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  toneGlyph: {
    fontSize: 32,
    width: 36,
    textAlign: "center",
  },
  toneLabel: {
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  toneDesc: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    lineHeight: 18,
  },

  timeList: { gap: 12 },

  primaryBtn: {
    marginTop: 24,
    borderRadius: 22,
    overflow: "hidden",
  },
  primaryBtnGrad: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  primaryBtnTxt: {
    color: BG,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  skipBtn: {
    marginTop: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  skipTxt: {
    color: "rgba(255,255,255,0.40)",
    fontSize: 14,
    fontWeight: "700",
  },
});
