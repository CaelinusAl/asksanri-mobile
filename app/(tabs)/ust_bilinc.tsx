// app/(tabs)/ust_bilinc.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ImageBackground,
  StatusBar,
  StyleSheet as RNStyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { hasVipEntitlement } from "../../lib/premium";
import { WORLD_EVENTS_PINNED_URL } from "../../lib/config";
import MatrixRain from "../../lib/MatrixRain";

type Lang = "tr" | "en";

type PinnedEvent = {
  id: string;
  title: string;
  subtitle?: string;
  reading_tr: string;
  reading_en?: string;
  source_url?: string;
  created_at?: string;
  tags?: string[];
  meta?: any;
} | null;

type Level = {
  id: 1 | 2 | 3 | 4 | 5;
  titleTR: string;
  titleEN: string;
  subTR: string;
  subEN: string;
  premium?: boolean;
  route: string;
};

const BG = require("../../assets/sanri_glass_bg.jpg");
const AY_CICEGI = require("../../assets/ay_cicegi.jpg");

const FALLBACK = {
  tr: {
    title: "🌻 Haftanın Sembolü",
    subtitle: "Altın Oran – Işığa Dönen Merkez",
    text:
      "Kaos sandığın şey, düzenin görünmeyen hâlidir.\n\n" +
      "Fibonacci spiral rastgele değil.\n" +
      "Doğa hesap yapmaz, oranla işler.",
  },
  en: {
    title: "🌻 Symbol of the Week",
    subtitle: "Golden Ratio – Center of Light",
    text:
      "What you call chaos is hidden order.\n\n" +
      "The Fibonacci spiral is not random.\n" +
      "Nature does not calculate — it flows by ratio.",
  },
} as const;

const LEVELS: Level[] = [
  {
    id: 1,
    titleTR: "Level 1 — Gözlemci",
    titleEN: "Level 1 — Observer",
    subTR: "Gözlem. Nefes. Basit veri.",
    subEN: "Observe. Breathe. Simple data.",
    route: "/(tabs)/observer",
  },
  {
    id: 2,
    titleTR: "Level 2 — Örüntü",
    titleEN: "Level 2 — Pattern",
    subTR: "Tekrarlayan motifleri gör.",
    subEN: "See repeating motifs.",
    route: "/(tabs)/pattern",
  },
  {
    id: 3,
    titleTR: "Level 3 — Sembol 🔒",
    titleEN: "Level 3 — Symbol 🔒",
    subTR: "Sembol okuma: olay → mesaj.",
    subEN: "Symbol reading: event → message.",
    premium: true,
    route: "/(tabs)/symbol",
  },
  {
    id: 4,
    titleTR: "Level 4 — Sistem 🔒",
    titleEN: "Level 4 — System 🔒",
    subTR: "Sistem haritası: aktörler, roller.",
    subEN: "System map: actors, roles.",
    premium: true,
    route: "/(tabs)/system_map",
  },
  {
    id: 5,
    titleTR: "Level 5 — Kod Gözü 🔒",
    titleEN: "Level 5 — Code Eye 🔒",
    subTR: "Her şeye 'kod' olarak bak.",
    subEN: "Look at everything as code.",
    premium: true,
    route: "/(tabs)/code_eye",
  },
];

const T = {
  tr: {
    kicker: "SYSTEM TERMINAL",
    title: "SYSTEM VIEW",
    subtitle: "Gerçeklik bir simülasyondur. Yorumlamak senin seçimin.",
    open: "Aç",
    vip: "VIP",
    loading: "Vitrin yükleniyor…",
    back: "Kapılar",
  },
  en: {
    kicker: "SYSTEM TERMINAL",
    title: "SYSTEM VIEW",
    subtitle: "Reality is a simulation. Interpretation is your choice.",
    open: "Open",
    vip: "VIP",
    loading: "Loading showcase…",
    back: "Gates",
  },
} as const;

