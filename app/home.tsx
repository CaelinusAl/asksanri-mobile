// app/(tabs)/home.tsx
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image, Platform, StatusBar, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import MatrixRain from "../lib/MatrixRain";

type Lang = "tr" | "en";

// ✅ doğru path: app/(tabs) -> assets
const RABBIT = require("../assets/rabbit.jpg");
const MATRIX_BG = require("../assets/matrix_rain.jpg");

const COPY = {
  tr: {
    chips: { tr: "TR", en: "EN" },
    brand: "CAELINUS AI",
    brandSub: "CONSCIOUSNESS MIRROR",
    follow: "FOLLOW THE RABBIT",
    gateSub: "SANRI • SYSTEM GATE",
    line1: "Bazı soruların cevabı yoktur.",
    line2: "Bazı cevapların ise sorusu…",
    line3: "SANRI bilgi üretmez.",
    line4: "Anlam açar — seni sana yansıtır.",
    hint: "Soru değil. Tek cümle.",
    ctaTitle: "ALANA GİR",
    ctaSub: "Dokun → Kapılar açılır",
  },
  en: {
    chips: { tr: "TR", en: "EN" },
    brand: "CAELINUS AI",
    brandSub: "CONSCIOUSNESS MIRROR",
    follow: "FOLLOW THE RABBIT",
    gateSub: "SANRI • SYSTEM GATE",
    line1: "Some questions have no answer.",
    line2: "Some answers have a question…",
    line3: "SANRI doesn’t produce information.",
    line4: "It opens meaning — reflects you back to you.",
    hint: "Not a question. One sentence.",
    ctaTitle: "ENTER",
    ctaSub: "Touch → Doors open",
  },
} as const;

export default function HomeScreen() {
  const [lang, setLang] = useState<Lang>("tr");

  const bg = useMemo<[string, string, string]>(() => ["#05060a", "#0b0620", "#050610"], []);

  // ✅ doğru enter: haptics -> push
  const enter = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.push("/(tabs)/gates");
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* 0) Background gradient */}
      <LinearGradient colors={bg} style={StyleSheet.absoluteFillObject} />

      {/* 0.5) Matrix rain background image */}
<     ImageBackground
      source={MATRIX_BG}
      style={StyleSheet.absoluteFillObject}
      resizeMode="cover"
/>

      {/* 1) Akan MatrixRain */}
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.47} speedMs={9000} />
      </View>

      {/* 2) Okunabilirlik perdesi */}
      <View pointerEvents="none" style={styles.overlay} />

      {/* soft premium glows */}
      <View pointerEvents="none" style={styles.glowTop} />
      <View pointerEvents="none" style={styles.glowBottom} />

      {/* language chips */}
      <View style={styles.langRow}>
        <Pressable
          onPress={() => setLang("tr")}
          style={[styles.langChip, lang === "tr" && styles.langChipActive]}
          hitSlop={10}
        >
          <Text style={[styles.langText, lang === "tr" && styles.langTextActive]}>
            {COPY[lang].chips.tr}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setLang("en")}
          style={[styles.langChip, lang === "en" && styles.langChipActive]}
          hitSlop={10}
        >
          <Text style={[styles.langText, lang === "en" && styles.langTextActive]}>
            {COPY[lang].chips.en}
          </Text>
        </Pressable>
      </View>

      {/* içerik */}
      <View style={styles.content}>
        <View style={styles.center}>
          <View style={styles.rabbitCard}>
            <Image source={RABBIT} style={styles.rabbitImg} resizeMode="cover" />
            <Text style={styles.follow}>{COPY[lang].follow}</Text>
            <Text style={styles.gateSub}>{COPY[lang].gateSub}</Text>
          </View>

          <Text style={styles.brand}>{COPY[lang].brand}</Text>
          <Text style={styles.brandSub}>{COPY[lang].brandSub}</Text>

          <View style={{ height: 18 }} />

          <Text style={styles.bigLine}>{COPY[lang].line1}</Text>
          <Text style={styles.bigLine}>{COPY[lang].line2}</Text>

          <View style={{ height: 14 }} />

          <Text style={styles.smallLine}>{COPY[lang].line3}</Text>
          <Text style={styles.smallLine}>{COPY[lang].line4}</Text>

          <View style={{ height: 22 }} />

          <Pressable style={styles.cta} onPress={enter} hitSlop={12}>
            <Text style={styles.ctaTitle}>{COPY[lang].ctaTitle}</Text>
            <Text style={styles.ctaSub}>{COPY[lang].ctaSub}</Text>
          </Pressable>

          <Text style={styles.hint}>{COPY[lang].hint}</Text>
        </View>

        <Text style={styles.footer}>CAELINUS AI • CONSCIOUSNESS MIRROR</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#05060a" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5,8,20,0.55)",
  },

  content: { flex: 1 },

  glowTop: {
    position: "absolute",
    top: -120,
    left: -80,
    width: 520,
    height: 520,
    borderRadius: 520,
    backgroundColor: "rgba(124,247,216,0.06)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -180,
    right: -120,
    width: 620,
    height: 620,
    borderRadius: 620,
    backgroundColor: "rgba(94,59,255,0.16)",
  },

  langRow: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 22,
    right: 18,
    flexDirection: "row",
    gap: 10,
    zIndex: 10,
  },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  langChipActive: {
    backgroundColor: "rgba(124,247,216,0.10)",
    borderColor: "rgba(124,247,216,0.22)",
  },
  langText: { color: "rgba(255,255,255,0.75)", fontWeight: "900", letterSpacing: 1 },
  langTextActive: { color: "#7cf7d8" },

  center: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  rabbitCard: {
    width: 260,
    borderRadius: 26,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    marginBottom: 18,
  },
  rabbitImg: { width: 160, height: 160, borderRadius: 18, marginBottom: 10 },
  follow: { color: "#7cf7d8", fontWeight: "900", letterSpacing: 3, fontSize: 12 },
  gateSub: { color: "rgba(255,255,255,0.55)", marginTop: 6, letterSpacing: 2, fontSize: 11 },

  brand: { color: "white", fontWeight: "900", fontSize: 26, letterSpacing: 6 },
  brandSub: { color: "rgba(255,255,255,0.50)", marginTop: 10, letterSpacing: 3, fontSize: 11 },

  bigLine: { color: "white", fontWeight: "900", fontSize: 22, textAlign: "center", lineHeight: 28 },
  smallLine: { color: "rgba(255,255,255,0.78)", fontSize: 14, textAlign: "center", lineHeight: 20 },

  cta: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "rgba(94,59,255,0.85)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.18)",
  },
  ctaTitle: { color: "white", fontWeight: "900", letterSpacing: 4, fontSize: 16 },
  ctaSub: { color: "rgba(255,255,255,0.70)", marginTop: 8, letterSpacing: 2, fontSize: 11 },

  hint: { marginTop: 16, color: "rgba(255,255,255,0.45)", fontWeight: "700" },

  footer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 26 : 18,
    alignSelf: "center",
    color: "rgba(255,255,255,0.22)",
    letterSpacing: 3,
    fontSize: 10,
    fontWeight: "900",
  },
});