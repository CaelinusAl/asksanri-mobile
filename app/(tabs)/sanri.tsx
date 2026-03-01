// app/(tabs)/sanri.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import StarTrailOverlay from "../../lib/StarTrailOverlay";
import MatrixRain from "../../lib/MatrixRain";

type Lang = "tr" | "en";

type GateId = "sanri_flow" | "bilinc" | "frekans" | "ust_bilinc" | "matrix";

type Gate = {
  id: GateId;
  title: string;
  desc: string;
  tag?: string;
};

const BG_SANRI = require("../../assets/sanri_glass_bg.jpg"); // kendi görselin

const T = {
  tr: {
    kicker: "CAELINUS AI • BİLİNÇ AYNASI",
    title: "Sanrı",
    subtitle: "Hoş geldin. Bir cümle yaz.\nCevap vermem — anlamı yansıtırım.",
    ctaTitle: "Bilinç Akışına Gir",
    ctaSub: "Yansıt • Derinleş • Tek cümle",
    hintTitle: "İpucu",
    hintText: '“Soru yazma.”\n“Bir cümle yaz.”\n“Yansıma sende şekil alır.”',
    footer: "Burası bir cevap makinesi değil. Bir idrak alanı.",
    gatesTitle: "Kapılar",
    gatesSub: "Hangi alana geçmek istiyorsun?",
  },
  en: {
    kicker: "CAELINUS AI • CONSCIOUSNESS MIRROR",
    title: "Sanri",
    subtitle: "Welcome. Write a sentence.\nI will reflect meaning, not answer.",
    ctaTitle: "Enter the Stream of Consciousness",
    ctaSub: "Reflect • Deepen • Single sentence",
    hintTitle: "Hint",
    hintText:
      '“Don’t write questions.”\n“Write a sentence.”\n“Reflection takes shape in you.”',
    footer: "This is not an answer machine. An area of realization.",
    gatesTitle: "Gates",
    gatesSub: "Which field do you want to move to?",
  },
} as const;