function firstLines(text: string, maxLines = 5) {
  const lines = (text || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
  return lines.slice(0, maxLines).join("\n");
}

export default function UstBilincScreen() {
  const [lang, setLang] = useState<Lang>("tr");
  const [pinned, setPinned] = useState<PinnedEvent>(null);
  const [loadingPinned, setLoadingPinned] = useState(true);
  const [isVip, setIsVip] = useState(false);

  const theme = useMemo(
    () => ({
      accent: "#7cf7d8",
      primary: "rgba(94,59,255,0.78)",
      card: "rgba(255,255,255,0.06)",
      stroke: "rgba(255,255,255,0.12)",
    }),
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const ok = await hasVipEntitlement();
        setIsVip(Boolean(ok));
      } catch {
        setIsVip(false);
      }
    })();
  }, []);

  useEffect(() => {
    let alive = true;
    setLoadingPinned(true);

    fetch(WORLD_EVENTS_PINNED_URL)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        setPinned(data || null);
        setLoadingPinned(false);
      })
      .catch(() => {
        if (!alive) return;
        setPinned(null);
        setLoadingPinned(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const openLevel = (lvl: Level) => {
    if (lvl.premium && !isVip) {
      router.push({ pathname: "/(tabs)/vip", params: { lang } } as any);
      return;
    }
    router.push({ pathname: lvl.route, params: { lang } } as any);
  };

  const showcaseTitle =
    pinned?.title
      ? lang === "tr"
        ? "🌻 Haftanın Sembolü"
        : "🌻 Symbol of the Week"
      : FALLBACK[lang].title;

  const showcaseSubtitle = pinned?.title ? pinned.title : FALLBACK[lang].subtitle;

  const pinnedText =
    lang === "tr"
      ? pinned?.reading_tr || ""
      : pinned?.reading_en || pinned?.reading_tr || "";

  const showcaseText = pinned?.title ? firstLines(pinnedText, 5) : FALLBACK[lang].text;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* BACKGROUND */}
      <ImageBackground source={BG} style={RNStyleSheet.absoluteFillObject} resizeMode="cover" />

      {/* MATRIX LAYER */}
      <View pointerEvents="none" style={RNStyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.14} />
      </View>

      {/* DARK OVERLAY */}
      <View pointerEvents="none" style={styles.overlay} />

      {/* TOP BAR */}
      <View style={styles.topbar}>
        <Pressable onPress={() => router.replace("/(tabs)/gates")} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLbl}>{T[lang].back}</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <View style={styles.langRow}>
          <Pressable
            onPress={() => setLang("tr")}
            style={[styles.langChip, lang === "tr" && styles.langChipActive]}
            hitSlop={10}
          >
            <Text style={[styles.langTxt, lang === "tr" && styles.langTxtActive]}>TR</Text>
          </Pressable>
          <Pressable
            onPress={() => setLang("en")}
            style={[styles.langChip, lang === "en" && styles.langChipActive]}
            hitSlop={10}
          >
            <Text style={[styles.langTxt, lang === "en" && styles.langTxtActive]}>EN</Text>
          </Pressable>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>{T[lang].kicker}</Text>
        <Text style={styles.h1}>{T[lang].title}</Text>
        <Text style={styles.sub}>{T[lang].subtitle}</Text>

        {/* SHOWCASE */}
        <View style={styles.showcaseWrap}>
          <ImageBackground
            source={AY_CICEGI}
            resizeMode="cover"
            style={styles.showcaseImage}
            imageStyle={{ borderRadius: 22 }}
          >
            <BlurView intensity={35} tint="dark" style={styles.showcaseCard}>
              <Text style={styles.showcaseTitle}>{showcaseTitle}</Text>
              <Text style={styles.showcaseSubtitle}>
                {loadingPinned ? T[lang].loading : showcaseSubtitle}
              </Text>
              <Text style={styles.showcaseText}>{showcaseText}</Text>
            </BlurView>
          </ImageBackground>
        </View>

        {/* LEVELS */}
        <View style={styles.levelCard}>
          {LEVELS.map((lvl) => (
            <View key={lvl.id} style={styles.levelRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.levelTitle}>{lang === "tr" ? lvl.titleTR : lvl.titleEN}</Text>
                <Text style={styles.levelSub}>{lang === "tr" ? lvl.subTR : lvl.subEN}</Text>
              </View>

              <Pressable
                onPress={() => openLevel(lvl)}
                style={[
                  styles.btn,
                  {
                    backgroundColor: lvl.premium ? "rgba(255,255,255,0.08)" : theme.primary,
                    borderColor: lvl.premium ? "rgba(255,255,255,0.12)" : "rgba(94,59,255,0.35)",
                  },
                ]}
              >
                <Text style={styles.btnTxt}>{lvl.premium ? T[lang].vip : T[lang].open}</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* bottom safe gap */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  overlay: { ...RNStyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },

  topbar: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backArrow: { color: "#7cf7d8", fontSize: 18, fontWeight: "900" },
  backLbl: { color: "rgba(255,255,255,0.75)", fontWeight: "800" },

  langRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  langChipActive: {
    backgroundColor: "rgba(124,247,216,0.12)",
    borderColor: "rgba(124,247,216,0.28)",
  },
  langTxt: { color: "rgba(255,255,255,0.7)", fontWeight: "900", letterSpacing: 1 },
  langTxtActive: { color: "#7cf7d8" },

  container: { padding: 18, paddingTop: 6 },

  kicker: { color: "rgba(255,255,255,0.55)", letterSpacing: 2, fontWeight: "800", marginBottom: 8 },
  h1: { color: "white", fontSize: 44, fontWeight: "900", lineHeight: 48 },
  sub: { color: "rgba(255,255,255,0.72)", marginTop: 10, marginBottom: 18, fontSize: 16, lineHeight: 22 },

  showcaseWrap: { marginBottom: 18 },
  showcaseImage: { borderRadius: 22, overflow: "hidden" },
  showcaseCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: "rgba(94,59,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  showcaseTitle: { color: "#7cf7d8", fontWeight: "900", fontSize: 16 },
  showcaseSubtitle: { color: "white", marginTop: 6, fontSize: 18, fontWeight: "900" },
  showcaseText: { color: "rgba(255,255,255,0.9)", marginTop: 10, lineHeight: 22, fontSize: 14 },

  levelCard: {
    borderRadius: 22,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  levelRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  levelTitle: { color: "white", fontWeight: "900", fontSize: 18 },
  levelSub: { color: "rgba(255,255,255,0.7)", marginTop: 4 },

  btn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  btnTxt: { color: "white", fontWeight: "900" },
});