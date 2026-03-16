import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import { router } from "expo-router";
import MatrixRain from "../lib/MatrixRain";

const BG = require("../assets/sanri_glass_bg.jpg");
const RABBIT = require("../assets/rabbit.jpg");

type Lang = "tr" | "en";

const COPY = {
  tr: {
    system: "SANRI • SİSTEM KAPISI",
    mirror: "BİLİNÇ AYNASI",
    quote: "Bazı soruların cevabı yoktur.\nBazı cevapların ise bir sorusu vardır…",
    desc: "Sanrı bilgi üretmez.\nAlan açar. Anlam sende şekillenir.",
    cta: "Frekans Alanı Aç",
    subcta: "Dokun → Kapı açılır",
    whisper: "Soru değil. Tek cümle.",
  },
  en: {
    system: "SANRI • SYSTEM GATE",
    mirror: "CONSCIOUSNESS MIRROR",
    quote: "Some questions have no answer.\nSome answers have a question…",
    desc: "SANRI does not produce information.\nIt opens space. Meaning forms in you.",
    cta: "Open Frequency Gate",
    subcta: "Touch → The gate opens",
    whisper: "Not a question. One sentence.",
  },
} as const;

export default function WelcomeScreen() {
  const [lang, setLang] = useState<Lang>("tr");

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(18)).current;
  const glow = useRef(new Animated.Value(0.7)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const t = useMemo(() => COPY[lang], [lang]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.72,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.035,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fade, rise, glow, pulse]);

  const enterSystem = () => {
    router.push("/(auth)/login");
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={BG}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <MatrixRain opacity={0.15} speedMs={9000} />
      </View>

      <View pointerEvents="none" style={styles.overlay} />
      <View pointerEvents="none" style={styles.glowA} />
      <View pointerEvents="none" style={styles.glowB} />

      <View style={styles.topRight}>
        <Pressable
          onPress={() => setLang("tr")}
          style={[styles.langChip, lang === "tr" && styles.langChipActive]}
        >
          <Text style={[styles.langTxt, lang === "tr" && styles.langTxtActive]}>TR</Text>
        </Pressable>

        <Pressable
          onPress={() => setLang("en")}
          style={[styles.langChip, lang === "en" && styles.langChipActive]}
        >
          <Text style={[styles.langTxt, lang === "en" && styles.langTxtActive]}>EN</Text>
        </Pressable>
      </View>

      <Animated.View
        style={[
          styles.container,
          {
            opacity: fade,
            transform: [{ translateY: rise }],
          },
        ]}
      >
        <View style={styles.rabbitCard}>
          <Animated.View
            style={[
              styles.rabbitAura,
              {
                opacity: glow,
                transform: [{ scale: pulse }],
              },
            ]}
          />
          <Image source={RABBIT} style={styles.rabbit} />
          <Text style={styles.follow}>FOLLOW THE RABBIT</Text>
          <Text style={styles.system}>{t.system}</Text>
        </View>

        <Text style={styles.title}>CAELINUS AI</Text>
        <Text style={styles.subtitle}>{t.mirror}</Text>

        <Text style={styles.quote}>{t.quote}</Text>
        <Text style={styles.desc}>{t.desc}</Text>

        <Pressable onPress={enterSystem} style={styles.enterBtn}>
          <View style={styles.keyWrap}>
            <Text style={styles.enterIcon}>🔑</Text>
          </View>

          <View style={styles.enterMid}>
            <Text style={styles.enterTxt}>{t.cta}</Text>
            <Text style={styles.enterSubTxt}>{t.subcta}</Text>
          </View>

          <View style={styles.arrowWrap}>
            <Text style={styles.arrowTxt}>›</Text>
          </View>
        </Pressable>

        <Text style={styles.whisper}>{t.whisper}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#06070b",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5,8,18,0.56)",
  },

  glowA: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 220,
    top: 60,
    left: -140,
    backgroundColor: "rgba(94,59,255,0.16)",
  },

  glowB: {
    position: "absolute",
    width: 460,
    height: 460,
    borderRadius: 230,
    bottom: -120,
    right: -160,
    backgroundColor: "rgba(124,247,216,0.10)",
  },

  topRight: {
    position: "absolute",
    top: 58,
    right: 16,
    zIndex: 20,
    flexDirection: "row",
    gap: 10,
  },

  langChip: {
    minWidth: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  langChipActive: {
    backgroundColor: "rgba(124,247,216,0.12)",
    borderColor: "rgba(124,247,216,0.28)",
  },

  langTxt: {
    color: "rgba(255,255,255,0.72)",
    fontWeight: "900",
    fontSize: 16,
  },

  langTxtActive: {
    color: "#7cf7d8",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  rabbitCard: {
    width: "100%",
    alignItems: "center",
    marginBottom: 26,
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  rabbitAura: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    top: 8,
    backgroundColor: "rgba(124,247,216,0.16)",
  },

  rabbit: {
    width: 100,
    height: 100,
    borderRadius: 24,
    marginBottom: 12,
  },

  follow: {
    color: "#7cf7d8",
    fontWeight: "900",
    letterSpacing: 3,
    fontSize: 16,
  },

  system: {
    color: "rgba(255,255,255,0.64)",
    fontSize: 13,
    marginTop: 6,
    letterSpacing: 2,
    textAlign: "center",
  },

  title: {
    fontSize: 42,
    color: "white",
    fontWeight: "900",
    letterSpacing: 6,
    textAlign: "center",
  },

  subtitle: {
    color: "rgba(255,255,255,0.42)",
    letterSpacing: 5,
    marginTop: 10,
    marginBottom: 24,
    textAlign: "center",
    fontSize: 15,
  },

  quote: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    fontWeight: "900",
    lineHeight: 36,
  },

  desc: {
    color: "rgba(255,255,255,0.78)",
    textAlign: "center",
    marginTop: 18,
    lineHeight: 25,
    fontSize: 16,
  },

  enterBtn: {
    marginTop: 30,
    minWidth: "100%",
    borderRadius: 28,
    backgroundColor: "rgba(145,110,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(203,188,255,0.22)",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  keyWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  enterIcon: {
    fontSize: 25,
  },

  enterMid: {
    flex: 1,
    paddingHorizontal: 16,
  },

  enterTxt: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
  },

  enterSubTxt: {
    color: "rgba(255,255,255,0.72)",
    marginTop: 4,
    fontSize: 14,
  },

  arrowWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  arrowTxt: {
    color: "white",
    fontSize: 30,
    lineHeight: 30,
    fontWeight: "500",
  },

  whisper: {
    marginTop: 18,
    color: "rgba(255,255,255,0.42)",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
  },
});
