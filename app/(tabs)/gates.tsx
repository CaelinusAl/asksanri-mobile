// app/(tabs)/gates.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain"; // sende farklı klasördeyse path’i düzelt

type Lang = "tr" | "en";

const COPY = {
  tr: {
    title: "Kapılar",
    sub: "Hangi alana geçmek istiyorsun?",
    back: "Geri",
    locked: "LOCKED",
    items: [
      { key: "sanri", title: "SANRI", sub: "Kişisel yansıma alanı", route: "/(tabs)/sanri_flow", premium: false, icon: "◉" },
      { key: "cities", title: "AWAKENED CITIES", sub: "Şehrin kodunu seç", route: "/(tabs)/explore", premium: false, icon: "▣" },
      { key: "matrix", title: "MATRIX", sub: "Akışı decode et", route: "/(tabs)/matrix", premium: false, icon: "⬡" },
      { key: "ust", title: "ÜST BİLİNÇ", sub: "Seviye 1–5 katmanları", route: "/(tabs)/ust_bilinc", premium: true, icon: "✶" },
      { key: "world", title: "DÜNYA OLAYLARI", sub: "Haber → mesaj okuması", route: "/(tabs)/world_events", premium: true, icon: "⌁" },
    ],
  },
  en: {
    title: "Gates",
    sub: "Choose your door.",
    back: "Back",
    locked: "LOCKED",
    items: [
      { key: "sanri", title: "SANRI", sub: "Personal reflection field", route: "/(tabs)/sanri_flow", premium: false, icon: "◉" },
      { key: "cities", title: "AWAKENED CITIES", sub: "Choose a city code", route: "/(tabs)/explore", premium: false, icon: "▣" },
      { key: "matrix", title: "MATRIX", sub: "Decode the stream", route: "/(tabs)/matrix", premium: false, icon: "⬡" },
      { key: "ust", title: "HIGHER MIND", sub: "Levels 1–5 layers", route: "/(tabs)/ust_bilinc", premium: true, icon: "✶" },
      { key: "world", title: "WORLD EVENTS", sub: "News → meaning", route: "/(tabs)/world_events", premium: true, icon: "⌁" },
    ],
  },
} as const;

export default function GatesScreen() {
  const [lang, setLang] = useState<Lang>("tr");

  // Demo: VIP false. Sonra RevenueCat ile isVip bağlarız.
  const [isVip] = useState(false);

  // hologram pulse anim
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const glowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.34] });
  const glowScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });

  const theme = useMemo(
    () => ({
      bg: ["#07080d", "#12082a", "#050610"] as [string, string, string],
      card: "rgba(255,255,255,0.06)",
      stroke: "rgba(255,255,255,0.10)",
      accent: "#7cf7d8",
      primaryA: "rgba(94,59,255,0.85)",
      primaryB: "rgba(124,247,216,0.18)",
    }),
    []
  );

  const t = COPY[lang];

  return (
    <View style={styles.root}>
      {/* Base gradient */}
      <LinearGradient colors={theme.bg} style={StyleSheet.absoluteFillObject} />

      {/* Matrix rain: CANLI */}
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.22} speedMs={9000} />
      </View>

      {/* Readability veil */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.28)" }]} />

      {/* Soft corner glows */}
      <View pointerEvents="none" style={styles.glowTL} />
      <View pointerEvents="none" style={styles.glowBR} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>{t.title}</Text>
          <Text style={styles.sub}>{t.sub}</Text>

          <View style={styles.langRow}>
            <Pressable
              onPress={() => setLang("tr")}
              style={[styles.langChip, lang === "tr" && styles.langChipActive]}
              hitSlop={10}
            >
              <Text style={[styles.langText, lang === "tr" && { color: theme.accent }]}>TR</Text>
            </Pressable>

            <Pressable
              onPress={() => setLang("en")}
              style={[styles.langChip, lang === "en" && styles.langChipActive]}
              hitSlop={10}
            >
              <Text style={[styles.langText, lang === "en" && { color: theme.accent }]}>EN</Text>
            </Pressable>
          </View>
        </View>

        {/* Back */}
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>
      </View>

      {/* Cards */}
      <View style={styles.list}>
        {t.items.map((it) => {
          const locked = it.premium && !isVip;

          return (
            <Pressable
              key={it.key}
              onPress={() => {
                if (locked) {
                  router.push({ pathname: "/(tabs)/vip", params: { lang } } as any);
                  return;
                }
                router.push(it.route as any);
              }}
              style={[styles.cardWrap]}
            >
              {/* glow ring */}
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.cardGlow,
                  {
                    opacity: glowOpacity,
                    transform: [{ scale: glowScale }],
                  },
                ]}
              >
                <LinearGradient
                  colors={["rgba(94,59,255,0.55)", "rgba(124,247,216,0.18)", "rgba(94,59,255,0.35)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
              </Animated.View>

              {/* main card */}
              <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.stroke }]}>
                <View style={styles.iconBox}>
                  <Text style={styles.iconTxt}>{it.icon}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.row}>
                    <Text style={styles.cardTitle}>{it.title}</Text>

                    {it.premium ? (
                      <View style={[styles.badge, locked ? styles.badgeLocked : styles.badgeVip]}>
                        <Text style={styles.badgeTxt}>{locked ? t.locked : "VIP"}</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.cardSub}>{it.sub}</Text>
                </View>

                <Text style={styles.chev}>{locked ? "🔒" : "›"}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Bottom */}
      <View style={{ height: Platform.OS === "ios" ? 26 : 18 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  glowTL: {
    position: "absolute",
    left: -120,
    top: -80,
    width: 420,
    height: 420,
    borderRadius: 420,
    backgroundColor: "rgba(94,59,255,0.14)",
  },
  glowBR: {
    position: "absolute",
    right: -140,
    bottom: -120,
    width: 480,
    height: 480,
    borderRadius: 480,
    backgroundColor: "rgba(124,247,216,0.08)",
  },

  header: {
    paddingTop: 22,
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  h1: { color: "white", fontSize: 44, fontWeight: "900", letterSpacing: 1 },
  sub: { color: "rgba(255,255,255,0.70)", marginTop: 10, lineHeight: 20 },

  langRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  langChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  langChipActive: { backgroundColor: "rgba(124,247,216,0.12)", borderColor: "rgba(124,247,216,0.25)" },
  langText: { color: "rgba(255,255,255,0.75)", fontWeight: "900" },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  backTxt: { color: "white", fontWeight: "900", fontSize: 18 },

  list: { paddingHorizontal: 18, paddingTop: 10, gap: 14 },

  cardWrap: { borderRadius: 22 },
  cardGlow: {
    position: "absolute",
    left: -6,
    right: -6,
    top: -6,
    bottom: -6,
    borderRadius: 26,
    overflow: "hidden",
  },

  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(94,59,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.22)",
  },
  iconTxt: { color: "white", fontWeight: "900", fontSize: 16 },

  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  cardTitle: { color: "white", fontWeight: "900", letterSpacing: 1, fontSize: 20 },
  cardSub: { color: "rgba(255,255,255,0.62)", marginTop: 6 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeVip: { backgroundColor: "rgba(124,247,216,0.14)", borderColor: "rgba(124,247,216,0.25)" },
  badgeLocked: { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.10)" },
  badgeTxt: { color: "white", fontWeight: "900", fontSize: 11, letterSpacing: 1 },

  chev: { color: "rgba(255,255,255,0.65)", fontSize: 22, fontWeight: "900" },
});