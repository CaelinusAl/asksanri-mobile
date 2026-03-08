// app/(tabs)/rituals.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ImageBackground,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";

import MatrixRain from "../../lib/MatrixRain";
import { apiGetJson, API } from "@/lib/apiClient";

type Lang = "tr" | "en";

type RitualPackListItem = {
  ritual_pack_id: string;
  title?: string;
  description?: string;
  mode?: string;
};

const BG = require("../../assets/sanri_glass_bg.jpg");

const FALLBACK: RitualPackListItem[] = [
  {
    ritual_pack_id: "tanricanin_hatirlayisi",
    title: "𓆸 Tanrıçanın Hatırlayışı",
    description:
      "Bu ritüeller yorumlanmaz. Sorulmaz. Açıklanmaz. Okunur ve hissedilir.",
    mode: "read_only",
  },
];

export default function RitualsScreen() {
  const params = useLocalSearchParams<{ lang?: string }>();
  const lang: Lang = String(params.lang || "tr").toLowerCase() === "en" ? "en" : "tr";

  const [items, setItems] = useState<RitualPackListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const title = useMemo(
    () => (lang === "tr" ? "RİTÜEL ALANI" : "RITUAL SPACE"),
    [lang]
  );

  const sub = useMemo(
    () =>
      lang === "tr"
        ? "Okunur ve hissedilir. Açıklama yok. Soru yok."
        : "Read and feel. No explanation. No question.",
    [lang]
  );

  const glow1 = useRef(new Animated.Value(0.35)).current;
  const glow2 = useRef(new Animated.Value(0.2)).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow1, {
            toValue: 0.75,
            duration: 2800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glow1, {
            toValue: 0.35,
            duration: 2800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow2, {
            toValue: 0.5,
            duration: 3600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glow2, {
            toValue: 0.18,
            duration: 3600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatY, {
            toValue: -8,
            duration: 3200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatY, {
            toValue: 8,
            duration: 3200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.sequence([
        Animated.timing(titleFade, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [glow1, glow2, floatY, titleFade, contentFade]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const data = await apiGetJson(API.ritualPacks, 20000);

        const list = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : [];

        if (!alive) return;

        setItems(list.length ? list : FALLBACK);
      } catch (e: any) {
        if (!alive) return;
        setErr(String(e?.message || e || "unknown_error"));
        setItems(FALLBACK);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  function goBack() {
    router.back();
  }

  function openPack(id: string) {
    router.push({
      pathname: "/ritual/[id]",
      params: { id, lang },
    });
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={BG}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.12} />
      </View>

      <View pointerEvents="none" style={styles.overlay} />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.orb,
          styles.orbTop,
          { opacity: glow1, transform: [{ translateY: floatY }] },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.orb,
          styles.orbBottom,
          { opacity: glow2, transform: [{ translateY: Animated.multiply(floatY, -1) }] },
        ]}
      />

      <View style={styles.topbar}>
        <Pressable onPress={goBack} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <View style={styles.langPill}>
          <Text style={styles.langTxt}>{lang.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: titleFade, transform: [{ translateY: floatY }] }}>
          <Text style={styles.h1}>{title}</Text>
          <Text style={styles.sub}>{sub}</Text>
        </Animated.View>

        {loading ? (
          <Text style={styles.note}>{lang === "tr" ? "Yükleniyor…" : "Loading…"}</Text>
        ) : null}

        {err ? <Text style={styles.err}>Hata: {err}</Text> : null}

        <Animated.View style={{ opacity: contentFade }}>
          <View style={{ height: 20 }} />

          {items.map((it, index) => (
            <Pressable
              key={it.ritual_pack_id}
              onPress={() => openPack(it.ritual_pack_id)}
              style={({ pressed }) => [
                styles.ritualCard,
                pressed && { transform: [{ scale: 0.985 }] },
                index === 0 && styles.featuredCard,
              ]}
              hitSlop={12}
            >
              <BlurView intensity={34} tint="dark" style={styles.ritualGlass}>
                <View style={styles.sigilWrap}>
                  <Text style={styles.sigil}>✶</Text>
                </View>

                <View style={styles.ritualHeader}>
                  <Text style={styles.ritualTitle}>
                    {it.title || it.ritual_pack_id}
                  </Text>
                </View>

                <Text style={styles.ritualDesc}>{it.description || ""}</Text>

                <View style={styles.ritualLine} />

                <View style={styles.ritualOpenRow}>
                  <Text style={styles.ritualOpen}>
                    {lang === "tr" ? "Ritüeli Aç →" : "Open Ritual →"}
                  </Text>
                </View>
              </BlurView>
            </Pressable>
          ))}

          <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#07080d",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2,6,12,0.42)",
  },

  orb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#8f7bff",
  },

  orbTop: {
    width: 280,
    height: 280,
    top: 140,
    left: -70,
    shadowColor: "#8f7bff",
    shadowOpacity: 0.45,
    shadowRadius: 45,
  },

  orbBottom: {
    width: 260,
    height: 260,
    bottom: 90,
    right: -40,
    backgroundColor: "#58ffd5",
    shadowColor: "#58ffd5",
    shadowOpacity: 0.25,
    shadowRadius: 40,
  },

  topbar: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  backTxt: {
    color: "#d7fff6",
    fontSize: 20,
    fontWeight: "900",
  },

  langPill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "rgba(94,59,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.38)",
  },

  langTxt: {
    color: "#cbbcff",
    fontWeight: "900",
    letterSpacing: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 40,
  },

  h1: {
    color: "white",
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  sub: {
    color: "rgba(255,255,255,0.74)",
    marginTop: 10,
    lineHeight: 24,
    fontSize: 16,
    maxWidth: "92%",
  },

  note: {
    color: "rgba(255,255,255,0.55)",
    marginTop: 14,
  },

  err: {
    color: "#ff7a97",
    marginTop: 14,
    lineHeight: 20,
  },

  ritualCard: {
    borderRadius: 28,
    overflow: "hidden",
    marginTop: 18,
  },

  featuredCard: {
    shadowColor: "#8f7bff",
    shadowOpacity: 0.22,
    shadowRadius: 24,
  },

  ritualGlass: {
    padding: 22,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(18,24,44,0.34)",
  },

  sigilWrap: {
    position: "absolute",
    right: 16,
    top: 10,
    opacity: 0.14,
  },

  sigil: {
    fontSize: 64,
    color: "#b59cff",
    fontWeight: "700",
  },

  ritualHeader: {
    marginBottom: 10,
    paddingRight: 44,
  },

  ritualTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#7cf7d8",
    letterSpacing: 0.4,
    textShadowColor: "rgba(124,247,216,0.25)",
    textShadowRadius: 12,
  },

  ritualDesc: {
    fontSize: 16,
    color: "rgba(255,255,255,0.82)",
    lineHeight: 25,
    marginTop: 2,
  },

  ritualLine: {
    marginTop: 18,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  ritualOpenRow: {
    marginTop: 14,
    alignItems: "flex-end",
  },

  ritualOpen: {
    color: "#bafcf0",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },
});