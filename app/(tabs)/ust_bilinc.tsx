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

type Lang = "tr" | "en";

type PinnedEvent = null | {
  id: string;
  title: string;
  reading_tr?: string;
  reading_en?: string;
  source_url?: string;
  created_at?: string;
  tags?: string[];
  meta?: any;
};

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
const AY_CICEGI = require("../../assets/ay_cicegi.png");

// fallback vitrin (pinned yoksa)
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
    premiumHint: "Bu katman Premium. İstersen VIP ile tekil açılım yapılabilir.",
    world: "🌍 Dünya Olayları",
    map: "🧬 Sistem Haritası",
    vision: "👁 Kod Görme Modu",
    loading: "Vitrin yükleniyor…",
  },
  en: {
    title: "SYSTEM VIEW",
    subtitle: "Reality is a simulation. It is your choice to interpret.",
    open: "Open",
    premium: "Premium",
    premiumHint: "This layer is Premium. VIP single read can unlock it.",
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

  const theme = useMemo(() => {
    return {
      bg: ["#07080d", "#12082a", "#050610"] as [string, string, string],
      accent: "#7cf7d8",
      primary: "rgba(94,59,255,0.75)",
      card: "rgba(255,255,255,0.06)",
      stroke: "rgba(255,255,255,0.10)",
    };
  }, []);

  // ✅ fetch pinned from API
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
    if (lvl.premium) {
      Alert.alert("Premium", T[lang].premiumHint);
      return;
    }

    router.push({
      pathname: "/(tabs)/sanri_flow",
      params: {
        lang,
        source: "ust_bilinc",
        intent: lvl.intent,
        title: lang === "tr" ? lvl.titleTR : lvl.titleEN,
      },
    } as any);
  };

  // ✅ Showcase content (pinned varsa onu kullan)
  const showcaseTitle =
    pinned?.title
      ? (lang === "tr" ? "🌻 Haftanın Sembolü" : "🌻 Symbol of the Week")
      : FALLBACK[lang].title;

  const showcaseSubtitle =
    pinned?.title
      ? pinned.title
      : FALLBACK[lang].subtitle;

  const pinnedText = lang === "tr" ? (pinned?.reading_tr || "") : (pinned?.reading_en || pinned?.reading_tr || "");
  const showcaseText =
    pinned?.title
      ? firstLines(pinnedText, 5)
      : FALLBACK[lang].text;

  const showcaseCTA = FALLBACK[lang].cta;

  return (
    <View style={styles.root}>
      <LinearGradient colors={theme.bg} style={StyleSheet.absoluteFillObject} />

      <TopMenu />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* TR/EN */}
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

        <Text style={styles.h1}>{T[lang].title}</Text>
        <Text style={styles.sub}>{T[lang].subtitle}</Text>

        {/* 🌻 SHOWCASE (DB pinned) */}
        <View style={styles.showcaseWrap}>
          <ImageBackground
            source={AY_CICEGI}
            resizeMode="cover"
            style={styles.showcaseImage}
            imageStyle={{ borderRadius: 22 }}
          >
            <View style={styles.showcaseOverlay}>
              <BlurView intensity={35} tint="dark" style={styles.showcaseCard}>
                <Text style={styles.showcaseTitle}>{showcaseTitle}</Text>
                <Text style={styles.showcaseSubtitle}>
                  {loadingPinned ? T[lang].loading : showcaseSubtitle}
                </Text>

                <Text style={styles.showcaseText}>{showcaseText}</Text>

                <Pressable
                  style={styles.showcaseBtn}
                  onPress={() => router.push("/(tabs)/world_events")}
                  hitSlop={12}
                >
                  <Text style={styles.showcaseBtnText}>{showcaseCTA}</Text>
                </Pressable>
              </BlurView>
            </View>
          </ImageBackground>
        </View>

        {/* LEVELS */}
        <View style={[styles.levelCard, { backgroundColor: theme.card, borderColor: theme.stroke }]}>
          {LEVELS.map((lvl) => (
            <View key={lvl.id} style={styles.levelRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.levelTitle}>{lang === "tr" ? lvl.titleTR : lvl.titleEN}</Text>
                <Text style={styles.levelSub}>{lang === "tr" ? lvl.subTR : lvl.subEN}</Text>
                {lvl.premium ? <Text style={styles.premiumHint}>{T[lang].premiumHint}</Text> : null}
              </View>

              <Pressable
  onPress={() => {
  if (lvl.id === 1) {
    router.push({ pathname: "/(tabs)/observer", params: { lang } } as any);
    return;
  }
  if (lvl.id === 2) {
    router.push({ pathname: "/(tabs)/pattern", params: { lang } } as any);
    return;
  }
  if (lvl.id === 3) {
  router.push({ pathname: "/(tabs)/vip", params: { lang } } as any);
  return;
}
  openLevel(lvl); // 3-4-5 premium/diğer davranış
}}
  style={[
    lvl.premium ? styles.premiumBtn : styles.openBtn,
    { backgroundColor: lvl.premium ? "rgba(255,255,255,0.08)" : theme.primary },
  ]}
  hitSlop={10}
>
                <Text style={styles.btnTxt}>{lvl.premium ? T[lang].premium : T[lang].open}</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* BIG ACTIONS */}
        <Pressable
          style={[styles.bigBtn, { backgroundColor: theme.primary }]}
          onPress={() => router.push("/(tabs)/world_events")}
          hitSlop={12}
        >
          <Text style={styles.bigTxt}>{T[lang].world}</Text>
        </Pressable>

        <Pressable
          style={[styles.bigBtn, { backgroundColor: theme.primary }]}
          onPress={() => Alert.alert("Yakında", "Sistem Haritası yakında aktif olacak.")}
          hitSlop={12}
        >
          <Text style={styles.bigTxt}>{T[lang].map}</Text>
        </Pressable>

        <Pressable
          style={[styles.bigBtn, { backgroundColor: theme.primary }]}
          onPress={() => Alert.alert("Yakında", "Kod Görme Modu yakında aktif olacak.")}
          hitSlop={12}
        >
          <Text style={styles.bigTxt}>{T[lang].vision}</Text>
        </Pressable>

        <View style={{ height: Platform.OS === "ios" ? 120 : 160 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  container: { paddingTop: 18, paddingHorizontal: 18 },

  langRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginBottom: 10 },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  langChipActive: { backgroundColor: "rgba(124,247,216,0.12)" },
  langText: { color: "rgba(255,255,255,0.70)", fontWeight: "900", letterSpacing: 1 },

  h1: { color: "white", fontSize: 40, fontWeight: "900", letterSpacing: 1 },
  sub: { color: "rgba(255,255,255,0.70)", marginTop: 10, marginBottom: 18, lineHeight: 20 },

  // Showcase
  showcaseWrap: { marginTop: 10, marginBottom: 24 },
  showcaseImage: { borderRadius: 22, overflow: "hidden" },
  showcaseOverlay: { borderRadius: 22, backgroundColor: "rgba(0,0,0,0.45)" },

  showcaseCard: {
    padding: 22,
    borderRadius: 22,
    backgroundColor: "rgba(94,59,255,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  showcaseTitle: { color: "#7cf7d8", fontSize: 18, fontWeight: "900", marginBottom: 6 },
  showcaseSubtitle: { color: "rgba(255,255,255,0.80)", fontSize: 14, marginBottom: 10 },
  showcaseText: { color: "rgba(255,255,255,0.90)", lineHeight: 20, marginBottom: 14 },

  showcaseBtn: {
    backgroundColor: "rgba(124,247,216,0.18)",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.35)",
  },
  showcaseBtnText: { color: "#7cf7d8", fontWeight: "900" },

  // Levels
  levelCard: { borderRadius: 22, borderWidth: 1, padding: 16, marginBottom: 18 },
  levelRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  levelTitle: { color: "white", fontWeight: "900", fontSize: 18 },
  levelSub: { color: "rgba(255,255,255,0.70)", marginTop: 4 },
  premiumHint: { color: "rgba(255,255,255,0.45)", marginTop: 8, fontSize: 12 },

  openBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  premiumBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  btnTxt: { color: "white", fontWeight: "900" },

  bigBtn: { borderRadius: 22, paddingVertical: 18, paddingHorizontal: 18, marginBottom: 14, alignItems: "center" },
  bigTxt: { color: "white", fontWeight: "900", fontSize: 18 },
});