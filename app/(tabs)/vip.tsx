// app/(tabs)/vip.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, StatusBar, Image, Animated, Easing, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";

import MatrixRain from "../../lib/MatrixRain";

type Lang = "tr" | "en";

const RABBIT = require("../../assets/rabbit.jpg");

const T = {
  tr: {
    kicker: "SANRI • PREMIUM GATE",
    title: "VIP Katmanı",
    sub: "Level 3–4–5 burada açılır. Sembol → Sistem → Kod Gözü.",
    rabbit: "FOLLOW THE RABBIT",
    rabbitSub: "You’re not here by accident.",
    bullets: [
      "Level 3 — Sembol okuma (olay → mesaj)",
      "Level 4 — Sistem haritası (aktörler, roller)",
      "Level 5 — Kod gözü (sayı/harf/kalıp çözümleme)",
      "VIP: Derin okuma + ritüel + kayıt",
    ],
    cta: "VIP Kapısını Aç (Yakında)",
    alt: "Şimdilik kapı kapalı. Yakında ödeme + üyelik aktif.",
    back: "← Geri",
  },
  en: {
    kicker: "SANRI • PREMIUM GATE",
    title: "VIP Layer",
    sub: "Levels 3–4–5 unlock here. Symbol → System → Code Eye.",
    rabbit: "FOLLOW THE RABBIT",
    rabbitSub: "You’re not here by accident.",
    bullets: [
      "Level 3 — Symbol reading (event → message)",
      "Level 4 — System map (actors, roles)",
      "Level 5 — Code eye (numbers/letters/patterns)",
      "VIP: Deep reading + ritual + archive",
    ],
    cta: "Unlock VIP Gate (Coming soon)",
    alt: "Gate is closed for now. Payments + membership soon.",
    back: "← Back",
  },
} as const;

export default function VipScreen() {
  const params = useLocalSearchParams<{ lang?: string }>();
  const lang: Lang = String(params.lang || "tr").toLowerCase() === "en" ? "en" : "tr";
  const [handshaking, setHandshaking] = useState(false);

  const bg = useMemo<[string, string, string]>(() => ["#07080d", "#14072e", "#050610"], []);

  // subtle premium motion
  const breathe = useRef(new Animated.Value(0)).current;
  const scan = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );

    const b = Animated.loop(
      Animated.timing(scan, { toValue: 1, duration: 2600, easing: Easing.linear, useNativeDriver: true })
    );

    a.start();
    b.start();
    return () => {
      a.stop();
      b.stop();
    };
  }, [breathe, scan]);

  const glowScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const glowOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.30, 0.60] });
  const scanY = scan.interpolate({ inputRange: [0, 1], outputRange: [-220, 220] });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={bg} style={StyleSheet.absoluteFillObject} />

      {/* matrix rain subtle */}
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.10} speedMs={9800} />
      </View>

      {/* veil for readability */}
      <View pointerEvents="none" style={styles.veil} />

      <View style={styles.wrap}>
        {/* Rabbit Portal */}
        <View style={styles.portalWrap}>
          <Animated.View
            pointerEvents="none"
            style={[styles.portalGlow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}
          />
          <View style={styles.portalCard}>
            <Animated.View pointerEvents="none" style={[styles.scanline, { transform: [{ translateY: scanY }] }]} />
            <View style={styles.rabbitFrame}>
              <Image source={RABBIT} style={styles.rabbitImg} resizeMode="contain" />
              <View pointerEvents="none" style={styles.rabbitTint} />
            </View>

            <Text style={styles.rabbitTag}>{T[lang].rabbit}</Text>
            <Text style={styles.rabbitSub}>{T[lang].rabbitSub}</Text>
          </View>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          <Text style={styles.kicker}>{T[lang].kicker}</Text>
          <Text style={styles.title}>{T[lang].title}</Text>
          <Text style={styles.sub}>{T[lang].sub}</Text>

          <View style={styles.list}>
            {T[lang].bullets.map((b, i) => (
              <Text key={i} style={styles.bullet}>
                • {b}
              </Text>
            ))}
          </View>

          <Pressable
  style={[styles.cta, handshaking && { opacity: 0.85 }]}
  onPress={() => {
    if (handshaking) return;
    setHandshaking(true);
    setTimeout(() => setHandshaking(false), 1200);
  }}
  hitSlop={12}
>
  <Text style={styles.ctaText}>
    {handshaking
      ? lang === "tr"
        ? "Gate handshake…"
        : "Gate handshake…"
      : T[lang].cta}
  </Text>
</Pressable>

{handshaking ? (
  <View pointerEvents="none" style={styles.handshakeBar}>
    <Animated.View
      style={[
        styles.handshakeGlow,
        { transform: [{ translateX: scanY }] }, // scanY zaten var, kullanıyoruz
      ]}
    />
  </View>
) : null}

          <Text style={styles.alt}>{T[lang].alt}</Text>

          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Text style={styles.backTxt}>{T[lang].back}</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>CAELINUS AI • CONSCIOUSNESS MIRROR</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },

  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.18)" },

  handshakeBar: {
  marginTop: 10,
  height: 10,
  borderRadius: 999,
  overflow: "hidden",
  backgroundColor: "rgba(255,255,255,0.06)",
  borderWidth: 1,
  borderColor: "rgba(124,247,216,0.14)",
},

handshakeGlow: {
  width: 180,
  height: 10,
  borderRadius: 999,
  backgroundColor: "rgba(124,247,216,0.35)",
},

  wrap: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
  },

  // Portal
  portalWrap: { alignItems: "center", marginBottom: 14 },
  portalGlow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: "rgba(124,247,216,0.10)",
  },
  portalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 26,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.16)",
    overflow: "hidden",
    alignItems: "center",
  },
  scanline: {
    position: "absolute",
    left: -40,
    right: -40,
    height: 70,
    backgroundColor: "rgba(124,247,216,0.06)",
  },
  rabbitFrame: {
    width: 170,
    height: 170,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginTop: 4,
  },
  rabbitImg: { width: 150, height: 150 },
  rabbitTint: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(94,59,255,0.10)" },

  rabbitTag: {
    marginTop: 12,
    color: "rgba(124,247,216,0.80)",
    letterSpacing: 4,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },
  rabbitSub: {
    marginTop: 6,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 1.6,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },

  // Main card
  card: {
    borderRadius: 26,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.16)",
  },

  kicker: {
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 10,
    textAlign: "center",
  },
  title: { color: "white", fontSize: 30, fontWeight: "900", textAlign: "center" },
  sub: { color: "rgba(255,255,255,0.70)", marginTop: 10, lineHeight: 20, textAlign: "center" },

  list: { marginTop: 16, gap: 8 },
  bullet: { color: "rgba(255,255,255,0.85)", lineHeight: 20 },

  cta: {
    marginTop: 18,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(94,59,255,0.90)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  ctaText: { color: "white", fontWeight: "900", letterSpacing: 1 },

  alt: { marginTop: 12, color: "rgba(255,255,255,0.45)", fontSize: 12, textAlign: "center" },

  backBtn: { marginTop: 14, alignItems: "center" },
  backTxt: { color: "#7cf7d8", fontWeight: "900" },

  footer: {
    marginTop: 12,
    textAlign: "center",
    color: "rgba(255,255,255,0.22)",
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "800",
    paddingBottom: Platform.OS === "ios" ? 6 : 2,
  },
});