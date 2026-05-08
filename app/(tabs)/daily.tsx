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
} from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getOnboarding,
  type OnboardingState,
} from "../../lib/onboardingStore";
import {
  getTodayReminder,
  TONE_META,
  type Reminder,
} from "../../lib/dailyReminders";
import PyramidMenu from "../../components/PyramidMenu";

const BG = "#07080d";

export default function DailyScreen() {
  const insets = useSafeAreaInsets();
  const [ob, setOb] = useState<OnboardingState | null>(null);
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [text, setText] = useState<string>("");

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await getOnboarding();
      if (!alive) return;
      if (!data.completed) {
        router.replace("/(tabs)/" as any);
        return;
      }
      const today = getTodayReminder(data.tone, data.lang);
      setOb(data);
      setReminder(today.reminder);
      setText(today.text);

      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    })();
    return () => { alive = false; };
  }, [fade, slide]);

  if (!ob || !reminder) {
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
  const meta = TONE_META[ob.tone];

  const T = {
    todayLabel: tr ? "BUGÜN" : "TODAY",
    write: tr ? "Yaz" : "Write",
    silence: tr ? "Sustur" : "Silence",
    archive: tr ? "Yankılar" : "Echoes",
    discover: tr ? "Keşfet" : "Discover",
    bottomNote: tr ? "Sanrı yarın yine konuşur." : "Sanrı will speak again tomorrow.",
    settings: tr ? "Ayarlar" : "Settings",
  };

  const onWrite = () => {
    Haptics.selectionAsync().catch(() => {});
    router.push({
      pathname: "/(tabs)/chat" as any,
      params: { prompt: text, tone: ob.tone },
    });
  };
  const onSilence = () => {
    Haptics.selectionAsync().catch(() => {});
    router.push("/(tabs)/silence" as any);
  };
  const onArchive = () => {
    Haptics.selectionAsync().catch(() => {});
    router.push("/(tabs)/archive" as any);
  };
  // Keşfet → tüm derinlik kapılarının (Sanrı, Şehirler, Kod, Üst Bilinç, Ritüel)
  // hub ekranı. Apple reviewer da buradan tüm içeriği test edebilir.
  const onDiscover = () => {
    Haptics.selectionAsync().catch(() => {});
    router.push("/(tabs)/gates" as any);
  };

  return (
    <View style={st.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={BG}
        translucent={false}
      />

      <PyramidMenu lang={ob.lang} />

      {/* Top bar */}
      <View style={[st.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={[st.toneChip, { borderColor: `${meta.color}55` }]}>
          <Text style={[st.toneChipGlyph, { color: meta.color }]}>{meta.glyph}</Text>
          <Text style={[st.toneChipLabel, { color: meta.color }]}>
            {tr ? meta.labelTr : meta.labelEn}
          </Text>
        </View>
        <Pressable onPress={onSilence} hitSlop={12} style={st.gearBtn}>
          <Text style={st.gearTxt}>⌖</Text>
        </Pressable>
      </View>

      {/* Center */}
      <View style={st.center}>
        <Animated.View
          style={{ opacity: fade, transform: [{ translateY: slide }] }}
        >
          <Text style={[st.label, { color: meta.color }]}>{T.todayLabel}</Text>
          <Text style={st.cumle}>{text}</Text>
        </Animated.View>
      </View>

      {/* Actions */}
      <View style={[st.actions, { paddingBottom: Math.max(insets.bottom + 16, 28) }]}>
        <Pressable onPress={onWrite} style={st.primaryBtn}>
          <LinearGradient
            colors={[meta.color, "#5e3bff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={st.primaryBtnGrad}
          >
            <Text style={st.primaryBtnTxt}>{T.write}</Text>
          </LinearGradient>
        </Pressable>

        <Pressable onPress={onDiscover} style={st.discoverBtn}>
          <LinearGradient
            colors={["rgba(124,247,216,0.10)", "rgba(94,59,255,0.12)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={st.discoverGrad}
          >
            <Text style={st.discoverGlyph}>◎</Text>
            <Text style={st.discoverTxt}>{T.discover}</Text>
            <Text style={st.discoverArrow}>→</Text>
          </LinearGradient>
        </Pressable>

        <View style={st.secondaryRow}>
          <Pressable onPress={onArchive} style={st.secondaryBtn}>
            <Text style={st.secondaryBtnTxt}>{T.archive}</Text>
          </Pressable>
          <Pressable onPress={onSilence} style={st.secondaryBtn}>
            <Text style={st.secondaryBtnTxt}>{T.silence}</Text>
          </Pressable>
        </View>

        <Text style={st.bottomNote}>{T.bottomNote}</Text>
      </View>
    </View>
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
    // paddingTop dinamik olarak inline (safe area inset).
    paddingBottom: 8,
  },
  toneChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  toneChipGlyph: { fontSize: 14 },
  toneChipLabel: { fontSize: 12, fontWeight: "900", letterSpacing: 1 },

  gearBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  gearTxt: { color: "rgba(255,255,255,0.65)", fontSize: 18, marginTop: -2 },

  center: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 5,
    marginBottom: 18,
  },
  cumle: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 40,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  actions: {
    paddingHorizontal: 28,
    // paddingBottom dinamik olarak inline (safe area inset).
  },
  primaryBtn: { borderRadius: 22, overflow: "hidden" },
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

  discoverBtn: {
    marginTop: 12,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.18)",
  },
  discoverGrad: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 12,
  },
  discoverGlyph: {
    color: "#7cf7d8",
    fontSize: 18,
  },
  discoverTxt: {
    flex: 1,
    color: "rgba(255,255,255,0.92)",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  discoverArrow: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 18,
    fontWeight: "700",
  },

  secondaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  secondaryBtnTxt: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  bottomNote: {
    marginTop: 20,
    color: "rgba(255,255,255,0.32)",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