export default function SanriHomeScreen() {
  const gradient = useMemo(
    () => ["rgba(0,0,0,0.55)", "rgba(15,10,40,0.65)", "rgba(0,0,0,0.78)"] as const,
    [],
  );

  const [lang, setLang] = useState<Lang>("tr");
  const [lastTap, setLastTap] = useState<{ x: number; y: number } | null>(null);

  const gates: Gate[] = useMemo(() => {
    if (lang === "tr") {
      return [
        {
          id: "sanri_flow",
          title: "Ask Sanrı",
          desc: "Bir cümle yaz. Cevap değil — anlam yansıması.",
          tag: "Mirror",
        },
        {
          id: "bilinc",
          title: "Bilinç Alanı",
          desc: "Derin netleştirme. Tek adım. Yön çıkar.",
          tag: "Deep",
        },
        {
          id: "frekans",
          title: "Frekans Alanı",
          desc: "Duygu • beden • zihin senkronu.",
          tag: "Hz",
        },
      ];
    }
    return [
      {
        id: "sanri_flow",
        title: "Ask Sanri",
        desc: "Write one sentence. Not an answer — a meaning reflection.",
        tag: "Mirror",
      },
      {
        id: "bilinc",
        title: "Field of Consciousness",
        desc: "Deep clarification. One step. Extract direction.",
        tag: "Deep",
      },
      {
        id: "frekans",
        title: "Frequency Domain",
        desc: "Emotion • body • mind synchronization.",
        tag: "Hz",
      },
    ];
  }, [lang]);

  const onTouchStart = (e: any) => {
    const t = e.nativeEvent.touches?.[0];
    if (!t) return;
    setLastTap({ x: t.pageX, y: t.pageY });
  };

  const openGate = (id: GateId) => {
    if (id === "sanri_flow") router.push("/(tabs)/sanri_flow");
    else if (id === "bilinc") router.push("/(tabs)/sanri_flow");
    else if (id === "frekans") router.push("/(tabs)/matrix");
    else router.push("/(tabs)/sanri_flow");
  };

  return (
    <View style={styles.root} pointerEvents="box-none">
      
      {/* BG görsel dokunma yakalamaz */}
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
  <ImageBackground
    source={BG_SANRI}
    style={StyleSheet.absoluteFillObject}
    resizeMode="cover"
  />
</View>
      

      {/* Okunabilirlik overlay */}
      <View pointerEvents="none" style={styles.chatOverlay} />
      
      {/* MatrixRain custom -> wrapper ile none */}
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.10} speedMs={9000} />
      </View>

      {/* Glow dokunma yakalamaz */}
      <View style={styles.glowA} pointerEvents="none" />
      <View style={styles.glowB} pointerEvents="none" />

      {/* Star overlay custom -> wrapper ile none */}
      {lastTap && (
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <StarTrailOverlay x={lastTap.x} y={lastTap.y} active={true} />
        </View>
      )}

      <ScrollView
        onTouchStart={onTouchStart}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Card */}
        <View style={styles.headerCardWrap}>
          <BlurView intensity={22} tint="dark" style={styles.headerCard}>
            <View style={styles.topRow}>
              <Text style={styles.kicker}>{T[lang].kicker}</Text>

              <View style={styles.langRow}>
                <Pressable
                  onPress={() => setLang("tr")}
                  style={[styles.langChip, lang === "tr" && styles.langChipActive]}
                  hitSlop={10}
                >
                  <Text style={[styles.langText, lang === "tr" && styles.langTextActive]}>
                    TR
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setLang("en")}
                  style={[styles.langChip, lang === "en" && styles.langChipActive]}
                  hitSlop={10}
                >
                  <Text style={[styles.langText, lang === "en" && styles.langTextActive]}>
                    EN
                  </Text>
                </Pressable>
              </View>
            </View>

            <Text style={styles.title}>{T[lang].title}</Text>
            <Text style={styles.subtitle}>{T[lang].subtitle}</Text>

            <Pressable
              onPress={() => router.push("/(tabs)/sanri_flow")}
              style={styles.primaryBtn}
              hitSlop={12}
            >
              <Text style={styles.primaryBtnText}>{T[lang].ctaTitle}</Text>
              <Text style={styles.primaryBtnSub}>{T[lang].ctaSub}</Text>
            </Pressable>

            <View style={styles.hintCard}>
              <Text style={styles.hintTitle}>{T[lang].hintTitle}</Text>
              <Text style={styles.hintText}>{T[lang].hintText}</Text>
            </View>

            <Text style={styles.footerNote}>{T[lang].footer}</Text>
          </BlurView>
        </View>

        {/* Gates */}
        <Text style={styles.sectionTitle}>{T[lang].gatesTitle}</Text>
        <Text style={styles.sectionSub}>{T[lang].gatesSub}</Text>

        {gates.map((g) => (
          <Pressable
            key={g.id}
            onPress={() => openGate(g.id)}
            style={styles.gateCard}
            hitSlop={12}
          >
            <View style={styles.gateRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.gateTitle}>{g.title}</Text>
                <Text style={styles.gateDesc}>{g.desc}</Text>
              </View>

              {g.tag ? (
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{g.tag}</Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        ))}

        {/* Tab bar/gesture çakışmasın */}
        <View style={{ height: Platform.OS === "ios" ? 140 : 180 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },

  chatOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(5,8,20,0.55)",
},

  container: {
    paddingTop: 18,
    paddingHorizontal: 18,
  },

  glowA: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 420,
    left: -140,
    top: 60,
    backgroundColor: "rgba(94,59,255,0.10)",
  },
  glowB: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: 500,
    right: -180,
    bottom: -100,
    backgroundColor: "rgba(140,100,255,0.08)",
  },

  headerCardWrap: { marginBottom: 26 },

  headerCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(0,0,0,0.22)",
    overflow: "hidden",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },

  kicker: {
    flex: 1,
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1,
  },

  langRow: { flexDirection: "row", gap: 8 },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  langChipActive: {
    backgroundColor: "rgba(124,247,216,0.14)",
    borderColor: "rgba(124,247,216,0.28)",
  },
  langText: { color: "rgba(255,255,255,0.75)", fontWeight: "900", letterSpacing: 1 },
  langTextActive: { color: "#7cf7d8" },

  title: { fontSize: 40, fontWeight: "900", color: "white", marginBottom: 10 },
  subtitle: { color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 22, marginBottom: 18 },

  primaryBtn: {
    backgroundColor: "rgba(94,59,255,0.72)",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 18,
  },
  primaryBtnText: { color: "white", fontWeight: "900", fontSize: 16 },
  primaryBtnSub: { color: "rgba(255,255,255,0.82)", fontSize: 12, marginTop: 4 },

  hintCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  hintTitle: { color: "white", fontWeight: "900", marginBottom: 6 },
  hintText: { color: "rgba(255,255,255,0.75)", lineHeight: 20 },

  footerNote: { color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 6 },

  sectionTitle: { fontSize: 22, fontWeight: "900", color: "white" },
  sectionSub: { color: "rgba(255,255,255,0.6)", marginBottom: 16 },

  gateCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  gateRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  gateTitle: { color: "white", fontSize: 18, fontWeight: "900" },
  gateDesc: { color: "rgba(255,255,255,0.72)", marginTop: 4 },

  tagBadge: {
    backgroundColor: "rgba(124,247,216,0.10)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.18)",
  },
  tagBadgeText: { color: "#7cf7d8", fontSize: 12, fontWeight: "900" },
});