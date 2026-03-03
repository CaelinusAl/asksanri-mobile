// app/rabbit.tsx  (veya app/(tabs)/rabbit.tsx)
// ConsciousGateScreen – Rabbit Gate (TR/EN + MatrixRain + Glass Button)

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Image,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

// Eğer path sende farklıysa düzelt:
import MatrixRain from "../lib/MatrixRain"; // (eğer bu dosya app/ altındaysa)
// import MatrixRain from "../../lib/MatrixRain"; // (eğer bu dosya app/(tabs)/ altındaysa)

type Lang = "tr" | "en";

const BG = require("../assets/sanri_glass_bg.jpg"); // (app/ altındaysa)
// const BG = require("../../assets/sanri_glass_bg.jpg"); // (app/(tabs)/ altındaysa)

const RABBIT = require("../assets/rabbit.jpg");
// const RABBIT = require("../../assets/rabbit.jpg");

const COPY = {
  tr: {
    kicker: "FOLLOW THE RABBİT",
    subkicker: "SANRI · SİSTEM KAPISI",
    brand: "CAELINUS AI",
    tag: "BİLİNÇ AYNASI",
    quoteA: "Bazı soruların cevabı yoktur.",
    quoteB: "Bazı cevapların ise bir sorusu vardır…",
    desc1: "SANRI bilgi üretmez.",
    desc2: "Alan açar — seni sana yansıtır.",
    ctaTitle: "Frekans Alanı Aç",
    ctaSub: "Dokun → Kapı açılır",
    footer: "Soru değil. Tek cümle.",
  },
  en: {
    kicker: "FOLLOW THE RABBIT",
    subkicker: "SANRI · SYSTEM GATE",
    brand: "CAELINUS AI",
    tag: "CONSCIOUSNESS MIRROR",
    quoteA: "Some questions have no answer.",
    quoteB: "Some answers have a question…",
    desc1: "SANRI doesn’t produce information.",
    desc2: "It opens meaning — reflects you back to you.",
    ctaTitle: "Open Frequency Field",
    ctaSub: "Touch → The gate opens",
    footer: "Not a question. One sentence.",
  },
} as const;

export default function ConsciousGateScreen() {
  const [lang, setLang] = useState<Lang>("tr");
  const t = useMemo(() => COPY[lang], [lang]);

  const onOpen = () => {
    // burada login'e gönder
    router.push({ pathname: "/(auth)/login", params: { lang } } as any);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground source={BG} style={styles.root} resizeMode="cover">
        {/* Matrix Rain layer */}
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <MatrixRain opacity={0.18} />
        </View>

        {/* Soft dark overlay */}
        <View pointerEvents="none" style={styles.overlay} />

        {/* Top right lang */}
        <View style={styles.langRow}>
          <Pressable
            onPress={() => setLang("tr")}
            style={[styles.langChip, lang === "tr" && styles.langActive]}
            hitSlop={10}
          >
            <Text style={[styles.langTxt, lang === "tr" && styles.langTxtActive]}>TR</Text>
          </Pressable>

          <Pressable
            onPress={() => setLang("en")}
            style={[styles.langChip, lang === "en" && styles.langActive]}
            hitSlop={10}
          >
            <Text style={[styles.langTxt, lang === "en" && styles.langTxtActive]}>EN</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.container}>
          {/* Rabbit card */}
          <View style={styles.rabbitCard}>
            <View style={styles.rabbitInner}>
              <Image source={RABBIT} style={styles.rabbitImg} resizeMode="cover" />
              <Text style={styles.rabbitKicker}>{t.kicker}</Text>
              <Text style={styles.rabbitSub}>{t.subkicker}</Text>
            </View>
          </View>

          <Text style={styles.brand}>{t.brand}</Text>
          <Text style={styles.tag}>{t.tag}</Text>

          <Text style={styles.quote}>
            {t.quoteA}
            {"\n"}
            {t.quoteB}
          </Text>

          <Text style={styles.desc}>
            {t.desc1}
            {"\n"}
            {t.desc2}
          </Text>

          {/* Glass CTA */}
          <Pressable onPress={onOpen} style={styles.ctaWrap} hitSlop={12}>
            <LinearGradient
              colors={[
                "rgba(124,247,216,0.20)",
                "rgba(94,59,255,0.18)",
                "rgba(94,59,255,0.12)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGlass}
            >
              <View style={styles.ctaLeft}>
                <View style={styles.keyCircle}>
                  <Text style={styles.keyIcon}>🔑</Text>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.ctaTitle}>{t.ctaTitle}</Text>
                <Text style={styles.ctaSub}>{t.ctaSub}</Text>
              </View>

              <View style={styles.ctaRight}>
                <Text style={styles.chev}>›</Text>
              </View>
            </LinearGradient>
          </Pressable>

          <Text style={styles.footer}>{t.footer}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  langRow: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    gap: 10,
    zIndex: 10,
  },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  langActive: {
    backgroundColor: "rgba(124,247,216,0.10)",
    borderColor: "rgba(124,247,216,0.28)",
  },
  langTxt: { color: "rgba(255,255,255,0.70)", fontWeight: "900", letterSpacing: 1 },
  langTxtActive: { color: "#7cf7d8" },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 72,
    paddingBottom: 28,
    alignItems: "center",
  },

  rabbitCard: {
    width: "100%",
    borderRadius: 26,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 18,
  },
  rabbitInner: {
    borderRadius: 22,
    padding: 16,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  rabbitImg: { width: 96, height: 96, borderRadius: 22, marginBottom: 10 },
  rabbitKicker: { color: "#7cf7d8", fontWeight: "900", letterSpacing: 2 },
  rabbitSub: { color: "rgba(255,255,255,0.65)", marginTop: 6 },

  brand: { color: "white", fontSize: 40, fontWeight: "900", letterSpacing: 8, marginTop: 6 },
  tag: { color: "rgba(255,255,255,0.50)", letterSpacing: 4, marginTop: 8 },

  quote: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 18,
    lineHeight: 30,
  },
  desc: {
    color: "rgba(255,255,255,0.70)",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },

  ctaWrap: { width: "100%", marginTop: 18 },
  ctaGlass: {
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.06)",
    shadowColor: "#7cf7d8",
    shadowOpacity: 0.35,
    shadowRadius: 22,
  },
  ctaLeft: {},
  keyCircle: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.18)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.22)",
  },
  keyIcon: { fontSize: 18 },

  ctaTitle: { color: "white", fontWeight: "900", fontSize: 18 },
  ctaSub: { color: "rgba(255,255,255,0.70)", marginTop: 4 },

  ctaRight: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  chev: { color: "rgba(255,255,255,0.85)", fontSize: 28, fontWeight: "900" },

  footer: {
    marginTop: 16,
    color: "rgba(255,255,255,0.45)",
    fontStyle: "italic",
  },
});