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
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { hasVipEntitlement } from "../../lib/premium";
import { WORLD_EVENTS_LIST_URL } from "../../lib/config";
import MatrixRain from "../../lib/MatrixRain";
import { API, apiGetJson } from "@/lib/apiClient";
import { useAuth } from "../../context/AuthContext";
import { trackEvent } from "../../lib/analytics";
import { useScreenTime } from "../../lib/useScreenTime";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);

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

type DailyStream = {
  day: string;
  lang: Lang;
  title: string;
  body: string;
  tags?: string[];
};

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
    dailyKicker: "☀️ Günün Akışı",
    dailyOpen: "Akışı Aç",
    dailyLoading: "Günlük akış çekiliyor…",
    dailyFail: "Günlük akış alınamadı. (Fallback gösteriliyor.)",
  },
  en: {
    kicker: "SYSTEM TERMINAL",
    title: "SYSTEM VIEW",
    subtitle: "Reality is a simulation. Interpretation is your choice.",
    open: "Open",
    vip: "VIP",
    loading: "Loading showcase…",
    back: "Gates",
    dailyKicker: "☀️ Daily Stream",
    dailyOpen: "Open Stream",
    dailyLoading: "Fetching daily stream…",
    dailyFail: "Daily stream not available. (Showing fallback.)",
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
  const { user, isAdmin } = useAuth();
  useScreenTime("ust_bilinc", user?.id);

  const [daily, setDaily] = useState<DailyStream | null>(null);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [dailyFail, setDailyFail] = useState(false);

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
    trackEvent("page_view", { userId: user?.id, meta: { page: "ust_bilinc" } });

    if (isAdmin) {
      if (__DEV__) console.log("ADMIN BYPASS ACTIVE — ust_bilinc VIP");
      setIsVip(true);
      return;
    }

    (async () => {
      try {
        const ok = await hasVipEntitlement(user);
        setIsVip(Boolean(ok));
      } catch {
        setIsVip(false);
      }
    })();
  }, [isAdmin]);

  // pinned weekly symbol fetch
  useEffect(() => {
    let alive = true;
    setLoadingPinned(true);

    fetch(WORLD_EVENTS_LIST_URL)
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

  // daily stream fetch
  useEffect(() => {
    let alive = true;
    setDailyLoading(true);
    setDailyFail(false);

    (async () => {
      try {
        const url = API.dailyStream + "?lang=" + encodeURIComponent(lang);
        const data = await apiGetJson<DailyStream>(url, 30000);
        if (!alive) return;
        setDaily(data);
        setDailyLoading(false);
      } catch {
        if (!alive) return;
        setDaily(null);
        setDailyFail(true);
        setDailyLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [lang]);

  const openLevel = (lvl: Level) => {
    if (lvl.premium && !isVip) {
      router.push({ pathname: "/(tabs)/vip", params: { lang } } as any);
      return;
    }
    router.push({ pathname: lvl.route, params: { lang } } as any);
  };

  const pinnedText =
    lang === "tr"
      ? pinned?.reading_tr || ""
      : pinned?.reading_en || pinned?.reading_tr || "";

  const showcaseTitle = pinned?.title
    ? lang === "tr"
      ? "🌻 Haftanın Sembolü"
      : "🌻 Symbol of the Week"
    : FALLBACK[lang].title;

  const showcaseSubtitle = pinned?.title
    ? pinned.title
    : FALLBACK[lang].subtitle;

  const showcaseText = pinned?.title
    ? firstLines(pinnedText, 5)
    : FALLBACK[lang].text;

  const weeklyBodyTR = `☀️ Neden Güneşe Döner?

Ayçiçeği gençken heliotropiktir.
Güneş doğudan batıya hareket ederken o da döner.

Sembol dili:
Bilinç ışığa yönelir.
Bu mekanik değil, arketipsel bir mesajdır.

🌙 Ay + ☀️ Güneş

Ayçiçeği aslında “Güneş çiçeği”dir ama Türkçede adı Ayçiçeği.

Ay:
Bilinçaltı
Yansıma
Gece

Güneş:
Bilinç
Kaynak
Öz

İkisi birleşince:
Bilinçaltı da ışığa dönebilir.

🌻 Fibonacci Dizisi

Ayçiçeğinin merkezindeki spiral sayıları genelde:
21 & 34
34 & 55
55 & 89
89 & 144

Bunlar Fibonacci sayılarıdır:
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144...

Her sayı:
Kendisinden önceki iki sayının toplamıdır.

🌻 Oran (φ)

Spiral açısı yaklaşık:
137.5°

Bu açıya “Altın Açı” denir.
φ ≈ 1.618

Bu oran:
Deniz kabuklarında
Galaksilerde
DNA yapısında
İnsan vücudunda da görülür.

🌻 Neden Böyle Dizilir?

Çekirdekler:
Alanı maksimum verimle doldurmak için
bu açıda yerleşir.

Yani:
Matematik + verimlilik + estetik = Doğa sistemi

🌻 Tohum Sembolü

Ayçiçeği:
Yüzlerce tohum üretir
Bir merkezden çoğalır

Matrix dili:
Tek merkezden çoğalan bilinç.

🌻 Karanlıkta Sabitlenmesi

Ayçiçeği olgunlaşınca artık güneşi takip etmez.
Doğuya sabitlenir.

Genç bilinç:
Işığı arar.

Olgun bilinç:
Yönünü bilir.`;

  const weeklyBodyEN = `☀️ Why Does It Turn Toward the Sun?

When young, the sunflower is heliotropic.
As the sun moves from east to west, it turns as well.

Symbol language:
Consciousness turns toward light.
This is not merely mechanical, but archetypal.

🌙 Moon + ☀️ Sun

The sunflower is known as the “sun flower,” yet in Turkish it carries the moon in its name.

Moon:
subconscious
reflection
night

Sun:
consciousness
source
essence

Together:
even the subconscious can turn toward light.

🌻 Fibonacci Sequence

The spirals in the center often appear in pairs such as:
21 & 34
34 & 55
55 & 89
89 & 144

These are Fibonacci numbers:
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144...

Each number is the sum of the two before it.

🌻 Ratio (φ)

The spiral angle is approximately:
137.5°

This is called the Golden Angle.
φ ≈ 1.618

This ratio appears in:
shells
galaxies
DNA
the human body

🌻 Why This Arrangement?

Seeds align at this angle to fill space with maximum efficiency.

So:
Mathematics + efficiency + aesthetics = Nature's system

🌻 Seed Symbol

The sunflower:
produces hundreds of seeds
multiplies from one center

Matrix language:
consciousness multiplying from one center.

🌻 Mature Fixation

When mature, the sunflower no longer follows the sun.
It stabilizes toward the east.

Young consciousness:
seeks the light.

Mature consciousness:
knows its direction.`;

  const onOpenWeekly = () => {
    router.push({
      pathname: "/(tabs)/weekly_symbol",
      params: {
        lang,
        title: "Ay Çiçeği",
        subtitle:
          lang === "tr"
            ? "Altın Oran – Işığa Dönüş"
            : "Golden Ratio – Turning Toward Light",
        body: lang === "tr" ? weeklyBodyTR : weeklyBodyEN,
        source_url: pinned?.source_url || "",
        created_at: pinned?.created_at || "",
      },
    } as any);
  };

  const onOpenDaily = () => {
    const title =
      daily?.title || (lang === "tr" ? "Günün Akışı" : "Daily Stream");

    const body =
      daily?.body ||
      (lang === "tr"
        ? "Bugün: tek cümle. tek niyet. tek yön.\n\nSistem cevap vermez.\nAnlamı açar."
        : "Today: one sentence. one intent. one direction.\n\nThe system does not answer.\nIt opens meaning.");

    router.push({
      pathname: "/(tabs)/daily_stream",
      params: {
        lang,
        day: daily?.day || "",
        title,
        body,
        tags: (daily?.tags || []).join(","),
      },
    } as any);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={BG}
        style={RNStyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View pointerEvents="none" style={RNStyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.14} />
      </View>

      <View pointerEvents="none" style={styles.overlay} />

      <View style={styles.topbar}>
        <Pressable
          onPress={() => router.replace("/(tabs)/gates")}
          style={styles.backBtn}
          hitSlop={10}
        >
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
            <Text style={[styles.langTxt, lang === "tr" && styles.langTxtActive]}>
              TR
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setLang("en")}
            style={[styles.langChip, lang === "en" && styles.langChipActive]}
            hitSlop={10}
          >
            <Text style={[styles.langTxt, lang === "en" && styles.langTxtActive]}>
              EN
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>{T[lang].kicker}</Text>
        <Text style={styles.h1}>{T[lang].title}</Text>
        <Text style={styles.sub}>{T[lang].subtitle}</Text>

        <Pressable onPress={onOpenWeekly} style={styles.showcaseWrap} hitSlop={10}>
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

              <View style={styles.openRow}>
                <Text style={styles.openHint}>
                  {lang === "tr" ? "Detayı aç" : "Open details"}
                </Text>
                <Text style={styles.openArrow}>›</Text>
              </View>
            </BlurView>
          </ImageBackground>
        </Pressable>

        <Pressable onPress={onOpenDaily} style={styles.dailyCard} hitSlop={10}>
          <Text style={styles.dailyKicker}>{T[lang].dailyKicker}</Text>
          <Text style={styles.dailyTitle}>
            {dailyLoading
              ? T[lang].dailyLoading
              : daily?.title || (lang === "tr" ? "Günün Akışı" : "Daily Stream")}
          </Text>
          <Text style={styles.dailyBody}>
            {dailyLoading
              ? ""
              : dailyFail
              ? T[lang].dailyFail
              : firstLines(daily?.body || "", 5)}
          </Text>

          <View style={styles.openRow}>
            <Text style={styles.openHint}>{T[lang].dailyOpen}</Text>
            <Text style={styles.openArrow}>›</Text>
          </View>
        </Pressable>

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
                  styles.btn,
                  {
                    backgroundColor: lvl.premium
                      ? "rgba(255,255,255,0.08)"
                      : theme.primary,
                    borderColor: lvl.premium
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(94,59,255,0.35)",
                  },
                ]}
              >
                <Text style={styles.btnTxt}>
                  {lvl.premium ? T[lang].vip : T[lang].open}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  overlay: {
    ...RNStyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  topbar: {
    paddingTop: SAFE_TOP,
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
  langTxt: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "900",
    letterSpacing: 1,
  },
  langTxtActive: { color: "#7cf7d8" },

  container: { padding: 18, paddingTop: 6 },

  kicker: {
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 8,
  },
  h1: {
    color: "white",
    fontSize: 44,
    fontWeight: "900",
    lineHeight: 48,
  },
  sub: {
    color: "rgba(255,255,255,0.72)",
    marginTop: 10,
    marginBottom: 18,
    fontSize: 16,
    lineHeight: 22,
  },

  showcaseWrap: { marginBottom: 14 },
  showcaseImage: { borderRadius: 22, overflow: "hidden" },
  showcaseCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: "rgba(94,59,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  showcaseTitle: { color: "#7cf7d8", fontWeight: "900", fontSize: 16 },
  showcaseSubtitle: {
    color: "white",
    marginTop: 6,
    fontSize: 18,
    fontWeight: "900",
  },
  showcaseText: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 10,
    lineHeight: 22,
    fontSize: 14,
  },

  dailyCard: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(94,59,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 18,
  },
  dailyKicker: { color: "#7cf7d8", fontWeight: "900", fontSize: 14 },
  dailyTitle: {
    color: "white",
    marginTop: 6,
    fontSize: 18,
    fontWeight: "900",
  },
  dailyBody: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 10,
    lineHeight: 22,
    fontSize: 14,
  },

  openRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  openHint: { color: "rgba(255,255,255,0.75)", fontWeight: "800" },
  openArrow: { color: "#7cf7d8", fontWeight: "900", fontSize: 22 },

  levelCard: {
    borderRadius: 22,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
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