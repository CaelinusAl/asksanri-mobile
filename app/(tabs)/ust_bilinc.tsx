// app/(tabs)/ust_bilinc.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  ImageBackground,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import TopMenu from "../../components/TopMenu";
import { hasVipEntitlement } from "../../lib/premium";

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
  intent: string;
};

const API_BASE = "https://api.asksanri.com";
const AY_CICEGI = require("../../assets/ay_cicegi.jpg");

const FALLBACK = {
  tr: {
    title: "🌻 Haftanın Sembolü",
    subtitle: "Altın Oran – Işığa Dönen Merkez",
    text:
      "Kaos sandığın şey, düzenin görünmeyen hâlidir.\n\n" +
      "Fibonacci spiral rastgele değil.\n" +
      "Doğa hesap yapmaz, oranla işler.",
    cta: "Derin Sembol Okumasını Aç",
  },
  en: {
    title: "🌻 Symbol of the Week",
    subtitle: "Golden Ratio – Center of Light",
    text:
      "What you call chaos is hidden order.\n\n" +
      "The Fibonacci spiral is not random.\n" +
      "Nature does not calculate — it flows by ratio.",
    cta: "Open Deep Symbol Reading",
  },
} as const;

const LEVELS: Level[] = [
  {
    id: 1,
    titleTR: "Level 1 — Gözlemci",
    titleEN: "Level 1 — Observer",
    subTR: "Gözlem. Nefes. Basit veri.",
    subEN: "Observe. Breathe. Simple data.",
    intent: "observer",
  },
  {
    id: 2,
    titleTR: "Level 2 — Örüntü",
    titleEN: "Level 2 — Pattern",
    subTR: "Tekrarlayan motifleri gör.",
    subEN: "See repeating motifs.",
    intent: "pattern",
  },
  {
    id: 3,
    titleTR: "Level 3 — Sembol 🔒",
    titleEN: "Level 3 — Symbol 🔒",
    subTR: "Sembol okuma: olay → mesaj.",
    subEN: "Symbol reading: event → message.",
    premium: true,
    intent: "symbol",
  },
  {
    id: 4,
    titleTR: "Level 4 — Sistem 🔒",
    titleEN: "Level 4 — System 🔒",
    subTR: "Sistem haritası: aktörler, roller.",
    subEN: "System map: actors, roles.",
    premium: true,
    intent: "system_map",
  },
  {
    id: 5,
    titleTR: "Level 5 — Kod Gözü 🔒",
    titleEN: "Level 5 — Code Eye 🔒",
    subTR: "Her şeye 'kod' olarak bak.",
    subEN: "Look at everything as code.",
    premium: true,
    intent: "code_eye",
  },
];

const T = {
  tr: {
    title: "SYSTEM VIEW",
    subtitle: "Gerçeklik bir simülasyondur. Yorumlamak senin seçimin.",
    open: "Aç",
    premium: "Premium",
    premiumHint: "Bu katman Premium. VIP ile açılır.",
    world: "🌍 Dünya Olayları",
    map: "🧬 Sistem Haritası",
    vision: "👁 Kod Görme Modu",
    loading: "Vitrin yükleniyor…",
  },
  en: {
    title: "SYSTEM VIEW",
    subtitle: "Reality is a simulation.",
    open: "Open",
    premium: "Premium",
    premiumHint: "This layer is Premium.",
    world: "🌍 World Events",
    map: "🧬 System Map",
    vision: "👁 Code Vision Mode",
    loading: "Loading showcase…",
  },
} as const;

function firstLines(text: string, maxLines = 4) {
  const lines = (text || "").split("\n").map((x) => x.trim()).filter(Boolean);
  return lines.slice(0, maxLines).join("\n");
}

export default function UstBilincScreen() {
  const [lang, setLang] = useState<Lang>("tr");
  const [pinned, setPinned] = useState<PinnedEvent>(null);
  const [loadingPinned, setLoadingPinned] = useState(true);
  const [isVip, setIsVip] = useState(false);

  const theme = useMemo(() => ({
    bg: ["#07080d", "#12082a", "#050610"] as [string, string, string],
    accent: "#7cf7d8",
    primary: "rgba(94,59,255,0.75)",
    card: "rgba(255,255,255,0.06)",
    stroke: "rgba(255,255,255,0.10)",
  }), []);

  useEffect(() => {
    hasVipEntitlement().then(setIsVip);
  }, []);

  useEffect(() => {
    let alive = true;
    setLoadingPinned(true);

    fetch(API_BASE + "/world-events/pinned")
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
    if (lvl.id === 1) {
      router.push({ pathname: "/(tabs)/observer", params: { lang } } as any);
      return;
    }

    if (lvl.id === 2) {
      router.push({ pathname: "/(tabs)/pattern", params: { lang } } as any);
      return;
    }

    if (lvl.premium && !isVip) {
      router.push({ pathname: "/(tabs)/vip", params: { lang } } as any);
      return;
    }

  
  };

  const showcaseTitle =
    pinned?.title
      ? (lang === "tr" ? "🌻 Haftanın Sembolü" : "🌻 Symbol of the Week")
      : FALLBACK[lang].title;

  const showcaseSubtitle =
    pinned?.title ? pinned.title : FALLBACK[lang].subtitle;

  const pinnedText =
    lang === "tr"
      ? pinned?.reading_tr || ""
      : pinned?.reading_en || pinned?.reading_tr || "";

  const showcaseText =
    pinned?.title
      ? firstLines(pinnedText, 5)
      : FALLBACK[lang].text;

  return (
    <View style={styles.root}>
      <LinearGradient colors={theme.bg} style={StyleSheet.absoluteFillObject} />
      <TopMenu />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>{T[lang].title}</Text>
        <Text style={styles.sub}>{T[lang].subtitle}</Text>

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

        <View style={styles.levelCard}>
          {LEVELS.map((lvl) => (
            <View key={lvl.id} style={styles.levelRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.levelTitle}>
                  {lang === "tr" ? lvl.titleTR : lvl.titleEN}
                </Text>
                <Text style={styles.levelSub}>
                  {lang === "tr" ? lvl.subTR : lvl.subEN}
                </Text>
              </View>

              <Pressable
                onPress={() => openLevel(lvl)}
                style={[
                  lvl.premium ? styles.premiumBtn : styles.openBtn,
                  { backgroundColor: lvl.premium ? "rgba(255,255,255,0.08)" : theme.primary },
                ]}
              >
                <Text style={styles.btnTxt}>
                  {lvl.premium ? T[lang].premium : T[lang].open}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  container: { padding: 18 },
  h1: { color: "white", fontSize: 36, fontWeight: "900" },
  sub: { color: "rgba(255,255,255,0.7)", marginBottom: 20 },
  showcaseWrap: { marginBottom: 24 },
  showcaseImage: { borderRadius: 22, overflow: "hidden" },
  showcaseCard: { padding: 20, borderRadius: 22, backgroundColor: "rgba(94,59,255,0.28)" },
  showcaseTitle: { color: "#7cf7d8", fontWeight: "900" },
  showcaseSubtitle: { color: "white", marginTop: 6 },
  showcaseText: { color: "rgba(255,255,255,0.9)", marginTop: 10 },
  levelCard: { borderRadius: 22, padding: 16, backgroundColor: "rgba(255,255,255,0.06)" },
  levelRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  levelTitle: { color: "white", fontWeight: "900", fontSize: 18 },
  levelSub: { color: "rgba(255,255,255,0.7)" },
  openBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16 },
  premiumBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16 },
  btnTxt: { color: "white", fontWeight: "900" },
});